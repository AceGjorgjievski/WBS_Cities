import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";


const CityNotFound = ({cityData}) => {


    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        return () => {
            setIsVisible(false);
        };
    }, [cityData?.cityLabel?.value]);

    return (
        <>
            <Container className={`city-card-container ${isVisible ? 'fade-in' : 'fade-out'}`}>
                <Row>
                    <Col className="info-text">
                        City not found
                    </Col>
                </Row>
                <Row>
                    <span>Possible reasons:</span>
                    <div>
                        - city does not exist
                    </div>
                    <div>
                        - check spelling
                    </div>
                    <div>
                        - DBpedia or other resources does not have data about it
                        or it is written differently
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default CityNotFound;
