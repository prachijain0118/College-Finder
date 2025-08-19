import { useState } from 'react';
import LocationSelector from './components/LocationSelector';
import CollegeResults from './components/CollegeResults';
import { geminiService } from './services/geminiService';
import './App.css';

export interface College {
  name: string;
  address: string;
  contactDetails: {
    phone?: string;
    email?: string;
    website?: string;
  };
  coursesAvailable: string[];
  fees: {
    course: string;
    amount: string;
  }[];
  type: 'IT' | 'Management' | 'Both';
}

function App() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(6);
  const [backgroundCache, setBackgroundCache] = useState<{[key: string]: College[]}>({});

  
  const handleBackgroundSearch = async (location: string) => {
    
    if (backgroundCache[location]) {
      console.log('Background search: using existing cache for', location);
      return;
    }

    try {
      console.log('Background searching for colleges in:', location);
      const response = await geminiService.searchColleges(location);
      
      if (response && response.length > 0) {
        setBackgroundCache(prev => ({
          ...prev,
          [location]: response
        }));
        console.log('✅ Background search completed for', location, '- cached', response.length, 'colleges');
      } else {
        console.log('⚠️ Background search returned no results for', location);
      }
    } catch (err: any) {
      console.log('❌ Background search failed for', location, '- Error:', err.message);
      
    }
  };

  
  const handleSearch = async (location: string) => {
    setLoading(true);
    setError('');
    setSearchLocation(location);
    setDisplayCount(6);
    
    try {
      
      if (backgroundCache[location]) {
        console.log('Using cached results for', location);
        setColleges(backgroundCache[location]);
        setLoading(false);
        return;
      }

      
      console.log('No cached results, searching for colleges in:', location);
      setColleges([]);
      
      const minLoadingTime = 300;
      const startTime = Date.now();
      
      const searchPromise = geminiService.searchColleges(location);
      
      const [response] = await Promise.all([
        searchPromise,
        new Promise(resolve => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minLoadingTime - elapsed);
          setTimeout(resolve, remaining);
        })
      ]);
      
      if (response && response.length > 0) {
        setColleges(response);
        
        setBackgroundCache(prev => ({
          ...prev,
          [location]: response
        }));
        console.log('Successfully loaded', response.length, 'colleges');
      } else {
        setError(`No colleges found in ${location}. Please try a different location or check the spelling.`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else if (err.message?.includes('timeout')) {
        setError('Search is taking longer than expected. Please try again with a different location.');
      } else {
        setError('Unable to search colleges right now. Please try again in a moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <div className="app">
      
      <div className="bubble-container">
        <div className="bubble tiny" style={{left: '10%', animationDelay: '0s'}}></div>
        <div className="bubble small" style={{left: '20%', animationDelay: '2s'}}></div>
        <div className="bubble medium" style={{left: '30%', animationDelay: '1s'}}></div>
        <div className="bubble large" style={{left: '40%', animationDelay: '3s'}}></div>
        <div className="bubble small" style={{left: '50%', animationDelay: '1.5s'}}></div>
        <div className="bubble xlarge" style={{left: '60%', animationDelay: '4s'}}></div>
        <div className="bubble tiny" style={{left: '70%', animationDelay: '0.5s'}}></div>
        <div className="bubble medium" style={{left: '80%', animationDelay: '2.5s'}}></div>
        <div className="bubble small" style={{left: '90%', animationDelay: '3.5s'}}></div>
        <div className="bubble tiny" style={{left: '15%', animationDelay: '5s'}}></div>
        <div className="bubble large" style={{left: '25%', animationDelay: '6s'}}></div>
        <div className="bubble small" style={{left: '35%', animationDelay: '4.5s'}}></div>
        <div className="bubble medium" style={{left: '45%', animationDelay: '7s'}}></div>
        <div className="bubble tiny" style={{left: '55%', animationDelay: '5.5s'}}></div>
        <div className="bubble xlarge" style={{left: '65%', animationDelay: '8s'}}></div>
        <div className="bubble small" style={{left: '75%', animationDelay: '6.5s'}}></div>
        <div className="bubble medium" style={{left: '85%', animationDelay: '9s'}}></div>
        <div className="bubble tiny" style={{left: '95%', animationDelay: '7.5s'}}></div>
        <div className="bubble large" style={{left: '5%', animationDelay: '10s'}}></div>
        <div className="bubble small" style={{left: '12%', animationDelay: '8.5s'}}></div>
      </div>

      <header className="app-header">
        <h1><span className="emoji">🎓</span> <span className="gradient-text">College Finder India</span></h1>
        <p>✨ Discover Premium IT & Management Colleges Across India ✨</p>
        <p className="creator-text">Made by <span className="animated-name">Prachi Jain</span> 💫</p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Colleges</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Cities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <LocationSelector 
          onSearch={handleSearch} 
          onBackgroundSearch={handleBackgroundSearch}
          loading={loading} 
        />
        
        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {colleges.length > 0 && (
          <CollegeResults 
            colleges={colleges.slice(0, displayCount)} 
            searchLocation={searchLocation}
            totalCount={colleges.length}
            displayCount={displayCount}
            onLoadMore={handleLoadMore}
          />
        )}
      </main>
    </div>
  );
}

export default App;
