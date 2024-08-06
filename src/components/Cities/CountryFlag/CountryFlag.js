import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {fetchFullCountryName, fetchWeatherData} from "../../utils/utils";


const CountryFlag = ({cityName}) => {

    const [countryAbbreviation, setCountryAbbreviation] = useState(null);

    const [fullCountryName, setFullCountryName] = useState(null);
    const [loading, setLoading] = useState(false);

    const decodeUnicode = (str) => {
        return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };

    useEffect(() => {
        const fetchCountryAbbreviation = async (cityName) => {
            setLoading(true);

            try {

                const fromWeatherData = await fetchWeatherData(cityName);
                const city = fromWeatherData.city;
                const country = fromWeatherData.country;

                if (city === 'Rome') {
                    setCountryAbbreviation('IT');
                } else if(city === 'Melbourne') {
                    setCountryAbbreviation('AU');
                } else {
                    setCountryAbbreviation(country);
                }

            } catch (error) {
                console.error("Error fetching weather data in CountryFlag.js:", error);
            }
        }

        const fetchFullNameOfCountry = async (cityName) => {
            setLoading(true);

            const fullCountryLabel = await fetchFullCountryName(cityName);
            setFullCountryName(fullCountryLabel);

            setLoading(false);

        };

        if (cityName) {
            fetchCountryAbbreviation(cityName);
            fetchFullNameOfCountry(cityName);
        }
    }, [cityName]);


    return (
        <>
            <Col>
                <Row className="">
                    <span className="text-md-center">
                        <b>Country flag: {countryAbbreviation}</b>
                    </span>
                </Row>
                <Row className="justify-content-center">
                    <img src={`https://flagsapi.com/${countryAbbreviation}/shiny/64.png`}
                         style={{maxWidth: '200px', maxHeight: '100px', display: 'block', marginBottom: '10px'}}/>
                </Row>
                <Row className="text-md-center">
                    <span className="text-md-center">
                        <b>Full country name:</b>
                    </span>
                    {loading ? (
                        <span>
                            Loading...
                        </span>
                    ) : (
                        <span className="inline; fw-bold">
                            {fullCountryName === 'North Macedonia' ? 'Macedonia' : fullCountryName}
                    </span>
                    )}
                </Row>
            </Col>
        </>
    );
}


export default CountryFlag;

