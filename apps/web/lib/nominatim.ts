const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

interface GeocodingResult {
  lat: string;
  lon: string;
  displayName: string;
}

export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      countrycodes: 'in',
      limit: '10',
      'accept-language': 'en',
    });

    const response = await fetch(`${NOMINATIM_API}/search?${params.toString()}`, {
      headers: {
        'User-Agent': 'Moon-Transit-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const results: NominatimResult[] = await response.json();

    return results.map((result) => ({
      lat: result.lat,
      lon: result.lon,
      displayName: result.display_name,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      'accept-language': 'en',
    });

    const response = await fetch(`${NOMINATIM_API}/reverse?${params.toString()}`, {
      headers: {
        'User-Agent': 'Moon-Transit-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const result: NominatimResult = await response.json();
    return result.display_name;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat}, ${lng}`;
  }
}

export async function searchCities(query: string) {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      countrycodes: 'in',
      featuretype: 'city',
      limit: '5',
      'accept-language': 'en',
    });

    const response = await fetch(`${NOMINATIM_API}/search?${params.toString()}`, {
      headers: {
        'User-Agent': 'Moon-Transit-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('City search failed');
    }

    const results: NominatimResult[] = await response.json();

    return results.map((result) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.address?.city || result.display_name.split(',')[0],
    }));
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
}
