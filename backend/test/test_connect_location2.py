import json
import os
import sys
import unittest

# Add the backend directory to the sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tools.connect_location2 import connect_location2

class TestConnectLocation2(unittest.TestCase):

    def setUp(self):
        self.test_data_path = os.path.join(os.path.dirname(__file__), 'test_data_for_connect2.json')
        self.output_path = os.path.join(os.path.dirname(__file__), 'test_result_for_connect2.json')

    def test_connect_location2(self):
        # Ensure the test data file exists
        self.assertTrue(os.path.exists(self.test_data_path), f"Test data file not found at {self.test_data_path}")

        # Run the function
        result_trip = connect_location2(self.test_data_path)

        # Save the result to a file
        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(result_trip, f, ensure_ascii=False, indent=2)

        # Assert that the result is not None
        self.assertIsNotNone(result_trip)

        # Assert that transportation has been added
        # A simple check: see if any activity has the type 'transportation'
        transportation_found = False
        for day in result_trip.get('days', []):
            for activity in day.get('activities', []):
                if activity.get('type') == 'transportation':
                    transportation_found = True
                    break
            if transportation_found:
                break
        
        self.assertTrue(transportation_found, "No transportation activities were added to the trip.")
        
        print(f"Test passed. Output saved to {self.output_path}")

if __name__ == '__main__':
    unittest.main()
