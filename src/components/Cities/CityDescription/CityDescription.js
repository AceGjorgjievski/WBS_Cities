import React, {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import {Card, Col, Row} from "react-bootstrap";
import {fetchDescription} from "../../utils/utils";

const CityDescription = ({cityName, handleShow, maxLength, setFullDescription}) => {
    const [cityDescription, setCityDescription] = useState(null);
    const [shortDescription, setShortDescription] = useState(null);

    useEffect(() => {
        const fetchFullDescription = async (cityName) => {

            const description = await fetchDescription(cityName);
            setCityDescription(description);

        };
        if (cityName) {
            fetchFullDescription(cityName);
        }
    }, [cityName]);

    useEffect(() => {
        if (cityDescription) {
            var shortDescription = cityDescription.length > maxLength
                ? cityDescription.substring(0, maxLength) + '...'
                : cityDescription;

            if (!shortDescription || !shortDescription.includes(cityName)) {
                shortDescription = 'No description found';
            }

            setShortDescription(shortDescription);
        }
    }, [cityDescription, cityName, maxLength]);

    const handleReadMoreButton = () => {
        setFullDescription(cityDescription);
        handleShow();
    }

    return (
        <>
            <Col>
            <span className="text-md-center">
            <Card.Title>City: {cityName}</Card.Title>
            </span>
                <Row>
                    <p className="text-center">{shortDescription}</p>
                    {cityDescription && cityDescription.length > maxLength && (
                        <Button variant="link" onClick={handleReadMoreButton}>Read More</Button>
                    )}
                </Row>
            </Col>

        </>
    );
}

export default CityDescription;
