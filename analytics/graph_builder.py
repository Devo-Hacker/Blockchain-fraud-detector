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
    print(f"\nTracing fund flow starting from: {start_address}\n")

    visited = set()
    queue = [(start_address, [start_address], 0)]

    while queue:
        current, path, hops = queue.pop(0)

        if hops >= max_hops:
            continue

        if current not in G:
            continue

        for neighbor in G.successors(current):
            edge_data = G.get_edge_data(current, neighbor)
            new_path = path + [neighbor]

            print(f"Hop {hops+1}: {current} --({edge_data['value']} {edge_data['token']})--> {neighbor}")

            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, new_path, hops + 1))

if __name__ == "__main__":
    print("Fetching transactions from database...")
    transactions = fetch_transactions()
    print(f"Fetched {len(transactions)} transactions.\n")

    print("Building graph...")
    G = build_graph(transactions)
    print(f"Graph built: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges.")

    # Change this to any wallet address that exists in your data
    start_wallet = "0x28c6c06298d514db089934071355e5743bf21d60"
    trace_fund_flow(G, start_wallet)