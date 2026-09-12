import express from "express";
import { AnkrProvider } from "@ankr.com/ankr.js";
import pool from "../db/pool.js";

const router = express.Router();
const provider = new AnkrProvider(process.env.ANKR_ENDPOINT);

const norm = (addr) => addr.toLowerCase();

router.get("/:address/fetch", async (req, res) => {
  const address = norm(req.params.address);

  try {
    console.log("Fetching transactions for", address);

    const result = await provider.getTransactionsByAddress({
      blockchain: "bsc",
      address: [address],
      pageSize: 50,
      descOrder: true,
    });

    const transactions = result.transactions || [];
    console.log("Fetched", transactions.length, "transactions from Ankr");

    // Collect all unique wallet addresses involved (normalized)
    const walletSet = new Set([address]);
    transactions.forEach((tx) => {
      walletSet.add(norm(tx.from));
      walletSet.add(norm(tx.to));
    });

    // Bulk insert all wallets in ONE query
    if (walletSet.size > 0) {
      const walletArr = [...walletSet];
      const walletValues = walletArr.map((_, i) => `($${i + 1}, 'bnb')`).join(",");
      await pool.query(
        `INSERT INTO wallets (address, chain) VALUES ${walletValues}
         ON CONFLICT (address) DO NOTHING`,
        walletArr
      );
    }
    console.log("Wallets inserted");

    // Bulk insert all transactions in ONE query
    if (transactions.length > 0) {
      const txValues = [];
      const params = [];
      transactions.forEach((tx, i) => {
        const valueBNB = parseInt(tx.value, 16) / 1e18;
        const blockNum = parseInt(tx.blockNumber, 16);
        const ts = new Date(parseInt(tx.timestamp, 16) * 1000);
        const base = i * 6;
        txValues.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, 'BNB', $${base + 5}, $${base + 6})`
        );
        params.push(tx.hash, norm(tx.from), norm(tx.to), valueBNB, blockNum, ts);
      });

      await pool.query(
        `INSERT INTO transactions (tx_hash, from_address, to_address, value, token, block_number, timestamp)
         VALUES ${txValues.join(",")}
         ON CONFLICT (tx_hash) DO NOTHING`,
        params
      );
    }
    console.log("Transactions inserted");

    res.json({ inserted: transactions.length, address });
  } catch (err) {
    console.error("Error in /wallet/:address/fetch:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;