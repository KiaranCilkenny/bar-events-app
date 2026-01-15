// ESPN API Service
// Fetches live sports data from ESPN's free API endpoints

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';

// Sport configurations
const SPORTS_CONFIG = {
  nfl: {
    path: 'football/nfl',
    name: 'NFL',
    icon: '🏈'
  },
  nba: {
    path: 'basketball/nba',
    name: 'NBA',
    icon: '🏀'
  },
  mlb: {
    path: 'baseball/mlb',
    name: 'MLB',
    icon: '⚾'
  },
  nhl: {
    path: 'hockey/nhl',
    name: 'NHL',
    icon: '🏒'
  },
  ufc: {
    path: 'mma/ufc',
    name: 'UFC',
    icon: '🥊'
  },
  'college-football': {
    path: 'football/college-football',
    name: 'College Football',
    icon: '🏈',
    league: 'College Football'
  },
  'mens-college-basketball': {
    path: 'basketball/mens-college-basketball',
    name: 'College Basketball',
    icon: '🏀',
    league: 'NCAA Basketball'
  },
  soccer: {
    path: 'soccer/eng.1',  // Premier League
    name: 'Premier League',
    icon: '⚽',
    league: 'Premier League'
  },
  'soccer-champions': {
    path: 'soccer/uefa.champions',
    name: 'Champions League',
    icon: '⚽',
    league: 'Champions League'
  },
  'soccer-laliga': {
    path: 'soccer/esp.1',
    name: 'La Liga',
    icon: '⚽',
    league: 'La Liga'
  },
  'soccer-mls': {
    path: 'soccer/usa.1',
    name: 'MLS',
    icon: '⚽',
    league: 'MLS'
  },
  'soccer-seriea': {
    path: 'soccer/ita.1',
    name: 'Serie A',
    icon: '⚽',
    league: 'Serie A'
  },
  'soccer-bundesliga': {
    path: 'soccer/ger.1',
    name: 'Bundesliga',
    icon: '⚽',
    league: 'Bundesliga'
  }
};

// Cache system to avoid hitting ESPN too frequently
class ESPNCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new ESPNCache();

// Fetch with error handling
async function fetchESPN(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('ESPN API fetch error:', error);
    throw error;
  }
}

