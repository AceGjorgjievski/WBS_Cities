import React, {useEffect, useState} from "react";
import {ListGroup, Row} from "react-bootstrap";


const CityData = ({population, coordinates, area}) => {


    return (
        <>
            <div className="text-md-center">
                <Row>
                    <b>City Area:</b>
                </Row>
                <Row>
                    <span>{area} km²</span>
                </Row>
            </div>
            <div className="text-md-center">
                <Row>
                    <b>City Coordinate Location:</b>
                </Row>
                <Row>
                    <span>{coordinates}</span>
                </Row>
            </div>
            <div className="text-md-center">
                <Row>
                    <b>City Population:</b>
                </Row>
                <Row>
                    <span>
                        {population ? population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A"}
                    </span>
                </Row>
            </div>
        </>
    );

}

export default CityData;

