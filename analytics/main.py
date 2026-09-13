from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from graph_builder import fetch_transactions, build_graph, trace_fund_flow, get_graph_stats

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for hackathon dev; tighten later if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "analytics service is alive"}

@app.get("/trace/{address}")
def trace_wallet(address: str, max_hops: int = 5):
    transactions = fetch_transactions()

    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found in database")

    G = build_graph(transactions)
    stats = get_graph_stats(G)
    hops = trace_fund_flow(G, address, max_hops=max_hops)

    return {
        "address": address.lower(),
        "graph_stats": stats,
        "hops": hops,
    }