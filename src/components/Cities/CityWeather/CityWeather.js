import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {WeatherSvg} from "weather-icons-animated";
import './CityWeather.css';
import {fetchWeatherData} from "../../utils/utils";

const CityWeather = ({cityName}) => {

    const [cityTemperature, setCityTemperature] = useState(null);
    const [cityTemperatureFeelsLike, setCityTemperatureFeelsLike] = useState(null);
    const [cityHumidity, setCityHumidity] = useState(null);
    const [cityPressure, setCityPressure] = useState(null);
    const [cityWindSpeed, setCityWindSpeed] = useState(null);
    const [cityWindDirection, setCityWindDirection] = useState(null);
    const [cityWeatherDescription, setCityWeatherDescription] = useState(null);

    useEffect(() => {

        const fetchWeather = async (cityName) => {
            try {
                const weatherData = await fetchWeatherData(cityName);
                setCityWeatherDescription(weatherData.weatherDescription);

                const city = weatherData.city;
                const country = weatherData.country;

                setCityTemperature(weatherData.temperature);
                setCityTemperatureFeelsLike(weatherData.feelsLike);
                setCityHumidity(weatherData.humidity);
                setCityPressure(weatherData.pressure);
                setCityWindSpeed(weatherData.windSpeed);
                setCityWindDirection(weatherData.windDirection);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        }


        if (cityName) {
            fetchWeather(cityName);
        }

    }, [cityName]);

    return (
        <>
            <Row>
                <Col>
                    <Row>
                        <div className="text-md-center">
                            <b>Weather in: {cityName}</b>
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <b>Temperature:</b> {cityTemperature}°C
                            </div>
                            <div>
                                <b>Feels Like:</b> {cityTemperatureFeelsLike}°C
                            </div>
                            <div>
                                <b>Humidity:</b> {cityHumidity}%
                            </div>
                            <div>
                                <b>Pressure:</b> {cityPressure} hPa
                            </div>
                            <div>
                                <b>Wind:</b> {cityWindSpeed} m/s from {cityWindDirection}
                            </div>
                            <div>
                                <b>Weather:</b> {cityWeatherDescription}
                            </div>
                        </Col>
                        <Col>
                            <Row>
                                <span className="text-md-center">
                                    <b>Current Weather animation:</b>
                                </span>
                            </Row>
                            <Row className="text-md-center">
                                <Col className="box-background">
                                    <WeatherSvg state={cityWeatherDescription} width={100} height={100}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    );
}


export default CityWeather;
