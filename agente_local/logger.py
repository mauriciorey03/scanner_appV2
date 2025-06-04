# logger.py

from datetime import datetime

def info(msg):
    print(f"[INFO] {datetime.now().isoformat()} - {msg}")

def error(msg):
    print(f"[ERROR] {datetime.now().isoformat()} - {msg}")
