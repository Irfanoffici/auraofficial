import requests
import json
import time

BASE_URL = "http://127.0.0.1:8002/api/v1"

# We cannot get a real Supabase token without a secret or login flow.
# However, our auth.py trusts ANY token if verify_signature=False (DEV MODE).
# So we can fake a token!
# A minimal JWT has 3 parts: header.payload.signature
# We just need a payload that has "sub" (user_id).
# Let's construct a "fake" JWT. 
# Base64 encoded '{"alg":"HS256","typ":"JWT"}' -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
# Base64 encoded '{"sub":"test-user-123","email":"test@aura.com","role":"authenticated"}' -> eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGF1cmEuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ
# Signature doesn't matter for our dev backend config.

FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGF1cmEuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.c2lnbmF0dXJl"
HEADERS = {"Authorization": f"Bearer {FAKE_TOKEN}"}

def run_tests():
    print("🚀 Starting Backend Tests...")
    
    # 1. Health Check
    try:
        r = requests.get("http://127.0.0.1:8002/")
        print(f"✅ Health Check: {r.status_code} - {r.json()['status']}")
    except Exception as e:
        print(f"❌ Backend not running? {e}")
        return

    # 2. Start Focus Session
    print("\n🔹 Testing Focus Session...")
    payload = {"intent": "Coding backend tests"}
    r = requests.post(f"{BASE_URL}/focus/start", json=payload, headers=HEADERS)
    if r.status_code == 200:
        session = r.json()
        print(f"✅ Started Session: {session['id']}")
        session_id = session['id']
    else:
        print(f"❌ Failed to start session: {r.text}")
        return

    # 3. End Focus Session
    time.sleep(1)
    print("\n🔹 Ending Focus Session...")
    payload = {
        "session_id": session_id,
        "duration": 120,
        "focus_score": 95,
        "interruptions": 1
    }
    r = requests.post(f"{BASE_URL}/focus/end", json=payload, headers=HEADERS)
    if r.status_code == 200:
        print(f"✅ Ended Session: {r.json()['status']}")
    else:
        print(f"❌ Failed to end session: {r.text}")

    # 4. Submit Checkin
    print("\n🔹 Testing Check-in (Sentiment)...")
    payload = {
        "mood_score": 8,
        "energy_score": 90,
        "productivity_score": 85,
        "notes": "I feel great about this progress! The backend is solid."
    }
    r = requests.post(f"{BASE_URL}/checkin/submit", json=payload, headers=HEADERS)
    if r.status_code == 200:
        data = r.json()
        print(f"✅ Checkin Received. Sentiment: {data.get('sentiment')}")
    else:
        print(f"❌ Checkin failed: {r.text}")

    # 5. Get Insights
    print("\n🔹 Testing Insights (Summary)...")
    r = requests.get(f"{BASE_URL}/insights/summary", headers=HEADERS)
    if r.status_code == 200:
        data = r.json()
        print(f"✅ Insight Generated: {data.get('ai_summary')}")
    else:
        print(f"❌ Insights failed: {r.text}")

if __name__ == "__main__":
    run_tests()
