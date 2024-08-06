import React, {useEffect, useState} from 'react';
import {Button, Modal, Container, Row, Col} from 'react-bootstrap';
import CityImageSearch from "../CityImageSearch/CityImageSearch";
import CityDescription from "../CityDescription/CityDescription";
import CityData from "../CityData/CityData";

import './cityCard.css';
import CityWeather from "../CityWeather/CityWeather";
import CountryFlag from "../CountryFlag/CountryFlag";


const CityCard = ({cityData, cityDescription, cityImage, weatherData}) => {

    const [showModal, setShowModal] = useState(false);
    const [fullDescription, setFullDescription] = useState('');
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [cityAllData, setCityAllData] = useState(null);

    const maxLength = 220; // Set your desired length for the preview
    var shortDescription = cityDescription && cityDescription.length > maxLength
        ? cityDescription.substring(0, maxLength) + '...'
        : cityDescription;

    if (!shortDescription || !shortDescription.includes(cityData.cityLabel.value)) {
        shortDescription = 'No description found';
    }

    useEffect(() => {
        const setCityData = (cityData) => {
            console.log("city data in city card: ", cityData);
            setCityAllData({
                cityLabel: cityData.cityLabel?.value,
                population: cityData.population?.value,
                countryLabel: cityData.countryLabel?.value,
                coordinateLocation: cityData.coordinateLocation?.value,
                cityArea: cityData.cityArea?.value,
            });
        }

        if (cityData.cityLabel.value) {
            setCityData(cityData);
        }
    }, [cityData.cityLabel.value]);


    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
        return () => {
            setIsVisible(false);
        };
    }, [cityData.cityLabel.value]);

    return (
        <>
            <Container className={`city-card-container ${isVisible ? 'fade-in' : 'fade-out'}`}>
                <Row className="row">
                    <Col className="col">
                        <Row className="text-md-center">
                            <b>Image:</b>
                        </Row>
                        <Row>
                            <span>
                            <CityImageSearch cityName={cityData.cityLabel.value}/>
                            </span>
                        </Row>
                    </Col>
                    <Col className="col">
                        <Row>
                            <CityDescription cityName={cityData.cityLabel.value}
                                             handleShow={handleShow}
                                             maxLength={maxLength}
                                             setFullDescription={setFullDescription}
                            />
                        </Row>
                    </Col>
                    <Col className="col">
                        <Row>
                            <span className="text-md-center">
                                <b>City Data of: {cityData.cityLabel.value}</b>
                            </span>
                        </Row>
                        <Row>
                            <Col>
                                <CityData
                                    population={cityAllData?.population}
                                    coordinates={cityAllData?.coordinateLocation}
                                    area={cityAllData?.cityArea}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="row">
                    <Col className="col">
                        <CityWeather cityName={cityData.cityLabel.value}/>
                    </Col>
                    <Col className="col">
                        <CountryFlag cityName={cityData.cityLabel.value}/>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{cityData.cityLabel.value} - Full Description</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>{fullDescription}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CityCard;
