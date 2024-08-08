import { useState } from "react";
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
      console.log("city info", data);
    });
  };

  const { current, location, forcast } = weather;

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
                <p>13😏C</p>
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
             let date = new Date(item.date)
             let options = {weekday:'long'}
             let dayName = date.toLocaleDateString('en-US', options)
             dayName=dayName.split(',')[0]
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
                  data: [
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                    "22:00",
                    "23:00",
                  ],
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  data: [
                    2, 5, 3, 4, 2, 8, 17, 6, 4, 2, 2, 3, 5, 6, 7, 9, 0, 8, 7, 6,
                    3, 3, 5, 3,
                  ],
                },
              ]}
              width={700}
              height={250}
            />
          </div>
          <div className="visibility">
            <FaCompressArrowsAlt />
            <p>vis</p>
            <p>800mb</p>
          </div>
          <div className="pressure">
            <MdRemoveRedEye />
            <p>pressure</p>
            <p>800mb</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
