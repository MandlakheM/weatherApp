import { useState, useEffect } from "react";
import "./App.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaDroplet } from "react-icons/fa6";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { TiWeatherWindy } from "react-icons/ti";
import { MdOutlineWbSunny } from "react-icons/md";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchLocation, fetchWeatherForcast } from "./api/weather";
import { FaWind } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";

import partlyCloudy from "./assets/images/partlycloudy.png";
import moderateRain from "./assets/images/moderaterain.png";
import sun from "./assets/images/sun.png";
import cloud from "./assets/images/cloud.png";
import heavyRain from "./assets/images/heavyrain.png";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoLocationSharp } from "react-icons/io5";
import { colors } from "@mui/material";

function App() {
  const [isLoading, setisLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState({});
  const [savedLocations, setSavedLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [units, setUnits] = useState("C");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCityName = async (latitude, longitude) => {
      setisLoading(true);
      try {
        const response = await fetch(
          `https://geocode.xyz/${latitude},${longitude}?json=1&auth=114163668033352e15780839x4681`
        );
        const data = await response.json();
        // console.log(data)
        return data.city || null;
      } catch (error) {
        console.error("Error fetching city name:", error);
        return null;
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await fetchCityName(latitude, longitude);

          if (cityName) {
            setCurrentLocation(cityName);
            fetchWeatherForcast({ cityName: cityName, days: "3" }).then((data) => {
              setWeather(data);
              localStorage.setItem("offline", JSON.stringify(data));
              setisLoading(false); 
            });
          }
        },
        (error) => {
          console.log("Location access denied.", error);

          const defaultCity =
            localStorage.getItem("defaultCity") || "Cape Town";
          setCurrentLocation(defaultCity);

          const savedWeatherData = localStorage.getItem("offline");
          if (savedWeatherData) {
            setWeather(JSON.parse(savedWeatherData));
            setisLoading(false); 
          } else {
            fetchWeatherForcast({ cityName: defaultCity, days: "3" }).then(
              (data) => {
                setWeather(data);
                localStorage.setItem("offline", JSON.stringify(data));
                setisLoading(false); 
              }
            );
          }
        }
      );
    }

    const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
    setSavedLocations(savedCities);
  }, []);

  useEffect(() => {
    if (search.length > 2) {
      fetchLocation({ cityName: search }).then((data) => {
        setResults(data || []);
      });
    } else {
      setResults([]);
    }
  }, [search]);

  function handleSearch() {
    if (search.length > 2) {
      fetchLocation({ cityName: search }).then((data) => {
        console.log("got data", data);
        setResults(data || []);
        setSearch("");
      });
    } else {
      console.log("Search term must be longer than 3 characters");
    }
  }

  const handleLocation = (city) => {
    console.log("Selected city:", city);
    setCurrentLocation(city.name);
    localStorage.setItem("defaultCity", city.name);
    setResults([]);
    fetchWeatherForcast({ cityName: city.name, days: "3" }).then((data) => {
      setWeather(data);
      localStorage.setItem("offline", JSON.stringify(data));
    });
  };

  const saveLocation = () => {
    if (!savedLocations.includes(currentLocation)) {
      const newSavedLocations = [...savedLocations, currentLocation];
      setSavedLocations(newSavedLocations);
      localStorage.setItem("savedCities", JSON.stringify(newSavedLocations));
    }
  };

  const handleSavedLocation = (city) => {
    setCurrentLocation(city);
    fetchWeatherForcast({ cityName: city, days: "3" }).then((data) => {
      setWeather(data);
      localStorage.setItem("offline", JSON.stringify(data));
    });
  };

  const handleUnits = () => {
    setUnits(units === "C" ? "F" : "C");
  };

  const getWeatherImage = (condition) => {
    switch (condition) {
      case "Partly cloudy":
        return partlyCloudy;
      case "Moderate rain":
      case "Patchy rain possible":
      case "Light rain":
      case "Moderate rain at times":
        return moderateRain;
      case "Sunny":
      case "Clear":
        return sun;
      case "Overcast":
      case "Cloudy":
        return cloud;
      case "Heavy rain":
      case "Heavy rain at times":
      case "Moderate or heavy freezing rain":
      case "Moderate or heavy rain shower":
      case "Moderate or heavy rain with thunder":
        return heavyRain;
      default:
        return moderateRain;
    }
  };

  const { current = {}, location = {}, forecast = {} } = weather || {};

  const hourlyTemperatures =
    forecast?.forecastday?.[0]?.hour?.map((hour) =>
      units === "C" ? hour.temp_c : hour.temp_f
    ) || [];
  const hourlyTimes =
    forecast?.forecastday?.[0]?.hour?.map((hour) => hour.time.split(" ")[1]) ||
    [];

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <button id="saveLoc" onClick={saveLocation}>
        Save Location <CiBookmarkCheck id="check" />
      </button>
      <button id="unit" onClick={handleUnits}>
        Switch to {units === "C" ? "Fahrenheit" : "Celsius"}
      </button>
      <div className="saved">
        <br />
        <h2>My cities</h2>
        <br />
        {savedLocations.map((city, index) => (
          <button
            id="loc"
            key={index}
            onClick={() => handleSavedLocation(city)}
          >
            <MdLocationPin id="location" />
            {city}
          </button>
        ))}
      </div>
    </Box>
  );

  if (isLoading) {
    return (
      <div className="loaderWrapper">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="main">
            <header className="head">
              <div className="logo">
                <TiWeatherWindy />
              </div>
              <div className="search">
                <TextField
                  id="standard-basic"
                  label="Enter city name"
                  variant="standard"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  color="warning"
                />

                {/* <button onClick={handleSearch}>🔍</button> */}

                {results.length > 0 && (
                  <ul>
                    {results.map((city, index) => (
                      <li key={index} onClick={() => handleLocation(city)}>
                        <MdLocationPin id="location" />
                        {city.name}, {city.region}, {city.country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <GiHamburgerMenu id="headerIcons" onClick={toggleDrawer(true)} />
              <Drawer open={open} anchor="right" onClose={toggleDrawer(false)}>
                {DrawerList}
              </Drawer>
            </header>
            <div className="mainIcon">
              <img
                src={getWeatherImage(current?.condition?.text)}
                alt={current?.condition?.text}
              />
            </div>
            <div className="temp">
              <div className="currentTemp">
                {/* <img
                  src={getWeatherImage(current?.condition?.text)}
                  alt={current?.condition?.text}
                /> */}
                <p id="temp">
                  {units === "C" ? current?.temp_c : current?.temp_f}°{units}
                </p>
                <p id="cityName">
                  <MdLocationPin id="location" />
                  {location?.name}, {location?.country}
                </p>
              </div>
              <div className="date">
                <p id="cityName">
                  {new Date().toLocaleString("en-ZA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    weekday: "long",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="humidity">
            <FaDroplet id="humidIcon" />
            <p>humidity</p>
            <p>{current?.humidity}%</p>
          </div>
          <div className="futureDays">
            {forecast?.forecastday?.map((item, index) => {
              let date = new Date(item.date);
              let options = { weekday: "long" };
              let dayName = date.toLocaleDateString("en-US", options);
              dayName = dayName.split(",")[0];
              return (
                <div key={index} className="dayCard">
                  <p>{dayName}</p>
                  <img
                    src={getWeatherImage(item.day.condition.text)}
                    alt={item.day.condition.text}
                  />
                  <p>
                    {units === "C"
                      ? item?.day?.avgtemp_c
                      : item?.day?.avgtemp_f}
                    °{units}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="dailyStats">
            {/* <p>daily</p> */}
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
                  label: `Hourly Temperature (°${units})`,
                },
              ]}
              width={700}
              height={250}
            />
          </div>
          <div className="visibility">
            <MdRemoveRedEye id="uvIcon" />
            <p>UV</p>
            <p>{current?.uv} of 10</p>
          </div>
          <div className="pressure">
            <FaWind id="windIcon" />
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
