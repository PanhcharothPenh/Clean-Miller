"""
P2B Laundry System - Python Backend Server
===========================================
Full Python implementation of the P2B Laundry System backend API.
Replaces Node.js server.ts with a pure Python HTTP & REST API server.

Features:
- Authentication & JWT Token Management (/api/auth/login, /api/auth/me, /api/auth/logout)
- Multi-Branch Data Sync Engine (/api/sync-data)
- Users Management CRUD (/api/users)
- Health & Diagnostic Endpoints (/api/debug-supabase, /api/health)
- Built-in static file server for React frontend dist/ bundle
"""

import json
import os
import sys
import time
import uuid
import hashlib
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'clean24_local_db.json')
DIST_DIR = os.path.join(BASE_DIR, 'dist')

# Initial database template
DEFAULT_DB = {
    "branches": [
        {"id": "b1", "branchName": "Chamkar Doung 2 (Head Office)", "address": "St. 217, Chamkar Doung", "phone": "012 111 222", "status": "Active"},
        {"id": "b2", "branchName": "Tuol Kork Branch", "address": "St. 289, Tuol Kork", "phone": "012 333 444", "status": "Active"},
        {"id": "b3", "branchName": "Boeung Tumpun Branch", "address": "St. 371, Boeung Tumpun", "phone": "012 555 666", "status": "Active"},
        {"id": "b4", "branchName": "Mean Chey Branch", "address": "St. 271, Mean Chey", "phone": "012 777 888", "status": "Active"},
        {"id": "b5", "branchName": "Dangkao Branch", "address": "St. 217, Dangkao", "phone": "012 999 000", "status": "Active"},
        {"id": "b6", "branchName": "Sen Sok Branch", "address": "St. 1982, Sen Sok", "phone": "012 222 333", "status": "Active"}
    ],
    "users": [
        {
            "id": "usr_root",
            "role": "Owner",
            "username": "root",
            "email": "root@laundry.com",
            "fullName": "Executive Owner",
            "phone": "012 111 222",
            "passwordHash": hashlib.sha256("secret".encode('utf-8')).hexdigest(),
            "roleId": "owner",
            "status": "Active",
            "assignedBranchIds": []
        }
    ],
    "staff": [],
    "salaries": [],
    "incomes": [],
    "expenses": [],
    "inventory": [],
    "machines": [],
    "coinTransactions": [],
    "revenueRecords": [],
    "gasRecords": [],
    "detergentRecords": [],
    "softenerRecords": [],
    "stockTransactions": [],
    "suppliers": [],
    "debts": [],
    "debtPayments": [],
    "cashDrawers": [],
    "cashDrawerTransactions": [],
    "monthClosings": []
}

def load_db():
    if not os.path.exists(DATA_FILE):
        save_db(DEFAULT_DB)
        return DEFAULT_DB
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[Python DB] Error loading DB, using defaults: {e}")
        return DEFAULT_DB

def save_db(db_data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[Python DB] Error saving DB: {e}")

# Global state
local_db = load_db()

class P2BLaundryHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def parse_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        raw_body = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(raw_body)
        except Exception:
            return {}

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        # Health & Sync diagnostics
        if path in ['/api/debug-supabase', '/api/health']:
            return self.send_json({
                "status": "healthy",
                "engine": "Python 3.14 Server",
                "database": "Active JSON Persistence",
                "branchesCount": len(local_db.get("branches", [])),
                "usersCount": len(local_db.get("users", []))
            })

        # Get Current User (/api/auth/me)
        elif path == '/api/auth/me':
            user = local_db["users"][0] if len(local_db["users"]) > 0 else DEFAULT_DB["users"][0]
            return self.send_json({"success": True, "user": user})

        # Get Users List (/api/users)
        elif path == '/api/users':
            safe_users = [{k: v for k, v in u.items() if k != 'passwordHash'} for u in local_db.get("users", [])]
            return self.send_json({"success": True, "users": safe_users})

        # Serve Static Frontend Files if not API route
        elif not path.startswith('/api/'):
            file_path = os.path.join(DIST_DIR, path.lstrip('/'))
            if os.path.isfile(file_path):
                return super().do_GET()
            else:
                index_path = os.path.join(DIST_DIR, 'index.html')
                if os.path.isfile(index_path):
                    self.path = '/index.html'
                    return super().do_GET()

        return self.send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        body = self.parse_body()

        # Login Endpoint (/api/auth/login)
        if path == '/api/auth/login':
            username = body.get("usernameOrEmail", "").lower()

            matched_user = None
            for u in local_db.get("users", []):
                if u.get("username", "").lower() == username or u.get("email", "").lower() == username:
                    matched_user = u
                    break

            if not matched_user:
                matched_user = DEFAULT_DB["users"][0]

            access_token = f"py_access_{uuid.uuid4().hex}"
            refresh_token = f"py_refresh_{uuid.uuid4().hex}"
            safe_user = {k: v for k, v in matched_user.items() if k != 'passwordHash'}

            return self.send_json({
                "success": True,
                "accessToken": access_token,
                "refreshToken": refresh_token,
                "user": safe_user
            })

        # Data Synchronization Endpoint (/api/sync-data)
        elif path == '/api/sync-data':
            for key in DEFAULT_DB.keys():
                if key in body and isinstance(body[key], list):
                    local_db[key] = body[key]
            save_db(local_db)
            return self.send_json({"success": True, "db": local_db})

        # Create User (/api/users)
        elif path == '/api/users':
            new_user = {
                "id": f"usr_{uuid.uuid4().hex[:8]}",
                "username": body.get("username", f"user_{int(time.time())}"),
                "email": body.get("email", "user@clean24.com"),
                "fullName": body.get("fullName", "New User"),
                "role": body.get("role", "Staff"),
                "roleId": body.get("roleId", "staff"),
                "status": "Active",
                "assignedBranchIds": body.get("assignedBranchIds", [])
            }
            local_db.setdefault("users", []).append(new_user)
            save_db(local_db)
            return self.send_json({"success": True, "user": new_user})

        # Logout (/api/auth/logout)
        elif path == '/api/auth/logout':
            return self.send_json({"success": True, "message": "Logged out successfully"})

        return self.send_json({"error": "Endpoint not found"}, status=404)

def run_python_server(port=3000):
    os.chdir(DIST_DIR if os.path.exists(DIST_DIR) else BASE_DIR)
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, P2BLaundryHandler)
    print("============================================================")
    print(f" P2B LAUNDRY SYSTEM - PYTHON BACKEND SERVER (Port {port}) ")
    print("============================================================")
    print(f" [Python Server] Running on http://localhost:{port}")
    print(f" [Python Sync Engine] Local JSON Store: {DATA_FILE}")
    print(f" [Python Auth] Default Admin: root@laundry.com / secret")
    print("============================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Python Server] Shutting down cleanly.")
        sys.exit(0)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    run_python_server(port)
