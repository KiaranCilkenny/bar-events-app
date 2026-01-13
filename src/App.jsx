import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MapPin, User, Bell, Star, Heart, Search, X } from 'lucide-react';

// ADD THIS LINE:
import espnAPI from './espn-api-service.js';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin, User, Bell, Star, Heart, Search, X } from 'lucide-react';

export default function BarEventsApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeFilter, setActiveFilter] = useState(null);
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [recentSearches] = useState(['Super Bowl', 'Trivia near me', 'Happy hour']);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBarView, setIsBarView] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedSportFromAZ, setSelectedSportFromAZ] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filters = [
    { id: 'nfl', icon: '🏈', label: 'NFL' },
    { id: 'nba', icon: '🏀', label: 'NBA' },
    { id: 'mlb', icon: '⚾', label: 'MLB' },
    { id: 'nhl', icon: '🏒', label: 'NHL' },
    { id: 'soccer', icon: '⚽', label: 'Soccer' },
    { id: 'college', icon: '🎓', label: 'College' }
  ];

  const eventTemplates = [
    { id: 'music', icon: '🎤', label: 'Live Music Night', description: 'Band, DJ, or live performance' },
    { id: 'trivia', icon: '🧠', label: 'Trivia Night', description: 'Quiz competition with prizes' },
    { id: 'happy', icon: '🍺', label: 'Happy Hour', description: 'Drink specials and deals' },
    { id: 'sports', icon: '📺', label: 'Sports Viewing', description: 'Watch games at your bar' },
    { id: 'special', icon: '🎉', label: 'Special Event', description: 'Parties, tastings, etc.' },
    { id: 'comedy', icon: '🎭', label: 'Comedy Night', description: 'Stand-up or open mic' }
  ];

  // Helper function to get team logo URLs from ESPN CDN
  const getTeamLogoUrl = (teamId) => {
    // Normalize team name - handle both "Knicks" and "New York Knicks"
    const normalized = teamId?.toLowerCase() || '';
    
    const logoMap = {
      // NFL - using both short and full names
      'giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
      'new york giants': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
      'jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
      'new york jets': 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
      'cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
      'dallas cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
      'eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
      'philadelphia eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
      'bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
      'buffalo bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
      
      // NBA
      'knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
      'new york knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
      'nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
      'brooklyn nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
      'lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      'los angeles lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      'heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      'miami heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      
      // MLB
      'yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
      'new york yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
      'mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
      'new york mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
      'red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
      'boston red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
      
      // NHL
      'rangers': 'https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png',
      'new york rangers': 'https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png',
      
      // Premier League
      'manchester united': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
      'manchester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
      'liverpool': 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
      'arsenal': 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      'chelsea': 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
      
      // NCAA Football
      'pittsburgh panthers': 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png',
      'alabama crimson tide': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
      'ohio state buckeyes': 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png'
    };
    
    return logoMap[normalized] || null;
  };

  // Helper function to get league/organization logos
  const getLeagueLogo = (leagueId) => {
    const leagueLogos = {
      // Major US Leagues
      'nfl': 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
      'nba': 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
      'mlb': 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
      'nhl': 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
      'mls': 'https://a.espncdn.com/i/teamlogos/leagues/500/mls.png',
      
      // NCAA
      'ncaa-football': 'https://a.espncdn.com/i/teamlogos/leagues/500/ncaa.png',
      'ncaa-basketball': 'https://a.espncdn.com/i/teamlogos/leagues/500/ncaa.png',
      
      // Soccer Leagues - using Wikipedia/Wikimedia
      'premier-league': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
      'champions-league': 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg',
      'la-liga': 'https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga_2023_Vertical_Logo.svg',
      'serie-a': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Serie_A_logo_2022.svg',
      'bundesliga': 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg'
    };
    
    return leagueLogos[leagueId?.toLowerCase()] || null;
  };

// NEW: State for ESPN data
const [sportsData, setSportsData] = useState({
  featured: [],
  sports: [
    { id: 'nfl', name: 'NFL', icon: '🏈', gamesCount: 0, gradient: 'from-green-600 to-blue-600' },
    { id: 'nba', name: 'NBA', icon: '🏀', gamesCount: 0, gradient: 'from-orange-500 to-red-600' },
    { id: 'nhl', name: 'NHL', icon: '🏒', gamesCount: 0, gradient: 'from-blue-500 to-cyan-600' },
    { id: 'mlb', name: 'MLB', icon: '⚾', gamesCount: 0, gradient: 'from-red-500 to-blue-600' },
    { id: 'soccer', name: 'Soccer', icon: '⚽', gamesCount: 0, gradient: 'from-green-500 to-blue-500' },
    { id: 'ufc', name: 'UFC/MMA', icon: '🥊', gamesCount: 0, gradient: 'from-red-600 to-black' },
  ],
  nfl: [],
  nba: [],
  myTeams: [
    { id: 'pitt', name: 'Pittsburgh Panthers', sport: 'NCAA Football', icon: '🏈', nextGame: 'Dec 10 vs Duke', fanBarsCount: 2 },
    { id: 'knicks', name: 'New York Knicks', sport: 'NBA', icon: '🏀', nextGame: 'Tonight vs Heat', fanBarsCount: 4 }
  ]
});

const [loadingGames, setLoadingGames] = useState(false);

