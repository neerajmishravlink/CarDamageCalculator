import requests
from .schemas import LocationResponse

NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'


def reverse_geocode(lat: float, lon: float) -> LocationResponse:
    params = {
        'format': 'json',
        'lat': lat,
        'lon': lon,
        'zoom': 10,
        'addressdetails': 1,
    }
    response = requests.get(NOMINATIM_URL, params=params, timeout=10, headers={'User-Agent': 'CarDamageCalculator/1.0'})
    response.raise_for_status()
    data = response.json()
    address = data.get('address', {})
    return LocationResponse(
        city=address.get('city') or address.get('town') or address.get('village') or address.get('hamlet'),
        region=address.get('state'),
        lat=float(data.get('lat', lat)),
        lon=float(data.get('lon', lon)),
    )
