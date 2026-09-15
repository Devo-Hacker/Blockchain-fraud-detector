import os
import csv
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def clean_address(address):
    address = address.strip().lower()
    if not address or not address.startswith("0x"):
        return None
    return address

def bulk_upsert(cur, wallet_dict):
    """wallet_dict: {address: (label, entity_type)}"""
    if not wallet_dict:
        return
    rows = [(addr, 'bnb', label, etype) for addr, (label, etype) in wallet_dict.items()]
    execute_values(
        cur,
        """
        INSERT INTO wallets (address, chain, label, entity_type)
        VALUES %s
        ON CONFLICT (address) DO UPDATE
        SET label = EXCLUDED.label,
            entity_type = EXCLUDED.entity_type
        WHERE wallets.entity_type = 'unknown' OR wallets.entity_type IS NULL
        """,
        rows
    )

def load_exchange_addresses(cur, path):
    wallets = {}
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("network", "").strip().lower() != "bsc":
                continue
            addr = clean_address(row.get("address", ""))
            if addr:
                wallets[addr] = (row.get("entity", "Exchange"), "exchange")
    bulk_upsert(cur, wallets)
    print(f"exchange_addresses.csv: {len(wallets)} unique BSC wallets loaded")

def load_bscscan_style(cur, path, default_label, default_entity_type):
    wallets = {}
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            from_addr = clean_address(row.get("From", ""))
            to_addr = clean_address(row.get("To", ""))
            from_tag = row.get("From_Nametag", "").strip()
            to_tag = row.get("To_Nametag", "").strip()

            if from_addr:
                wallets[from_addr] = (from_tag if from_tag else default_label, default_entity_type)
            if to_addr:
                wallets[to_addr] = (to_tag if to_tag else default_label, default_entity_type)

    bulk_upsert(cur, wallets)
    print(f"{os.path.basename(path)}: {len(wallets)} unique wallets loaded")

if __name__ == "__main__":
    conn = get_conn()
    cur = conn.cursor()

    data_dir = os.path.join(os.path.dirname(__file__), "data")

    load_exchange_addresses(cur, os.path.join(data_dir, "exchange_addresses.csv"))
    conn.commit()

    load_bscscan_style(cur, os.path.join(data_dir, "bridge_addresses.csv"), "Bridge Contract", "bridge")
    conn.commit()

    load_bscscan_style(cur, os.path.join(data_dir, "scam_wallet_addresses.csv"), "Reported Scam Wallet", "scam")
    conn.commit()

    load_bscscan_style(cur, os.path.join(data_dir, "bnb_transactions_combined.csv"), "Unlabeled", "unknown")
    conn.commit()

    cur.close()
    conn.close()
    print("Done.")