import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://localhost:8000";

router.post("/", async (req, res) => {
  const { victim_name, contact, amount_lost, reported_wallet, case_title } = req.body;

  if (!reported_wallet) {
    return res.status(400).json({ error: "reported_wallet is required" });
  }

  const address = reported_wallet.toLowerCase();

  try {
    // 1. Create a case
    const caseResult = await pool.query(
      `INSERT INTO cases (title, status) VALUES ($1, 'open') RETURNING id`,
      [case_title || `Case for ${address}`]
    );
    const caseId = caseResult.rows[0].id;

    // 2. Create the victim report
    const reportResult = await pool.query(
      `INSERT INTO victim_reports (case_id, victim_name, contact, amount_lost, reported_wallet)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [caseId, victim_name || null, contact || null, amount_lost || null, address]
    );
    const reportId = reportResult.rows[0].id;

    // 3. Make sure the wallet's transaction data is fetched first
    // (calling our own Node route internally, reusing existing logic)
    await fetch(`http://localhost:${process.env.PORT || 5000}/wallet/${address}/fetch`);

    // 4. Run the investigation via the Python analytics service
    const investigateResponse = await fetch(`${ANALYTICS_URL}/investigate/${address}`);
    let investigation = null;

    if (investigateResponse.ok) {
      investigation = await investigateResponse.json();

      // 5. Save the investigation result
      await pool.query(
        `INSERT INTO investigations (case_id, status, risk_score, findings)
         VALUES ($1, 'completed', $2, $3)`,
        [caseId, investigation.risk.score, JSON.stringify(investigation)]
      );
    }

    res.json({
      case_id: caseId,
      report_id: reportId,
      investigation,
    });
  } catch (err) {
    console.error("Error in POST /reports:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/cases/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const caseData = await pool.query(`SELECT * FROM cases WHERE id = $1`, [id]);
    const reports = await pool.query(`SELECT * FROM victim_reports WHERE case_id = $1`, [id]);
    const investigations = await pool.query(`SELECT * FROM investigations WHERE case_id = $1`, [id]);

    if (caseData.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json({
      case: caseData.rows[0],
      victim_reports: reports.rows,
      investigations: investigations.rows,
    });
  } catch (err) {
    console.error("Error in GET /reports/cases/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/cases", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(vr.id) as report_count
      FROM cases c
      LEFT JOIN victim_reports vr ON vr.case_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error in GET /reports/cases:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;