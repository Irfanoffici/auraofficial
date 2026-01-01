import os
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase Client
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or "https://iqjmfcegdlnyglyalvst.supabase.co"
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or "sb_publishable_nsdLWQ62blKqW8PcMh0jrA_-tnG30zv"
# Note: For backend admin tasks (bypassing RLS), we should use SERVICE_ROLE_KEY if available.
# check settings for secret, else fallback to anon (which might fail validation for some admin tasks)

supabase: Client = create_client(url, key)

def get_supabase() -> Client:
    return supabase
