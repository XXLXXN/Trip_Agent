import json
import os
import sys
import time
from typing import List, Dict, Any

# Add parent directory to path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.map_tools import search_and_add_poi, add_detail_info
from DataDefinition.DataDefinition import SpotDetailInfo, SpotNameAndRecReason

def process_raw_data_to_detailed(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Processes a raw trip data dictionary, adds detailed POI information
    to each activity, and returns the enriched trip data.
    """
    # Create a deep copy to avoid modifying the original data
    detailed_data = json.loads(json.dumps(raw_data))
    destination_city = detailed_data.get("destination", "北京") # Get destination city for context
    item_counter = 0 # Initialize a universal counter, starting from 0 for transport

    for day in detailed_data.get("days", []):
        new_activities = []
        for activity in day.get("activities", []):
            if activity.get("type") == "activity" and "raw_poi_info" in activity:
                try:
                    # Step 0: Convert the raw dict to the Pydantic model expected by the functions
                    raw_poi_info = activity["raw_poi_info"]
                    spot_to_process = SpotNameAndRecReason(
                        SpotName=raw_poi_info.get("name"),
                        POIId=raw_poi_info.get("id"), # Map the 'id' field to 'POIId'
                        RecReason="Generated from raw data for testing."
                    )
                    
                    # Step 1: Get basic POI info (like precise location)
                    # The function needs a list and the city context
                    poi_basics_list = search_and_add_poi([spot_to_process], destination_city)
                    
                    if not poi_basics_list:
                        print(f"⚠️ search_and_add_poi returned empty for: {spot_to_process.SpotName}. Skipping.")
                        # Even if skipped, add original with a new ID
                        activity['id'] = f"activity_{item_counter}"
                        new_activities.append(activity)
                        item_counter += 1
                        continue

                    # Step 2: Get detailed POI info (photos, rating, etc.)
                    # add_detail_info takes the list of basic spots and fetches details.
                    detailed_poi_list = add_detail_info(poi_basics_list)

                    if detailed_poi_list:
                        # Get the first (and only) detailed POI object
                        detailed_poi = detailed_poi_list[0]
                        
                        # Create the new activity structure based on origin_data.json format
                        new_activity = {
                            "id": f"activity_{item_counter}",
                            "start_time": "00:00:00", # Placeholder
                            "end_time": "00:00:00",   # Placeholder
                            "description": f"游览 {detailed_poi.name}",
                            "notes": "",
                            "cost": 0.0,
                            "type": "activity",
                            "title": detailed_poi.name,
                            "location": {
                                "name": detailed_poi.name,
                                "address": detailed_poi.address,
                                "coordinates": None # Placeholder
                            },
                            "recommended_products": [],
                            "poi_details": detailed_poi.model_dump()
                        }
                        new_activities.append(new_activity)
                        print(f"✅ Successfully processed and added details for: {detailed_poi.name}")
                    else:
                        print(f"⚠️ Could not get details for: {spot_to_process.SpotName}. Skipping.")
                        # If details fail, add original with a new ID
                        activity['id'] = f"activity_{item_counter}"
                        new_activities.append(activity)

                except Exception as e:
                    print(f"💥 Error processing {activity.get('raw_poi_info', {}).get('name')}: {e}")
                    # Append the original activity if processing fails
                    activity['id'] = f"activity_{item_counter}"
                    new_activities.append(activity)
                
                item_counter += 1
                # Add a delay to avoid hitting API rate limits
                time.sleep(0.2) # 200ms delay

            else:
                # Handle other types like 'large_transportation'
                if activity.get("type") == "large_transportation":
                    activity['id'] = f"transport_{item_counter}"
                else:
                    activity['id'] = f"item_{item_counter}"
                new_activities.append(activity)
                item_counter += 1
        
        day["activities"] = new_activities

    return detailed_data

if __name__ == "__main__":
    # Get the absolute path of the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    input_file = os.path.join(backend_dir, 'DataDefinition', 'SAMPLE_RAW_DATA.json')
    output_file = os.path.join(backend_dir, 'test', 'detailed_sample_raw_data.json')

    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    print(f"Reading raw data from: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_trip_data = json.load(f)

    print("\nProcessing raw data to add details...")
    detailed_trip_data = process_raw_data_to_detailed(raw_trip_data)

    print(f"\nWriting detailed data to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(detailed_trip_data, f, ensure_ascii=False, indent=2)

    print("\n🎉 Test finished successfully.")
