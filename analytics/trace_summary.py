from risk_scoring import get_wallet_entities


def build_trace_summary(hops, risk, root_address):
    """
    Turns the raw hop list into a plain-language summary: how far the
    trace went, how much left the reported wallet directly, and — most
    importantly — where the trail currently ends and what kind of
    wallets those endpoints are (exchange / scam / unlabeled).
    """
    root_address = root_address.lower()

    if not hops:
        return {
            "root": root_address,
            "hops_traced": 0,
            "wallets_touched": 0,
            "transactions_traced": 0,
            "outflow_from_root": 0.0,
            "outflow_token": "BNB",
            "endpoints": [],
            "headline": "No outgoing transactions were found for this wallet in our records — either it hasn't moved funds yet, or we haven't fetched its history.",
        }

    all_addresses = set()
    senders = set()
    for h in hops:
        all_addresses.add(h["from"])
        all_addresses.add(h["to"])
        senders.add(h["from"])

    # Endpoints: wallets money reached that never sent anything onward
    # within this trace. That's either a genuine dead end, the point
    # where we hit the hop limit, or a wallet we simply haven't fetched
    # full history for yet — the headline below is worded so it never
    # overclaims which of those it is.
    endpoints = sorted(a for a in all_addresses if a not in senders and a != root_address)

    outflow = round(sum(h["value"] for h in hops if h["from"] == root_address), 6)
    token = hops[0]["token"]
    max_hop = risk.get("max_hop") or max(h["hop"] for h in hops)

    entities = get_wallet_entities(endpoints)
    exchange_endpoints = [a for a in endpoints if entities.get(a, {}).get("entity_type") == "exchange"]
    scam_endpoints = [a for a in endpoints if entities.get(a, {}).get("entity_type") == "scam"]

    if exchange_endpoints:
        headline = (
            f"The trail leads to {len(exchange_endpoints)} wallet(s) belonging to a known exchange after "
            f"{max_hop} hop(s) — this is a realistic recovery point; a legal request to that exchange can "
            "potentially identify or freeze the account."
        )
    elif scam_endpoints:
        headline = (
            f"After {max_hop} hop(s), funds connect to {len(scam_endpoints)} wallet(s) already flagged as "
            "scam-linked from prior reports — this reinforces that the reported wallet is part of a known "
            "fraud network, not an isolated incident."
        )
    elif len(endpoints) > 3:
        headline = (
            f"Funds moved through {max_hop} hop(s) and are currently split across {len(endpoints)} wallets "
            "with no further recorded activity — this kind of fanning-out is a common layering tactic to make "
            "manual tracing harder. None of these end wallets are on our known-exchange or known-scam lists yet."
        )
    else:
        headline = (
            f"Funds moved through {max_hop} hop(s) and currently sit at {len(endpoints)} wallet(s) with no "
            "further recorded outgoing activity. This may be a genuine dead end, or simply a wallet we haven't "
            "pulled full history for yet — scan it individually to check."
        )

    return {
        "root": root_address,
        "hops_traced": max_hop,
        "wallets_touched": len(all_addresses),
        "transactions_traced": len(hops),
        "outflow_from_root": outflow,
        "outflow_token": token,
        "endpoints": [
            {
                "address": a,
                "label": entities.get(a, {}).get("label"),
                "entity_type": entities.get(a, {}).get("entity_type", "unknown"),
            }
            for a in endpoints[:15]
        ],
        "headline": headline,
    }