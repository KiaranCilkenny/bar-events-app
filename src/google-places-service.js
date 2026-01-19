// Google Places API Service
const GOOGLE_API_KEY = 'AIzaSyAw_sBnpDUWWnI0G24yZPxm4KFInL9YRQo';

// Using CORS Anywhere proxy to bypass CORS restrictions
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export async function searchPlace(barName, location = 'New York, NY') {
  const searchQuery = `${barName} ${location}`;
  const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(apiUrl));
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }
    
    throw new Error(`Place not found: ${barName}`);
  } catch (error) {
    console.error('Error searching place:', error);
    throw error;
  }
}

export async function getPlaceDetails(placeId) {
  const fields = [
    'place_id', 'name', 'formatted_address', 'formatted_phone_number',
    'website', 'rating', 'user_ratings_total', 'opening_hours',
    'photos', 'price_level', 'types', 'geometry', 'url'
  ].join(',');
  
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(apiUrl));
    const data = await response.json();
    
    if (data.status === 'OK') {
      return transformPlaceData(data.result);
    }
    
    throw new Error(`Failed to get details: ${data.status}`);
  } catch (error) {
    console.error('Error getting place details:', error);
    throw error;
  }
}

function transformPlaceData(place) {
  return {
    googlePlaceId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    phone: place.formatted_phone_number || 'N/A',
    website: place.website || 'N/A',
    googleMapsUrl: place.url,
    
    latitude: place.geometry?.location?.lat,
    longitude: place.geometry?.location?.lng,
    
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    priceLevel: place.price_level || 2,
    
    hours: place.opening_hours ? {
      weekdayText: place.opening_hours.weekday_text || []
    } : null,
    
    photos: (place.photos || []).slice(0, 5).map(photo => ({
      reference: photo.photo_reference,
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
      width: photo.width,
      height: photo.height
    })),
    
    types: place.types || []
  };
}

export async function getBarByName(barName, location = 'New York, NY') {
  console.log(`Searching for: ${barName} in ${location}`);
  const placeId = await searchPlace(barName, location);
  
  console.log(`Found place_id: ${placeId}`);
  const details = await getPlaceDetails(placeId);
  
  return details;
}

export default {
  searchPlace,
  getPlaceDetails,
  getBarByName
};
