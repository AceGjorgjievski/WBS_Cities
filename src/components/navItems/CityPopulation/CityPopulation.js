import Header from "../../Header/Header";
import React, {useState} from "react";
import {Col, Container, Row, Button} from "react-bootstrap";
import CityList from "../../Cities/CityList/CityList";


const CityPopulation = () => {

    const top5CitiesByPopulation = [
        {
            name: 'Istanbul',
            population: 15462452
        },
        {
            name: 'Moscow',
            population: 13010112
        },
        {
            name: 'London',
            population: 8799728
        },
        {
            name: 'Madrid',
            population: 3332035
        },
        {
            name: 'Paris',
            population: 2145906
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
                <p className="title-style">Top 5 cities in Europe by population</p>
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
                                            <b>Population: </b>
                                            <span>
                                        {
                                            city.population
                                                ?
                                                city.population
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : "N/A"
                                        }
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
                                            <b>Population: </b>
                                            <span>
                                        {
                                            city.population
                                                ?
                                                city.population
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : "N/A"
                                        }
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

export default CityPopulation;
