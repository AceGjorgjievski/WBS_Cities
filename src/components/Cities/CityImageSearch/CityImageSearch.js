import React, { useState, useEffect } from 'react';
import {fetchCityImage} from "../../utils/utils";


const CityImageSearch = ({cityName}) => {
    const [cityImage, setCityImage] = useState(null);

    useEffect(() => {
        const getImage = async () => {

            try {
                const image = await fetchCityImage(cityName);
                setCityImage(image);
            } catch (error) {
                console.error("Error fetching city image:", error);
                // Set default image in case of error
                setCityImage("https://tile.loc.gov/image-services/iiif/service:pnp:highsm:12400:12458/full/pct:50/0/default.jpg");
            }
        };

        if (cityName) {
            getImage();
        }
    }, [cityName]);

    return (
        <img src={cityImage} alt={cityName} width="400px" height="250px" style={{display: 'block', marginBottom: '10px' }} />
    );
}

export default CityImageSearch;