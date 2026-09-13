import os
import psycopg2
import networkx as nx
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def fetch_transactions():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        SELECT tx_hash, from_address, to_address, value, token, block_number, timestamp
        FROM transactions
        ORDER BY timestamp ASC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def build_graph(transactions):
    G = nx.DiGraph()

    for tx_hash, from_addr, to_addr, value, token, block_number, timestamp in transactions:
        G.add_node(from_addr)
        G.add_node(to_addr)
        G.add_edge(
            from_addr,
            to_addr,
            tx_hash=tx_hash,
            value=float(value),
            token=token,
            block_number=block_number,
            timestamp=str(timestamp),
        )

    return G

def trace_fund_flow(G, start_address, max_hops=5):
    """Returns a list of hop dicts instead of printing."""
    start_address = start_address.lower()
    results = []
    visited = set()
    queue = [(start_address, 0)]

    while queue:
        current, hops = queue.pop(0)

        if hops >= max_hops or current not in G:
            continue

        for neighbor in G.successors(current):
            edge_data = G.get_edge_data(current, neighbor)

            results.append({
                "hop": hops + 1,
                "from": current,
                "to": neighbor,
                "value": edge_data["value"],
                "token": edge_data["token"],
                "tx_hash": edge_data["tx_hash"],
                "timestamp": edge_data["timestamp"],
            })

            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, hops + 1))

    return results

def get_graph_stats(G):
    return {
        "nodes": G.number_of_nodes(),
        "edges": G.number_of_edges(),
    }