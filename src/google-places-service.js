// Google Places API Service - Now calls our backend

export async function getBarByName(barName, address = '') {
  console.log(`Fetching: ${barName}`);
  
  try {
    // Call our Vercel serverless function instead of Google directly
    const url = `/api/fetch-bar?name=${encodeURIComponent(barName)}${address ? `&address=${encodeURIComponent(address)}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bar');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Failed to get bar: ${barName}`, error);
    throw error;
  }
}

export default {
  getBarByName
};
