import express from "express";

const router = express.Router();

const ANALYTICS_URL = process.env.ANALYTICS_URL || "http://localhost:8000";

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  const maxHops = req.query.max_hops || 5;

  try {
    const response = await fetch(
      `${ANALYTICS_URL}/trace/${address}?max_hops=${maxHops}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error calling analytics service:", err);
    res.status(500).json({ error: "Failed to reach analytics service" });
  }
});

export default router;