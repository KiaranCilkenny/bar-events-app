// Vercel Serverless Function to fetch bar data from Google Places API
const GOOGLE_API_KEY = 'AIzaSyAw_sBnpDUWWnI0G24yZPxm4KFInL9YRQo';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { name, address } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Bar name is required' });
  }
  
  try {
    // Step 1: Search for place
    const searchQuery = address ? `${name} ${address}` : `${name} New York, NY`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.status !== 'OK' || !searchData.candidates.length) {
      return res.status(404).json({ error: `Bar not found: ${name}` });
    }
    
    const placeId = searchData.candidates[0].place_id;
    
    // Step 2: Get place details
    const fields = [
      'place_id', 'name', 'formatted_address', 'formatted_phone_number',
      'website', 'rating', 'user_ratings_total', 'opening_hours',
      'photos', 'price_level', 'types', 'geometry', 'url'
    ].join(',');
    
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    
    if (detailsData.status !== 'OK') {
      return res.status(500).json({ error: 'Failed to get place details' });
    }
    
    const place = detailsData.result;
    
    // Step 3: Transform to our format
    const barData = {
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
    
    return res.status(200).json(barData);
    
  } catch (error) {
    console.error('Error fetching bar:', error);
    return res.status(500).json({ error: error.message });
  }
}
