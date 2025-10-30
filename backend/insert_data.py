import json
from pymongo import MongoClient
import os
import certifi
import socks
import socket

# --- 代理配置 ---
socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 7890)
socket.socket = socks.socksocket

# --- Configuration ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://fireflyx:UrfV1fqFHyLwuWQ0@firefly.thygnti.mongodb.net/?appName=firefly")
DB_NAME = "trip_agent"
COLLECTION_NAME = "trips"

# --- File Paths ---
# Get the absolute path of the directory where the script is located
backend_dir = os.path.dirname(os.path.abspath(__file__))

RAW_TRIP_FILE = os.path.join(backend_dir, 'DataDefinition', 'origin_data.json')
DETAILED_TRIP_FILE = os.path.join(backend_dir, 'DataDefinition', 'SAMPLE_TRIP_DATA_3.json')

def load_json_data(file_path):
    """Loads JSON data from a file with robust error handling."""
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found at {file_path}")
        return None
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error decoding JSON from {file_path}: {e}")
        return None
    except Exception as e:
        print(f"❌ An unexpected error occurred while reading {file_path}: {e}")
        return None

def insert_data():
    """
    Connects to MongoDB and inserts/updates a trip document with both raw and detailed trip data.
    """
    client = None
    try:
        # --- Database Connection ---
        print("Connecting to MongoDB...")
        ca = certifi.where()
        client = MongoClient(MONGO_URI, tlsCAFile=ca)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        # Test connection
        client.admin.command('ping')
        print("✅ Connection successful.")

        # --- Load Data ---
        print(f"Loading raw trip data from: {RAW_TRIP_FILE}")
        raw_trip_data = load_json_data(RAW_TRIP_FILE)
        
        print(f"Loading detailed trip data from: {DETAILED_TRIP_FILE}")
        detailed_trip_data = load_json_data(DETAILED_TRIP_FILE)

        if raw_trip_data is None or detailed_trip_data is None:
            print("Aborting insertion due to data loading failure.")
            return

        # --- Data Preparation ---
        trip_id_to_update = "beijing_wenyi_trip_001" # The trip_id we are working with
        
        trip_document = {
            "trip_id": trip_id_to_update,
            "user_id": "test_user_beijing_001",
            "raw_trip": raw_trip_data,
            "detailed_trip": detailed_trip_data
        }

        # --- Database Operation ---
        print(f"Updating document with trip_id: {trip_id_to_update}...")
        result = collection.update_one(
            {"trip_id": trip_id_to_update},
            {"$set": trip_document},
            upsert=True
        )

        if result.upserted_id is not None:
            print(f"✅ Successfully inserted a new document with id: {result.upserted_id}")
        elif result.modified_count > 0:
            print(f"✅ Successfully updated the document for trip_id: {trip_id_to_update}")
        else:
            print(f"🟡 Document for trip_id: {trip_id_to_update} already exists and is up-to-date.")

    except Exception as e:
        print(f"❌ An error occurred: {e}")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    insert_data()


