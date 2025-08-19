import { useState, useEffect } from 'react';

interface LocationSelectorProps {
  onSearch: (location: string) => void;
  onBackgroundSearch: (location: string) => void;
  loading: boolean;
}


const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];


const MAJOR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
  'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior',
  'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati',
  'Chandigarh', 'Solapur', 'Hubballi-Dharwad', 'Tiruchirappalli', 'Bareilly',
  'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar',
  'Salem', 'Mira-Bhayandar', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai',
  'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun',
  'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer',
  'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
  'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore',
  'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
  'Jalgaon', 'Udaipur', 'Maheshtala'
];

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSearch, onBackgroundSearch, loading }) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  
  useEffect(() => {
    const location = selectedState || selectedCity;
    if (location && !loading) {
      
      const backgroundSearchTimeout = setTimeout(() => {
        onBackgroundSearch(location);
      }, 500);

      return () => clearTimeout(backgroundSearchTimeout);
    }
  }, [selectedState, selectedCity, onBackgroundSearch, loading]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity('');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setSelectedState('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = selectedState || selectedCity;
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  return (
    <div className="location-selector">
      <div className="selector-card">
        <h2>🌟 Discover Your Perfect College</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="dual-selector-container">
            <div className="location-input-group">
              <label htmlFor="state-select">
                🗺️ Select State:
              </label>
              <select
                id="state-select"
                value={selectedState}
                onChange={handleStateChange}
                className="location-select"
                disabled={loading}
              >
                <option value="">✨ Choose your State ✨</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    📍 {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="divider">
              <span>💫 OR 💫</span>
            </div>

            <div className="location-input-group">
              <label htmlFor="city-select">
                🏙️ Select City:
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={handleCityChange}
                className="location-select"
                disabled={loading}
              >
                <option value="">✨ Choose your City ✨</option>
                {MAJOR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!selectedState && !selectedCity)}
            className={`search-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                🔍 Discovering Premium Colleges...
              </>
            ) : (
              <>
                🚀 Discover Elite Colleges
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationSelector;
