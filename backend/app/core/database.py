import os
import logging
from datetime import datetime
from app.core.config import settings

# Setup Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Safe Import for Firebase
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    firebase_admin = None
    logger.warning("⚠️ firebase_admin module not found. forcing Mock Mode.")

db = None

class MockDocumentReference:
    def __init__(self, collection_name, doc_id, data_store):
        self.collection_name = collection_name
        self.id = doc_id
        self._data_store = data_store
        
    def set(self, data):
        self._data_store[self.collection_name][self.id] = data
        logger.info(f"[MOCK DB] Set document {self.collection_name}/{self.id}")
        
    def update(self, data):
        if self.id in self._data_store[self.collection_name]:
            self._data_store[self.collection_name][self.id].update(data)
            logger.info(f"[MOCK DB] Updated document {self.collection_name}/{self.id}")
        else:
            raise Exception("Document not found")
            
    def get(self):
        data = self._data_store[self.collection_name].get(self.id)
        return MockDocumentSnapshot(self.id, data)

class MockDocumentSnapshot:
    def __init__(self, doc_id, data):
        self.id = doc_id
        self._data = data
        self.exists = data is not None
        
    def to_dict(self):
        return self._data

class MockCollectionReference:
    def __init__(self, collection_name, data_store):
        self.collection_name = collection_name
        self._data_store = data_store
        
    def document(self, doc_id=None):
        if not doc_id:
            import uuid
            doc_id = str(uuid.uuid4())
        return MockDocumentReference(self.collection_name, doc_id, self._data_store)

    def order_by(self, field, direction=None):
        # Mock sorting (no-op or simple sort could be added, here just returning self for chaining)
        return self

    def limit(self, count):
        # Mock limit
        return self

    def stream(self):
        # Yield all docs in collection
        for doc_id, data in self._data_store[self.collection_name].items():
            yield MockDocumentSnapshot(doc_id, data)

class MockFirestore:
    def __init__(self):
        self._data = {
            "users": {},
            # Nested collections are tricky in flat dicts, 
            # so we'll just mock basic paths if needed or assume simple structure for now.
            # Real Firestore has subcollections. 
            # usage: db.collection("users").document(uid).collection("focus_sessions")
        }
        # For our simple usage: db.collection("users").document(...).collection(...)
        # We need a recursive mock or a flattened key approach.
        # Let's use a simpler approach: Just accept any collection call and return a MockCollection
        # stored in a global dict. This is a "Loose Mock".
        self._store = {} 

    def collection(self, name):
        if name not in self._store:
            self._store[name] = {}
        return MockCollectionReference(name, self._store)

class MockRecursiveReference:
    """
    Handles db.collection(...).document(...).collection(...) chains dynamically.
    """
    def __init__(self, path, store):
        self.path = path # e.g., "users/123/focus_sessions"
        self.store = store # Reference to global dict
        
    def document(self, doc_id=None):
        import uuid
        if not doc_id:
            doc_id = str(uuid.uuid4())
        new_path = f"{self.path}/{doc_id}"
        return MockDoc(new_path, self.store)
    
    def order_by(self, field, direction=None): return self
    def limit(self, count): return self
    def stream(self):
        # Return list of docs found at this path level
        # This requires the store to know about paths.
        # Simplified: We store data in self.store[path] = { doc_id: data }
        if self.path not in self.store:
            return []
        for doc_id, data in self.store[self.path].items():
            yield MockDocumentSnapshot(doc_id, data)

class MockDoc:
    def __init__(self, path, store):
        self.path = path # "users/123"
        self.id = path.split("/")[-1]
        self.store = store
        
    def collection(self, name):
        # "users/123" + "focus_sessions" -> "users/123/focus_sessions"
        return MockRecursiveReference(f"{self.path}/{name}", self.store)
        
    def set(self, data):
        # We need to find the "parent collection" in the store.
        # path is "col/doc/col/doc..."
        # We are at a Doc level.
        # Let's say we store collections as keys in `store`.
        # "users/123/focus_sessions" -> { "sess1": {...} }
        parent_col_path = "/".join(self.path.split("/")[:-1])
        if parent_col_path not in self.store:
            self.store[parent_col_path] = {}
        self.store[parent_col_path][self.id] = data
        logger.info(f"[MOCK DB] Set {self.path}")

    def get(self):
        parent_col_path = "/".join(self.path.split("/")[:-1])
        data = self.store.get(parent_col_path, {}).get(self.id)
        return MockDocumentSnapshot(self.id, data)
    
    def update(self, data):
        parent_col_path = "/".join(self.path.split("/")[:-1])
        if parent_col_path in self.store and self.id in self.store[parent_col_path]:
             self.store[parent_col_path][self.id].update(data)
             logger.info(f"[MOCK DB] Updated {self.path}")
        else:
            logger.warning(f"[MOCK DB] Update failed, doc not found: {self.path}")

class BetterMockFirestore:
    def __init__(self):
        self._store = {}
        
    def collection(self, name):
        return MockRecursiveReference(name, self._store)


def init_firebase():
    global db
    cred_path = settings.FIREBASE_CREDENTIALS
    
    if os.path.exists(cred_path):
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                logger.info(f"✅ Firebase initialized with {cred_path}")
            db = firestore.client()
        except Exception as e:
            logger.error(f"❌ Firebase init failed: {e}")
            logger.warning("⚠️ Falling back to In-Memory Mock Database.")
            db = BetterMockFirestore()
    else:
        logger.warning(f"⚠️ '{cred_path}' not found. Using In-Memory Mock Database.")
        db = BetterMockFirestore()

def get_db():
    if db is None:
        init_firebase()
    return db
