import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MapPin, User, Bell, Star, Heart, Search, X } from 'lucide-react';
import espnAPI from './espn-api-service.js';

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

  const getTeamLogoUrl = (teamId) => {
    const normalized = teamId?.toLowerCase() || '';
    const logoMap = {
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
      'knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
      'new york knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
      'nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
      'brooklyn nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
      'lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      'los angeles lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      'heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      'miami heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      'yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
      'new york yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
      'mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
      'new york mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
      'red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
      'boston red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
      'rangers': 'https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png',
      'new york rangers': 'https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png',
      'manchester united': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
      'manchester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
      'liverpool': 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
      'arsenal': 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      'chelsea': 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
      'pittsburgh panthers': 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png',
      'alabama crimson tide': 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png',
      'ohio state buckeyes': 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png'
    };
    return logoMap[normalized] || null;
  };

  const getLeagueLogo = (leagueId) => {
    const leagueLogos = {
      'nfl': 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
      'nba': 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
      'mlb': 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
      'nhl': 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
      'mls': 'https://a.espncdn.com/i/teamlogos/leagues/500/mls.png',
      'ncaa-football': 'https://a.espncdn.com/i/teamlogos/leagues/500/ncaa.png',
      'ncaa-basketball': 'https://a.espncdn.com/i/teamlogos/leagues/500/ncaa.png',
      'premier-league': 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
      'champions-league': 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg',
      'la-liga': 'https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga_2023_Vertical_Logo.svg',
      'serie-a': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Serie_A_logo_2022.svg',
      'bundesliga': 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg'
    };
    return leagueLogos[leagueId?.toLowerCase()] || null;
  };

  const [sportsData, setSportsData] = useState({
    featured: [],
    nfl: [],
    nba: [],
    nhl: [],
    collegeFootball: [],
    soccer: [],
    collegeBasketball: [],
    sports: [
      { id: 'nfl', name: 'NFL', icon: '🏈', gamesCount: 0, gradient: 'from-green-600 to-blue-600' },
      { id: 'nba', name: 'NBA', icon: '🏀', gamesCount: 0, gradient: 'from-orange-500 to-red-600' },
      { id: 'nhl', name: 'NHL', icon: '🏒', gamesCount: 0, gradient: 'from-blue-500 to-cyan-600' },
      { id: 'mlb', name: 'MLB', icon: '⚾', gamesCount: 0, gradient: 'from-red-500 to-blue-600' },
      { id: 'soccer', name: 'Soccer', icon: '⚽', gamesCount: 0, gradient: 'from-green-500 to-blue-500' },
      { id: 'ufc', name: 'UFC/MMA', icon: '🥊', gamesCount: 0, gradient: 'from-red-600 to-black' },
      { id: 'other', name: 'Other Sports', icon: '🏆', gamesCount: 0, gradient: 'from-purple-500 to-pink-500' }
    ],
    myTeams: [
      { id: 'pitt', name: 'Pittsburgh Panthers', sport: 'NCAA Football', icon: '🏈', nextGame: 'Dec 10 vs Duke', fanBarsCount: 2 },
      { id: 'knicks', name: 'New York Knicks', sport: 'NBA', icon: '🏀', nextGame: 'Tonight vs Heat', fanBarsCount: 4 }
    ]
  });

  const [loadingGames, setLoadingGames] = useState(false);