// Transform ESPN game data to app format
function transformGame(espnGame, sport) {
  const homeTeam = espnGame.competitions[0].competitors.find(c => c.homeAway === 'home');
  const awayTeam = espnGame.competitions[0].competitors.find(c => c.homeAway === 'away');
  
  // Get broadcast info
  const broadcast = espnGame.competitions[0].broadcasts?.[0] || {};
  const network = broadcast.names?.[0] || 'TBD';
  
  // Get venue
  const venue = espnGame.competitions[0].venue;
  
  // Format date and time
  const gameDate = new Date(espnGame.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateDisplay;
  if (gameDate.toDateString() === today.toDateString()) {
    dateDisplay = 'Today';
  } else if (gameDate.toDateString() === tomorrow.toDateString()) {
    dateDisplay = 'Tomorrow';
  } else {
    dateDisplay = gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  const timeDisplay = gameDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
return {
    id: espnGame.id,
    sport: SPORTS_CONFIG[sport].name,
    sportKey: sport.includes('soccer') ? 'soccer' : sport, // Normalize all soccer leagues to 'soccer'
    league: SPORTS_CONFIG[sport].league || SPORTS_CONFIG[sport].name,
    name: espnGame.name,
    shortName: espnGame.shortName,
    date: dateDisplay,
    time: timeDisplay,
    fullDate: gameDate.toISOString(),
    status: espnGame.status.type.description,
    statusDetail: espnGame.status.type.detail,
    completed: espnGame.status.type.completed,
    
    // Teams
    homeTeam: {
      id: homeTeam.team.id,
      name: homeTeam.team.displayName,
      shortName: homeTeam.team.shortDisplayName,
      abbreviation: homeTeam.team.abbreviation,
      logo: homeTeam.team.logo,
      color: homeTeam.team.color,
      alternateColor: homeTeam.team.alternateColor,
      score: homeTeam.score,
      record: homeTeam.records?.[0]?.summary || ''
    },
    
    awayTeam: {
      id: awayTeam.team.id,
      name: awayTeam.team.displayName,
      shortName: awayTeam.team.shortDisplayName,
      abbreviation: awayTeam.team.abbreviation,
      logo: awayTeam.team.logo,
      color: awayTeam.team.color,
      alternateColor: awayTeam.team.alternateColor,
      score: awayTeam.score,
      record: awayTeam.records?.[0]?.summary || ''
    },
    
    // Venue & Broadcast
    venue: {
      name: venue?.fullName || 'TBD',
      city: venue?.address?.city || '',
      state: venue?.address?.state || ''
    },
    network: network,
    
    // Links
    links: {
      espn: espnGame.links?.[0]?.href || '',
      gamecast: espnGame.competitions[0].competitors[0].team.links?.[0]?.href || ''
    }
  };
}

// Transform UFC event (slightly different structure)
function transformUFCEvent(espnEvent) {
  const competition = espnEvent.competitions[0];
  const fighters = competition.competitors;
  
  const gameDate = new Date(espnEvent.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateDisplay;
  if (gameDate.toDateString() === today.toDateString()) {
    dateDisplay = 'Today';
  } else if (gameDate.toDateString() === tomorrow.toDateString()) {
    dateDisplay = 'Tomorrow';
  } else {
    dateDisplay = gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  const timeDisplay = gameDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  return {
    id: espnEvent.id,
    sport: 'UFC',
    sportKey: 'ufc',
    name: espnEvent.name,
    shortName: espnEvent.shortName,
    date: dateDisplay,
    time: timeDisplay,
    fullDate: gameDate.toISOString(),
    status: espnEvent.status.type.description,
    statusDetail: espnEvent.status.type.detail,
    completed: espnEvent.status.type.completed,
    
    // Fighters
    fighters: fighters.map(f => ({
      id: f.athlete?.id || f.id,
      name: f.athlete?.displayName || f.team?.displayName,
      record: f.record?.[0]?.displayValue || '',
      winner: f.winner || false,
      image: f.athlete?.headshot || f.team?.logo
    })),
    
    // Venue
    venue: {
      name: competition.venue?.fullName || 'TBD',
      city: competition.venue?.address?.city || '',
      state: competition.venue?.address?.state || ''
    },
    
    // Broadcast
    network: competition.broadcasts?.[0]?.names?.[0] || 'TBD',
    
    // Links
    links: {
      espn: espnEvent.links?.[0]?.href || ''
    }
  };
}

// Get scoreboard for a specific sport
export async function getScoreboard(sport, dates = null) {
  const config = SPORTS_CONFIG[sport];
  if (!config) {
    throw new Error(`Unknown sport: ${sport}`);
  }
  
  const cacheKey = `scoreboard-${sport}-${dates || 'today'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached;
  }
  
  let url = `${ESPN_BASE_URL}/${config.path}/scoreboard`;
  if (dates) {
    url += `?dates=${dates}`;
  }
  
  console.log(`Fetching ESPN data: ${url}`);
  const data = await fetchESPN(url);
  
  // Transform events
  const games = data.events?.map(event => {
    if (sport === 'ufc') {
      return transformUFCEvent(event);
    }
    return transformGame(event, sport);
  }) || [];
  
  const result = {
    sport: config.name,
    sportKey: sport,
    league: data.leagues?.[0] || {},
    games,
    lastUpdated: new Date().toISOString()
  };
  
  cache.set(cacheKey, result);
  return result;
}

// Get today's games across all sports
export async function getTodaysGames() {
  const sports = Object.keys(SPORTS_CONFIG);
  const results = await Promise.allSettled(
    sports.map(sport => getScoreboard(sport))
  );
  
  const games = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      games.push(...result.value.games);
    } else {
      console.error(`Error fetching ${sports[index]}:`, result.reason);
    }
  });
  
  // Sort by date/time
  games.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  
  return games;
}

// Get games for a specific date range
export async function getGamesByDateRange(startDate, endDate) {
  // Format: YYYYMMDD or YYYYMMDD-YYYYMMDD
  const dateParam = endDate 
    ? `${formatDate(startDate)}-${formatDate(endDate)}`
    : formatDate(startDate);
  
  const sports = Object.keys(SPORTS_CONFIG);
  const results = await Promise.allSettled(
    sports.map(sport => getScoreboard(sport, dateParam))
  );
  
  const games = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      games.push(...result.value.games);
    } else {
      console.error(`Error fetching ${sports[index]}:`, result.reason);
    }
  });
  
  games.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  return games;
}

// Get teams for a specific sport
export async function getTeams(sport) {
  const config = SPORTS_CONFIG[sport];
  if (!config) {
    throw new Error(`Unknown sport: ${sport}`);
  }
  
  const cacheKey = `teams-${sport}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached;
  }
  
  const url = `${ESPN_BASE_URL}/${config.path}/teams`;
  console.log(`Fetching ESPN teams: ${url}`);
  
  const data = await fetchESPN(url);
  
  const teams = data.sports?.[0]?.leagues?.[0]?.teams?.map(teamWrapper => {
    const team = teamWrapper.team;
    return {
      id: team.id,
      name: team.displayName,
      shortName: team.shortDisplayName,
      abbreviation: team.abbreviation,
      logo: team.logos?.[0]?.href || team.logo,
      color: team.color,
      alternateColor: team.alternateColor,
      location: team.location,
      nickname: team.nickname,
      links: team.links || []
    };
  }) || [];
  
  cache.set(cacheKey, teams);
  return teams;
}

// Get specific team schedule
export async function getTeamSchedule(sport, teamId) {
  const config = SPORTS_CONFIG[sport];
  if (!config) {
    throw new Error(`Unknown sport: ${sport}`);
  }
  
  const cacheKey = `team-schedule-${sport}-${teamId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached;
  }
  
  const url = `${ESPN_BASE_URL}/${config.path}/teams/${teamId}/schedule`;
  console.log(`Fetching team schedule: ${url}`);
  
  const data = await fetchESPN(url);
  
  const games = data.events?.map(event => {
    if (sport === 'ufc') {
      return transformUFCEvent(event);
    }
    return transformGame(event, sport);
  }) || [];
  
  cache.set(cacheKey, games);
  return games;
}

// Helper: Format date as YYYYMMDD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Clear cache (useful for testing or manual refresh)
export function clearCache() {
  cache.clear();
  console.log('ESPN API cache cleared');
}

// Get all available sports
export function getSupportedSports() {
  return Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
    key,
    name: config.name,
    icon: config.icon
  }));
}

export default {
  getScoreboard,
  getTodaysGames,
  getGamesByDateRange,
  getTeams,
  getTeamSchedule,
  clearCache,
  getSupportedSports,
  SPORTS_CONFIG
};
