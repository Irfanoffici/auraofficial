from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Validates Supabase JWT.
    Note: For full security, we need the SUPABASE_JWT_SECRET to verify signature.
    Since we only have the Anon Key (public), we can only DECODE to check expiration
    and claims structure, but we cannot cryptographically verify that WE signed it purely
    backend-side without the project secret.
    
    For now, we trust the token if it decodes successfully (Development Mode).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # In production, add signature verification with the secret!
        # options={"verify_signature": False} is for dev only when secret is missing.
        # Passing None as key because we aren't using the signature and the anon key is NOT an HS256 secret.
        payload = jwt.decode(token, None, options={"verify_signature": False})
        
        user_id: str = payload.get("sub")
        if user_id is None:
            print("❌ Auth Error: No 'sub' in payload")
            raise credentials_exception
            
        return {"id": user_id, "email": payload.get("email"), "role": payload.get("role")}
        
    except JWTError as e:
        print(f"❌ Auth JWT Error: {e}")
        raise credentials_exception
