import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_case_narrative(investigation):
    """
    Takes the full investigation dict ({address, graph_stats, hops, risk})
    and asks Groq's hosted model for a short investigator-facing summary.
    Returns None (never raises) if no API key is set or the call fails,
    so this feature degrades gracefully instead of breaking the trace endpoint.
    """
    if not GROQ_API_KEY:
        return None

    risk = investigation.get("risk", {})
    hops = investigation.get("hops", [])
    address = investigation.get("address", "")

    factor_lines = "\n".join(
        f"- {f['reason']} (+{f['points']} pts)" for f in risk.get("factors", [])
    ) or "None detected"

    hop_lines = "\n".join(
        f"- Hop {h['hop']}: {h['from'][:10]}... -> {h['to'][:10]}... ({h['value']} {h['token']})"
        for h in hops[:20]
    ) or "No outgoing transactions found"

    prompt = f"""You are assisting an Indian cybercrime investigator reviewing a cryptocurrency fraud complaint.

Wallet under investigation: {address}
Risk score: {risk.get('score', 0)}/100
Max hops traced: {risk.get('max_hop', 0)}

Risk factors detected:
{factor_lines}

Fund flow (up to 20 hops):
{hop_lines}

Write a concise 3-4 sentence investigator-facing summary describing what likely happened to the victim's funds and what this pattern suggests (e.g. layering, cash-out via exchange, dead end). Be factual and measured, do not speculate beyond what the data shows. Do not use markdown formatting."""

    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 300,
            },
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print("AI narrative generation failed:", e)
        return None