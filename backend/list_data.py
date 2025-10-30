import json
from pymongo import MongoClient
import certifi
import socks
import socket
from bson.json_util import dumps

def list_data_in_db():
    """
    Connects to the MongoDB database and lists the data in the 'trips' collection.
    """
    try:
        # Configure the SOCKS5 proxy
        socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 7890)
        socket.socket = socks.socksocket
        print("SOCKS5 proxy configured.")

        # MongoDB Atlas connection string
        # Make sure to use the correct password
        client = MongoClient(
            "mongodb+srv://fireflyx:UrfV1fqFHyLwuWQ0@firefly.thygnti.mongodb.net/?retryWrites=true&w=majority&appName=firefly",
            tlsCAFile=certifi.where()
        )
        print("Attempting to connect to MongoDB Atlas...")

        # Ping the server to confirm a successful connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")

        # Select the database and collection
        db = client['trip_agent']
        collection = db['trips']
        print("Connected to 'trip_agent' database and 'trips' collection.")

        # Find all documents in the collection
        print("\nFetching documents from the 'trips' collection...")
        all_trips = list(collection.find())

        if not all_trips:
            print("No data found in the 'trips' collection.")
            return

        print(f"Found {len(all_trips)} document(s) in the collection.")
        
        # Print the data
        print("\n--- Data in 'trips' collection ---")
        for trip in all_trips:
            # Use dumps to handle MongoDB specific types like ObjectId
            print(dumps(trip, indent=2))
        print("--- End of data ---")

    except socks.ProxyConnectionError as e:
        print(f"Proxy connection error: {e}")
        print("Please ensure your SOCKS5 proxy is running on 127.0.0.1:7890.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    list_data_in_db()
