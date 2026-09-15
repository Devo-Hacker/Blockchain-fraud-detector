import os
import psycopg2
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


def get_wallet_entities(addresses):
    """Returns {address: {label, entity_type}} for the given addresses."""
    if not addresses:
        return {}

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(
        "SELECT address, label, entity_type FROM wallets WHERE address = ANY(%s)",
        (list(addresses),)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return {addr: {"label": label, "entity_type": entity_type} for addr, label, entity_type in rows}


def parse_timestamp(ts_str):
    try:
        return datetime.fromisoformat(ts_str)
    except (ValueError, TypeError):
        return None


def compute_risk(hops):
    """
    hops: list of dicts from trace_fund_flow(), e.g.
      {"hop": 1, "from": "0x..", "to": "0x..", "value": 1.2, "tx_hash": "..", "timestamp": ".."}

    Returns {"score": int, "factors": [...], "max_hop": int}
    """
    if not hops:
        return {"score": 0, "factors": [], "max_hop": 0}

    factors = []
    score = 0

    # Collect all wallet addresses involved
    all_addresses = set()
    for h in hops:
        all_addresses.add(h["from"])
        all_addresses.add(h["to"])

    entities = get_wallet_entities(all_addresses)

    # --- Signal 1: Known scam wallet in trace ---
    scam_wallets = [addr for addr, info in entities.items() if info["entity_type"] == "scam"]
    if scam_wallets:
        score += 25
        factors.append({
            "reason": "Trace connects to a previously reported scam wallet",
            "points": 25,
            "evidence": scam_wallets[:5],
        })

    # --- Signal 2: Exchange exposure ---
    exchange_wallets = [addr for addr, info in entities.items() if info["entity_type"] == "exchange"]
    if exchange_wallets:
        score += 10
        factors.append({
            "reason": "Funds traced to a known exchange wallet (potential recovery point)",
            "points": 10,
            "evidence": exchange_wallets[:5],
        })

    # --- Signal 3: Multi-hop layering ---
    max_hop = max(h["hop"] for h in hops)
    if max_hop >= 3:
        score += 15
        factors.append({
            "reason": f"Funds moved through {max_hop} hops (layering behavior)",
            "points": 15,
            "evidence": [f"{max_hop} hops deep"],
        })

    # --- Signal 4: Fund splitting (out-degree) ---
    out_degree = {}
    for h in hops:
        out_degree.setdefault(h["from"], set()).add(h["to"])

    splitting_wallets = [addr for addr, targets in out_degree.items() if len(targets) >= 5]
    if splitting_wallets:
        score += 12
        factors.append({
            "reason": "A wallet split funds across 5+ destination wallets",
            "points": 12,
            "evidence": splitting_wallets[:5],
        })

    # --- Signal 5: Fund consolidation (in-degree) ---
    in_degree = {}
    for h in hops:
        in_degree.setdefault(h["to"], set()).add(h["from"])

    consolidating_wallets = [addr for addr, sources in in_degree.items() if len(sources) >= 5]
    if consolidating_wallets:
        score += 8
        factors.append({
            "reason": "A wallet consolidated funds from 5+ source wallets",
            "points": 8,
            "evidence": consolidating_wallets[:5],
        })

    # --- Signal 6: Rapid movement ---
    rapid_count = 0
    by_wallet = {}
    for h in hops:
        by_wallet.setdefault(h["from"], []).append(h)

    for wallet, txns in by_wallet.items():
        timestamps = sorted(filter(None, (parse_timestamp(t["timestamp"]) for t in txns)))
        for i in range(1, len(timestamps)):
            delta = (timestamps[i] - timestamps[i - 1]).total_seconds()
            if 0 <= delta < 600:  # under 10 minutes
                rapid_count += 1

    if rapid_count > 0:
        score += 20
        factors.append({
            "reason": f"Detected {rapid_count} instance(s) of rapid fund movement (under 10 min)",
            "points": 20,
            "evidence": [f"{rapid_count} rapid transfers"],
        })

    score = min(score, 100)

    return {
        "score": score,
        "max_hop": max_hop,
        "factors": factors,
        "wallets_flagged": {
            "scam": scam_wallets,
            "exchange": exchange_wallets,
        },
    }