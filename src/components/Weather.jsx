import React, { useState, useEffect } from "react";
import Simg from "../Assets/search.png";
import clear from "../Assets/clear.png";
import cloud from "../Assets/cloud.png";
import drizzle from "../Assets/drizzle.png";
import humidity from "../Assets/humidity.png";
import rain from "../Assets/rain.png";
import snow from "../Assets/snow.png";
import wind from "../Assets/wind.png";
import axios from "axios";

import "./weather.css";

function Weather() {
  const [cityName, setCityName] = useState("Dallas");
  const [isClicked, setIsClicked] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const AppId = "6978cd1c5e314edd8f014ae6aee3459b"; // Store securely in production

  const handleCityChange = (e) => {
    setCityName(e.target.value);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${AppId}&units=metric`
        );
        setWeatherData(res.data);
        setErrorMessage(""); // Clear any previous error
        console.log(res.data);
      } catch (error) {
        setErrorMessage(
          "Unable to fetch weather data. Please check the city name."
        );
        setWeatherData(null); // Reset weather data if an error occurs
        console.error("Error fetching the weather data:", error);
      }
    };

    fetchWeatherData();
  }, [isClicked]); // Trigger when the city changes or search button is clicked

  // Function to determine the appropriate weather icon based on the weather condition
  const getWeatherIcon = (weather) => {
    if (!weather || weather.length === 0) return null; // Return null if no weather data

    const condition = weather[0].main; // Get the main weather condition

    // Map the weather conditions to corresponding icons
    switch (condition) {
      case "Clear":
        return clear;
      case "Clouds":
        return cloud;
      case "Drizzle":
        return drizzle;
      case "Thunderstorm":
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      default:
        return cloud;
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="search"
          value={cityName}
          onChange={handleCityChange}
        />
        <img
          src={Simg}
          alt="search icon"
          onClick={() => setIsClicked(!isClicked)} // Trigger search
        />
      </div>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : weatherData ? (
        <>
          <img
            src={getWeatherIcon(weatherData.weather)} // Dynamically set the weather icon
            className="weather-icon"
            alt="weather icon"
          />
          <p className="temperature">{weatherData.main.temp} °C</p>
          <p className="location">{weatherData.name}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="humidity icon" />
              <div>{weatherData.main.humidity} %</div>
              <span>Humidity</span>
            </div>
            <div className="col">
              <img src={wind} alt="wind icon" />
              <div>{weatherData.wind.speed} km/h</div>
              <span>Wind Speed</span>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Weather;