// NEW: Load ESPN data on mount
useEffect(() => {
  async function loadESPNGames() {
    setLoadingGames(true);
    try {
      // Get today's games from ESPN
      const todaysGames = await espnAPI.getTodaysGames();
      
      console.log('ESPN Games:', todaysGames); // Let's see what we got!
      
      // Transform ESPN data to match our app format
      const transformedGames = todaysGames.slice(0, 3).map(game => ({
        id: game.id,
        title: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
        sport: game.sport,
        teams: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
        homeTeam: game.homeTeam.name,
        awayTeam: game.awayTeam.name,
        time: `${game.date} • ${game.time}`,
        network: game.network,
        image: game.sportKey === 'nfl' ? '🏈' : game.sportKey === 'nba' ? '🏀' : '⚽',
        gradient: game.sportKey === 'nfl' ? 'from-blue-700 to-red-600' : 'from-orange-500 to-red-600',
        barsCount: 15, // We'll calculate this later
        isLocal: false
      }));
      
      setSportsData(prev => ({
        ...prev,
        featured: transformedGames
      }));
      
    } catch (error) {
      console.error('Error loading ESPN games:', error);
      // Keep the hardcoded data as fallback
    } finally {
      setLoadingGames(false);
    }
  }
  
  loadESPNGames();
}, []);


  // This will be filtered dynamically based on selected game
  const allBarsData = [
    { id: 'b1', name: "Murphy's Bar", rating: 4.5, reviews: 120, distance: '0.3 mi', special: '🍺 $5 wings', isFanBar: true, teamAffiliation: 'Cowboys', image: '🏈', gradient: 'from-blue-500 to-gray-600', address: '123 Broadway, New York, NY 10012', description: 'Official Dallas Cowboys fan headquarters in NYC since 2015. Owner is Dallas native and lifelong Cowboys fan.', ownerStory: 'Owner Mike grew up in Dallas and moved to NYC in 2010. Missing his hometown team, he opened this bar to create a community for Cowboys fans.', gameDaySpecials: ['$4 Lone Star Beer during games', 'Wear Cowboys gear - get a free shot', '$20 wings & beer bucket combo', 'Free nachos at halftime when Cowboys lead'], photos: ['Interior with Cowboys memorabilia', 'Game day crowd', 'Signed jerseys on wall', 'Bar exterior'] },
    { id: 'b2', name: "Philly's Tavern", rating: 4.7, reviews: 98, distance: '0.5 mi', special: '🍺 Eagles specials', isFanBar: true, teamAffiliation: 'Eagles', image: '🦅', gradient: 'from-green-600 to-gray-700', address: '456 5th Ave, New York, NY 10018', description: 'The official Philadelphia Eagles bar in Manhattan. Eagles fans have been gathering here for over 20 years.', ownerStory: 'Family-owned by Philly natives since 2003. Three generations of Eagles fans.', gameDaySpecials: ['$3 Yuengling on tap all game', 'Wear Eagles jersey - free cheesesteak slider', '$25 beer bucket (6 beers)', 'Win a signed jersey - raffle every game'], photos: ['Eagles flags everywhere', 'Championship memorabilia', 'Packed game day', 'Owner with Eagles legends'] },
    { id: 'b3', name: "Jack's Sports Bar", rating: 4.3, reviews: 156, distance: '0.7 mi', special: '📺 20+ screens', isFanBar: false, image: '📺', gradient: 'from-gray-600 to-gray-800', address: '789 7th Ave, New York, NY 10019', description: 'Multi-sport bar showing all major games on 20+ HD screens.' },
    { id: 'b4', name: "The Sports Palace", rating: 4.6, reviews: 203, distance: '1.0 mi', special: '🍻 $3 drafts', isFanBar: false, image: '🏟️', gradient: 'from-orange-500 to-red-600', address: '321 W 50th St, New York, NY 10019', description: 'Large sports bar with great atmosphere for any game.' },
    { id: 'b5', name: "Game Day Grille", rating: 4.4, reviews: 87, distance: '1.2 mi', special: '🍔 Game day menu', isFanBar: false, image: '🍔', gradient: 'from-red-500 to-orange-600', address: '654 3rd Ave, New York, NY 10017', description: 'Casual sports bar with great food and drinks.' },
    { id: 'b6', name: "Pitt's Pub NYC", rating: 4.8, reviews: 145, distance: '0.3 mi', special: '🐾 Pitt alumni bar', isFanBar: true, teamAffiliation: 'Pittsburgh Panthers', image: '🐾', gradient: 'from-blue-600 to-yellow-500', address: '234 E 14th St, New York, NY 10003', description: 'Official Pittsburgh Panthers alumni bar. Home away from home for Pitt fans in NYC since 2012.', ownerStory: 'Owner Sarah graduated from Pitt in 2008. After moving to NYC, she wanted to create a space where Panthers could gather and cheer together.', gameDaySpecials: ['Wear Pitt gear - free beer token', '$5 Iron City Beer all game', 'Primanti Bros sandwich special - $12', '$30 beer bucket + wings combo', 'Raffle for Pitt merchandise every game'], photos: ['Pitt flags and banners', 'Championship photos', 'Alumni gatherings', 'Game day atmosphere'] },
    { id: 'b7', name: "Oakland Tavern", rating: 4.6, reviews: 89, distance: '1.1 mi', special: '🏈 All Pitt games', isFanBar: true, teamAffiliation: 'Pittsburgh Panthers', image: '🎓', gradient: 'from-navy-600 to-gold-500', address: '567 2nd Ave, New York, NY 10016', description: 'Pitt watch party headquarters. Named after Pittsburgh\'s Oakland neighborhood where the university is located.', ownerStory: 'Run by a group of Pitt alumni who wanted to recreate the Oakland experience in NYC.', gameDaySpecials: ['$4 Miller Lite during Pitt games', 'Show student ID - 20% off food', 'Wear Pitt cap/jersey - free appetizer', '$18 Primanti sandwich + draft beer', 'Free shot for the bar when Pitt scores'], photos: ['Oakland neighborhood tribute', 'Pitt gear collection', 'Watch party crowd', 'Primanti sandwich special'] },
    
    // NEW FAN BARS
    { id: 'b8', name: "Smithfield Hall", rating: 4.9, reviews: 287, distance: '0.4 mi', special: '⚽ United matchday', isFanBar: true, teamAffiliation: 'Manchester United', image: '⚽', gradient: 'from-red-600 to-black', address: '138 W 25th St, New York, NY 10001', description: 'The official Manchester United supporters club bar in NYC. Red Devils fans gather here for every match since 2005.', ownerStory: 'Owned by lifelong United supporter from Manchester. Moved to NYC in 2003 and created a home for the Red Army.', gameDaySpecials: ['Doors open 2 hours before kickoff', 'Full English breakfast for early matches', '$5 Boddingtons and Newcastle on tap', 'Wear United kit - free appetizer', 'Raffle for signed memorabilia every match'], photos: ['Red walls with United scarves', 'Match day atmosphere', 'Trophy replica display', 'Singing crowd'] },
    { id: 'b9', name: "Giants Den", rating: 4.7, reviews: 312, distance: '0.6 mi', special: '🏈 Big Blue HQ', isFanBar: true, teamAffiliation: 'Giants', image: '🔵', gradient: 'from-blue-700 to-red-600', address: '234 W 47th St, New York, NY 10036', description: 'Official NY Giants fan bar in Midtown. Three floors of Big Blue pride with 40+ screens.', ownerStory: 'Opened by former Giants season ticket holder. Every game feels like MetLife Stadium.', gameDaySpecials: ['$4 Bud Light during Giants games', 'Free shot when Giants score TD', 'Giants jersey - 15% off food', '$25 beer bucket for 4', 'Halftime raffle for tickets'], photos: ['Giants memorabilia wall', 'Game day packed house', 'Eli Manning signed jersey', 'Rooftop viewing area'] },
    { id: 'b10', name: "Gang Green Tavern", rating: 4.6, reviews: 198, distance: '0.8 mi', special: '✈️ J-E-T-S bar', isFanBar: true, teamAffiliation: 'Jets', image: '✈️', gradient: 'from-green-600 to-white', address: '789 3rd Ave, New York, NY 10017', description: 'The official NY Jets supporters bar. Jets fans unite here for every game, win or lose.', ownerStory: 'Die-hard Jets fan who never gave up. Been watching games here for 15 years.', gameDaySpecials: ['$3 Miller Lite all game', 'Wear Jets green - free wings', '$20 bucket of 5 beers', 'TD shot specials', 'Jets win = everyone drinks'], photos: ['Jets flags and banners', 'Loyal fanbase', 'Namath throwback decor', 'Game day energy'] },
    { id: 'b11', name: "Yankee Tavern", rating: 4.8, reviews: 445, distance: '0.2 mi', special: '⚾ Pinstripes pub', isFanBar: true, teamAffiliation: 'Yankees', image: '⚾', gradient: 'from-navy-700 to-gray-500', address: '72 E 161st St, Bronx, NY 10451', description: 'Right across from Yankee Stadium. The pregame and postgame destination for Yankees fans since 1923.', ownerStory: 'Family owned for four generations. Served Yankees fans through 27 championships.', gameDaySpecials: ['Show game ticket - free beer', '$5 Stella Artois on tap', '$15 burger & beer combo', 'Yankee home run = shots', '7th inning stretch specials'], photos: ['Historic photos on walls', 'View of stadium', 'Championship banners', 'Packed before games'] },
    { id: 'b12', name: "The Bronx Bomber", rating: 4.7, reviews: 289, distance: '0.3 mi', special: '⚾ Bombers HQ', isFanBar: true, teamAffiliation: 'Yankees', image: '💣', gradient: 'from-blue-800 to-white', address: '923 River Ave, Bronx, NY 10452', description: 'Yankees sports bar with memorabilia dating back to Ruth and Gehrig. A shrine to pinstripe glory.', ownerStory: 'Owner\'s grandfather caught a Babe Ruth home run. That ball is displayed behind the bar.', gameDaySpecials: ['$4 domestic drafts during games', 'Wear pinstripes - appetizer discount', '$18 wings & pitcher combo', 'Grand slam = free round', 'Postgame happy hour'], photos: ['Vintage Yankees photos', 'Babe Ruth artifacts', 'Championship rings display', 'Stadium view from patio'] },
    { id: 'b13', name: "Amazin' Bar & Grill", rating: 4.5, reviews: 176, distance: '1.8 mi', special: '⚾ Mets mania', isFanBar: true, teamAffiliation: 'Mets', image: '🔶', gradient: 'from-blue-600 to-orange-500', address: '126-10 Queens Blvd, Queens, NY 11375', description: 'Official Mets bar in Queens. Let\'s Go Mets chants echo here every game day.', ownerStory: 'Born and raised in Queens. Bleeds orange and blue since the \'86 championship.', gameDaySpecials: ['$3 Coors Light during Mets games', 'Mets gear - free appetizer', '$22 beer bucket special', 'Home run = shots for the bar', 'Win = half-price apps after'], photos: ['Mets jerseys on walls', 'Mr. Met cutout', '1986 memorabilia', 'Queens community vibe'] },
    { id: 'b14', name: "The Garden Pub", rating: 4.8, reviews: 334, distance: '0.5 mi', special: '🏀 Knicks kingdom', isFanBar: true, teamAffiliation: 'Knicks', image: '🗽', gradient: 'from-blue-600 to-orange-500', address: '867 8th Ave, New York, NY 10019', description: 'Official Knicks bar near MSG. Where the Garden faithful gather before and after every game.', ownerStory: 'Owner has courtside season tickets. Bar feels like an extension of Madison Square Garden.', gameDaySpecials: ['Show Knicks ticket - beer discount', '$5 Blue Moon all game', 'Knicks jersey - free shot', '$28 bucket & wings', 'Knicks win = celebration shots'], photos: ['MSG proximity', 'Knicks championship banners', 'Ewing era photos', 'Courtside atmosphere'] },
    { id: 'b15', name: "Barclays Bar", rating: 4.6, reviews: 203, distance: '1.4 mi', special: '🏀 Nets nest', isFanBar: true, teamAffiliation: 'Nets', image: '⚫', gradient: 'from-black to-gray-600', address: '789 Atlantic Ave, Brooklyn, NY 11238', description: 'Official Brooklyn Nets bar. Black and white pride since the team moved to Brooklyn.', ownerStory: 'Brooklyn native who fought to bring an NBA team to the borough. Lives the dream.', gameDaySpecials: ['$4 Brooklyn Lager all game', 'Nets gear - 20% off food', '$24 beer & wings combo', '3-pointer = shot specials', 'Student discount with ID'], photos: ['Brooklyn pride', 'Modern Nets decor', 'Barclays Center view', 'Local fanbase'] },
    { id: 'b16', name: "Blueshirt Tavern", rating: 4.7, reviews: 267, distance: '0.7 mi', special: '🏒 Rangers rally', isFanBar: true, teamAffiliation: 'Rangers', image: '🔵', gradient: 'from-blue-700 to-red-600', address: '456 Amsterdam Ave, New York, NY 10024', description: 'Official NY Rangers bar on the Upper West Side. Blueshirts fans since 1926.', ownerStory: 'Grandfather played for Rangers farm team. Hockey is in the family blood.', gameDaySpecials: ['$4 Labatt Blue during games', 'Rangers jersey - free appetizer', '$20 beer pitcher deal', 'Goal = shot special', 'Playoff overtime free wings'], photos: ['Rangers banners', 'Stanley Cup photos', 'Hockey stick signed', 'UWS local favorite'] },
    { id: 'b17', name: "Boston Pride", rating: 4.4, reviews: 156, distance: '0.9 mi', special: '⚾ Sox in NYC', isFanBar: true, teamAffiliation: 'Red Sox', image: '🔴', gradient: 'from-red-700 to-blue-800', address: '123 Avenue A, New York, NY 10009', description: 'Red Sox fans living in NYC gather here. Enemy territory but it feels like Fenway.', ownerStory: 'Boston expat who couldn\'t leave the Sox behind. Created a Boston enclave in Manhattan.', gameDaySpecials: ['$4 Sam Adams all game', 'Red Sox gear - free Fenway Frank', '$18 beer & pretzel combo', 'Sweet Caroline singalong', 'Sox win = Boston cream pie shots'], photos: ['Green Monster replica', 'Fenway seats at bar', '2004 memorabilia', 'Boston faithful'] },
    
    // ADDITIONAL NYC FAN BARS
    { id: 'b36', name: "Madison Square Tavern", rating: 4.8, reviews: 402, distance: '0.4 mi', special: '🏀 Knicks HQ #2', isFanBar: true, teamAffiliation: 'Knicks', image: '🗽', gradient: 'from-blue-600 to-orange-500', address: '234 W 33rd St, New York, NY 10001', description: 'Second official Knicks bar right across from MSG. Pregame madhouse on game nights.', ownerStory: 'Owner is a Knicks season ticket holder since the 90s. This is where real fans come.', gameDaySpecials: ['Show Knicks ticket - free appetizer', '$5 drafts all game', 'Knicks win - shots on the house', '$30 beer & wings bucket', 'Halftime raffle for signed gear'], photos: ['MSG view from window', 'Knicks shrine wall', 'Game night crowds', 'Championship photos'] },
    { id: 'b37', name: "Orange & Blue Pub", rating: 4.7, reviews: 298, distance: '1.3 mi', special: '🏀 Knicks UWS', isFanBar: true, teamAffiliation: 'Knicks', image: '🏀', gradient: 'from-orange-600 to-blue-700', address: '567 Columbus Ave, New York, NY 10024', description: 'Upper West Side Knicks bar. Where neighborhood fans gather for every game.', ownerStory: 'Family has been going to Knicks games for three generations. Bar is a love letter to the team.', gameDaySpecials: ['$4 Blue Moon all game', 'Orange or blue outfit - free shot', '$25 pizza & pitcher combo', 'Knicks 3-pointer = $1 shots', 'Student discount with ID'], photos: ['Orange and blue decor', 'UWS loyal crowd', 'Ewing jersey signed', 'Local favorite'] },
    { id: 'b38', name: "Big Blue Sports Bar", rating: 4.6, reviews: 334, distance: '2.8 mi', special: '🏈 Giants NJ', isFanBar: true, teamAffiliation: 'Giants', image: '🔵', gradient: 'from-blue-700 to-red-600', address: '234 Washington St, Hoboken, NJ 07030', description: 'Giants bar in Hoboken. Short PATH ride from Manhattan. Worth the trip on game day.', ownerStory: 'Hoboken native and lifelong Giants season ticket holder. Bar is packed every Sunday.', gameDaySpecials: ['$3 Bud Light during games', 'Giants TD - free round', 'Wear Giants jersey - 20% off', '$28 wings & beer special', 'Postgame party after wins'], photos: ['Giants flags outside', 'Packed Sunday crowds', 'Super Bowl trophies display', 'Hoboken location'] },
    { id: 'b39', name: "MetLife Tavern", rating: 4.5, reviews: 267, distance: '3.5 mi', special: '🏈 Near stadium', isFanBar: true, teamAffiliation: 'Giants', image: '🏟️', gradient: 'from-blue-800 to-gray-600', address: '789 Route 3, East Rutherford, NJ 07073', description: 'Right near MetLife Stadium. Perfect pregame and postgame spot for Giants fans.', ownerStory: 'Opened the year MetLife Stadium opened. Serves tailgaters and stadium-goers.', gameDaySpecials: ['Show game ticket - beer discount', '$4 domestic drafts', 'Shuttle to/from stadium', '$20 burger & fries & beer', 'Giants memorabilia raffle'], photos: ['Stadium view', 'Pregame crowds', 'Shuttle bus', 'Game day atmosphere'] },
    { id: 'b40', name: "The Stadium Club", rating: 4.7, reviews: 389, distance: '0.2 mi', special: '⚾ Yankees #3', isFanBar: true, teamAffiliation: 'Yankees', image: '⚾', gradient: 'from-navy-700 to-white', address: '456 E 161st St, Bronx, NY 10451', description: 'Third Yankees bar on the stadium strip. Premium location, premium Yankees experience.', ownerStory: 'Premium Yankees bar with upscale food and craft cocktails. Classy pinstripe vibes.', gameDaySpecials: ['$6 craft cocktails during games', 'Show ticket stub - free dessert', '$22 steak sandwich & beer', 'Home run happy hour', 'VIP rooftop viewing area'], photos: ['Upscale interior', 'Stadium proximity', 'Craft cocktail bar', 'Premium experience'] },
    { id: 'b41', name: "Green & White Bar", rating: 4.5, reviews: 278, distance: '2.4 mi', special: '✈️ Jets LIC', isFanBar: true, teamAffiliation: 'Jets', image: '✈️', gradient: 'from-green-700 to-white', address: '345 Jackson Ave, Long Island City, NY 11101', description: 'Jets bar in LIC serving Queens and Brooklyn fans. J-E-T-S chants echo here every Sunday.', ownerStory: 'Queens native and diehard Jets fan. Never gave up on the team, never will.', gameDaySpecials: ['$3 Miller Lite all game', 'Jets gear - free wings', '$18 beer bucket', 'TD celebration shots', 'Loyalty punch card program'], photos: ['Jets green everywhere', 'LIC location', 'Loyal fanbase', 'Game day energy'] },
    { id: 'b42', name: "Rangers Den", rating: 4.6, reviews: 312, distance: '0.6 mi', special: '🏒 Rangers Midtown', isFanBar: true, teamAffiliation: 'Rangers', image: '🔵', gradient: 'from-blue-700 to-red-600', address: '432 7th Ave, New York, NY 10018', description: 'Second Rangers bar in Midtown. Convenient to MSG and packed on game nights.', ownerStory: 'Rangers fan since childhood. Created a home away from home for Blueshirts faithful.', gameDaySpecials: ['$4 Labatt Blue during games', 'Rangers jersey - free appetizer', '$22 pitcher & nachos', 'Goal celebration shots', 'Playoff watch parties'], photos: ['Rangers memorabilia', 'Midtown location', 'MSG proximity', 'Blueshirts pride'] },
    { id: 'b43', name: "Brooklyn Nets Lounge", rating: 4.5, reviews: 245, distance: '1.2 mi', special: '🏀 Nets Downtown', isFanBar: true, teamAffiliation: 'Nets', image: '⚫', gradient: 'from-black to-white', address: '567 Flatbush Ave, Brooklyn, NY 11225', description: 'Second Nets bar in Brooklyn. Downtown location for Brooklyn basketball fans.', ownerStory: 'Brooklyn born and raised. Celebrated when the Nets moved to Brooklyn and opened this bar.', gameDaySpecials: ['$4 Brooklyn Lager all game', 'Nets gear - 15% off food', '$20 wings & beer combo', '3-pointer specials', 'Free arcade games'], photos: ['Brooklyn pride', 'Black and white theme', 'Downtown vibe', 'Nets faithful'] },
    { id: 'b44', name: "Amazin' Mets Tavern", rating: 4.6, reviews: 298, distance: '2.1 mi', special: '⚾ Mets Flushing', isFanBar: true, teamAffiliation: 'Mets', image: '🔶', gradient: 'from-blue-600 to-orange-600', address: '789 Roosevelt Ave, Flushing, NY 11368', description: 'Second Mets bar near Citi Field. Queens Mets fans unite here for every game.', ownerStory: 'Queens family business. Three generations of Mets fans running this bar.', gameDaySpecials: ['$3 Coors Light during games', 'Mets gear - free Mr. Met cookie', '$20 beer & hot dog combo', 'Home run shots', 'Postgame celebrations'], photos: ['Near Citi Field', 'Mets orange and blue', 'Queens community', 'Family atmosphere'] },
    { id: 'b45', name: "The Bronx Pinstripes", rating: 4.7, reviews: 356, distance: '0.4 mi', special: '⚾ Yankees Bronx', isFanBar: true, teamAffiliation: 'Yankees', image: '⚾', gradient: 'from-navy-800 to-gray-500', address: '234 Grand Concourse, Bronx, NY 10451', description: 'Fourth Yankees bar in the Bronx. Deep in Yankees territory with true Bronx atmosphere.', ownerStory: 'Bronx born, Bronx raised, Yankees forever. This is where real Bronx fans watch the game.', gameDaySpecials: ['$4 domestic drafts all game', 'Pinstripes outfit - free shot', '$16 sandwich & beer', 'Grand slam celebrations', 'Bronx pride specials'], photos: ['Bronx atmosphere', 'Yankees shrine', 'Local crowd', 'Pinstripe paradise'] },
    
    // NEW REGULAR BARS - MANHATTAN
    { id: 'b18', name: "The Midtown Mixer", rating: 4.5, reviews: 289, distance: '0.6 mi', special: '🍸 Craft cocktails', isFanBar: false, image: '🍸', gradient: 'from-purple-600 to-pink-500', address: '432 5th Ave, New York, NY 10018', description: 'Upscale cocktail lounge with creative drinks and sophisticated atmosphere. Perfect for after-work gatherings.' },
    { id: 'b19', name: "Times Square Tavern", rating: 4.2, reviews: 512, distance: '0.8 mi', special: '🎭 Theater district', isFanBar: false, image: '🎭', gradient: 'from-yellow-500 to-orange-600', address: '234 W 44th St, New York, NY 10036', description: 'Classic NYC pub in the heart of Times Square. Popular pre-theater spot with 15+ screens for sports.' },
    { id: 'b20', name: "The Village Piano Bar", rating: 4.8, reviews: 198, distance: '0.5 mi', special: '🎹 Live piano nightly', isFanBar: false, image: '🎹', gradient: 'from-indigo-600 to-purple-600', address: '67 W 3rd St, New York, NY 10012', description: 'Intimate piano bar where patrons request songs and sing along. West Village institution since 1967.' },
    { id: 'b21', name: "East Village Dive", rating: 4.3, reviews: 445, distance: '0.7 mi', special: '🍺 $2 PBR', isFanBar: false, image: '🍺', gradient: 'from-gray-700 to-black', address: '234 E 10th St, New York, NY 10009', description: 'No-frills dive bar with cheap drinks, pool table, and jukebox. Cash only. Real NYC character.' },
    { id: 'b22', name: "The LES Lounge", rating: 4.6, reviews: 223, distance: '0.8 mi', special: '🎵 DJ Thu-Sat', isFanBar: false, image: '🎵', gradient: 'from-pink-600 to-purple-700', address: '156 Ludlow St, New York, NY 10002', description: 'Trendy Lower East Side bar with resident DJs and creative cocktails. Late-night dance floor.' },
    { id: 'b23', name: "UES Sports Club", rating: 4.7, reviews: 312, distance: '1.2 mi', special: '📺 20 screens', isFanBar: false, image: '📺', gradient: 'from-blue-600 to-green-600', address: '1567 2nd Ave, New York, NY 10028', description: 'Upper East Side sports bar with extensive beer list and upscale pub fare. Popular with young professionals.' },
    { id: 'b24', name: "UWS Brew House", rating: 4.5, reviews: 267, distance: '1.4 mi', special: '🍺 24 craft taps', isFanBar: false, image: '🍺', gradient: 'from-amber-600 to-orange-700', address: '789 Amsterdam Ave, New York, NY 10025', description: 'Craft beer haven on Upper West Side. Rotating taps featuring local breweries and rare imports.' },
    { id: 'b25', name: "Harlem Nights", rating: 4.6, reviews: 189, distance: '1.6 mi', special: '🎷 Live jazz Wed-Sun', isFanBar: false, image: '🎷', gradient: 'from-purple-700 to-blue-800', address: '2247 Frederick Douglass Blvd, New York, NY 10027', description: 'Historic Harlem jazz club with live music and soul food. A cultural landmark.' },
    { id: 'b26', name: "Hell's Kitchen Pub", rating: 4.4, reviews: 298, distance: '0.7 mi', special: '🍔 Burger happy hour', isFanBar: false, image: '🍔', gradient: 'from-red-600 to-orange-600', address: '456 9th Ave, New York, NY 10018', description: 'Neighborhood favorite in Hell\'s Kitchen. Great burgers, friendly bartenders, and sports on TV.' },
    
    // NEW REGULAR BARS - BROOKLYN
    { id: 'b27', name: "Williamsburg Brewery", rating: 4.8, reviews: 534, distance: '1.5 mi', special: '🍺 House-brewed beer', isFanBar: false, image: '🍺', gradient: 'from-amber-500 to-brown-700', address: '123 N 5th St, Brooklyn, NY 11249', description: 'Trendy Williamsburg brewery with rooftop seating and house-made craft beers. Brooklyn hipster haven.' },
    { id: 'b28', name: "The Brooklyn Bowl", rating: 4.7, reviews: 687, distance: '1.6 mi', special: '🎳 Bowling & music', isFanBar: false, image: '🎳', gradient: 'from-blue-600 to-purple-600', address: '61 Wythe Ave, Brooklyn, NY 11249', description: 'Bowling alley, concert venue, and bar all in one. Live music with lanes and craft cocktails.' },
    { id: 'b29', name: "Park Slope Alehouse", rating: 4.6, reviews: 312, distance: '1.8 mi', special: '🍺 Local craft focus', isFanBar: false, image: '🍺', gradient: 'from-green-600 to-brown-700', address: '356 6th Ave, Brooklyn, NY 11215', description: 'Cozy Park Slope bar featuring Brooklyn and NYC craft beers. Neighborhood gathering spot.' },
    { id: 'b30', name: "DUMBO Social", rating: 4.5, reviews: 245, distance: '1.7 mi', special: '🌉 Bridge views', isFanBar: false, image: '🌉', gradient: 'from-blue-500 to-gray-600', address: '68 Water St, Brooklyn, NY 11201', description: 'Waterfront bar with stunning Manhattan Bridge views. Upscale cocktails and small plates.' },
    { id: 'b31', name: "Bushwick Billiards", rating: 4.4, reviews: 198, distance: '2.1 mi', special: '🎱 Pool tables', isFanBar: false, image: '🎱', gradient: 'from-green-700 to-black', address: '234 Knickerbocker Ave, Brooklyn, NY 11237', description: 'Dive bar with 6 pool tables, cheap drinks, and no pretension. Real Brooklyn vibe.' },
    { id: 'b32', name: "Brooklyn Heights Tavern", rating: 4.7, reviews: 289, distance: '1.6 mi', special: '🍷 Wine selection', isFanBar: false, image: '🍷', gradient: 'from-red-700 to-purple-800', address: '73 Clark St, Brooklyn, NY 11201', description: 'Upscale neighborhood tavern with extensive wine list and seasonal menu. Brooklyn Heights charm.' },
    
    // NEW REGULAR BARS - QUEENS & BRONX
    { id: 'b33', name: "Astoria Beer Garden", rating: 4.6, reviews: 423, distance: '2.3 mi', special: '🍺 Outdoor seating', isFanBar: false, image: '🍺', gradient: 'from-green-600 to-yellow-500', address: '29-19 24th Ave, Queens, NY 11102', description: 'Massive outdoor beer garden in Astoria. German-style hall with picnic tables and live music weekends.' },
    { id: 'b34', name: "LIC Tap Room", rating: 4.5, reviews: 267, distance: '2.5 mi', special: '🍺 40 taps', isFanBar: false, image: '🍺', gradient: 'from-blue-600 to-amber-600', address: '47-18 Vernon Blvd, Queens, NY 11101', description: 'Long Island City craft beer destination. 40 rotating taps and knowledgeable staff.' },
    { id: 'b35', name: "The Bronx Ale House", rating: 4.4, reviews: 178, distance: '3.2 mi', special: '🍺 Bronx brewing', isFanBar: false, image: '🍺', gradient: 'from-brown-600 to-orange-700', address: '216 W Kingsbridge Rd, Bronx, NY 10463', description: 'Bronx neighborhood bar supporting local breweries. Friendly crowd and sports on multiple screens.' }
  ];

  const teamDetailData = {
    'pittsburgh-panthers': {
      name: 'Pittsburgh Panthers',
      sport: 'NCAA Football',
      icon: '🐾',
      colors: ['#003594', '#FFB81C'],
      upcomingGames: [
        { id: 'g1', opponent: 'vs Duke', date: 'Dec 10', time: '3:30 PM EST', network: 'ESPN', barsCount: 5, fanBarsCount: 2 },
        { id: 'g2', opponent: 'vs Syracuse', date: 'Dec 17', time: '7:00 PM EST', network: 'ACC Network', barsCount: 8, fanBarsCount: 2 },
        { id: 'g3', opponent: '@ Virginia Tech', date: 'Jan 3', time: '12:00 PM EST', network: 'ESPN2', barsCount: 6, fanBarsCount: 2 }
      ],
      fanBars: ['b6', 'b7'],
      description: 'Pittsburgh Panthers football - ACC conference'
    },
    'dallas-cowboys': {
      name: 'Dallas Cowboys',
      sport: 'NFL',
      icon: '⭐',
      colors: ['#041E42', '#869397'],
      upcomingGames: [
        { id: 'g4', opponent: 'vs Eagles', date: 'Today', time: '1:00 PM EST', network: 'FOX', barsCount: 12, fanBarsCount: 1 },
        { id: 'g5', opponent: '@ Giants', date: 'Dec 11', time: '8:15 PM EST', network: 'NBC', barsCount: 15, fanBarsCount: 1 },
        { id: 'g6', opponent: 'vs 49ers', date: 'Dec 18', time: '4:25 PM EST', network: 'CBS', barsCount: 10, fanBarsCount: 1 }
      ],
      fanBars: ['b1'],
      description: 'Dallas Cowboys - NFC East'
    },
    'new-york-knicks': {
      name: 'New York Knicks',
      sport: 'NBA',
      icon: '🗽',
      colors: ['#006BB6', '#F58426'],
      upcomingGames: [
        { id: 'g7', opponent: 'vs Heat', date: 'Tonight', time: '7:30 PM EST', network: 'MSG', barsCount: 28, fanBarsCount: 3 },
        { id: 'g8', opponent: '@ Celtics', date: 'Dec 8', time: '7:00 PM EST', network: 'TNT', barsCount: 22, fanBarsCount: 3 },
        { id: 'g9', opponent: 'vs Lakers', date: 'Dec 12', time: '8:00 PM EST', network: 'ESPN', barsCount: 35, fanBarsCount: 3 }
      ],
      fanBars: ['b14', 'b36', 'b37'],
      description: 'New York Knicks - Eastern Conference'
    },
    'manchester-united': {
      name: 'Manchester United',
      sport: 'Premier League',
      icon: '⚽',
      colors: ['#DA291C', '#FFB81C'],
      upcomingGames: [
        { id: 'mu1', opponent: 'vs Manchester City', date: 'Dec 28', time: '11:30 AM EST', network: 'NBC', barsCount: 15, fanBarsCount: 1 },
        { id: 'mu2', opponent: '@ Liverpool', date: 'Jan 4', time: '10:00 AM EST', network: 'USA Network', barsCount: 12, fanBarsCount: 1 },
        { id: 'mu3', opponent: 'vs Arsenal', date: 'Jan 11', time: '12:30 PM EST', network: 'NBC', barsCount: 14, fanBarsCount: 1 }
      ],
      fanBars: ['b8'],
      description: 'Manchester United - Premier League'
    },
    'ny-giants': {
      name: 'New York Giants',
      sport: 'NFL',
      icon: '🔵',
      colors: ['#0B2265', '#A71930'],
      upcomingGames: [
        { id: 'nyg1', opponent: 'vs Cowboys', date: 'Today', time: '1:00 PM EST', network: 'FOX', barsCount: 25, fanBarsCount: 3 },
        { id: 'nyg2', opponent: '@ Eagles', date: 'Dec 29', time: '1:00 PM EST', network: 'FOX', barsCount: 22, fanBarsCount: 3 },
        { id: 'nyg3', opponent: 'vs Colts', date: 'Jan 5', time: '1:00 PM EST', network: 'CBS', barsCount: 18, fanBarsCount: 3 }
      ],
      fanBars: ['b9', 'b38', 'b39'],
      description: 'New York Giants - NFC East'
    },
    'ny-jets': {
      name: 'New York Jets',
      sport: 'NFL',
      icon: '✈️',
      colors: ['#125740', '#FFFFFF'],
      upcomingGames: [
        { id: 'nyj1', opponent: 'vs Bills', date: 'Tomorrow', time: '1:00 PM EST', network: 'CBS', barsCount: 20, fanBarsCount: 2 },
        { id: 'nyj2', opponent: '@ Patriots', date: 'Dec 29', time: '1:00 PM EST', network: 'CBS', barsCount: 18, fanBarsCount: 2 },
        { id: 'nyj3', opponent: 'vs Dolphins', date: 'Jan 5', time: '1:00 PM EST', network: 'CBS', barsCount: 19, fanBarsCount: 2 }
      ],
      fanBars: ['b10', 'b41'],
      description: 'New York Jets - AFC East'
    },
    'ny-yankees': {
      name: 'New York Yankees',
      sport: 'MLB',
      icon: '⚾',
      colors: ['#003087', '#FFFFFF'],
      upcomingGames: [
        { id: 'nyy1', opponent: 'Spring Training', date: 'Feb 22', time: '1:00 PM EST', network: 'YES', barsCount: 30, fanBarsCount: 4 },
        { id: 'nyy2', opponent: 'Opening Day', date: 'Mar 28', time: '1:00 PM EST', network: 'YES', barsCount: 45, fanBarsCount: 4 }
      ],
      fanBars: ['b11', 'b12', 'b40', 'b45'],
      description: 'New York Yankees - AL East'
    },
    'ny-mets': {
      name: 'New York Mets',
      sport: 'MLB',
      icon: '🔶',
      colors: ['#002D72', '#FF5910'],
      upcomingGames: [
        { id: 'nym1', opponent: 'Spring Training', date: 'Feb 23', time: '1:00 PM EST', network: 'SNY', barsCount: 25, fanBarsCount: 2 },
        { id: 'nym2', opponent: 'Opening Day', date: 'Mar 27', time: '7:00 PM EST', network: 'SNY', barsCount: 35, fanBarsCount: 2 }
      ],
      fanBars: ['b13', 'b44'],
      description: 'New York Mets - NL East'
    },
    'brooklyn-nets': {
      name: 'Brooklyn Nets',
      sport: 'NBA',
      icon: '⚫',
      colors: ['#000000', '#FFFFFF'],
      upcomingGames: [
        { id: 'bkn1', opponent: 'vs 76ers', date: 'Tomorrow', time: '7:30 PM EST', network: 'YES', barsCount: 18, fanBarsCount: 2 },
        { id: 'bkn2', opponent: '@ Bucks', date: 'Dec 28', time: '8:00 PM EST', network: 'YES', barsCount: 15, fanBarsCount: 2 },
        { id: 'bkn3', opponent: 'vs Raptors', date: 'Dec 31', time: '7:00 PM EST', network: 'YES', barsCount: 17, fanBarsCount: 2 }
      ],
      fanBars: ['b15', 'b43'],
      description: 'Brooklyn Nets - Eastern Conference'
    },
    'ny-rangers': {
      name: 'New York Rangers',
      sport: 'NHL',
      icon: '🔵',
      colors: ['#0038A8', '#CE1126'],
      upcomingGames: [
        { id: 'nyr1', opponent: 'vs Islanders', date: 'Tomorrow', time: '7:00 PM EST', network: 'MSG', barsCount: 22, fanBarsCount: 2 },
        { id: 'nyr2', opponent: '@ Devils', date: 'Dec 29', time: '7:30 PM EST', network: 'MSG', barsCount: 20, fanBarsCount: 2 },
        { id: 'nyr3', opponent: 'vs Bruins', date: 'Jan 2', time: '7:00 PM EST', network: 'MSG', barsCount: 24, fanBarsCount: 2 }
      ],
      fanBars: ['b16', 'b42'],
      description: 'New York Rangers - Metropolitan Division'
    },
    'boston-red-sox': {
      name: 'Boston Red Sox',
      sport: 'MLB',
      icon: '🔴',
      colors: ['#BD3039', '#0C2340'],
      upcomingGames: [
        { id: 'bos1', opponent: 'Spring Training', date: 'Feb 23', time: '1:00 PM EST', network: 'NESN', barsCount: 15, fanBarsCount: 1 },
        { id: 'bos2', opponent: 'Opening Day', date: 'Mar 28', time: '2:00 PM EST', network: 'NESN', barsCount: 25, fanBarsCount: 1 }
      ],
      fanBars: ['b17'],
      description: 'Boston Red Sox - AL East'
    }
  };

  const allEvents = {
    featured: [
      { id: 1, title: 'Super Bowl Watch Party', bar: "Murphy's Bar", rating: 4.5, reviews: 120, distance: '0.3 mi', special: '🍺 $5 wings during game', image: '🏈', gradient: 'from-orange-500 to-red-600', category: 'sports', time: 'Today • 6:30 PM', address: '123 Broadway, New York, NY 10012', description: 'Join us for the biggest game of the year! 10+ screens, full bar menu, and great atmosphere.', barDescription: 'Classic sports bar with 20+ TVs, full menu, and daily specials.' },
      { id: 2, title: 'UFC 300 PPV', bar: 'Jack\'s Sports Tavern', rating: 4.7, reviews: 85, distance: '0.7 mi', special: '📺 10+ screens', image: '🥊', gradient: 'from-red-500 to-pink-600', category: 'sports', time: 'Saturday • 10:00 PM', address: '456 5th Ave, New York, NY 10018', description: 'The ultimate UFC viewing experience with sound on every screen.', barDescription: 'Upscale sports tavern featuring craft cocktails and elevated pub fare.' },
      { id: 3, title: '80s Costume Party', bar: 'The Dive Bar', rating: 4.2, reviews: 95, distance: '1.1 mi', special: '🎉 Prizes for best costume', image: '🎊', gradient: 'from-purple-500 to-pink-500', category: 'events', time: 'Friday • 9:00 PM', address: '789 Avenue A, New York, NY 10009', description: 'Dress up in your best 80s attire for a chance to win prizes! DJ spinning all your favorite 80s hits.', barDescription: 'Neighborhood dive bar with a fun, unpretentious vibe and strong drinks.' }
    ],
    music: [
      { id: 6, title: 'Live Jazz Night', bar: 'Blue Note Bar', rating: 4.8, reviews: 200, distance: '0.5 mi', special: '🎵 No cover charge', image: '🎷', gradient: 'from-blue-500 to-indigo-600', category: 'music', time: 'Tonight • 9:00 PM - 1:00 AM', address: '131 W 3rd St, New York, NY 10012', description: 'Experience world-class jazz in an intimate setting. Tonight featuring the Marcus Johnson Quartet with special guest vocalist Sarah Chen.', barDescription: 'Legendary jazz club featuring live music every night since 1981. Intimate atmosphere with excellent acoustics.' },
      { id: 7, title: 'Acoustic Open Mic', bar: 'The Local Pub', rating: 4.3, reviews: 67, distance: '0.9 mi', special: '🎸 Sign up at 8 PM', image: '🎸', gradient: 'from-green-500 to-teal-600', category: 'music', time: 'Wednesday • 8:00 PM', address: '222 Thompson St, New York, NY 10012', description: 'Open mic night for acoustic performances. All skill levels welcome!', barDescription: 'Cozy neighborhood pub with a focus on local musicians and craft beer.' },
      { id: 8, title: 'Rock Band Night', bar: 'Rockers Tavern', rating: 4.6, reviews: 145, distance: '1.3 mi', special: '🤘 $3 domestic beers', image: '🎤', gradient: 'from-red-500 to-orange-600', category: 'music', time: 'Saturday • 10:00 PM', address: '555 Bleecker St, New York, NY 10014', description: 'Three local rock bands taking the stage. High energy show!', barDescription: 'Rock bar with live music 6 nights a week and an extensive whiskey selection.' },
      { id: 9, title: 'Blues Legends', bar: 'Delta Blues Bar', rating: 4.7, reviews: 156, distance: '0.6 mi', special: '🎺 Special guest tonight', image: '🎺', gradient: 'from-blue-600 to-purple-600', category: 'music', time: 'Thursday • 8:30 PM', address: '88 E 4th St, New York, NY 10003', description: 'Special guest appearance by blues legend Johnny "Smokestack" Williams.', barDescription: 'Authentic blues bar with Southern-inspired food and live music nightly.' },
      { id: 50, title: 'Sunday Jazz Brunch', bar: 'Blue Note Bar', rating: 4.9, reviews: 180, distance: '0.5 mi', special: '🥂 Bottomless mimosas', image: '☕', gradient: 'from-orange-500 to-pink-600', category: 'music', time: 'Sunday • 11:00 AM - 3:00 PM', address: '131 W 3rd St, New York, NY 10012', description: 'Start your Sunday with smooth jazz and delicious brunch. Live trio plays while you dine.', barDescription: 'Legendary jazz club featuring live music every night since 1981. Intimate atmosphere with excellent acoustics.' },
      { id: 51, title: 'Late Night Jam Session', bar: 'Blue Note Bar', rating: 4.7, reviews: 145, distance: '0.5 mi', special: '🎵 Open to musicians', image: '🎹', gradient: 'from-purple-500 to-blue-600', category: 'music', time: 'Friday • 11:30 PM', address: '131 W 3rd St, New York, NY 10012', description: 'After-hours jam session where local musicians come together for improvised performances.', barDescription: 'Legendary jazz club featuring live music every night since 1981. Intimate atmosphere with excellent acoustics.' },
      { id: 52, title: 'Piano Sing-Along Night', bar: 'The Village Piano Bar', rating: 4.9, reviews: 234, distance: '0.5 mi', special: '🎹 Request any song', image: '🎹', gradient: 'from-indigo-600 to-purple-700', category: 'music', time: 'Friday • 8:00 PM', address: '67 W 3rd St, New York, NY 10012', description: 'Request your favorite songs and sing along with the crowd. Billy Joel night this week!', barDescription: 'Intimate piano bar where patrons request songs and sing along. West Village institution since 1967.' },
      { id: 53, title: 'Harlem Jazz Experience', bar: 'Harlem Nights', rating: 4.8, reviews: 198, distance: '1.6 mi', special: '🎷 No cover Wed', image: '🎷', gradient: 'from-purple-700 to-blue-800', category: 'music', time: 'Wednesday • 9:00 PM', address: '2247 Frederick Douglass Blvd, New York, NY 10027', description: 'Authentic Harlem jazz with soul food menu. Experience history in the making.', barDescription: 'Historic Harlem jazz club with live music and soul food. A cultural landmark.' },
      { id: 54, title: 'Indie Rock Showcase', bar: 'Williamsburg Brewery', rating: 4.7, reviews: 312, distance: '1.5 mi', special: '🎸 3 local bands', image: '🎸', gradient: 'from-red-600 to-orange-700', category: 'music', time: 'Saturday • 9:00 PM', address: '123 N 5th St, Brooklyn, NY 11249', description: 'Three up-and-coming Brooklyn indie bands. Discover your new favorite artist.', barDescription: 'Trendy Williamsburg brewery with rooftop seating and house-made craft beers.' },
      { id: 55, title: 'DJ Night - House Music', bar: 'The LES Lounge', rating: 4.6, reviews: 187, distance: '0.8 mi', special: '🎵 No cover before 11', image: '🎵', gradient: 'from-pink-600 to-purple-700', category: 'music', time: 'Saturday • 10:00 PM', address: '156 Ludlow St, New York, NY 10002', description: 'Resident DJ spinning deep house and techno all night. Dance floor open until 4am.', barDescription: 'Trendy Lower East Side bar with resident DJs and creative cocktails. Late-night dance floor.' },
      { id: 56, title: 'Classic Rock Covers', bar: "Hell's Kitchen Pub", rating: 4.5, reviews: 167, distance: '0.7 mi', special: '🎸 $4 beers', image: '🎤', gradient: 'from-blue-600 to-purple-700', category: 'music', time: 'Friday • 9:30 PM', address: '456 9th Ave, New York, NY 10018', description: 'Local band covering Led Zeppelin, Pink Floyd, and classic rock hits.', barDescription: 'Neighborhood favorite in Hell\'s Kitchen. Great burgers, friendly bartenders, and sports on TV.' },
      { id: 57, title: 'Latin Night - Salsa & Bachata', bar: 'Times Square Tavern', rating: 4.4, reviews: 289, distance: '0.8 mi', special: '💃 Free dance lessons 8pm', image: '🎺', gradient: 'from-orange-600 to-red-700', category: 'music', time: 'Thursday • 8:00 PM', address: '234 W 44th St, New York, NY 10036', description: 'Live salsa band with free dance lessons before the show. All levels welcome!', barDescription: 'Classic NYC pub in the heart of Times Square. Popular pre-theater spot with 15+ screens for sports.' }
    ],
    trivia: [
      { id: 14, title: '90s Pop Culture Trivia', bar: 'Trivia Central', rating: 4.7, reviews: 180, distance: '0.4 mi', special: '🏆 $100 bar tab prize', image: '📺', gradient: 'from-purple-500 to-blue-600', category: 'trivia', time: 'Tuesday • 7:30 PM', address: '321 2nd Ave, New York, NY 10003', description: 'Test your knowledge of 90s TV, movies, music, and more! Teams of up to 6 players.', barDescription: 'Trivia headquarters with weekly themed nights and great prizes.' },
      { id: 15, title: 'General Knowledge Night', bar: 'The Think Tank', rating: 4.4, reviews: 92, distance: '0.8 mi', special: '🧠 Teams of 4-6', image: '💡', gradient: 'from-yellow-500 to-orange-600', category: 'trivia', time: 'Wednesday • 8:00 PM', address: '444 Park Ave S, New York, NY 10016', description: 'Classic trivia covering history, science, sports, and current events.', barDescription: 'Craft beer bar with a smart, competitive trivia crowd.' },
      { id: 16, title: 'Sports Trivia', bar: 'All-Star Bar', rating: 4.5, reviews: 110, distance: '1.0 mi', special: '⚾ Free wings for winners', image: '🏀', gradient: 'from-blue-500 to-green-600', category: 'trivia', time: 'Monday • 7:00 PM', address: '777 Lexington Ave, New York, NY 10065', description: 'All sports, all eras. From baseball to basketball to hockey and more.', barDescription: 'Sports-themed bar with memorabilia covering every wall.' },
      { id: 58, title: 'Harry Potter Trivia', bar: 'The Midtown Mixer', rating: 4.8, reviews: 245, distance: '0.6 mi', special: '⚡ Butterbeer specials', image: '📖', gradient: 'from-purple-600 to-blue-700', category: 'trivia', time: 'Thursday • 7:30 PM', address: '432 5th Ave, New York, NY 10018', description: 'Wizarding World trivia! Dress in house colors for bonus points. Prizes for top teams.', barDescription: 'Upscale cocktail lounge with creative drinks and sophisticated atmosphere.' },
      { id: 59, title: 'Music Trivia Night', bar: 'UES Sports Club', rating: 4.6, reviews: 178, distance: '1.2 mi', special: '🎵 Name that tune', image: '🎤', gradient: 'from-pink-600 to-purple-700', category: 'trivia', time: 'Wednesday • 8:00 PM', address: '1567 2nd Ave, New York, NY 10028', description: 'Classic rock, pop, hip-hop, and everything in between. Audio rounds included!', barDescription: 'Upper East Side sports bar with extensive beer list and upscale pub fare.' },
      { id: 60, title: 'Movie & TV Trivia', bar: 'Brooklyn Heights Tavern', rating: 4.7, reviews: 198, distance: '1.6 mi', special: '🎬 $50 gift card prize', image: '📺', gradient: 'from-blue-600 to-purple-700', category: 'trivia', time: 'Tuesday • 7:30 PM', address: '73 Clark St, Brooklyn, NY 11201', description: 'From classic films to current streaming hits. Cinephiles unite!', barDescription: 'Upscale neighborhood tavern with extensive wine list and seasonal menu.' },
      { id: 61, title: 'NYC History Trivia', bar: 'East Village Dive', rating: 4.4, reviews: 156, distance: '0.7 mi', special: '🗽 $2 PBR all night', image: '🏙️', gradient: 'from-gray-700 to-blue-800', category: 'trivia', time: 'Monday • 8:00 PM', address: '234 E 10th St, New York, NY 10009', description: 'How well do you know the five boroughs? From Dutch settlers to modern day.', barDescription: 'No-frills dive bar with cheap drinks, pool table, and jukebox. Cash only.' },
      { id: 62, title: 'Pub Quiz - British Style', bar: 'Smithfield Hall', rating: 4.8, reviews: 267, distance: '0.4 mi', special: '🍺 British prizes', image: '🇬🇧', gradient: 'from-red-600 to-blue-700', category: 'trivia', time: 'Wednesday • 8:00 PM', address: '138 W 25th St, New York, NY 10001', description: 'Authentic British pub quiz with rounds on UK culture, football, and general knowledge.', barDescription: 'The official Manchester United supporters club bar in NYC.' },
      { id: 63, title: 'Disney Trivia Night', bar: 'Park Slope Alehouse', rating: 4.7, reviews: 234, distance: '1.8 mi', special: '🏰 Themed cocktails', image: '🐭', gradient: 'from-purple-600 to-pink-700', category: 'trivia', time: 'Thursday • 7:30 PM', address: '356 6th Ave, Brooklyn, NY 11215', description: 'From classic animations to Marvel and Star Wars. Family-friendly early session!', barDescription: 'Cozy Park Slope bar featuring Brooklyn and NYC craft beers.' },
      { id: 64, title: 'Science & Nature Trivia', bar: 'UWS Brew House', rating: 4.5, reviews: 145, distance: '1.4 mi', special: '🔬 Nerd night', image: '🧪', gradient: 'from-green-600 to-blue-700', category: 'trivia', time: 'Tuesday • 8:00 PM', address: '789 Amsterdam Ave, New York, NY 10025', description: 'Physics, biology, astronomy, and more. Bring your thinking cap!', barDescription: 'Craft beer haven on Upper West Side. Rotating taps featuring local breweries.' },
      { id: 65, title: 'Food & Drink Trivia', bar: 'DUMBO Social', rating: 4.6, reviews: 189, distance: '1.7 mi', special: '🍷 Wine pairings', image: '🍽️', gradient: 'from-orange-600 to-red-700', category: 'trivia', time: 'Wednesday • 7:30 PM', address: '68 Water St, Brooklyn, NY 11201', description: 'Culinary trivia covering cuisines, cocktails, and food history. Tastings included!', barDescription: 'Waterfront bar with stunning Manhattan Bridge views. Upscale cocktails and small plates.' },
      { id: 66, title: 'Meme & Internet Trivia', bar: 'Williamsburg Brewery', rating: 4.7, reviews: 298, distance: '1.5 mi', special: '📱 Gen Z vs Millennials', image: '💻', gradient: 'from-pink-600 to-purple-700', category: 'trivia', time: 'Friday • 8:00 PM', address: '123 N 5th St, Brooklyn, NY 11249', description: 'Viral videos, memes, and internet culture. Which generation knows the web better?', barDescription: 'Trendy Williamsburg brewery with rooftop seating and house-made craft beers.' }
    ],
    happy: [
      { id: 21, title: '2-for-1 Craft Beers', bar: 'Hop House', rating: 4.6, reviews: 156, distance: '0.6 mi', special: '🍺 4-7 PM daily', image: '🍻', gradient: 'from-amber-500 to-orange-600', category: 'happy', time: 'Daily • 4:00 PM - 7:00 PM', address: '999 Amsterdam Ave, New York, NY 10025', description: 'Two-for-one on all draft craft beers during happy hour.', barDescription: 'Craft beer haven with 24 rotating taps and knowledgeable staff.' },
      { id: 22, title: 'Half-Price Cocktails', bar: 'Mixology Lounge', rating: 4.8, reviews: 210, distance: '0.3 mi', special: '🍸 5-8 PM', image: '🍹', gradient: 'from-pink-500 to-purple-600', category: 'happy', time: 'Mon-Fri • 5:00 PM - 8:00 PM', address: '111 Madison Ave, New York, NY 10016', description: 'All classic and signature cocktails half price during extended happy hour.', barDescription: 'Upscale cocktail lounge with craft cocktails and elegant ambiance.' },
      { id: 23, title: '$5 Wine Wednesdays', bar: 'Vino Bar', rating: 4.4, reviews: 88, distance: '1.2 mi', special: '🍷 All wines $5', image: '🍷', gradient: 'from-red-500 to-purple-600', category: 'happy', time: 'Wednesday • All Day', address: '222 E 14th St, New York, NY 10003', description: 'Every wine by the glass just $5 all day Wednesday.', barDescription: 'Wine bar featuring an extensive international wine list and small plates.' },
      { id: 67, title: 'Reverse Happy Hour', bar: 'The LES Lounge', rating: 4.7, reviews: 267, distance: '0.8 mi', special: '🌙 10pm-midnight', image: '🍸', gradient: 'from-purple-600 to-pink-700', category: 'happy', time: 'Thu-Sat • 10:00 PM - 12:00 AM', address: '156 Ludlow St, New York, NY 10002', description: 'Late-night happy hour! Half-price cocktails and apps from 10pm-midnight.', barDescription: 'Trendy Lower East Side bar with resident DJs and creative cocktails.' },
      { id: 68, title: 'Sunday Funday', bar: 'Williamsburg Brewery', rating: 4.8, reviews: 412, distance: '1.5 mi', special: '☀️ All day deals', image: '🍺', gradient: 'from-amber-500 to-orange-700', category: 'happy', time: 'Sunday • 12:00 PM - 10:00 PM', address: '123 N 5th St, Brooklyn, NY 11249', description: '$1 off all beers and half-price apps all day Sunday. Brunch until 4pm!', barDescription: 'Trendy Williamsburg brewery with rooftop seating and house-made craft beers.' },
      { id: 69, title: 'Weekday Wine Down', bar: 'Brooklyn Heights Tavern', rating: 4.6, reviews: 198, distance: '1.6 mi', special: '🍷 $6 wine', image: '🍷', gradient: 'from-red-700 to-purple-800', category: 'happy', time: 'Mon-Thu • 5:00 PM - 7:00 PM', address: '73 Clark St, Brooklyn, NY 11201', description: 'All wines by the glass $6, plus half-price cheese boards during happy hour.', barDescription: 'Upscale neighborhood tavern with extensive wine list and seasonal menu.' },
      { id: 70, title: 'Industry Night', bar: 'The Midtown Mixer', rating: 4.7, reviews: 289, distance: '0.6 mi', special: '👨‍🍳 Service workers', image: '🍸', gradient: 'from-blue-600 to-purple-700', category: 'happy', time: 'Monday • 11:00 PM - 2:00 AM', address: '432 5th Ave, New York, NY 10018', description: 'Show your service industry ID for 50% off drinks. For those who serve others.', barDescription: 'Upscale cocktail lounge with creative drinks and sophisticated atmosphere.' },
      { id: 71, title: 'Taco Tuesday', bar: "Hell's Kitchen Pub", rating: 4.5, reviews: 312, distance: '0.7 mi', special: '🌮 $2 tacos', image: '🌮', gradient: 'from-orange-600 to-red-700', category: 'happy', time: 'Tuesday • 5:00 PM - 10:00 PM', address: '456 9th Ave, New York, NY 10018', description: '$2 tacos all night! Margaritas $6. Live mariachi band at 8pm.', barDescription: 'Neighborhood favorite in Hell\'s Kitchen. Great burgers, friendly bartenders.' },
      { id: 72, title: 'Beer Garden Happy Hour', bar: 'Astoria Beer Garden', rating: 4.8, reviews: 456, distance: '2.3 mi', special: '🍺 Outdoor deals', image: '🍺', gradient: 'from-green-600 to-yellow-600', category: 'happy', time: 'Daily • 4:00 PM - 7:00 PM', address: '29-19 24th Ave, Queens, NY 11102', description: 'Outdoor happy hour with $4 German beers and pretzel specials.', barDescription: 'Massive outdoor beer garden in Astoria. German-style hall with picnic tables.' },
      { id: 73, title: 'Brunch Happy Hour', bar: 'DUMBO Social', rating: 4.6, reviews: 234, distance: '1.7 mi', special: '🥂 Bottomless brunch', image: '🥂', gradient: 'from-orange-500 to-pink-600', category: 'happy', time: 'Sat-Sun • 11:00 AM - 3:00 PM', address: '68 Water St, Brooklyn, NY 11201', description: 'Bottomless mimosas and bellinis with any brunch entree. Bridge views included!', barDescription: 'Waterfront bar with stunning Manhattan Bridge views.' }
    ],
    sports: [
      { id: 28, title: 'Monday Night Football', bar: 'Gridiron Bar', rating: 4.6, reviews: 178, distance: '0.5 mi', special: '🏈 Wing specials', image: '🏈', gradient: 'from-green-600 to-blue-600', category: 'sports', time: 'Monday • 8:00 PM', address: '333 W 42nd St, New York, NY 10036', description: 'Watch MNF on our massive screens with game-day specials.', barDescription: 'Football-focused sports bar with game-day atmosphere every Monday.' },
      { id: 29, title: 'NBA Games All Day', bar: 'Hoops Central', rating: 4.7, reviews: 156, distance: '0.7 mi', special: '🏀 20+ screens', image: '🏀', gradient: 'from-orange-500 to-red-600', category: 'sports', time: 'Today • 1:00 PM onwards', address: '888 8th Ave, New York, NY 10019', description: 'All NBA games all day long on 20+ HD screens.', barDescription: 'Basketball fans paradise with multiple games shown simultaneously.' },
      { id: 74, title: 'Giants vs Cowboys', bar: 'Giants Den', rating: 4.9, reviews: 445, distance: '0.6 mi', special: '🏈 Game day specials', image: '🏈', gradient: 'from-blue-700 to-red-600', category: 'sports', time: 'Today • 1:00 PM', address: '234 W 47th St, New York, NY 10036', description: 'Big Blue takes on Dallas! Three floors, 40+ screens, game day atmosphere.', barDescription: 'Official NY Giants fan bar in Midtown.' },
      { id: 75, title: 'Jets Game Watch Party', bar: 'Gang Green Tavern', rating: 4.7, reviews: 312, distance: '0.8 mi', special: '✈️ J-E-T-S JETS', image: '✈️', gradient: 'from-green-600 to-white', category: 'sports', time: 'Tomorrow • 1:00 PM', address: '789 3rd Ave, New York, NY 10017', description: 'Jets vs Bills! Free shot for every TD. Gang Green faithful unite!', barDescription: 'The official NY Jets supporters bar.' },
      { id: 76, title: 'Knicks at MSG', bar: 'The Garden Pub', rating: 4.8, reviews: 398, distance: '0.5 mi', special: '🏀 Knicks HQ', image: '🗽', gradient: 'from-blue-600 to-orange-500', category: 'sports', time: 'Tonight • 7:30 PM', address: '867 8th Ave, New York, NY 10019', description: 'Pre-game at the official Knicks bar! Walking distance to MSG.', barDescription: 'Official Knicks bar near Madison Square Garden.' },
      { id: 77, title: 'Rangers Hockey Night', bar: 'Blueshirt Tavern', rating: 4.7, reviews: 289, distance: '0.7 mi', special: '🏒 LGR!', image: '🔵', gradient: 'from-blue-700 to-red-600', category: 'sports', time: 'Tomorrow • 7:00 PM', address: '456 Amsterdam Ave, New York, NY 10024', description: 'Rangers vs Islanders rivalry game! Blueshirts bar gets loud.', barDescription: 'Official NY Rangers bar on the Upper West Side.' },
      { id: 78, title: 'Premier League Morning', bar: 'Smithfield Hall', rating: 4.9, reviews: 356, distance: '0.4 mi', special: '⚽ Early kickoff', image: '⚽', gradient: 'from-red-600 to-black', category: 'sports', time: 'Saturday • 7:30 AM', address: '138 W 25th St, New York, NY 10001', description: 'Man United derby! Doors open at 7am. Full English breakfast available.', barDescription: 'Official Manchester United supporters club bar.' },
      { id: 79, title: 'College Football Saturday', bar: "Pitt's Pub NYC", rating: 4.8, reviews: 267, distance: '0.3 mi', special: '🏈 All Pitt games', image: '🐾', gradient: 'from-blue-600 to-yellow-500', category: 'sports', time: 'Saturday • 12:00 PM', address: '234 E 14th St, New York, NY 10003', description: 'Pitt Panthers football! Alumni central with game day specials.', barDescription: 'Official Pittsburgh Panthers alumni bar.' },
      { id: 80, title: 'Sunday NFL Package', bar: 'UES Sports Club', rating: 4.7, reviews: 423, distance: '1.2 mi', special: '🏈 All games', image: '📺', gradient: 'from-green-600 to-blue-600', category: 'sports', time: 'Sunday • 1:00 PM', address: '1567 2nd Ave, New York, NY 10028', description: 'Every NFL game on 20 screens. Red Zone channel with sound!', barDescription: 'Upper East Side sports bar with extensive beer list.' },
      { id: 81, title: 'UFC Fight Night', bar: "Jack's Sports Bar", rating: 4.6, reviews: 298, distance: '0.7 mi', special: '🥊 Main card', image: '🥊', gradient: 'from-red-500 to-black', category: 'sports', time: 'Saturday • 10:00 PM', address: '789 7th Ave, New York, NY 10019', description: 'UFC Fight Night with sound on all screens. $5 Jaeger shots for knockouts!', barDescription: 'Multi-sport bar showing all major games on 20+ HD screens.' },
      { id: 82, title: 'Boxing Championship', bar: 'The Sports Palace', rating: 4.8, reviews: 367, distance: '1.0 mi', special: '🥊 Title fight', image: '🥊', gradient: 'from-gold-500 to-red-600', category: 'sports', time: 'Saturday • 11:00 PM', address: '321 W 50th St, New York, NY 10019', description: 'Heavyweight championship! Big screens, big crowd, big fight.', barDescription: 'Large sports bar with great atmosphere for any game.' },
      { id: 83, title: 'Champions League', bar: 'Astoria Beer Garden', rating: 4.7, reviews: 389, distance: '2.3 mi', special: '⚽ European soccer', image: '⚽', gradient: 'from-blue-600 to-green-600', category: 'sports', time: 'Wednesday • 3:00 PM', address: '29-19 24th Ave, Queens, NY 11102', description: 'Champions League knockout rounds! Outdoor screens weather permitting.', barDescription: 'Massive outdoor beer garden in Astoria.' },
      { id: 84, title: 'Yankees Spring Training', bar: 'Yankee Tavern', rating: 4.8, reviews: 512, distance: '0.2 mi', special: '⚾ Baseball is back', image: '⚾', gradient: 'from-navy-700 to-gray-500', category: 'sports', time: 'Feb 22 • 1:00 PM', address: '72 E 161st St, Bronx, NY 10451', description: 'Spring training opener! Yankees faithful getting ready for the season.', barDescription: 'Right across from Yankee Stadium. The pregame destination.' }
    ],
    events: [
      { id: 33, title: 'Whiskey Tasting', bar: 'The Barrel Room', rating: 4.9, reviews: 75, distance: '0.7 mi', special: '🥃 Rare releases', image: '🥃', gradient: 'from-amber-600 to-orange-700', category: 'events', time: 'Thursday • 7:00 PM', address: '555 Hudson St, New York, NY 10014', description: 'Guided tasting of 5 premium whiskeys including rare Japanese releases. Limited to 20 guests.', barDescription: 'Whiskey bar with 200+ bottles and intimate tasting room.' },
      { id: 34, title: 'Brewery Takeover', bar: 'Craft Corner', rating: 4.7, reviews: 95, distance: '1.1 mi', special: '🍺 Limited releases', image: '🍺', gradient: 'from-green-500 to-blue-600', category: 'events', time: 'Friday • 6:00 PM', address: '123 Spring St, New York, NY 10012', description: 'Brooklyn Brewery taking over all our taps with limited releases and rarities.', barDescription: 'Craft beer bar specializing in local breweries and hard-to-find beers.' },
      { id: 85, title: 'Wine & Paint Night', bar: 'Brooklyn Heights Tavern', rating: 4.6, reviews: 198, distance: '1.6 mi', special: '🎨 All materials included', image: '🎨', gradient: 'from-purple-600 to-pink-700', category: 'events', time: 'Thursday • 7:00 PM', address: '73 Clark St, Brooklyn, NY 11201', description: 'Sip wine while painting! Instructor guides you step-by-step. All skill levels welcome.', barDescription: 'Upscale neighborhood tavern with extensive wine list.' },
      { id: 86, title: 'Karaoke Night', bar: 'Times Square Tavern', rating: 4.5, reviews: 456, distance: '0.8 mi', special: '🎤 Private rooms available', image: '🎤', gradient: 'from-pink-600 to-purple-700', category: 'events', time: 'Friday • 9:00 PM', address: '234 W 44th St, New York, NY 10036', description: 'Belt out your favorites! Private karaoke rooms or join the main stage. Drink specials all night.', barDescription: 'Classic NYC pub in the heart of Times Square.' },
      { id: 87, title: 'Board Game Night', bar: 'Park Slope Alehouse', rating: 4.7, reviews: 234, distance: '1.8 mi', special: '🎲 50+ games', image: '🎲', gradient: 'from-green-600 to-blue-700', category: 'events', time: 'Tuesday • 7:00 PM', address: '356 6th Ave, Brooklyn, NY 11215', description: 'Over 50 board games to choose from. Meet new people or bring your crew!', barDescription: 'Cozy Park Slope bar featuring Brooklyn craft beers.' },
      { id: 88, title: 'Speed Dating', bar: 'The Midtown Mixer', rating: 4.5, reviews: 187, distance: '0.6 mi', special: '💕 Ages 25-35', image: '❤️', gradient: 'from-red-600 to-pink-700', category: 'events', time: 'Thursday • 7:30 PM', address: '432 5th Ave, New York, NY 10018', description: 'Meet 12-15 singles in one night! Professional hosting, drink specials, no awkwardness.', barDescription: 'Upscale cocktail lounge with sophisticated atmosphere.' },
      { id: 89, title: 'Craft Beer Festival', bar: 'Williamsburg Brewery', rating: 4.9, reviews: 567, distance: '1.5 mi', special: '🍺 30+ breweries', image: '🍺', gradient: 'from-amber-500 to-brown-700', category: 'events', time: 'Saturday • 2:00 PM', address: '123 N 5th St, Brooklyn, NY 11249', description: 'Annual beer festival with 30+ NYC breweries. Unlimited tastings, food trucks, live music!', barDescription: 'Trendy Williamsburg brewery with rooftop seating.' },
      { id: 90, title: 'Tequila Tasting', bar: 'DUMBO Social', rating: 4.7, reviews: 156, distance: '1.7 mi', special: '🥃 Premium agave', image: '🌮', gradient: 'from-orange-600 to-yellow-700', category: 'events', time: 'Wednesday • 8:00 PM', address: '68 Water St, Brooklyn, NY 11201', description: 'Sample 6 premium tequilas with expert sommelier. Tacos included!', barDescription: 'Waterfront bar with stunning Manhattan Bridge views.' },
      { id: 91, title: 'NYE Countdown Party', bar: 'The Brooklyn Bowl', rating: 4.9, reviews: 789, distance: '1.6 mi', special: '🎉 Live band', image: '🎊', gradient: 'from-gold-500 to-purple-700', category: 'events', time: 'Dec 31 • 9:00 PM', address: '61 Wythe Ave, Brooklyn, NY 11249', description: 'New Years Eve bash! Live band, bowling, open bar package, champagne toast at midnight.', barDescription: 'Bowling alley, concert venue, and bar all in one.' },
      { id: 92, title: 'Poker Tournament', bar: 'East Village Dive', rating: 4.4, reviews: 234, distance: '0.7 mi', special: '♠️ $500 prize pool', image: '🃏', gradient: 'from-black to-red-700', category: 'events', time: 'Saturday • 7:00 PM', address: '234 E 10th St, New York, NY 10009', description: 'Texas Hold\'em tournament! $40 buy-in, rebuys allowed. Winner takes all.', barDescription: 'No-frills dive bar with pool table and jukebox. Cash only.' }
    ],
    comedy: [
      { id: 39, title: 'Stand-Up Comedy Night', bar: 'Laugh Factory', rating: 4.8, reviews: 198, distance: '0.6 mi', special: '😂 5 comedians', image: '🎤', gradient: 'from-yellow-500 to-orange-600', category: 'comedy', time: 'Friday • 8:00 PM', address: '369 W 46th St, New York, NY 10036', description: 'Five up-and-coming comedians plus a surprise headliner. Full bar and food menu available.', barDescription: 'Comedy club and bar featuring stand-up shows 5 nights a week.' },
      { id: 40, title: 'Open Mic Comedy', bar: 'The Chuckle Hut', rating: 4.5, reviews: 124, distance: '0.9 mi', special: '🎭 Sign up at 7', image: '🎭', gradient: 'from-purple-500 to-pink-600', category: 'comedy', time: 'Wednesday • 7:30 PM', address: '777 9th Ave, New York, NY 10019', description: 'Open mic for comedians of all levels. Supportive crowd and full bar.', barDescription: 'Intimate comedy venue with a welcoming atmosphere for new talent.' },
      { id: 93, title: 'Comedy Roast Battle', bar: 'The LES Lounge', rating: 4.7, reviews: 298, distance: '0.8 mi', special: '🔥 Brutal & hilarious', image: '🎤', gradient: 'from-red-600 to-orange-700', category: 'comedy', time: 'Saturday • 9:00 PM', address: '156 Ludlow St, New York, NY 10002', description: 'Comedians roast each other! Audience votes for winner. Not for the easily offended.', barDescription: 'Trendy Lower East Side bar with resident DJs.' },
      { id: 94, title: 'Improv Comedy Show', bar: 'UWS Brew House', rating: 4.6, reviews: 187, distance: '1.4 mi', special: '🎭 Audience participation', image: '🎭', gradient: 'from-blue-600 to-purple-700', category: 'comedy', time: 'Friday • 8:30 PM', address: '789 Amsterdam Ave, New York, NY 10025', description: 'Improv troupe creates sketches based on YOUR suggestions. Interactive and hilarious!', barDescription: 'Craft beer haven on Upper West Side.' },
      { id: 95, title: 'Comedy Brunch', bar: 'Harlem Nights', rating: 4.5, reviews: 234, distance: '1.6 mi', special: '🥞 Laughs with eggs', image: '☕', gradient: 'from-yellow-500 to-orange-600', category: 'comedy', time: 'Sunday • 11:00 AM', address: '2247 Frederick Douglass Blvd, New York, NY 10027', description: 'Brunch + comedy! Soul food buffet with stand-up show. Family-friendly early show.', barDescription: 'Historic Harlem jazz club with live music and soul food.' },
      { id: 96, title: 'Late Night Comedy', bar: 'Bushwick Billiards', rating: 4.4, reviews: 156, distance: '2.1 mi', special: '🌙 Midnight show', image: '🎤', gradient: 'from-purple-600 to-black', category: 'comedy', time: 'Saturday • 12:00 AM', address: '234 Knickerbocker Ave, Brooklyn, NY 11237', description: 'After-hours comedy show! Edgy material, adult crowd, late-night vibes.', barDescription: 'Dive bar with 6 pool tables and no pretension.' },
      { id: 97, title: 'Comedy Game Show', bar: 'The Brooklyn Bowl', rating: 4.7, reviews: 412, distance: '1.6 mi', special: '🎲 Interactive fun', image: '🎮', gradient: 'from-pink-600 to-purple-700', category: 'comedy', time: 'Thursday • 8:00 PM', address: '61 Wythe Ave, Brooklyn, NY 11249', description: 'Comedians compete in ridiculous games. Audience members can join in. Prizes for participation!', barDescription: 'Bowling alley, concert venue, and bar all in one.' }
    ]
  };

  const toggleSave = (eventId) => {
    setSavedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleFilterClick = (filterId) => {
    // Check if it's a sport filter
    const sportFilters = ['nfl', 'nba', 'mlb', 'nhl', 'soccer', 'college'];
    if (sportFilters.includes(filterId)) {
      setActiveFilter(filterId);
      setCurrentPage('filter');
      return;
    }
    
    // Old event filters (music, trivia, etc) - in case we need them later
    setActiveFilter(filterId);
    setCurrentPage('filter');
  };

  const handleSearchClick = () => {
    setCurrentPage('search');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveFilter(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setCurrentPage('event-detail');
  };

  const handleBackFromEventDetail = () => {
    setSelectedEvent(null);
    // Go back to previous page (home or filter)
    if (activeFilter) {
      setCurrentPage('filter');
    } else {
      setCurrentPage('home');
    }
  };

  // Search functionality
  const searchableContent = [
    // Teams
    { type: 'team', id: 'pittsburgh-panthers', name: 'Pittsburgh Panthers', icon: '🐾', sport: 'NCAA Football', action: () => { setSelectedTeam({ id: 'pittsburgh-panthers', ...teamDetailData['pittsburgh-panthers'] }); setCurrentPage('team-detail'); } },
    { type: 'team', id: 'dallas-cowboys', name: 'Dallas Cowboys', icon: '⭐', sport: 'NFL', action: () => { setSelectedTeam({ id: 'dallas-cowboys', ...teamDetailData['dallas-cowboys'] }); setCurrentPage('team-detail'); } },
    { type: 'team', id: 'new-york-knicks', name: 'New York Knicks', icon: '🗽', sport: 'NBA', action: () => { setSelectedTeam({ id: 'new-york-knicks', ...teamDetailData['new-york-knicks'] }); setCurrentPage('team-detail'); } },
    // Events
    { type: 'event', id: 'trivia', name: 'Trivia', icon: '🧠', action: () => { setActiveFilter('trivia'); setCurrentPage('filter'); } },
    { type: 'event', id: 'live-music', name: 'Live Music', icon: '🎤', action: () => { setActiveFilter('music'); setCurrentPage('filter'); } },
    { type: 'event', id: 'happy-hour', name: 'Happy Hour', icon: '🍺', action: () => { setActiveFilter('happy'); setCurrentPage('filter'); } },
    { type: 'event', id: 'comedy', name: 'Comedy', icon: '🎭', action: () => { setActiveFilter('comedy'); setCurrentPage('filter'); } },
    // Games
    { type: 'game', id: 'cowboys-eagles', name: 'Cowboys vs Eagles', icon: '🏈', sport: 'NFL', time: 'Today • 1:00 PM', action: () => { setSelectedGame({ id: 'nfl1', teams: 'Cowboys vs Eagles', time: 'Today • 1:00 PM EST', network: 'FOX', barsCount: 12, fanBars: 2 }); setCurrentPage('game-detail'); } },
    { type: 'game', id: 'knicks-heat', name: 'Knicks vs Heat', icon: '🏀', sport: 'NBA', time: 'Tonight • 7:30 PM', action: () => { setSelectedGame({ id: 'nba1', teams: 'Knicks vs Heat', time: 'Tonight • 7:30 PM EST', network: 'MSG', barsCount: 28, fanBars: 4 }); setCurrentPage('game-detail'); } },
    { type: 'game', id: 'lakers-celtics', name: 'Lakers vs Celtics', icon: '🏀', sport: 'NBA', time: 'Tonight • 8:00 PM', action: () => { setSelectedGame({ id: 'nba2', teams: 'Lakers vs Celtics', time: 'Tonight • 8:00 PM EST', network: 'ESPN', barsCount: 18, fanBars: 2 }); setCurrentPage('game-detail'); } }
  ];

  const getSearchResults = (query) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return searchableContent.filter(item => 
      item.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 results
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setShowSearchResults(value.length >= 2);
  };

  const handleSearchResultClick = (item) => {
    item.action();
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getFilteredEvents = () => {
    if (!activeFilter) return [];
    return Object.values(allEvents).flat().filter(event => event.category === activeFilter);
  };

  const getSportGames = () => {
    if (!activeFilter) return [];
    
    const sportMapping = {
      'nfl': sportsData.nfl || [],
      'nba': sportsData.nba || [],
      'mlb': [
        { id: 'mlb1', title: 'Yankees vs Red Sox', teams: 'Yankees vs Red Sox', homeTeam: 'Yankees', awayTeam: 'Red Sox', time: 'Tonight • 7:05 PM EST', network: 'YES', barsCount: 22, gradient: 'from-navy-800 to-red-700' },
        { id: 'mlb2', title: 'Mets vs Phillies', teams: 'Mets vs Phillies', homeTeam: 'Mets', awayTeam: 'Phillies', time: 'Tonight • 7:10 PM EST', network: 'SNY', barsCount: 16, gradient: 'from-blue-600 to-orange-600' }
      ],
      'nhl': [
        { id: 'nhl1', title: 'Rangers vs Bruins', teams: 'Rangers vs Bruins', homeTeam: 'Rangers', awayTeam: 'Bruins', time: 'Tonight • 7:00 PM EST', network: 'MSG', barsCount: 14, gradient: 'from-blue-700 to-red-600' },
        { id: 'nhl2', title: 'Islanders vs Devils', teams: 'Islanders vs Devils', time: 'Tomorrow • 7:30 PM EST', network: 'ESPN+', barsCount: 8, gradient: 'from-orange-600 to-blue-600' }
      ],
      'soccer': [
        { id: 'soccer1', title: 'Man United vs Arsenal', teams: 'Manchester United vs Arsenal', homeTeam: 'Manchester United', awayTeam: 'Arsenal', time: 'Saturday • 12:30 PM EST', network: 'USA', barsCount: 12, gradient: 'from-red-600 to-red-700' },
        { id: 'soccer2', title: 'Liverpool vs Chelsea', teams: 'Liverpool vs Chelsea', homeTeam: 'Liverpool', awayTeam: 'Chelsea', time: 'Sunday • 11:30 AM EST', network: 'NBC', barsCount: 10, gradient: 'from-red-700 to-blue-600' }
      ],
      'college': [
        { id: 'ncaa1', title: 'Alabama vs Georgia', teams: 'Alabama vs Georgia', homeTeam: 'Alabama Crimson Tide', awayTeam: 'Georgia', time: 'Saturday • 3:30 PM EST', network: 'CBS', barsCount: 8, gradient: 'from-red-700 to-black' },
        { id: 'ncaa2', title: 'Ohio State vs Michigan', teams: 'Ohio State vs Michigan', homeTeam: 'Ohio State Buckeyes', awayTeam: 'Michigan', time: 'Saturday • 12:00 PM EST', network: 'FOX', barsCount: 6, gradient: 'from-red-600 to-gray-700' }
      ]
    };
    
    return sportMapping[activeFilter] || [];
  };

  const EventCard = ({ event, isVertical = false }) => (
    <div 
      onClick={() => handleEventClick(event)}
      style={{
      backgroundColor: '#151B3F',
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: isVertical ? '100%' : '260px',
      maxWidth: isVertical ? '100%' : '260px',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      marginBottom: isVertical ? '16px' : '0'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        height: isVertical ? '220px' : '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isVertical ? '72px' : '56px',
        position: 'relative'
      }}
      className={`bg-gradient-to-br ${event.gradient}`}>
        {event.image}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(event.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Heart
            size={18}
            color={savedEvents.has(event.id) ? '#ff4444' : '#ffffff'}
            fill={savedEvents.has(event.id) ? '#ff4444' : 'none'}
          />
        </button>
      </div>
      <div style={{ padding: isVertical ? '16px' : '14px' }}>
        <h4 style={{
          color: '#FFFFFF',
          fontSize: isVertical ? '18px' : '15px',
          fontWeight: '600',
          marginBottom: isVertical ? '6px' : '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {event.title}
        </h4>
        <div style={{
          color: '#FFFFFF',
          fontSize: isVertical ? '16px' : '14px',
          fontWeight: '500',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {event.bar}
        </div>
        <div style={{
          color: '#9CA3B8',
          fontSize: isVertical ? '14px' : '12px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          flexWrap: 'wrap'
        }}>
          <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Star size={isVertical ? 14 : 12} fill="#FBBF24" />
            {event.rating}
          </span>
          <span>({event.reviews}+)</span>
          <span>•</span>
          <span>{event.distance}</span>
          <span>•</span>
          <span style={{ color: '#4ADE80' }}>Open</span>
        </div>
        <div style={{
          color: '#9CA3B8',
          fontSize: isVertical ? '14px' : '12px'
        }}>
          {event.special}
        </div>
      </div>
    </div>
  );

  const CarouselSection = ({ title, events }) => {
    if (!events || events.length === 0) return null;
    
    return (
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            {title}
          </h2>
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#5B8EFF',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '6px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#5B8EFF #151B3F'
        }}>
          {events.map(event => (
            <EventCard key={event.id} event={event} isVertical={false} />
          ))}
        </div>
      </div>
    );
  };

  // BAR DASHBOARD PAGES
  const BarDashboardHome = () => {
    // Mock data for bar's events
    const myEvents = [
      { id: 6, title: 'Live Jazz Night', time: 'Tonight • 9:00 PM', status: 'active', views: 234 },
      { id: 50, title: 'Sunday Jazz Brunch', time: 'Sunday • 11:00 AM', status: 'scheduled', views: 156 },
      { id: 51, title: 'Late Night Jam Session', time: 'Friday • 11:30 PM', status: 'scheduled', views: 89 }
    ];

    return (
      <>
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: '#0A0E27'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              margin: 0
            }}>
              Blue Note Bar
            </h1>
            <button
              onClick={() => setIsBarView(false)}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#FFFFFF',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Exit Bar View
            </button>
          </div>
          <p style={{
            color: '#9CA3B8',
            fontSize: '14px',
            margin: 0
          }}>
            Manage your events and profile
          </p>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#151B3F',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ color: '#9CA3B8', fontSize: '12px', marginBottom: '4px' }}>Active Events</div>
              <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '700' }}>3</div>
            </div>
            <div style={{
              backgroundColor: '#151B3F',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ color: '#9CA3B8', fontSize: '12px', marginBottom: '4px' }}>Total Views</div>
              <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '700' }}>479</div>
            </div>
            <div style={{
              backgroundColor: '#151B3F',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ color: '#9CA3B8', fontSize: '12px', marginBottom: '4px' }}>Saves</div>
              <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '700' }}>67</div>
            </div>
          </div>

          {/* Create Event Button */}
          <button
            onClick={() => setCurrentPage('bar-create-event')}
            style={{
              backgroundColor: '#5B8EFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              width: '100%',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            + Create New Event
          </button>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <button
              onClick={() => setCurrentPage('bar-sports-schedule')}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '32px' }}>📺</span>
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500' }}>Sports Schedule</span>
            </button>
            <button
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '32px' }}>⚙️</span>
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500' }}>Bar Profile</span>
            </button>
          </div>

          {/* My Events */}
          <div>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              My Events
            </h2>

            {myEvents.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: '#151B3F',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {event.title}
                  </div>
                  <div style={{ color: '#9CA3B8', fontSize: '13px', marginBottom: '6px' }}>
                    {event.time}
                  </div>
                  <div style={{ color: '#9CA3B8', fontSize: '12px' }}>
                    👁️ {event.views} views
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    backgroundColor: '#0A0E27',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#5B8EFF',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    Edit
                  </button>
                  <button style={{
                    backgroundColor: '#0A0E27',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ff4444',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const TeamDetailPage = () => {
    if (!selectedTeam) return null;

    const fanBarsList = allBarsData.filter(bar => selectedTeam.fanBars?.includes(bar.id));
    const regularBarsList = allBarsData.filter(bar => !selectedTeam.fanBars?.includes(bar.id)).slice(0, 5);

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage('organization-teams');
                setSelectedTeam(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {getTeamLogoUrl(selectedTeam.name) ? (
                <img 
                  src={getTeamLogoUrl(selectedTeam.name)} 
                  alt={`${selectedTeam.name} logo`}
                  style={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ fontSize: '28px' }}>{selectedTeam.icon}</span>
              )}
              {selectedTeam.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          {/* Team Logo Banner */}
          {getTeamLogoUrl(selectedTeam.name) && (
            <div style={{
              backgroundColor: '#151B3F',
              borderRadius: '16px',
              padding: '32px 24px',
              marginBottom: '28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src={getTeamLogoUrl(selectedTeam.name)} 
                alt={`${selectedTeam.name} logo`}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 0 6px 0'
                }}>
                  {selectedTeam.name}
                </h2>
                <p style={{
                  color: '#9CA3B8',
                  fontSize: '15px',
                  margin: 0
                }}>
                  {selectedTeam.description}
                </p>
              </div>
            </div>
          )}

          {/* Upcoming Games */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              📅 Upcoming Games ({selectedTeam.upcomingGames?.length || 0})
            </h2>
            {selectedTeam.upcomingGames?.map(game => (
              <div
                key={game.id}
                style={{
                  backgroundColor: '#151B3F',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {game.opponent}
                </div>
                <div style={{
                  color: '#9CA3B8',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  {game.date} • {game.time} • {game.network}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  color: '#9CA3B8',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#5B8EFF' }}>
                    👀 {game.barsCount} bars
                  </span>
                  {game.fanBarsCount > 0 && (
                    <span style={{ color: '#FBBF24' }}>
                      ⭐ {game.fanBarsCount} fan bars
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fan Bars Section */}
          {fanBarsList.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⭐</span>
                {selectedTeam.name} Fan Bars ({fanBarsList.length})
              </h2>
              <p style={{
                color: '#9CA3B8',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                Official fan headquarters - your home away from home
              </p>

              {fanBarsList.map(bar => (
                <div
                  key={bar.id}
                  onClick={() => {
                    setSelectedBar(bar);
                    setCurrentPage('fan-bar-profile');
                  }}
                  style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '2px solid #FBBF24',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '56px',
                    position: 'relative'
                  }}
                  className={`bg-gradient-to-br ${bar.gradient}`}>
                    {bar.image}
                    {/* Team Logo Badge */}
                    {bar.teamAffiliation && getTeamLogoUrl(bar.teamAffiliation) && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        padding: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={getTeamLogoUrl(bar.teamAffiliation)} 
                          alt={`${bar.teamAffiliation} logo`}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#FBBF24',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0A0E27'
                    }}>
                      ⭐ OFFICIAL FAN BAR
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '6px'
                    }}>
                      {bar.name}
                    </div>
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '14px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                        <Star size={14} fill="#FBBF24" />
                        {bar.rating}
                      </span>
                      <span>({bar.reviews}+)</span>
                      <span>•</span>
                      <span>{bar.distance}</span>
                    </div>
                    <p style={{
                      color: '#9CA3B8',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      {bar.description}
                    </p>
                    
                    {/* GAME DAY SPECIALS PREVIEW */}
                    {bar.gameDaySpecials && bar.gameDaySpecials.length > 0 && (
                      <div style={{
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '8px',
                        padding: '10px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          color: '#FBBF24',
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          🍺 GAME DAY SPECIALS
                        </div>
                        <div style={{
                          color: '#FFFFFF',
                          fontSize: '13px',
                          marginBottom: '2px'
                        }}>
                          • {bar.gameDaySpecials[0]}
                        </div>
                        {bar.gameDaySpecials.length > 1 && (
                          <div style={{
                            color: '#9CA3B8',
                            fontSize: '12px',
                            fontStyle: 'italic'
                          }}>
                            + {bar.gameDaySpecials.length - 1} more special(s)
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div style={{
                      color: '#5B8EFF',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      View Full Profile
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Bars Section */}
          {regularBarsList.length > 0 && (
            <div>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📺</span>
                Other Bars Nearby ({regularBarsList.length})
              </h2>
              <p style={{
                color: '#9CA3B8',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                Bars showing {selectedTeam.name} games
              </p>
              {regularBarsList.map(bar => (
                <div
                  key={bar.id}
                  style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {bar.name}
                  </div>
                  <div style={{
                    color: '#9CA3B8',
                    fontSize: '13px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                      <Star size={12} fill="#FBBF24" />
                      {bar.rating}
                    </span>
                    <span>({bar.reviews}+)</span>
                    <span>•</span>
                    <span>{bar.distance}</span>
                  </div>
                  <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                    {bar.special}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const FanBarProfilePage = () => {
    if (!selectedBar) return null;

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => {
              setCurrentPage('team-detail');
              setSelectedBar(null);
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button style={{
            backgroundColor: '#151B3F',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Heart size={20} color="#FFFFFF" />
          </button>
        </div>

        <div style={{ paddingBottom: '20px' }}>
          {/* Hero Image */}
          <div style={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px',
            position: 'relative'
          }}
          className={`bg-gradient-to-br ${selectedBar.gradient}`}>
            {selectedBar.image}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#FBBF24',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#0A0E27',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ⭐ OFFICIAL FAN BAR
            </div>
          </div>

          {/* Bar Info */}
          <div style={{ padding: '20px 16px' }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {selectedBar.name}
            </h1>

            <div style={{
              color: '#9CA3B8',
              fontSize: '16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={18} fill="#FBBF24" />
                {selectedBar.rating}
              </span>
              <span>({selectedBar.reviews}+ reviews)</span>
              <span>•</span>
              <span>{selectedBar.distance}</span>
              <span>•</span>
              <span style={{ color: '#4ADE80' }}>Open Now</span>
            </div>

            <div style={{
              backgroundColor: '#FBBF24',
              color: '#0A0E27',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              fontWeight: '600'
            }}>
              <div style={{ fontSize: '15px', marginBottom: '4px' }}>
                ⭐ Official {selectedBar.teamAffiliation} Fan Headquarters
              </div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>
                Home away from home for {selectedBar.teamAffiliation} fans
              </div>
            </div>

            {/* Description */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                About This Bar
              </h3>
              <p style={{
                color: '#9CA3B8',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '12px'
              }}>
                {selectedBar.description}
              </p>
              {selectedBar.ownerStory && (
                <p style={{
                  color: '#9CA3B8',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  {selectedBar.ownerStory}
                </p>
              )}
            </div>

            {/* Game Day Specials */}
            {selectedBar.gameDaySpecials && selectedBar.gameDaySpecials.length > 0 && (
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '20px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  🍺 Game Day Specials
                </h3>
                <p style={{
                  color: '#9CA3B8',
                  fontSize: '13px',
                  marginBottom: '12px'
                }}>
                  Every {selectedBar.teamAffiliation} game
                </p>
                {selectedBar.gameDaySpecials.map((special, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#151B3F',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      border: '1px solid rgba(91, 142, 255, 0.2)'
                    }}
                  >
                    • {special}
                  </div>
                ))}
              </div>
            )}

            {/* Location */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📍 Location
              </h3>
              
              <div style={{
                backgroundColor: '#151B3F',
                borderRadius: '12px',
                height: '180px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1320 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '48px', opacity: 0.3 }}>🗺️</div>
                </div>
                <div style={{ fontSize: '40px', zIndex: 1 }}>📍</div>
              </div>

              <div style={{
                color: '#FFFFFF',
                fontSize: '15px',
                marginBottom: '16px'
              }}>
                {selectedBar.address}
              </div>

              <button style={{
                backgroundColor: '#5B8EFF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                width: '100%',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '10px'
              }}>
                Get Directions
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Call Bar
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Share
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Connect
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📷 Instagram
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📘 Facebook
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🌐 Website
                </button>
              </div>
            </div>

            {/* Photos */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📸 Photos ({selectedBar.photos?.length || 0})
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                {selectedBar.photos?.map((photo, index) => (
                  <div key={index} style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative'
                  }}>
                    📷
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      padding: '4px',
                      borderRadius: '4px'
                    }}>
                      {photo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Games */}
            {selectedTeam && (
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '20px'
              }}>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  📅 Upcoming {selectedBar.teamAffiliation} Games
                </h3>
                {selectedTeam.upcomingGames?.slice(0, 3).map(game => (
                  <div
                    key={game.id}
                    style={{
                      backgroundColor: '#151B3F',
                      borderRadius: '12px',
                      padding: '14px',
                      marginBottom: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {game.opponent}
                    </div>
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '13px'
                    }}>
                      {game.date} • {game.time} • {game.network}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // SPORTS PAGES
  const SportsLandingPage = () => {
    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <button style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              <MapPin size={18} color="#5B8EFF" />
              Lower Manhattan
              <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{
                backgroundColor: '#151B3F',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <User size={18} color="#FFFFFF" />
              </button>
              <button style={{
                backgroundColor: '#151B3F',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <Bell size={18} color="#FFFFFF" />
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button 
              onClick={() => setCurrentPage('sports-search')}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '400',
                color: '#9CA3B8'
              }}
            >
              <Search size={18} color="#9CA3B8" />
              Search teams, games...
            </button>
            <button
              onClick={() => setCurrentPage('sports-az')}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                color: '#FFFFFF',
                flexShrink: 0
              }}
            >
              A-Z
            </button>
          </div>
        </div>

        <div style={{ paddingTop: '20px' }}>
          {/* My Teams Section - Only if logged in */}
          {isLoggedIn && (
            <div style={{ marginBottom: '28px', paddingLeft: '16px', paddingRight: '16px' }}>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '14px'
              }}>
                🎯 My Teams
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sportsData.myTeams.map(team => (
                  <button
                    key={team.id}
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{team.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                        {team.name}
                      </div>
                      <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                        Next: {team.nextGame}
                      </div>
                    </div>
                    <ChevronRight size={20} color="#9CA3B8" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {isLoggedIn && (
            <div style={{ marginBottom: '28px', paddingLeft: '16px', paddingRight: '16px' }}>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '14px'
              }}>
                🎯 My Teams
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sportsData.myTeams.map(team => (
                  <button
                    key={team.id}
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{team.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600' }}>
                        {team.name}
                      </div>
                      <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                        Next: {team.nextGame}
                      </div>
                    </div>
                    <ChevronRight size={20} color="#9CA3B8" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Popular Sports Grid */}
          <div style={{ paddingLeft: '16px', paddingRight: '16px', marginBottom: '28px' }}>
            <h2 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '14px'
            }}>
              📺 Popular Sports
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {sportsData.sports.map(sport => (
                <button
                  key={sport.id}
                  onClick={() => {
                    setSelectedSport(sport);
                    setCurrentPage('sport-games');
                  }}
                  style={{
                    backgroundColor: '#151B3F',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {getLeagueLogo(sport.id) ? (
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }}>
                      <img 
                        src={getLeagueLogo(sport.id)} 
                        alt={`${sport.name} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => { 
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: '40px' }}>{sport.icon}</span>
                  )}
                  <span style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {sport.name}
                  </span>
                  <span style={{
                    color: '#9CA3B8',
                    fontSize: '13px'
                  }}>
                    {sport.gamesCount} games
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const SportGamesPage = () => {
    if (!selectedSport) return null;
    
    const games = sportsData[selectedSport.id] || [];

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage('sports');
                setSelectedSport(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {getLeagueLogo(selectedSport.id) ? (
                <img 
                  src={getLeagueLogo(selectedSport.id)} 
                  alt={`${selectedSport.name} logo`}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ fontSize: '28px' }}>{selectedSport.icon}</span>
              )}
              {selectedSport.name}
            </h1>
          </div>
          <div style={{
            color: '#9CA3B8',
            fontSize: '14px',
            paddingLeft: '48px'
          }}>
            {games.length} games available
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {games.length > 0 ? (
            <>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Upcoming Games
              </h3>
              {games.map(game => (
                <div
                  key={game.id}
                  onClick={() => {
                    setSelectedGame(game);
                    setCurrentPage('game-detail');
                  }}
                  style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  {/* Team Logos Header */}
                  {game.homeTeam && game.awayTeam && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      {getTeamLogoUrl(game.homeTeam) && (
                        <img 
                          src={getTeamLogoUrl(game.homeTeam)} 
                          alt={`${game.homeTeam} logo`}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                      <span style={{ color: '#9CA3B8', fontSize: '20px', fontWeight: '700' }}>vs</span>
                      {getTeamLogoUrl(game.awayTeam) && (
                        <img 
                          src={getTeamLogoUrl(game.awayTeam)} 
                          alt={`${game.awayTeam} logo`}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                  )}
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '6px'
                  }}>
                    {game.teams}
                  </div>
                  <div style={{
                    color: '#9CA3B8',
                    fontSize: '14px',
                    marginBottom: '10px'
                  }}>
                    {game.time} • {game.network}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    color: '#9CA3B8',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#5B8EFF' }}>
                      👀 {game.barsCount} bars
                    </span>
                    {game.fanBars > 0 && (
                      <span style={{ color: '#FBBF24' }}>
                        ⭐ {game.fanBars} fan bars
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3B8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>
                No games scheduled
              </div>
              <div style={{ fontSize: '14px' }}>
                Check back later for upcoming games
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const GameDetailPage = () => {
    if (!selectedGame) return null;

    // Dynamically find bars showing this game based on team affiliations
    const getBarsForGame = () => {
      if (!selectedGame.homeTeam && !selectedGame.awayTeam) {
        // For special events (UFC, etc), show general sports bars
        return allBarsData.filter(bar => !bar.isFanBar).slice(0, 8);
      }

      const homeTeam = selectedGame.homeTeam;
      const awayTeam = selectedGame.awayTeam;

      // Find fan bars for both teams
      const fanBars = allBarsData.filter(bar => 
        bar.isFanBar && (
          bar.teamAffiliation === homeTeam || 
          bar.teamAffiliation === awayTeam
        )
      );

      // Find general sports bars (not fan bars)
      const generalSportsBars = allBarsData.filter(bar => !bar.isFanBar).slice(0, 6);

      return [...fanBars, ...generalSportsBars];
    };

    const barsShowingGame = getBarsForGame();
    const fanBars = barsShowingGame.filter(bar => bar.isFanBar);
    const regularBars = barsShowingGame.filter(bar => !bar.isFanBar);
    const allBars = [...fanBars, ...regularBars];

    return (
      <>
        {/* Map Modal */}
        {showMapView && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0A0E27',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Map Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              backgroundColor: '#0A0E27',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                margin: 0
              }}>
                Bars on Map
              </h2>
              <button
                onClick={() => setShowMapView(false)}
                style={{
                  backgroundColor: '#151B3F',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

            {/* Map Area */}
            <div style={{
              flex: 1,
              position: 'relative',
              background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1320 100%)',
              overflow: 'hidden'
            }}>
              {/* Map Background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px'
              }}>
                🗺️
              </div>

              {/* Simulated Map Pins */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '25%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5))'
                }}>
                  ⭐
                </div>
                <div style={{
                  backgroundColor: '#FBBF24',
                  color: '#0A0E27',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Murphy's Bar
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '45%',
                left: '60%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5))'
                }}>
                  ⭐
                </div>
                <div style={{
                  backgroundColor: '#FBBF24',
                  color: '#0A0E27',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Philly's Tavern
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '55%',
                left: '35%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '28px',
                  filter: 'drop-shadow(0 2px 4px rgba(91, 142, 255, 0.5))'
                }}>
                  📍
                </div>
                <div style={{
                  backgroundColor: '#5B8EFF',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Jack's Sports
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '25%',
                left: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '28px',
                  filter: 'drop-shadow(0 2px 4px rgba(91, 142, 255, 0.5))'
                }}>
                  📍
                </div>
                <div style={{
                  backgroundColor: '#5B8EFF',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Sports Palace
                </div>
              </div>

              <div style={{
                position: 'absolute',
                top: '65%',
                left: '55%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '28px',
                  filter: 'drop-shadow(0 2px 4px rgba(91, 142, 255, 0.5))'
                }}>
                  📍
                </div>
                <div style={{
                  backgroundColor: '#5B8EFF',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  Game Day
                </div>
              </div>

              {/* Legend */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '16px',
                right: '16px',
                backgroundColor: 'rgba(21, 27, 63, 0.95)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⭐</span>
                    <span style={{ color: '#FFFFFF', fontSize: '13px' }}>Fan Bars</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📍</span>
                    <span style={{ color: '#FFFFFF', fontSize: '13px' }}>Other Bars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Page Content */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage(selectedSport ? 'sport-games' : 'sports');
                setSelectedGame(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                marginBottom: '2px'
              }}>
                {selectedGame.teams || selectedGame.title}
              </h1>
              <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                {selectedGame.time}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          {/* Fan Bars Section */}
          {fanBars.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⭐</span>
                Fan Bars ({fanBars.length})
              </h3>
              <p style={{
                color: '#9CA3B8',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                These bars are dedicated fan headquarters
              </p>
              {fanBars.map(bar => (
                <div
                  key={bar.id}
                  style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    border: '2px solid #FBBF24',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    position: 'relative'
                  }}
                  className={`bg-gradient-to-br ${bar.gradient}`}>
                    {bar.image}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#FBBF24',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#0A0E27'
                    }}>
                      ⭐ {bar.teamAffiliation.toUpperCase()} FAN BAR
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {bar.name}
                    </div>
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '13px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                        <Star size={12} fill="#FBBF24" />
                        {bar.rating}
                      </span>
                      <span>({bar.reviews}+)</span>
                      <span>•</span>
                      <span>{bar.distance}</span>
                    </div>
                    <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                      {bar.special}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular Bars Section */}
          <div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📺</span>
              Other Bars Showing ({regularBars.length})
            </h3>
            {regularBars.map(bar => (
              <div
                key={bar.id}
                style={{
                  backgroundColor: '#151B3F',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {bar.name}
                </div>
                <div style={{
                  color: '#9CA3B8',
                  fontSize: '13px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                    <Star size={12} fill="#FBBF24" />
                    {bar.rating}
                  </span>
                  <span>({bar.reviews}+)</span>
                  <span>•</span>
                  <span>{bar.distance}</span>
                </div>
                <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                  {bar.special}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating View on Map Button */}
        <button
          onClick={() => setShowMapView(true)}
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#5B8EFF',
            border: 'none',
            borderRadius: '30px',
            padding: '14px 24px',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(91, 142, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 90
          }}
        >
          🗺️ View on Map
        </button>
      </>
    );
  };

  const SportsAZPage = () => {
    const allSports = [
      { id: 'american-football', name: 'American Football', icon: '🏈', hasOrgs: true },
      { id: 'baseball', name: 'Baseball', icon: '⚾', hasOrgs: true },
      { id: 'basketball', name: 'Basketball', icon: '🏀', hasOrgs: true },
      { id: 'boxing-mma', name: 'Boxing / MMA', icon: '🥊', hasOrgs: false },
      { id: 'hockey', name: 'Hockey', icon: '🏒', hasOrgs: true },
      { id: 'soccer', name: 'Soccer', icon: '⚽', hasOrgs: true },
      { id: 'tennis', name: 'Tennis', icon: '🎾', hasOrgs: false },
      { id: 'golf', name: 'Golf', icon: '⛳', hasOrgs: false },
      { id: 'rugby', name: 'Rugby', icon: '🏉', hasOrgs: false },
      { id: 'cricket', name: 'Cricket', icon: '🏏', hasOrgs: false }
    ];

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => setCurrentPage('sports')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              All Sports
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{
            backgroundColor: '#151B3F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search size={18} color="#9CA3B8" />
            <input
              placeholder="Search sports..."
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                flex: 1
              }}
            />
          </div>

          {allSports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => {
                if (sport.hasOrgs) {
                  setSelectedSportFromAZ(sport);
                  setCurrentPage('sport-organizations');
                } else {
                  // For sports without organizations, go directly to games
                  alert(`${sport.name} games coming soon!`);
                }
              }}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '10px',
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '32px' }}>{sport.icon}</span>
              <span style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                flex: 1
              }}>
                {sport.name}
              </span>
              <ChevronRight size={20} color="#9CA3B8" />
            </button>
          ))}
        </div>
      </>
    );
  };

  const SportOrganizationsPage = () => {
    if (!selectedSportFromAZ) return null;

    const organizations = {
      'american-football': [
        { id: 'nfl', name: 'NFL', icon: '🏈', description: 'National Football League' },
        { id: 'ncaa-football', name: 'NCAA Football', icon: '🎓', description: 'College Football' }
      ],
      'basketball': [
        { id: 'nba', name: 'NBA', icon: '🏀', description: 'National Basketball Association' },
        { id: 'ncaa-basketball', name: 'NCAA Basketball', icon: '🎓', description: 'College Basketball' },
        { id: 'wnba', name: 'WNBA', icon: '🏀', description: 'Women\'s National Basketball Association' }
      ],
      'baseball': [
        { id: 'mlb', name: 'MLB', icon: '⚾', description: 'Major League Baseball' },
        { id: 'ncaa-baseball', name: 'NCAA Baseball', icon: '🎓', description: 'College Baseball' }
      ],
      'hockey': [
        { id: 'nhl', name: 'NHL', icon: '🏒', description: 'National Hockey League' },
        { id: 'ncaa-hockey', name: 'NCAA Hockey', icon: '🎓', description: 'College Hockey' }
      ],
      'soccer': [
        { id: 'premier-league', name: 'Premier League', icon: '🏴', description: 'English Premier League' },
        { id: 'mls', name: 'MLS', icon: '🇺🇸', description: 'Major League Soccer' },
        { id: 'champions-league', name: 'Champions League', icon: '🏆', description: 'UEFA Champions League' },
        { id: 'la-liga', name: 'La Liga', icon: '🇪🇸', description: 'Spanish La Liga' },
        { id: 'serie-a', name: 'Serie A', icon: '🇮🇹', description: 'Italian Serie A' },
        { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪', description: 'German Bundesliga' }
      ]
    };

    const orgs = organizations[selectedSportFromAZ.id] || [];

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage('sports-az');
                setSelectedSportFromAZ(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>{selectedSportFromAZ.icon}</span>
              {selectedSportFromAZ.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <p style={{
            color: '#9CA3B8',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Select a league or organization
          </p>

          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                setSelectedOrganization(org);
                setCurrentPage('organization-teams');
              }}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              {getLeagueLogo(org.id) ? (
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px'
                }}>
                  <img 
                    src={getLeagueLogo(org.id)} 
                    alt={`${org.name} logo`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => { 
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <span style={{ fontSize: '32px' }}>{org.icon}</span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  {org.name}
                </div>
                <div style={{
                  color: '#9CA3B8',
                  fontSize: '13px'
                }}>
                  {org.description}
                </div>
              </div>
              <ChevronRight size={20} color="#9CA3B8" />
            </button>
          ))}
        </div>
      </>
    );
  };

  const OrganizationTeamsPage = () => {
    if (!selectedOrganization) return null;

    // Sample teams data - would come from API
    const teams = {
      'nfl': [
        { id: 'dallas-cowboys', name: 'Dallas Cowboys', icon: '⭐', conference: 'NFC East' },
        { id: 'ny-giants', name: 'New York Giants', icon: '🔵', conference: 'NFC East' },
        { id: 'ny-jets', name: 'New York Jets', icon: '✈️', conference: 'AFC East' },
        { id: 't2', name: 'Philadelphia Eagles', icon: '🦅', conference: 'NFC East' },
        { id: 't4', name: 'Kansas City Chiefs', icon: '🏈', conference: 'AFC West' }
      ],
      'ncaa-football': [
        { id: 'pittsburgh-panthers', name: 'Pittsburgh Panthers', icon: '🐾', conference: 'ACC' },
        { id: 't6', name: 'Alabama Crimson Tide', icon: '🔴', conference: 'SEC' },
        { id: 't7', name: 'Ohio State Buckeyes', icon: '🌰', conference: 'Big Ten' }
      ],
      'nba': [
        { id: 'new-york-knicks', name: 'New York Knicks', icon: '🗽', conference: 'Eastern' },
        { id: 'brooklyn-nets', name: 'Brooklyn Nets', icon: '⚫', conference: 'Eastern' },
        { id: 't10', name: 'Los Angeles Lakers', icon: '💜', conference: 'Western' }
      ],
      'mlb': [
        { id: 'ny-yankees', name: 'New York Yankees', icon: '⚾', conference: 'AL East' },
        { id: 'ny-mets', name: 'New York Mets', icon: '🔶', conference: 'NL East' },
        { id: 'boston-red-sox', name: 'Boston Red Sox', icon: '🔴', conference: 'AL East' }
      ],
      'nhl': [
        { id: 'ny-rangers', name: 'New York Rangers', icon: '🔵', conference: 'Metropolitan' },
        { id: 'nyi', name: 'New York Islanders', icon: '🏒', conference: 'Metropolitan' },
        { id: 'njd', name: 'New Jersey Devils', icon: '😈', conference: 'Metropolitan' }
      ],
      'premier-league': [
        { id: 'manchester-united', name: 'Manchester United', icon: '⚽', conference: 'Premier League' },
        { id: 'liverpool', name: 'Liverpool', icon: '🔴', conference: 'Premier League' },
        { id: 'arsenal', name: 'Arsenal', icon: '🔴', conference: 'Premier League' },
        { id: 'chelsea', name: 'Chelsea', icon: '🔵', conference: 'Premier League' }
      ]
    };

    const teamList = teams[selectedOrganization.id] || [];

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage('sport-organizations');
                setSelectedOrganization(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {getLeagueLogo(selectedOrganization.id) ? (
                <img 
                  src={getLeagueLogo(selectedOrganization.id)} 
                  alt={`${selectedOrganization.name} logo`}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => { 
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ fontSize: '28px' }}>{selectedOrganization.icon}</span>
              )}
              {selectedOrganization.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{
            backgroundColor: '#151B3F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search size={18} color="#9CA3B8" />
            <input
              placeholder="Search teams..."
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                flex: 1
              }}
            />
          </div>

          {teamList.length > 0 ? (
            teamList.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  // Check if we have detail data for this team
                  if (teamDetailData[team.id]) {
                    setSelectedTeam({ ...team, ...teamDetailData[team.id] });
                    setCurrentPage('team-detail');
                  } else {
                    alert(`${team.name} games & fan bars coming soon!`);
                  }
                }}
                style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '10px',
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left'
                }}
              >
                {getTeamLogoUrl(team.name) ? (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
                  }}>
                    <img 
                      src={getTeamLogoUrl(team.name)} 
                      alt={`${team.name} logo`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => { 
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: '28px' }}>{team.icon}</span>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {team.name}
                  </div>
                  <div style={{
                    color: '#9CA3B8',
                    fontSize: '13px'
                  }}>
                    {team.conference}
                  </div>
                </div>
                <ChevronRight size={20} color="#9CA3B8" />
              </button>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3B8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px' }}>
                Teams coming soon!
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const BarCreateEvent = () => {
    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={() => {
                setCurrentPage('bar-dashboard');
                setSelectedTemplate(null);
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              {selectedTemplate ? 'Event Details' : 'Choose Event Type'}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {!selectedTemplate ? (
            <>
              <p style={{
                color: '#9CA3B8',
                fontSize: '15px',
                marginBottom: '24px'
              }}>
                Select a template to get started quickly
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '12px'
              }}>
                {eventTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '40px' }}>{template.icon}</span>
                    <div>
                      <div style={{
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {template.label}
                      </div>
                      <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                        {template.description}
                      </div>
                    </div>
                    <ChevronRight size={20} color="#9CA3B8" style={{ marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: '#151B3F',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>{selectedTemplate.icon}</span>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>
                    {selectedTemplate.label}
                  </div>
                  <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                    {selectedTemplate.description}
                  </div>
                </div>
              </div>

              {/* Event Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Event Title *
                  </label>
                  <input
                    placeholder="e.g., Live Jazz Night"
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      width: '100%',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      width: '100%',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      style={{
                        backgroundColor: '#151B3F',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        width: '100%',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      End Time
                    </label>
                    <input
                      type="time"
                      style={{
                        backgroundColor: '#151B3F',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        width: '100%',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Special Offers / Pricing
                  </label>
                  <input
                    placeholder="e.g., $5 cover, 2-for-1 drinks"
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      width: '100%',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Tell people about this event..."
                    rows={4}
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      width: '100%',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" />
                    <span>Recurring Event</span>
                  </label>
                  <p style={{ color: '#9CA3B8', fontSize: '12px', marginTop: '4px', marginLeft: '24px' }}>
                    Automatically create this event weekly
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '20px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    style={{
                      backgroundColor: '#151B3F',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '14px',
                      flex: 1,
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      alert('Event created! (This is a demo)');
                      setCurrentPage('bar-dashboard');
                      setSelectedTemplate(null);
                    }}
                    style={{
                      backgroundColor: '#5B8EFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      flex: 2,
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Publish Event
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const BarSportsSchedule = () => {
    const sportsGames = [
      { id: 1, teams: 'Lakers vs Celtics', league: 'NBA', time: 'Tonight • 8:00 PM', selected: true },
      { id: 2, teams: 'Rangers vs Devils', league: 'NHL', time: 'Tonight • 7:30 PM', selected: false },
      { id: 3, teams: 'Giants vs Cowboys', league: 'NFL', time: 'Sunday • 1:00 PM', selected: true },
      { id: 4, teams: 'Yankees vs Red Sox', league: 'MLB', time: 'Tomorrow • 7:05 PM', selected: false },
      { id: 5, teams: 'Knicks vs Heat', league: 'NBA', time: 'Friday • 7:30 PM', selected: false }
    ];

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <button 
              onClick={() => setCurrentPage('bar-dashboard')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              Sports Schedule
            </h1>
          </div>
          <p style={{
            color: '#9CA3B8',
            fontSize: '13px',
            paddingLeft: '48px'
          }}>
            Select games you're showing at your bar
          </p>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{
            backgroundColor: '#151B3F',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #5B8EFF'
          }}>
            <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              💡 Quick Tip
            </div>
            <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
              Tick the games you're showing. They'll automatically appear in user searches.
            </div>
          </div>

          {sportsGames.map(game => (
            <div
              key={game.id}
              style={{
                backgroundColor: '#151B3F',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: `1px solid ${game.selected ? '#5B8EFF' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={game.selected}
                onChange={() => {}}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {game.teams}
                </div>
                <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                  {game.league} • {game.time}
                </div>
              </div>
              {game.selected && (
                <span style={{
                  backgroundColor: '#5B8EFF',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  SHOWING
                </span>
              )}
            </div>
          ))}

          <button
            style={{
              backgroundColor: '#5B8EFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              width: '100%',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Save Changes
          </button>
        </div>
      </>
    );
  };

  const EventDetailPage = () => {
    if (!selectedEvent) return null;

    // Get other events from the same bar
    const otherEventsAtBar = Object.values(allEvents)
      .flat()
      .filter(e => e.bar === selectedEvent.bar && e.id !== selectedEvent.id)
      .slice(0, 3);

    return (
      <>
        {/* Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            onClick={handleBackFromEventDetail}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(selectedEvent.id);
            }}
            style={{
              backgroundColor: '#151B3F',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Heart
              size={20}
              color={savedEvents.has(selectedEvent.id) ? '#ff4444' : '#FFFFFF'}
              fill={savedEvents.has(selectedEvent.id) ? '#ff4444' : 'none'}
            />
          </button>
        </div>

        {/* Content */}
        <div style={{ paddingBottom: '20px' }}>
          {/* Hero Image */}
          <div style={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '96px'
          }}
          className={`bg-gradient-to-br ${selectedEvent.gradient}`}>
            {selectedEvent.image}
          </div>

          {/* Event Info */}
          <div style={{ padding: '20px 16px' }}>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {selectedEvent.title}
            </h1>

            <div style={{
              color: '#5B8EFF',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px',
              cursor: 'pointer'
            }}>
              {selectedEvent.bar}
            </div>

            <div style={{
              color: '#9CA3B8',
              fontSize: '15px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#FBBF24" />
                {selectedEvent.rating}
              </span>
              <span>({selectedEvent.reviews}+)</span>
              <span>•</span>
              <span>{selectedEvent.distance}</span>
              <span>•</span>
              <span style={{ color: '#4ADE80' }}>Open</span>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ color: '#FFFFFF', fontSize: '15px' }}>
                📅 {selectedEvent.time}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '15px' }}>
                {selectedEvent.special}
              </div>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <>
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  margin: '20px 0',
                  paddingTop: '20px'
                }}>
                  <h3 style={{
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    About This Event
                  </h3>
                  <p style={{
                    color: '#9CA3B8',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {selectedEvent.description}
                  </p>
                </div>
              </>
            )}

            {/* Location */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              margin: '20px 0',
              paddingTop: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📍 Location
              </h3>
              
              {/* Map Snippet */}
              <div style={{
                backgroundColor: '#151B3F',
                borderRadius: '12px',
                height: '180px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1320 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '48px',
                    opacity: 0.3
                  }}>
                    🗺️
                  </div>
                </div>
                <div style={{
                  fontSize: '40px',
                  zIndex: 1
                }}>
                  📍
                </div>
              </div>

              <div style={{
                color: '#FFFFFF',
                fontSize: '15px',
                marginBottom: '16px'
              }}>
                {selectedEvent.address}
              </div>

              <button style={{
                backgroundColor: '#5B8EFF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                width: '100%',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '10px'
              }}>
                Get Directions
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Share
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Add to Calendar
                </button>
              </div>
            </div>

            {/* About the Bar */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              margin: '20px 0',
              paddingTop: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                About {selectedEvent.bar}
              </h3>
              <p style={{
                color: '#9CA3B8',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                {selectedEvent.barDescription}
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📷 Instagram
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📘 Facebook
                </button>
                <button style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🌐 Website
                </button>
              </div>
            </div>

            {/* Bar Photos */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              margin: '20px 0',
              paddingTop: '20px'
            }}>
              <h3 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                📸 Photos
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    📷
                  </div>
                ))}
              </div>
            </div>

            {/* More Events at This Bar */}
            {otherEventsAtBar.length > 0 && (
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                margin: '20px 0',
                paddingTop: '20px'
              }}>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  More Events at {selectedEvent.bar}
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {otherEventsAtBar.map(event => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{
                        backgroundColor: '#151B3F',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '14px'
                      }}
                    >
                      <div style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        flexShrink: 0
                      }}
                      className={`bg-gradient-to-br ${event.gradient}`}>
                        {event.image}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: '#FFFFFF',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {event.title}
                        </div>
                        <div style={{
                          color: '#9CA3B8',
                          fontSize: '13px',
                          marginBottom: '6px'
                        }}>
                          {event.time}
                        </div>
                        <div style={{
                          color: '#9CA3B8',
                          fontSize: '13px'
                        }}>
                          {event.special}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Game Card Component (SeatGeek style)
  const GameCard = ({ game, onClick }) => (
    <button
      onClick={onClick}
      style={{
        minWidth: '240px',
        backgroundColor: '#151B3F',
        border: 'none',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative'
      }}
    >
      {/* Game Image/Hero */}
      <div style={{
        background: game.gradient ? `linear-gradient(135deg, ${game.gradient.split(' ')[0].replace('from-', '#')}, ${game.gradient.split(' ')[1].replace('to-', '#')})` : '#1E2749',
        width: '100%',
        height: '150px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* TODAY badge */}
        {game.time.includes('Today') || game.time.includes('Tonight') ? (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#5B8EFF',
            color: '#FFFFFF',
            padding: '5px 10px',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            {game.time.includes('Today') ? 'TODAY' : 'TONIGHT'}
          </div>
        ) : null}

        {/* Heart Icon */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '32px',
          height: '32px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Heart size={18} color="#FFFFFF" fill="none" />
        </div>

        {/* Team Logos */}
        {game.homeTeam && game.awayTeam && getTeamLogoUrl(game.homeTeam) && getTeamLogoUrl(game.awayTeam) ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px'
          }}>
            <img 
              src={getTeamLogoUrl(game.homeTeam)} 
              alt={game.homeTeam}
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
              }}
            />
            <span style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '20px', 
              fontWeight: '800',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)'
            }}>
              VS
            </span>
            <img 
              src={getTeamLogoUrl(game.awayTeam)} 
              alt={game.awayTeam}
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
              }}
            />
          </div>
        ) : (
          <div style={{ fontSize: '48px' }}>{game.image || '🏟️'}</div>
        )}

        {/* Gradient Overlay for text readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
        }} />
      </div>

      {/* Game Info */}
      <div style={{ padding: '12px 14px' }}>
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: '700',
          marginBottom: '5px',
          margin: 0,
          lineHeight: '1.3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {game.title || game.teams}
        </h3>
        
        <div style={{
          color: '#9CA3B8',
          fontSize: '13px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {game.time}
          {game.network && (
            <>
              <span>•</span>
              <span style={{ color: '#FBBF24' }}>{game.network}</span>
            </>
          )}
        </div>

        <div style={{
          color: '#5B8EFF',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {game.barsCount} bars
        </div>
      </div>
    </button>
  );

  // Sport Carousel Component
  const SportCarousel = ({ title, games, emoji }) => {
    if (!games || games.length === 0) return null;
    
    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '16px',
          paddingRight: '16px',
          marginBottom: '14px'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9CA3B8',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            SEE ALL
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game}
              onClick={() => {
                setSelectedGame(game);
                setCurrentPage('game-detail');
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <>
      {/* Simple Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        backgroundColor: '#0A0E27',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px'
        }}>
          {/* App Logo/Name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              backgroundColor: '#5B8EFF',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🏈
            </div>
            <div>
              <div style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                BarScout
              </div>
              <div style={{
                color: '#9CA3B8',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                New York City
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              backgroundColor: '#151B3F',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Bell size={18} color="#FFFFFF" />
            </button>
            <button style={{
              backgroundColor: '#151B3F',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <User size={18} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <button 
          onClick={handleSearchClick}
          style={{
            backgroundColor: '#151B3F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '13px 16px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '400',
            color: '#9CA3B8'
          }}
        >
          <Search size={19} color="#9CA3B8" />
          Team, performer or venue
        </button>

        {/* Sport Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingTop: '12px',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              style={{
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 14px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 'fit-content',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '16px' }}>{filter.icon}</span>
              <span style={{
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content - Sport Carousels */}
      <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        {/* Featured Events */}
        <SportCarousel 
          title="Featured Events" 
          emoji="⭐"
          games={sportsData.featured}
        />

        {/* NFL */}
        <SportCarousel 
          title="NFL" 
          emoji="🏈"
          games={sportsData.nfl}
        />

        {/* NBA */}
        <SportCarousel 
          title="NBA" 
          emoji="🏀"
          games={sportsData.nba}
        />

        {/* College Football - Placeholder (we'll add data later) */}
        <SportCarousel 
          title="College Football" 
          emoji="🏈"
          games={[
            { id: 'ncaa1', title: 'Alabama vs Georgia', teams: 'Alabama vs Georgia', homeTeam: 'Alabama Crimson Tide', awayTeam: 'Georgia', time: 'Saturday • 3:30 PM EST', network: 'CBS', barsCount: 8, gradient: 'from-red-700 to-black' },
            { id: 'ncaa2', title: 'Ohio State vs Michigan', teams: 'Ohio State vs Michigan', homeTeam: 'Ohio State Buckeyes', awayTeam: 'Michigan', time: 'Saturday • 12:00 PM EST', network: 'FOX', barsCount: 6, gradient: 'from-red-600 to-gray-700' }
          ]}
        />

        {/* NHL - Placeholder */}
        <SportCarousel 
          title="NHL" 
          emoji="🏒"
          games={[
            { id: 'nhl1', title: 'Rangers vs Bruins', teams: 'Rangers vs Bruins', homeTeam: 'Rangers', awayTeam: 'Bruins', time: 'Tonight • 7:00 PM EST', network: 'MSG', barsCount: 14, gradient: 'from-blue-700 to-red-600' },
            { id: 'nhl2', title: 'Islanders vs Devils', teams: 'Islanders vs Devils', time: 'Tomorrow • 7:30 PM EST', network: 'ESPN+', barsCount: 8, gradient: 'from-orange-600 to-blue-600' }
          ]}
        />

        {/* MLB - Placeholder */}
        <SportCarousel 
          title="MLB" 
          emoji="⚾"
          games={[
            { id: 'mlb1', title: 'Yankees vs Red Sox', teams: 'Yankees vs Red Sox', homeTeam: 'Yankees', awayTeam: 'Red Sox', time: 'Tonight • 7:05 PM EST', network: 'YES', barsCount: 22, gradient: 'from-navy-800 to-red-700' },
            { id: 'mlb2', title: 'Mets vs Phillies', teams: 'Mets vs Phillies', homeTeam: 'Mets', awayTeam: 'Phillies', time: 'Tonight • 7:10 PM EST', network: 'SNY', barsCount: 16, gradient: 'from-blue-600 to-orange-600' }
          ]}
        />

        {/* Soccer */}
        <SportCarousel 
          title="Soccer" 
          emoji="⚽"
          games={[
            { id: 'soccer1', title: 'Man United vs Arsenal', teams: 'Manchester United vs Arsenal', homeTeam: 'Manchester United', awayTeam: 'Arsenal', time: 'Saturday • 12:30 PM EST', network: 'USA', barsCount: 12, gradient: 'from-red-600 to-red-700' },
            { id: 'soccer2', title: 'Liverpool vs Chelsea', teams: 'Liverpool vs Chelsea', homeTeam: 'Liverpool', awayTeam: 'Chelsea', time: 'Sunday • 11:30 AM EST', network: 'NBC', barsCount: 10, gradient: 'from-red-700 to-blue-600' }
          ]}
        />

        {/* College Basketball - Placeholder */}
        <SportCarousel 
          title="College Basketball" 
          emoji="🏀"
          games={[
            { id: 'cbb1', title: 'Duke vs UNC', teams: 'Duke vs UNC', time: 'Tonight • 9:00 PM EST', network: 'ESPN', barsCount: 7, gradient: 'from-blue-700 to-blue-400' },
            { id: 'cbb2', title: 'Kentucky vs Louisville', teams: 'Kentucky vs Louisville', time: 'Saturday • 8:00 PM EST', network: 'CBS', barsCount: 5, gradient: 'from-blue-600 to-red-600' }
          ]}
        />
      </div>
    </>
  );

  const FilterPage = () => {
    const sportFilters = ['nfl', 'nba', 'mlb', 'nhl', 'soccer', 'college'];
    const isSportFilter = sportFilters.includes(activeFilter);
    
    const games = isSportFilter ? getSportGames() : [];
    const events = !isSportFilter ? getFilteredEvents() : [];
    const items = isSportFilter ? games : events;
    
    const filterLabel = filters.find(f => f.id === activeFilter)?.label || '';
    const filterIcon = filters.find(f => f.id === activeFilter)?.icon || '';

    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <button 
              onClick={handleBackToHome}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              <span style={{ fontSize: '24px', marginRight: '8px' }}>{filterIcon}</span>
              {filterLabel}
            </h1>
          </div>
          
          <div style={{
            color: '#9CA3B8',
            fontSize: '14px',
            paddingLeft: '48px'
          }}>
            {items.length} {isSportFilter ? 'games' : 'events'} near you
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          {items.length > 0 ? (
            isSportFilter ? (
              // Vertical game cards for sports
              items.map(game => (
                <button
                  key={game.id}
                  onClick={() => {
                    setSelectedGame(game);
                    setCurrentPage('game-detail');
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#151B3F',
                    border: 'none',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '16px',
                    position: 'relative'
                  }}
                >
                  {/* Game Image/Hero */}
                  <div style={{
                    background: game.gradient ? `linear-gradient(135deg, ${game.gradient.split(' ')[0].replace('from-', '#')}, ${game.gradient.split(' ')[1].replace('to-', '#')})` : '#1E2749',
                    width: '100%',
                    height: '160px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* TODAY badge */}
                    {game.time.includes('Today') || game.time.includes('Tonight') ? (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#5B8EFF',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '18px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        {game.time.includes('Today') ? 'TODAY' : 'TONIGHT'}
                      </div>
                    ) : null}

                    {/* Team Logos */}
                    {game.homeTeam && game.awayTeam && getTeamLogoUrl(game.homeTeam) && getTeamLogoUrl(game.awayTeam) ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px'
                      }}>
                        <img 
                          src={getTeamLogoUrl(game.homeTeam)} 
                          alt={game.homeTeam}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
                          }}
                        />
                        <span style={{ 
                          color: 'rgba(255,255,255,0.95)', 
                          fontSize: '22px', 
                          fontWeight: '800',
                          textShadow: '0 2px 10px rgba(0,0,0,0.4)'
                        }}>
                          VS
                        </span>
                        <img 
                          src={getTeamLogoUrl(game.awayTeam)} 
                          alt={game.awayTeam}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ fontSize: '52px' }}>{game.image || '🏟️'}</div>
                    )}

                    {/* Gradient Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '70px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                    }} />
                  </div>

                  {/* Game Info */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      color: '#FFFFFF',
                      fontSize: '17px',
                      fontWeight: '700',
                      marginBottom: '8px',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      {game.title || game.teams}
                    </h3>
                    
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '14px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {game.time}
                      {game.network && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#FBBF24' }}>{game.network}</span>
                        </>
                      )}
                    </div>

                    <div style={{
                      color: '#5B8EFF',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>
                      {game.barsCount} bars
                    </div>
                  </div>
                </button>
              ))
            ) : (
              // Original event cards
              events.map(event => (
                <EventCard key={event.id} event={event} isVertical={true} />
              ))
            )
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3B8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>
                No {isSportFilter ? 'games' : 'events'} found
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const SearchPage = () => {
    return (
      <>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0A0E27',
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              onClick={handleBackToHome}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <div style={{
              backgroundColor: '#151B3F',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Search size={18} color="#9CA3B8" />
              <input 
                autoFocus
                placeholder="Search bars & events..."
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  flex: 1
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Recent Searches
            </h3>
            {recentSearches.map((search, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Search size={18} color="#9CA3B8" />
                  <span style={{ color: '#FFFFFF', fontSize: '15px' }}>{search}</span>
                </div>
                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}>
                  <X size={18} color="#9CA3B8" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Browse by Category
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  style={{
                    backgroundColor: '#151B3F',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{filter.icon}</span>
                  <span style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Popular Searches
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Trivia', 'Happy Hour', 'Live Music', 'Sports Bar', 'Comedy Night', 'Karaoke', 'Rooftop Bar', 'Beer Garden'].map((tag, index) => (
                <button
                  key={index}
                  style={{
                    backgroundColor: '#151B3F',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{
      backgroundColor: '#0A0E27',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '80px',
      maxWidth: '430px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* User View Pages */}
      {!isBarView && currentPage === 'home' && <HomePage />}
      {!isBarView && currentPage === 'filter' && <FilterPage />}
      {!isBarView && currentPage === 'search' && <SearchPage />}
      {!isBarView && currentPage === 'event-detail' && <EventDetailPage />}
      {!isBarView && currentPage === 'sports' && <SportsLandingPage />}
      {!isBarView && currentPage === 'sport-games' && <SportGamesPage />}
      {!isBarView && currentPage === 'game-detail' && <GameDetailPage />}
      {!isBarView && currentPage === 'sports-az' && <SportsAZPage />}
      {!isBarView && currentPage === 'sport-organizations' && <SportOrganizationsPage />}
      {!isBarView && currentPage === 'organization-teams' && <OrganizationTeamsPage />}
      {!isBarView && currentPage === 'team-detail' && <TeamDetailPage />}
      {!isBarView && currentPage === 'fan-bar-profile' && <FanBarProfilePage />}
      
      {/* Bar View Pages */}
      {isBarView && currentPage === 'bar-dashboard' && <BarDashboardHome />}
      {isBarView && currentPage === 'bar-create-event' && <BarCreateEvent />}
      {isBarView && currentPage === 'bar-sports-schedule' && <BarSportsSchedule />}

      {/* Bottom Navigation - Only show on home page in user view */}
      {!isBarView && (currentPage === 'home' || currentPage === 'sports') && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#151B3F',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0 10px 0',
          zIndex: 100
        }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: currentPage === 'home' ? '#5B8EFF' : '#9CA3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: currentPage === 'home' ? '600' : '500'
          }}>
            <span style={{ fontSize: '24px' }}>🏠</span>
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('sports')}
            style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: currentPage === 'sports' || currentPage === 'sport-games' || currentPage === 'game-detail' || currentPage === 'sports-az' ? '#5B8EFF' : '#9CA3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: currentPage.includes('sport') ? '600' : '500'
          }}>
            <span style={{ fontSize: '24px' }}>🏈</span>
            Sports
          </button>
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            Profile
          </button>
        </div>
      )}
      
      {/* Demo: Toggle Login Button */}
      {/* Removed - we'll handle login later */}
      
      {/* Demo: Switch to Bar View Button */}
      {!isBarView && currentPage === 'home' && (
        <button
          onClick={() => {
            setIsBarView(true);
            setCurrentPage('bar-dashboard');
          }}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            backgroundColor: '#8B5FFF',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 95, 255, 0.4)',
            fontSize: '24px',
            zIndex: 99
          }}
          title="Switch to Bar View (Demo)"
        >
          🏪
        </button>
      )}
    </div>
  );
}
