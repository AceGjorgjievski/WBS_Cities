import Header from "../../Header/Header";
import React, {useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import CityList from "../../Cities/CityList/CityList";


const CityTemperature = () => {

    const top5CitiesByHighTemperature = [
        {
            name: 'Rome',
            temperature: 33.62
        },
        {
            name: 'Athens',
            temperature: 28.73
        },
        {
            name: 'Valletta',
            temperature: 27.3
        },
        {
            name: 'Tirana',
            temperature: 23.49
        },
        {
            name: 'Podgorica',
            temperature: 23.06
        }
    ]


    const [selectedCity, setSelectedCity] = useState(null);
    const [showDetailsClicked, setShowDetailsClicked] = useState(false);

    const handleShowDetails = (cityName) => {
        setSelectedCity(cityName);
        setShowDetailsClicked(true);
    };

    const navigateBack = () => {
        setShowDetailsClicked(false);
    }

    return (
        <>
            <Header/>
            <div className="info-text mt-2">
                <p className="title-style">Top 5 cities in Europe by high temperature</p>
            </div>
            <div className="container">
                <div className="mt-2">
                    {
                        !showDetailsClicked &&
                        <>
                            <Container className={`city-card-container`}>
                                <Row className="row-cols-3 text-center">
                                    {top5CitiesByHighTemperature.slice(0, 3).map((city, index) => (
                                        <Col key={index} className="col">
                                            <Row>
                                                <b>
                                                    {city.name}
                                                </b>
                                            </Row>
                                            <Row>
                                                <b>City Temperature: </b>
                                                <span>
                                                    {
                                                        city.temperature
                                                    }
                                                    °C
                                                </span>
                                                <Button
                                                    variant="link"
                                                    onClick={() => handleShowDetails(city.name)}
                                                >
                                                    Show details...
                                                </Button>
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                                <Row className="row-cols-2 text-center mt-2">
                                    {top5CitiesByHighTemperature.slice(3, 5).map((city, index) => (
                                        <Col key={index} className="col">
                                            <Row>
                                                <b>
                                                    {city.name}
                                                </b>
                                            </Row>
                                            <Row>
                                                <b>City Temperature: </b>
                                                <span>
                                                    {
                                                        city.temperature
                                                    }
                                                    °C
                                                </span>
                                                <Button
                                                    variant="link"
                                                    onClick={() => handleShowDetails(city.name)}
                                                >
                                                    Show details...
                                                </Button>
                                            </Row>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </>
                    }
                    {
                        selectedCity && showDetailsClicked &&
                        <>
                            <CityList initialCity={selectedCity}/>
                            <div className="text-center back-button">
                                <Button
                                    onClick={navigateBack}
                                >
                                    Back
                                </Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default CityTemperature;
