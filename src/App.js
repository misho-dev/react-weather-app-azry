import React, { useState } from 'react';
import moment from 'moment';
import './App.css';
const api = {
  WEATHER_API_URL: "https://api.openweathermap.org/data/2.5/",
  WEATHER_API_KEY: "121d16fc909149e88d1dbe13d1323cf5"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});



  //decided not use default location.
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }
  }


  const search = (e) => {
    if (e.key === "Enter") {
      fetch(`${api.WEATHER_API_URL}weather?q=${query}&units=metric&APPID=${api.WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result)
        });
    }
  }

  const DateBuilder = (d) => {
    return `${moment().format('dddd')} ${moment().format('LL')}`
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'App warm' : 'App cold') : 'App'}>
      <main>
        <div className="search-box">
          <input type="text" className="search-bar" placeholder="Search..." onChange={e => setQuery(e.target.value)} value={query} onKeyPress={search} />
        </div>
        {(typeof weather.main != "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{DateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
              </div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className="other-info"><b>Sunrise: </b>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-IN')}</div>
              <div className="other-info"><b>Sunset: </b>{new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-IN')}</div>
              <div className="other-info"><b>Humidity:</b>{weather.main.humidity} %</div>
            </div>
          </div>
        ) : ('')}

      </main>
    </div>
  );
}

export default App;
