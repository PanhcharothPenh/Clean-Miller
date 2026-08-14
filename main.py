"""
============================================================
P2B LAUNDRY SYSTEM - MAIN PYTHON LAUNCHER (main.py)
============================================================
Pure Python application runner. Starts the P2B Laundry System 
Python Backend Server and opens the browser interface automatically.

Usage:
    python main.py
    python run.py
============================================================
"""

import os
import sys
import time
import webbrowser
import threading
from python_server import run_python_server

def open_browser(url, delay=1.5):
    time.sleep(delay)
    print(f"\n[Python Launcher] Opening P2B Laundry System interface: {url}")
    webbrowser.open(url)

def main():
    port = 3000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    url = f"http://localhost:{port}"

    print("============================================================")
    print("      P2B LAUNDRY SYSTEM - PURE PYTHON ENGINE               ")
    print("============================================================")
    print(f" [Engine] Python Version: {sys.version.split()[0]}")
    print(f" [Status] Starting Python Server on {url}...")
    print("============================================================")

    # Automatically launch browser in background thread
    threading.Thread(target=open_browser, args=(url, 1.2), daemon=True).start()

    # Start main Python HTTP & API Server
    run_python_server(port)

if __name__ == '__main__':
    main()