useEffect(() => {
    async function loadESPNGames() {
      setLoadingGames(true);
      try {
        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);
        const fourteenDaysFromNow = new Date();
        fourteenDaysFromNow.setDate(now.getDate() + 14);
        
        // Get games for next 2 days (priority) and next 14 days (backup)
        const priorityGames = await espnAPI.getGamesByDateRange(now, twoDaysFromNow);
        const extendedGames = await espnAPI.getGamesByDateRange(twoDaysFromNow, fourteenDaysFromNow);
        
        console.log('Priority Games (next 2 days):', priorityGames.length);
        console.log('Extended Games (2-14 days):', extendedGames.length);
        
        const allGames = [...priorityGames, ...extendedGames];
        
        // NY Teams
        const nyTeams = [
          'knicks', 'new york knicks', 'nets', 'brooklyn nets',
          'giants', 'new york giants', 'jets', 'new york jets',
          'yankees', 'new york yankees', 'mets', 'new york mets',
          'rangers', 'new york rangers', 'islanders', 'new york islanders',
          'bills', 'buffalo bills'
        ];
        
        // Flagged Soccer Teams
        const flaggedSoccerTeams = [
          'manchester united', 'manchester city', 'chelsea', 'arsenal',
          'barcelona', 'liverpool', 'real madrid', 'tottenham',
          'newcastle', 'aston villa'
        ];
        
        const rivalries = [
          ['yankees', 'red sox'], ['mets', 'phillies'],
          ['giants', 'cowboys'], ['giants', 'eagles'],
          ['jets', 'patriots'], ['knicks', 'celtics'],
          ['knicks', 'heat'], ['rangers', 'devils'],
          ['rangers', 'islanders']
        ];
        
        const isNYTeam = (teamName) => {
          const normalized = teamName?.toLowerCase() || '';
          return nyTeams.some(nyTeam => normalized.includes(nyTeam));
        };
        
        const isFlaggedSoccerTeam = (teamName) => {
          const normalized = teamName?.toLowerCase() || '';
          return flaggedSoccerTeams.some(flaggedTeam => normalized.includes(flaggedTeam));
        };
        
        const isRivalryGame = (game) => {
          const home = game.homeTeam?.name?.toLowerCase() || '';
          const away = game.awayTeam?.name?.toLowerCase() || '';
          return rivalries.some(([team1, team2]) => {
            return (home.includes(team1) && away.includes(team2)) ||
                   (home.includes(team2) && away.includes(team1));
          });
        };
        
        const isPlayoffGame = (game) => {
          const name = game.name?.toLowerCase() || '';
          const status = game.statusDetail?.toLowerCase() || '';
          return name.includes('playoff') || 
                 name.includes('wild card') || 
                 name.includes('divisional') ||
                 name.includes('championship') ||
                 name.includes('finals') ||
                 name.includes('conference') ||
                 status.includes('playoff');
        };
        
        const getSoccerLeaguePriority = (game) => {
          const league = game.league?.toLowerCase() || '';
          if (league.includes('premier') || league.includes('epl')) return 1000;
          if (league.includes('champions')) return 900;
          if (league.includes('la liga') || league.includes('laliga')) return 800;
          if (league.includes('mls')) return 700;
          if (league.includes('serie a')) return 600;
          if (league.includes('bundesliga')) return 500;
          if (league.includes('liga mx') || league.includes('ligamx')) return 400;
          return 0;
        };
        
        const transformGame = (game) => ({
          id: game.id,
          title: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
          sport: game.sport,
          teams: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
          homeTeam: game.homeTeam.name,
          awayTeam: game.awayTeam.name,
          homeTeamLogo: game.homeTeam.logo,
          awayTeamLogo: game.awayTeam.logo,
          time: `${game.date} • ${game.time}`,
          network: game.network,
          image: game.sportKey === 'nfl' ? '🏈' : 
                 game.sportKey === 'nba' ? '🏀' : 
                 game.sportKey === 'mlb' ? '⚾' : 
                 game.sportKey === 'nhl' ? '🏒' :
                 game.sportKey === 'ufc' ? '🥊' : '⚽',
          gradient: game.sportKey === 'nfl' ? 'from-blue-700 to-red-600' : 
                    game.sportKey === 'nba' ? 'from-orange-500 to-red-600' :
                    game.sportKey === 'nhl' ? 'from-blue-500 to-cyan-600' :
                    game.sportKey === 'ufc' ? 'from-red-600 to-black' :
                    'from-green-600 to-blue-600',
          barsCount: 15,
          isLocal: isNYTeam(game.homeTeam?.name) || isNYTeam(game.awayTeam?.name),
          fullDate: game.fullDate,
          isPriority: priorityGames.some(pg => pg.id === game.id)
        });
        
        // Score all games
        const scoredGames = allGames.map(game => {
          let score = 0;
          const hasNYTeam = isNYTeam(game.homeTeam?.name) || isNYTeam(game.awayTeam?.name);
          const isPlayoff = isPlayoffGame(game);
          const isRivalry = isRivalryGame(game);
          const isPPV = game.sportKey === 'ufc';
          const isInNext2Days = priorityGames.some(pg => pg.id === game.id);
          
          // Featured Events scoring (for all sports)
          if (isPlayoff && hasNYTeam) score += 10000;
          else if (isPlayoff) score += 9000;
          else if (hasNYTeam) score += 8000;
          if (isPPV) score += 7000;
          if (isRivalry) score += 6000;
          
          // Soccer-specific scoring
          if (game.sportKey === 'soccer') {
            const hasFlaggedTeam = isFlaggedSoccerTeam(game.homeTeam?.name) || isFlaggedSoccerTeam(game.awayTeam?.name);
            const leaguePriority = getSoccerLeaguePriority(game);
            
            if (hasFlaggedTeam) score += 5000;
            score += leaguePriority;
          }
          
          // Time proximity bonus
          if (isInNext2Days) {
            const gameTime = new Date(game.fullDate);
            const hoursUntilGame = (gameTime - now) / (1000 * 60 * 60);
            score += Math.max(0, 100 - hoursUntilGame);
          }
          
          return { ...game, priorityScore: score };
        });
        
        // Sort by priority score
        scoredGames.sort((a, b) => b.priorityScore - a.priorityScore);
        
        // Separate by sport
        const nflGames = scoredGames.filter(g => g.sportKey === 'nfl');
        const nbaGames = scoredGames.filter(g => g.sportKey === 'nba');
        const nhlGames = scoredGames.filter(g => g.sportKey === 'nhl');
        const mlbGames = scoredGames.filter(g => g.sportKey === 'mlb');
        const soccerGames = scoredGames.filter(g => g.sportKey === 'soccer');
        const collegeFootballGames = scoredGames.filter(g => g.sportKey === 'college-football');
        const collegeBasketballGames = scoredGames.filter(g => g.sportKey === 'mens-college-basketball');
        
        console.log('Prioritized Featured Games:', scoredGames.slice(0, 5).map(g => ({
          name: g.name,
          score: g.priorityScore,
          sport: g.sport,
          isPriority: g.isPriority
        })));
        
        console.log('Soccer Games:', soccerGames.slice(0, 5).map(g => ({
          name: g.name,
          score: g.priorityScore,
          league: g.league
        })));
        
        setSportsData(prev => ({
          ...prev,
          featured: scoredGames.slice(0, 3).map(transformGame),
          nfl: nflGames.map(transformGame),
          nba: nbaGames.map(transformGame),
          nhl: nhlGames.map(transformGame),
          mlb: mlbGames.map(transformGame),
          soccer: soccerGames.map(transformGame),
          collegeFootball: collegeFootballGames.map(transformGame),
          collegeBasketball: collegeBasketballGames.map(transformGame)
        }));
        
      } catch (error) {
        console.error('Error loading ESPN games:', error);
      } finally {
        setLoadingGames(false);
      }
    }
    
    loadESPNGames();
  }, []);

  const allBarsData = [
    { id: 'b1', name: "Murphy's Bar", rating: 4.5, reviews: 120, distance: '0.3 mi', special: '🍺 $5 wings', isFanBar: true, teamAffiliation: 'Cowboys', image: '🏈', gradient: 'from-blue-500 to-gray-600' },
    { id: 'b2', name: "Philly's Tavern", rating: 4.7, reviews: 98, distance: '0.5 mi', special: '🍺 Eagles specials', isFanBar: true, teamAffiliation: 'Eagles', image: '🦅', gradient: 'from-green-600 to-gray-700' },
    { id: 'b3', name: "Jack's Sports Bar", rating: 4.3, reviews: 156, distance: '0.7 mi', special: '📺 20+ screens', isFanBar: false, image: '📺', gradient: 'from-gray-600 to-gray-800' }
  ];

  const teamDetailData = {
    'pittsburgh-panthers': {
      name: 'Pittsburgh Panthers',
      sport: 'NCAA Football',
      icon: '🐾',
      upcomingGames: [
        { id: 'g1', opponent: 'vs Duke', date: 'Dec 10', time: '3:30 PM EST', network: 'ESPN', barsCount: 5, fanBarsCount: 2 }
      ],
      fanBars: ['b6', 'b7'],
      description: 'Pittsburgh Panthers football - ACC conference'
    },
    'new-york-knicks': {
      name: 'New York Knicks',
      sport: 'NBA',
      icon: '🗽',
      upcomingGames: [
        { id: 'g7', opponent: 'vs Heat', date: 'Tonight', time: '7:30 PM EST', network: 'MSG', barsCount: 28, fanBarsCount: 3 }
      ],
      fanBars: ['b14', 'b36', 'b37'],
      description: 'New York Knicks - Eastern Conference'
    }
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
    const sportFilters = ['nfl', 'nba', 'mlb', 'nhl', 'soccer', 'college'];
    if (sportFilters.includes(filterId)) {
      setActiveFilter(filterId);
      setCurrentPage('filter');
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

  const getSportGames = () => {
    if (!activeFilter) return [];
    const sportMapping = {
      'nfl': sportsData.nfl || [],
      'nba': sportsData.nba || [],
      'mlb': sportsData.mlb || [],
      'nhl': sportsData.nhl || [],
      'soccer': sportsData.soccer || [],
      'college': [...(sportsData.collegeFootball || []), ...(sportsData.collegeBasketball || [])]
    };
    return sportMapping[activeFilter] || [];
  };

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
      <div style={{
        background: `linear-gradient(135deg, #1a2a5e, #0f1829)`,
        width: '100%',
        height: '150px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {game.time?.includes('Today') || game.time?.includes('Tonight') ? (
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

        {game.homeTeamLogo && game.awayTeamLogo ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px'
          }}>
            <img 
              src={game.awayTeamLogo}
              alt={game.awayTeam}
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
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
              src={game.homeTeamLogo}
              alt={game.homeTeam}
              style={{
                width: '55px',
                height: '55px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ) : game.homeTeam && game.awayTeam && (getTeamLogoUrl(game.homeTeam) || getTeamLogoUrl(game.awayTeam)) ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px'
          }}>
            {getTeamLogoUrl(game.awayTeam) && (
              <img 
                src={getTeamLogoUrl(game.awayTeam)}
                alt={game.awayTeam}
                style={{
                  width: '55px',
                  height: '55px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span style={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '20px', 
              fontWeight: '800',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)'
            }}>
              VS
            </span>
            {getTeamLogoUrl(game.homeTeam) && (
              <img 
                src={getTeamLogoUrl(game.homeTeam)}
                alt={game.homeTeam}
                style={{
                  width: '55px',
                  height: '55px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        ) : (
          <div style={{ fontSize: '48px' }}>{game.image || '🏟️'}</div>
        )}

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
        }} />
      </div>

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

  const SportCarousel = ({ title, games, emoji, sportKey }) => {
    if (!games || games.length === 0) return null;
    const leagueLogo = getLeagueLogo(sportKey);
    
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
            {leagueLogo ? (
              <img 
                src={leagueLogo} 
                alt={title}
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain'
                }}
                onError={(e) => { 
                  e.target.style.display = 'none';
                }}
              />
            ) : emoji && <span>{emoji}</span>}
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

      <div style={{ paddingTop: '20px', paddingBottom: '80px' }}>
  {loadingGames ? (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3B8' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <div style={{ fontSize: '18px' }}>Loading games...</div>
    </div>
  ) : (
    <>
      <SportCarousel title="Featured Events" emoji="⭐" games={sportsData.featured} />
      
      {/* Dynamic ordering: Sports with games in next 2 days first, then others */}
      {(() => {
        const sportOrder = [
          { key: 'nfl', title: 'NFL', sportKey: 'nfl', games: sportsData.nfl },
          { key: 'nba', title: 'NBA', sportKey: 'nba', games: sportsData.nba },
          { key: 'nhl', title: 'NHL', sportKey: 'nhl', games: sportsData.nhl },
          { key: 'cfb', title: 'College Football', sportKey: 'ncaa-football', games: sportsData.collegeFootball },
          { key: 'soccer', title: 'Soccer', emoji: '⚽', games: sportsData.soccer },
          { key: 'cbb', title: 'College Basketball', sportKey: 'ncaa-basketball', games: sportsData.collegeBasketball }
        ];
        
        // Separate sports with priority games vs extended games
        const sportsWithPriorityGames = sportOrder.filter(sport => 
          sport.games?.some(game => game.isPriority)
        );
        const sportsWithOnlyExtendedGames = sportOrder.filter(sport => 
          sport.games?.length > 0 && !sport.games.some(game => game.isPriority)
        );
        
        return (
          <>
            {sportsWithPriorityGames.map(sport => (
              <SportCarousel 
                key={sport.key}
                title={sport.title}
                emoji={sport.emoji}
                sportKey={sport.sportKey}
                games={sport.games}
              />
            ))}
            {sportsWithOnlyExtendedGames.map(sport => (
              <SportCarousel 
                key={sport.key}
                title={sport.title}
                emoji={sport.emoji}
                sportKey={sport.sportKey}
                games={sport.games}
              />
            ))}
          </>
        );
      })()}
    </>
  )}
</div>
      
    </>
  );

  const FilterPage = () => {
    const sportFilters = ['nfl', 'nba', 'mlb', 'nhl', 'soccer', 'college'];
    const isSportFilter = sportFilters.includes(activeFilter);
    
    const games = isSportFilter ? getSportGames() : [];
    const items = games;
    
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
            {items.length} games near you
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          {items.length > 0 ? (
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
                <div style={{
                  background: `linear-gradient(135deg, #1a2a5e, #0f1829)`,
                  width: '100%',
                  height: '160px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {game.time?.includes('Today') || game.time?.includes('Tonight') ? (
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

                  {game.homeTeamLogo && game.awayTeamLogo ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px'
                    }}>
                      <img 
                        src={game.awayTeamLogo} 
                        alt={game.awayTeam}
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
                        src={game.homeTeamLogo} 
                        alt={game.homeTeam}
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

                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                  }} />
                </div>

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
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3B8'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FFFFFF' }}>
                No games found
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const SearchPage = () => (
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
      </div>
    </>
  );

  const GameDetailPage = () => {
    if (!selectedGame) return null;

    const getBarsForGame = () => {
      return allBarsData.slice(0, 8);
    };

    const barsShowingGame = getBarsForGame();

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
                setCurrentPage('home');
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
            {selectedGame.awayTeamLogo && selectedGame.homeTeamLogo ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}>
                <img 
                  src={selectedGame.awayTeamLogo} 
                  alt={selectedGame.awayTeam}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain'
                  }}
                />
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '28px',
                  fontWeight: '800'
                }}>
                  VS
                </span>
                <img 
                  src={selectedGame.homeTeamLogo} 
                  alt={selectedGame.homeTeam}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            ) : (
              <div style={{ fontSize: '64px' }}>{selectedGame.image}</div>
            )}

            <div style={{ textAlign: 'center' }}>
              <div style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {selectedGame.teams}
              </div>
              <div style={{
                color: '#9CA3B8',
                fontSize: '15px',
                marginBottom: '8px'
              }}>
                {selectedGame.time}
              </div>
              {selectedGame.network && (
                <div style={{
                  color: '#FBBF24',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📺 {selectedGame.network}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📺</span>
              Bars Showing This Game ({barsShowingGame.length})
            </h3>
            <p style={{
              color: '#9CA3B8',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Find the perfect spot to watch
            </p>

            {barsShowingGame.map(bar => (
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
      </>
    );
  };

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
          </div>
        </div>

        <div style={{ paddingTop: '20px' }}>
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

const SportsSearchPage = () => (
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, games..."
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
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Browse All Sports
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          {sportsData.sports.map(sport => (
            <button
              key={sport.id}
              onClick={() => {
                setSelectedSportFromAZ(sport.id);
                setCurrentPage('sport-az');
              }}
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
              <span style={{ fontSize: '32px' }}>{sport.icon}</span>
              <span style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {sport.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const SportGamesPage = () => {
    if (!selectedSport) return null;

    const games = getSportGames();

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
              <span style={{ fontSize: '24px', marginRight: '8px' }}>{selectedSport.icon}</span>
              {selectedSport.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              color: '#9CA3B8',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {games.length} games available
            </div>
            {games.map(game => (
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
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  background: `linear-gradient(135deg, #1a2a5e, #0f1829)`,
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {game.homeTeamLogo && game.awayTeamLogo ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <img src={game.awayTeamLogo} alt={game.awayTeam} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                      <span style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '800' }}>VS</span>
                      <img src={game.homeTeamLogo} alt={game.homeTeam} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize: '48px' }}>{game.image}</div>
                  )}
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '6px', margin: 0 }}>
                    {game.title}
                  </h3>
                  <div style={{ color: '#9CA3B8', fontSize: '13px', marginBottom: '8px' }}>
                    {game.time}
                    {game.network && <> • <span style={{ color: '#FBBF24' }}>{game.network}</span></>}
                  </div>
                  <div style={{ color: '#5B8EFF', fontSize: '14px', fontWeight: '600' }}>
                    {game.barsCount} bars
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const SportAZPage = () => {
    const organizations = [
      { id: 'nfl', name: 'NFL', icon: '🏈', teamsCount: 32 },
      { id: 'nba', name: 'NBA', icon: '🏀', teamsCount: 30 },
      { id: 'mlb', name: 'MLB', icon: '⚾', teamsCount: 30 },
      { id: 'nhl', name: 'NHL', icon: '🏒', teamsCount: 32 },
      { id: 'premier-league', name: 'Premier League', icon: '⚽', teamsCount: 20 },
      { id: 'ncaa-football', name: 'NCAA Football', icon: '🏈', teamsCount: 130 },
      { id: 'ncaa-basketball', name: 'NCAA Basketball', icon: '🏀', teamsCount: 350 }
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
              onClick={() => setCurrentPage('sports-search')}
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
              Select Organization
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {organizations.map(org => (
            <button
              key={org.id}
              onClick={() => {
                setSelectedOrganization(org);
                setCurrentPage('organization-teams');
              }}
              style={{
                width: '100%',
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '36px' }}>{org.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>
                  {org.name}
                </div>
                <div style={{ color: '#9CA3B8', fontSize: '13px' }}>
                  {org.teamsCount} teams
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

    const teams = [
      { id: 'team1', name: 'New York Giants', logo: '🏈', nextGame: 'Sunday vs Cowboys' },
      { id: 'team2', name: 'New York Jets', logo: '✈️', nextGame: 'Monday vs Patriots' },
      { id: 'team3', name: 'Buffalo Bills', logo: '🦬', nextGame: 'Sunday vs Dolphins' }
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
              onClick={() => setCurrentPage('sport-az')}
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
              <span style={{ fontSize: '24px', marginRight: '8px' }}>{selectedOrganization.icon}</span>
              {selectedOrganization.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => {
                setSelectedTeam(team);
                setCurrentPage('team-detail');
              }}
              style={{
                width: '100%',
                backgroundColor: '#151B3F',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '36px' }}>{team.logo}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>
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
      </>
    );
  };

  const TeamDetailPage = () => {
    if (!selectedTeam) return null;

    const upcomingGames = [
      { id: 'g1', opponent: 'vs Cowboys', date: 'Sunday, Dec 10', time: '4:25 PM EST', network: 'FOX', barsCount: 28 },
      { id: 'g2', opponent: '@ Packers', date: 'Monday, Dec 18', time: '8:15 PM EST', network: 'ESPN', barsCount: 24 }
    ];

    const fanBars = [
      { id: 'fb1', name: "Giant's Den", distance: '0.4 mi', rating: 4.7, isOfficial: true },
      { id: 'fb2', name: "Blue & Red Tavern", distance: '0.8 mi', rating: 4.5, isOfficial: false }
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
              onClick={() => setCurrentPage('organization-teams')}
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
              <span style={{ fontSize: '24px', marginRight: '8px' }}>{selectedTeam.logo}</span>
              {selectedTeam.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          <div style={{
            backgroundColor: '#151B3F',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>
              {selectedTeam.logo}
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              {selectedTeam.name}
            </div>
            <div style={{ color: '#9CA3B8', fontSize: '14px' }}>
              Next: {selectedTeam.nextGame}
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📅</span>
              Upcoming Games
            </h3>
            {upcomingGames.map(game => (
              <button
                key={game.id}
                style={{
                  width: '100%',
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
                  {game.opponent}
                </div>
                <div style={{ color: '#9CA3B8', fontSize: '13px', marginBottom: '8px' }}>
                  {game.date} • {game.time}
                  {game.network && <> • <span style={{ color: '#FBBF24' }}>{game.network}</span></>}
                </div>
                <div style={{ color: '#5B8EFF', fontSize: '14px', fontWeight: '600' }}>
                  {game.barsCount} bars showing
                </div>
              </button>
            ))}
          </div>

          <div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🏆</span>
              Fan Bars ({fanBars.length})
            </h3>
            <p style={{
              color: '#9CA3B8',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Official gathering spots for {selectedTeam.name} fans
            </p>
            {fanBars.map(bar => (
              <button
                key={bar.id}
                onClick={() => {
                  setSelectedBar(bar);
                  setCurrentPage('bar-detail');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#151B3F',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {bar.name}
                      {bar.isOfficial && (
                        <span style={{
                          marginLeft: '8px',
                          backgroundColor: '#5B8EFF',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '10px'
                        }}>
                          OFFICIAL
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: '#9CA3B8',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                        <Star size={12} fill="#FBBF24" />
                        {bar.rating}
                      </span>
                      <span>•</span>
                      <span>{bar.distance}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#9CA3B8" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const BarDetailPage = () => {
    if (!selectedBar) return null;

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
              onClick={() => setCurrentPage('team-detail')}
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
              {selectedBar.name}
            </h1>
          </div>
        </div>

        <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
          <div style={{
            backgroundColor: '#151B3F',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '12px'
            }}>
              {selectedBar.name}
            </div>
            <div style={{
              color: '#9CA3B8',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#FBBF24', display: 'flex', alignItems: 'center' }}>
                <Star size={14} fill="#FBBF24" />
                {selectedBar.rating}
              </span>
              <span>•</span>
              <span>{selectedBar.distance}</span>
            </div>
            <button style={{
              backgroundColor: '#5B8EFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              width: '100%',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Get Directions
            </button>
          </div>

          <div style={{
            backgroundColor: '#151B3F',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Official Fan Bar
            </div>
            <div style={{ color: '#9CA3B8', fontSize: '14px' }}>
              Recognized gathering spot for team fans
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
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'search' && <SearchPage />}
      {currentPage === 'filter' && <FilterPage />}
      {currentPage === 'game-detail' && <GameDetailPage />}
      {currentPage === 'sports' && <SportsLandingPage />}
      {currentPage === 'sports-search' && <SportsSearchPage />}
      {currentPage === 'sport-games' && <SportGamesPage />}
      {currentPage === 'sport-az' && <SportAZPage />}
      {currentPage === 'organization-teams' && <OrganizationTeamsPage />}
      {currentPage === 'team-detail' && <TeamDetailPage />}
      {currentPage === 'bar-detail' && <BarDetailPage />}

      {/* Bottom Navigation */}
      {(currentPage === 'home' || currentPage === 'sports' || currentPage === 'profile') && (
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
            color: currentPage === 'sports' ? '#5B8EFF' : '#9CA3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: currentPage === 'sports' ? '600' : '500'
          }}>
            <span style={{ fontSize: '24px' }}>🏈</span>
            Sports
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: currentPage === 'profile' ? '#5B8EFF' : '#9CA3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: currentPage === 'profile' ? '600' : '500'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            Profile
          </button>
        </div>
      )}
    </div>
  );
}
