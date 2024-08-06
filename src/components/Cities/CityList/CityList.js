import React, {useEffect, useState} from 'react';
import Header from "../../Header/Header";
import CityCard from "../cityCard/CityCard";
import './CityList.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
    fetchCityData,
    fetchCityId,
    fetchDBpediaData,
    fetchWeatherData,
    capitalizeCityName
} from '../../utils/utils';
import CityNotFound from "../CityNotFound/CityNotFound";
import {MoonLoader} from "react-spinners";

const CityList = ({initialCity}) => {
    const [cityName, setCityName] = useState('');
    const [cityData, setCityData] = useState(null);

    const [cityImage, setCityImage] = useState(null);
    const [cityDescription, setCityDescription] = useState(null);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        if(initialCity) {
            fetchCity(initialCity);
        }
    }, [initialCity]);


    const fetchCity = async (cityName) => {
        setLoading(true);
        setError(null);


        try {
            const finalCityName = capitalizeCityName(cityName);
            const cityId = await fetchCityId(finalCityName);
            if (!cityId) {
                console.log("the city: ", cityId);
                setError("ne e najden gradot");
                throw new Error('City not found');
            }

            const cityData = await fetchCityData(cityId);
            console.log("the city: ", cityId);
            setCityData(cityData);

            const dbpediaData = await fetchDBpediaData(finalCityName);
            setCityDescription(dbpediaData.description);
            setCityImage(dbpediaData.image);

            const weatherData = await fetchWeatherData(finalCityName);
            setWeatherData(weatherData);
            setLoading(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };


    const handleSearch = () => {
        if (cityName) {
            fetchCity(cityName);
        }
    };

    return (
        <>
            <div>
                {
                    !initialCity &&
                    <>
                        <Header/>
                        <div className="info-text mt-2">
                            <p className="title-style">Search your favorite capital city</p>
                            <Form className="d-flex" onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}>
                                <Form.Control
                                    type="search"
                                    value={cityName}
                                    onChange={(e) => setCityName(e.target.value)}
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button variant="outline-success" type="submit"
                                        style={{background: "cyan"}}>Search</Button>
                            </Form>
                        </div>
                    </>
                }


                {loading &&
                    <div className="content">
                        <MoonLoader/>
                    </div>
                }
                <div className="content">
                    <div className="city-data">
                        {error && error === 'City not found' &&
                            <div>
                                <CityNotFound cityData={cityData}/>
                            </div>
                        }
                        {cityData && error !== 'City not found' &&
                            (
                                <CityCard
                                    cityData={cityData}
                                    cityDescription={cityDescription}
                                    cityImage={cityImage}
                                    weatherData={weatherData}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default CityList;