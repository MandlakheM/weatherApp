import { useState, useEffect } from "react";
import "./App.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaDroplet } from "react-icons/fa6";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchLocation, fetchWeatherForcast } from "./api/weather";

function App() {
  const [locations, setLocations] = useState();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState({});

  const handleSearch = () => {
    if (search.length > 2) {
      fetchLocation({ cityName: search }).then((data) => {
        console.log("got data", data);
        setResults(data || []);
      });
    } else {
      console.log("Search term must be longer than 3 characters");
    }
  };

  const handleLocation = (city) => {
    console.log("Selected city:", city);
    setResults([]); // Clear the results after selection (optional)
    fetchWeatherForcast({ cityName: city.name, days: "3" }).then((data) => {
      setWeather(data);
      localStorage.setItem('city',city.name )
      console.log("city info", data);
    });
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  function fetchWeatherData() {
    let myCity = localStorage.getItem('city')
    let cityName = "Cape Town"
    if(myCity) cityName=myCity
    fetchWeatherForcast({
      cityName,
      days: "3",
    }).then((data) => {
      setWeather(data);
    });
  }

  const { current, location, forecast } = weather;

  const hourlyTemperatures =
    forecast?.forecastday?.[0]?.hour?.map((hour) => hour.temp_c) || [];
  const hourlyTimes =
    forecast?.forecastday?.[0]?.hour?.map((hour) => hour.time.split(" ")[1]) ||
    [];

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="main">
            <header className="head">
              <div className="logo"></div>
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter city name"
                />
                <button onClick={handleSearch}>Search</button>

                {results.length > 0 && (
                  <ul>
                    {results.map((city, index) => (
                      <li key={index} onClick={() => handleLocation(city)}>
                        {city.name}, {city.region}, {city.country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <GiHamburgerMenu />{" "}
            </header>
            <div className="temp">
              <div className="currentTemp">
                {/* <img src={url:`https:`+current?.condition?.icon} alt="" /> */}
                <p>{current?.temp_c}</p>
                <p>{location?.name}</p>
                <p>{location?.country}</p>
              </div>
              <div className="date">
                <p>2024-08-07</p>
              </div>
            </div>
          </div>
          <div className="humadity">
            <FaDroplet />
            <p>humidity</p>
            <p>18%</p>
          </div>
          <div className="futureDays">
            {weather?.forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let options = { weekday: "long" };
              let dayName = date.toLocaleDateString("en-US", options);
              dayName = dayName.split(",")[0];
              return (
                <div key={index} className="dayCard">
                  <p>{dayName}</p>
                  <p>icon</p>
                  <p>{item?.day?.avgtemp_c}</p>
                </div>
              );
            })}
          </div>
          <div className="dailyStats">
            <p>daily</p>
            <BarChart
              xAxis={[
                {
                  id: "barCategories",
                  data: hourlyTimes,
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  id: "temperature",
                  data: hourlyTemperatures,
                  label: "Hourly Temperature (°C)",
                },
              ]}
              width={700}
              height={250}
            />
          </div>
          <div className="visibility">
            <MdRemoveRedEye />
            <p>UV</p>
            <p>{current?.uv} of 10</p>
          </div>
          <div className="pressure">
            <FaCompressArrowsAlt />
            <p>Wind</p>
            <p>{current?.wind_kph}</p>
            <p>{current?.wind_dir}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
