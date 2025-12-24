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
    { id: 'music', icon: '🎤', label: 'Live Music' },
    { id: 'trivia', icon: '🧠', label: 'Trivia' },
    { id: 'happy', icon: '🍺', label: 'Happy Hour' },
    { id: 'sports', icon: '📺', label: 'Sports' },
    { id: 'events', icon: '🎉', label: 'Events' },
    { id: 'comedy', icon: '🎭', label: 'Comedy' }
  ];

  const eventTemplates = [
    { id: 'music', icon: '🎤', label: 'Live Music Night', description: 'Band, DJ, or live performance' },
    { id: 'trivia', icon: '🧠', label: 'Trivia Night', description: 'Quiz competition with prizes' },
    { id: 'happy', icon: '🍺', label: 'Happy Hour', description: 'Drink specials and deals' },
    { id: 'sports', icon: '📺', label: 'Sports Viewing', description: 'Watch games at your bar' },
    { id: 'special', icon: '🎉', label: 'Special Event', description: 'Parties, tastings, etc.' },
    { id: 'comedy', icon: '🎭', label: 'Comedy Night', description: 'Stand-up or open mic' }
  ];

  const sportsData = {
    featured: [
      { id: 'sb', title: 'Super Bowl LIX', sport: 'NFL', teams: 'TBD vs TBD', time: 'Feb 9 • 6:30 PM EST', image: '🏈', gradient: 'from-orange-500 to-red-600', barsCount: 45 },
      { id: 'knicks', title: 'Knicks vs Heat', sport: 'NBA', teams: 'New York Knicks vs Miami Heat', time: 'Tonight • 7:30 PM EST', image: '🏀', gradient: 'from-blue-500 to-orange-600', barsCount: 28, isLocal: true },
      { id: 'ufc', title: 'UFC 300', sport: 'UFC', teams: 'Main Card', time: 'Saturday • 10:00 PM EST', image: '🥊', gradient: 'from-red-500 to-purple-600', barsCount: 19 }
    ],
    sports: [
      { id: 'nfl', name: 'NFL', icon: '🏈', gamesCount: 12, gradient: 'from-green-600 to-blue-600' },
      { id: 'nba', name: 'NBA', icon: '🏀', gamesCount: 8, gradient: 'from-orange-500 to-red-600' },
      { id: 'nhl', name: 'NHL', icon: '🏒', gamesCount: 15, gradient: 'from-blue-500 to-cyan-600' },
      { id: 'mlb', name: 'MLB', icon: '⚾', gamesCount: 6, gradient: 'from-red-500 to-blue-600' },
      { id: 'soccer', name: 'Soccer', icon: '⚽', gamesCount: 10, gradient: 'from-green-500 to-blue-500' },
      { id: 'ufc', name: 'UFC/MMA', icon: '🥊', gamesCount: 3, gradient: 'from-red-600 to-black' },
      { id: 'other', name: 'Other Sports', icon: '🏆', gamesCount: 5, gradient: 'from-purple-500 to-pink-500' }
    ],
    nfl: [
      { id: 'nfl1', teams: 'Cowboys vs Eagles', time: 'Today • 1:00 PM EST', network: 'FOX', barsCount: 12, fanBars: 2 },
      { id: 'nfl2', teams: 'Giants vs Bills', time: 'Today • 4:25 PM EST', network: 'CBS', barsCount: 8, fanBars: 1 },
      { id: 'nfl3', teams: 'Jets vs Patriots', time: 'Sunday • 1:00 PM EST', network: 'CBS', barsCount: 15, fanBars: 3 }
    ],
    nba: [
      { id: 'nba1', teams: 'Knicks vs Heat', time: 'Tonight • 7:30 PM EST', network: 'MSG', barsCount: 28, fanBars: 4 },
      { id: 'nba2', teams: 'Lakers vs Celtics', time: 'Tonight • 8:00 PM EST', network: 'ESPN', barsCount: 18, fanBars: 2 },
      { id: 'nba3', teams: 'Nets vs 76ers', time: 'Tomorrow • 7:00 PM EST', network: 'YES', barsCount: 12, fanBars: 2 }
    ],
    myTeams: [
      { id: 'pitt', name: 'Pittsburgh Panthers', sport: 'NCAA Football', icon: '🏈', nextGame: 'Dec 10 vs Duke', fanBarsCount: 2 },
      { id: 'knicks', name: 'New York Knicks', sport: 'NBA', icon: '🏀', nextGame: 'Tonight vs Heat', fanBarsCount: 4 }
    ]
  };

  const barsShowingGame = [
    { id: 'b1', name: "Murphy's Bar", rating: 4.5, reviews: 120, distance: '0.3 mi', special: '🍺 $5 wings', isFanBar: true, teamAffiliation: 'Cowboys', image: '🏈', gradient: 'from-blue-500 to-gray-600', address: '123 Broadway, New York, NY 10012', description: 'Official Dallas Cowboys fan headquarters in NYC since 2015. Owner is Dallas native and lifelong Cowboys fan.', ownerStory: 'Owner Mike grew up in Dallas and moved to NYC in 2010. Missing his hometown team, he opened this bar to create a community for Cowboys fans.', gameDaySpecials: ['$4 Lone Star Beer during games', 'Wear Cowboys gear - get a free shot', '$20 wings & beer bucket combo', 'Free nachos at halftime when Cowboys lead'], photos: ['Interior with Cowboys memorabilia', 'Game day crowd', 'Signed jerseys on wall', 'Bar exterior'] },
    { id: 'b2', name: "Philly's Tavern", rating: 4.7, reviews: 98, distance: '0.5 mi', special: '🍺 Eagles specials', isFanBar: true, teamAffiliation: 'Eagles', image: '🦅', gradient: 'from-green-600 to-gray-700', address: '456 5th Ave, New York, NY 10018', description: 'The official Philadelphia Eagles bar in Manhattan. Eagles fans have been gathering here for over 20 years.', ownerStory: 'Family-owned by Philly natives since 2003. Three generations of Eagles fans.', gameDaySpecials: ['$3 Yuengling on tap all game', 'Wear Eagles jersey - free cheesesteak slider', '$25 beer bucket (6 beers)', 'Win a signed jersey - raffle every game'], photos: ['Eagles flags everywhere', 'Championship memorabilia', 'Packed game day', 'Owner with Eagles legends'] },
    { id: 'b3', name: "Jack's Sports Bar", rating: 4.3, reviews: 156, distance: '0.7 mi', special: '📺 20+ screens', isFanBar: false, image: '📺', gradient: 'from-gray-600 to-gray-800', address: '789 7th Ave, New York, NY 10019', description: 'Multi-sport bar showing all major games on 20+ HD screens.' },
    { id: 'b4', name: "The Sports Palace", rating: 4.6, reviews: 203, distance: '1.0 mi', special: '🍻 $3 drafts', isFanBar: false, image: '🏟️', gradient: 'from-orange-500 to-red-600', address: '321 W 50th St, New York, NY 10019', description: 'Large sports bar with great atmosphere for any game.' },
    { id: 'b5', name: "Game Day Grille", rating: 4.4, reviews: 87, distance: '1.2 mi', special: '🍔 Game day menu', isFanBar: false, image: '🍔', gradient: 'from-red-500 to-orange-600', address: '654 3rd Ave, New York, NY 10017', description: 'Casual sports bar with great food and drinks.' },
    { id: 'b6', name: "Pitt's Pub NYC", rating: 4.8, reviews: 145, distance: '0.3 mi', special: '🐾 Pitt alumni bar', isFanBar: true, teamAffiliation: 'Pittsburgh Panthers', image: '🐾', gradient: 'from-blue-600 to-yellow-500', address: '234 E 14th St, New York, NY 10003', description: 'Official Pittsburgh Panthers alumni bar. Home away from home for Pitt fans in NYC since 2012.', ownerStory: 'Owner Sarah graduated from Pitt in 2008. After moving to NYC, she wanted to create a space where Panthers could gather and cheer together.', gameDaySpecials: ['Wear Pitt gear - free beer token', '$5 Iron City Beer all game', 'Primanti Bros sandwich special - $12', '$30 beer bucket + wings combo', 'Raffle for Pitt merchandise every game'], photos: ['Pitt flags and banners', 'Championship photos', 'Alumni gatherings', 'Game day atmosphere'] },
    { id: 'b7', name: "Oakland Tavern", rating: 4.6, reviews: 89, distance: '1.1 mi', special: '🏈 All Pitt games', isFanBar: true, teamAffiliation: 'Pittsburgh Panthers', image: '🎓', gradient: 'from-navy-600 to-gold-500', address: '567 2nd Ave, New York, NY 10016', description: 'Pitt watch party headquarters. Named after Pittsburgh\'s Oakland neighborhood where the university is located.', ownerStory: 'Run by a group of Pitt alumni who wanted to recreate the Oakland experience in NYC.', gameDaySpecials: ['$4 Miller Lite during Pitt games', 'Show student ID - 20% off food', 'Wear Pitt cap/jersey - free appetizer', '$18 Primanti sandwich + draft beer', 'Free shot for the bar when Pitt scores'], photos: ['Oakland neighborhood tribute', 'Pitt gear collection', 'Watch party crowd', 'Primanti sandwich special'] }
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
        { id: 'g7', opponent: 'vs Heat', date: 'Tonight', time: '7:30 PM EST', network: 'MSG', barsCount: 28, fanBarsCount: 4 },
        { id: 'g8', opponent: '@ Celtics', date: 'Dec 8', time: '7:00 PM EST', network: 'TNT', barsCount: 22, fanBarsCount: 4 },
        { id: 'g9', opponent: 'vs Lakers', date: 'Dec 12', time: '8:00 PM EST', network: 'ESPN', barsCount: 35, fanBarsCount: 4 }
      ],
      fanBars: [],
      description: 'New York Knicks - Eastern Conference'
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
      { id: 51, title: 'Late Night Jam Session', bar: 'Blue Note Bar', rating: 4.7, reviews: 145, distance: '0.5 mi', special: '🎵 Open to musicians', image: '🎹', gradient: 'from-purple-500 to-blue-600', category: 'music', time: 'Friday • 11:30 PM', address: '131 W 3rd St, New York, NY 10012', description: 'After-hours jam session where local musicians come together for improvised performances.', barDescription: 'Legendary jazz club featuring live music every night since 1981. Intimate atmosphere with excellent acoustics.' }
    ],
    trivia: [
      { id: 14, title: '90s Pop Culture Trivia', bar: 'Trivia Central', rating: 4.7, reviews: 180, distance: '0.4 mi', special: '🏆 $100 bar tab prize', image: '📺', gradient: 'from-purple-500 to-blue-600', category: 'trivia', time: 'Tuesday • 7:30 PM', address: '321 2nd Ave, New York, NY 10003', description: 'Test your knowledge of 90s TV, movies, music, and more! Teams of up to 6 players.', barDescription: 'Trivia headquarters with weekly themed nights and great prizes.' },
      { id: 15, title: 'General Knowledge Night', bar: 'The Think Tank', rating: 4.4, reviews: 92, distance: '0.8 mi', special: '🧠 Teams of 4-6', image: '💡', gradient: 'from-yellow-500 to-orange-600', category: 'trivia', time: 'Wednesday • 8:00 PM', address: '444 Park Ave S, New York, NY 10016', description: 'Classic trivia covering history, science, sports, and current events.', barDescription: 'Craft beer bar with a smart, competitive trivia crowd.' },
      { id: 16, title: 'Sports Trivia', bar: 'All-Star Bar', rating: 4.5, reviews: 110, distance: '1.0 mi', special: '⚾ Free wings for winners', image: '🏀', gradient: 'from-blue-500 to-green-600', category: 'trivia', time: 'Monday • 7:00 PM', address: '777 Lexington Ave, New York, NY 10065', description: 'All sports, all eras. From baseball to basketball to hockey and more.', barDescription: 'Sports-themed bar with memorabilia covering every wall.' }
    ],
    happy: [
      { id: 21, title: '2-for-1 Craft Beers', bar: 'Hop House', rating: 4.6, reviews: 156, distance: '0.6 mi', special: '🍺 4-7 PM daily', image: '🍻', gradient: 'from-amber-500 to-orange-600', category: 'happy', time: 'Daily • 4:00 PM - 7:00 PM', address: '999 Amsterdam Ave, New York, NY 10025', description: 'Two-for-one on all draft craft beers during happy hour.', barDescription: 'Craft beer haven with 24 rotating taps and knowledgeable staff.' },
      { id: 22, title: 'Half-Price Cocktails', bar: 'Mixology Lounge', rating: 4.8, reviews: 210, distance: '0.3 mi', special: '🍸 5-8 PM', image: '🍹', gradient: 'from-pink-500 to-purple-600', category: 'happy', time: 'Mon-Fri • 5:00 PM - 8:00 PM', address: '111 Madison Ave, New York, NY 10016', description: 'All classic and signature cocktails half price during extended happy hour.', barDescription: 'Upscale cocktail lounge with craft cocktails and elegant ambiance.' },
      { id: 23, title: '$5 Wine Wednesdays', bar: 'Vino Bar', rating: 4.4, reviews: 88, distance: '1.2 mi', special: '🍷 All wines $5', image: '🍷', gradient: 'from-red-500 to-purple-600', category: 'happy', time: 'Wednesday • All Day', address: '222 E 14th St, New York, NY 10003', description: 'Every wine by the glass just $5 all day Wednesday.', barDescription: 'Wine bar featuring an extensive international wine list and small plates.' }
    ],
    sports: [
      { id: 28, title: 'Monday Night Football', bar: 'Gridiron Bar', rating: 4.6, reviews: 178, distance: '0.5 mi', special: '🏈 Wing specials', image: '🏈', gradient: 'from-green-600 to-blue-600', category: 'sports', time: 'Monday • 8:00 PM', address: '333 W 42nd St, New York, NY 10036', description: 'Watch MNF on our massive screens with game-day specials.', barDescription: 'Football-focused sports bar with game-day atmosphere every Monday.' },
      { id: 29, title: 'NBA Games All Day', bar: 'Hoops Central', rating: 4.7, reviews: 156, distance: '0.7 mi', special: '🏀 20+ screens', image: '🏀', gradient: 'from-orange-500 to-red-600', category: 'sports', time: 'Today • 1:00 PM onwards', address: '888 8th Ave, New York, NY 10019', description: 'All NBA games all day long on 20+ HD screens.', barDescription: 'Basketball fans paradise with multiple games shown simultaneously.' }
    ],
    events: [
      { id: 33, title: 'Whiskey Tasting', bar: 'The Barrel Room', rating: 4.9, reviews: 75, distance: '0.7 mi', special: '🥃 Rare releases', image: '🥃', gradient: 'from-amber-600 to-orange-700', category: 'events', time: 'Thursday • 7:00 PM', address: '555 Hudson St, New York, NY 10014', description: 'Guided tasting of 5 premium whiskeys including rare Japanese releases. Limited to 20 guests.', barDescription: 'Whiskey bar with 200+ bottles and intimate tasting room.' },
      { id: 34, title: 'Brewery Takeover', bar: 'Craft Corner', rating: 4.7, reviews: 95, distance: '1.1 mi', special: '🍺 Limited releases', image: '🍺', gradient: 'from-green-500 to-blue-600', category: 'events', time: 'Friday • 6:00 PM', address: '123 Spring St, New York, NY 10012', description: 'Brooklyn Brewery taking over all our taps with limited releases and rarities.', barDescription: 'Craft beer bar specializing in local breweries and hard-to-find beers.' }
    ],
    comedy: [
      { id: 39, title: 'Stand-Up Comedy Night', bar: 'Laugh Factory', rating: 4.8, reviews: 198, distance: '0.6 mi', special: '😂 5 comedians', image: '🎤', gradient: 'from-yellow-500 to-orange-600', category: 'comedy', time: 'Friday • 8:00 PM', address: '369 W 46th St, New York, NY 10036', description: 'Five up-and-coming comedians plus a surprise headliner. Full bar and food menu available.', barDescription: 'Comedy club and bar featuring stand-up shows 5 nights a week.' },
      { id: 40, title: 'Open Mic Comedy', bar: 'The Chuckle Hut', rating: 4.5, reviews: 124, distance: '0.9 mi', special: '🎭 Sign up at 7', image: '🎭', gradient: 'from-purple-500 to-pink-600', category: 'comedy', time: 'Wednesday • 7:30 PM', address: '777 9th Ave, New York, NY 10019', description: 'Open mic for comedians of all levels. Supportive crowd and full bar.', barDescription: 'Intimate comedy venue with a welcoming atmosphere for new talent.' }
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
    // Special handling for sports - go to sports tab instead of filtering
    if (filterId === 'sports') {
      setCurrentPage('sports');
      return;
    }
    
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

    const fanBarsList = barsShowingGame.filter(bar => selectedTeam.fanBars?.includes(bar.id));
    const regularBarsList = barsShowingGame.filter(bar => !selectedTeam.fanBars?.includes(bar.id)).slice(0, 5);

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
              margin: 0
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>{selectedTeam.icon}</span>
              {selectedTeam.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
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

          {/* Featured Games */}
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
                🏆 Featured Games
              </h2>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingBottom: '6px',
              scrollbarWidth: 'thin'
            }}>
              {sportsData.featured.map(game => (
                <div
                  key={game.id}
                  onClick={() => {
                    setSelectedGame(game);
                    setCurrentPage('game-detail');
                  }}
                  style={{
                    backgroundColor: '#151B3F',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '260px',
                    maxWidth: '260px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    border: game.isLocal ? '2px solid #5B8EFF' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '56px',
                    position: 'relative'
                  }}
                  className={`bg-gradient-to-br ${game.gradient}`}>
                    {game.image}
                    {game.isLocal && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#5B8EFF',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#FFFFFF'
                      }}>
                        LOCAL
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {game.title}
                    </div>
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '13px',
                      marginBottom: '8px'
                    }}>
                      {game.time}
                    </div>
                    <div style={{
                      color: '#5B8EFF',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      👀 {game.barsCount} bars showing
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  <span style={{ fontSize: '40px' }}>{sport.icon}</span>
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
              margin: 0
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>{selectedSport.icon}</span>
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
              <span style={{ fontSize: '32px' }}>{org.icon}</span>
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
        { id: 't2', name: 'Philadelphia Eagles', icon: '🦅', conference: 'NFC East' },
        { id: 't3', name: 'New York Giants', icon: '🗽', conference: 'NFC East' },
        { id: 't4', name: 'Kansas City Chiefs', icon: '🏈', conference: 'AFC West' }
      ],
      'ncaa-football': [
        { id: 'pittsburgh-panthers', name: 'Pittsburgh Panthers', icon: '🐾', conference: 'ACC' },
        { id: 't6', name: 'Alabama Crimson Tide', icon: '🔴', conference: 'SEC' },
        { id: 't7', name: 'Ohio State Buckeyes', icon: '🌰', conference: 'Big Ten' }
      ],
      'nba': [
        { id: 'new-york-knicks', name: 'New York Knicks', icon: '🗽', conference: 'Eastern' },
        { id: 't9', name: 'Brooklyn Nets', icon: '🏙️', conference: 'Eastern' },
        { id: 't10', name: 'Los Angeles Lakers', icon: '💜', conference: 'Western' }
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
              margin: 0
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>{selectedOrganization.icon}</span>
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
                <span style={{ fontSize: '28px' }}>{team.icon}</span>
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

  const HomePage = () => (
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
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ff4444',
                borderRadius: '50%'
              }} />
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
              <Heart size={18} color="#FFFFFF" />
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <button 
            onClick={handleSearchClick}
            style={{
              backgroundColor: '#151B3F',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
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
            <Search size={18} color="#9CA3B8" />
            Search bars & events...
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
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
                padding: '10px 16px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 'fit-content'
              }}
            >
              <span style={{ fontSize: '20px' }}>{filter.icon}</span>
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

      <div style={{ paddingTop: '20px' }}>
        <CarouselSection title="🏆 Featured Tonight" events={allEvents.featured} />
        <CarouselSection title="🎤 Live Music Near You" events={allEvents.music} />
        <CarouselSection title="🧠 Trivia Nights" events={allEvents.trivia} />
        <CarouselSection title="🍺 Happy Hours" events={allEvents.happy} />
        <CarouselSection title="📺 Sports Viewing" events={allEvents.sports} />
        <CarouselSection title="🎉 Other Events" events={allEvents.events} />
        <CarouselSection title="🎭 Comedy Shows" events={allEvents.comedy} />
      </div>
    </>
  );

  const FilterPage = () => {
    const filteredEvents = getFilteredEvents();
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
            {filteredEvents.length} events near you
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} isVertical={true} />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3B8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>
                No events found
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