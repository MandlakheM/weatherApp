import axios from "axios";

const forcastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=d434e9013de24efa99f111412240708&q=${params.cityName}&days=${params.days}&aqi=no&alerts=yes`;
const locationEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=d434e9013de24efa99f111412240708&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const res = await axios.request(options);
    return res.data;
  } catch (err) {
    console.log("error:", err);
    return null;
  }
};

export const fetchWeatherForcast = (params) => {
  let forcastUrl = forcastEndpoint(params);
  return apiCall(forcastUrl);
};

export const fetchLocation = (params) => {
    let locationtUrl = locationEndpoint(params);
    return apiCall(locationtUrl);
  };
