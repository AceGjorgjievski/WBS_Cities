import Header from "../../Header/Header";
import React, {useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import CityList from "../../Cities/CityList/CityList";


const CityArea = () => {

    const top5CitiesByPopulation = [
        {
            name: 'Moscow',
            area: 2562,
        },
        {
            name: 'Istanbul',
            area: 5343
        },
        {
            name: 'London',
            area: 1572
        },
        {
            name: 'Paris',
            area: 105.4
        },
        {
            name: 'Düsseldorf',
            area: 217.41
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
                <p className="title-style">Top 5 cities in Europe by area</p>
            </div>
            <div className="container">
                <div className="mt-2">
                    {
                        !showDetailsClicked &&
                        <>
                            <Container className={`city-card-container`}>
                                <Row className="row-cols-3 text-center">
                                    {top5CitiesByPopulation.slice(0, 3).map((city, index) => (
                                        <Col key={index} className="col">
                                            <Row>
                                                <b>
                                                    {city.name}
                                                </b>
                                            </Row>
                                            <Row>
                                                <b>City Area: </b>
                                                <span>
                                                    {
                                                        city.area
                                                    }
                                                    km²
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
                                    {top5CitiesByPopulation.slice(3, 5).map((city, index) => (
                                        <Col key={index} className="col">
                                            <Row>
                                                <b>
                                                    {city.name}
                                                </b>
                                            </Row>
                                            <Row>
                                                <b>City Area: </b>
                                                <span>
                                                    {
                                                        city.area
                                                    }
                                                    km²
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

export default CityArea;
