from geopy.geocoders import Nominatim
from uszipcode import SearchEngine

search = SearchEngine()
geolocator = Nominatim(user_agent="myGeocoder")

def zipcodes(zip_code, radius_miles=10, max_results=100):
    data = []
    location = geolocator.geocode(f"{zip_code}, US")
    if location:
        nearby_zipcodes = search.query(
            lat=location.latitude,
            lng=location.longitude,
            radius=radius_miles,
            returns=max_results
        )
        data = [z.zipcode for z in nearby_zipcodes]
    return data
