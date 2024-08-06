import axios from 'axios';
import {Parser, Store, DataFactory} from 'n3';

const decodeUnicode = (str) => {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
};

export const capitalizeCityName = (name) => {
    return name
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};


export const fetchCityId = async (cityName) => {
    const cityIdQuery = `
        SELECT ?city ?cityLabel
        WHERE {
          ?city rdfs:label "${cityName}"@en.
          VALUES ?cityTypes { wd:Q515 wd:Q1549591 wd:Q7930989 wd:Q1549591 wd:Q1549591 wd:Q174844 wd:Q3957} # city, big city, administrative territorial entity, metropolis, independent city, megacity, town
          ?city wdt:P31 ?cityTypes. # Must be one of the defined city types
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        LIMIT 1
      `;
    try {
        const cityIdResponse = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(cityIdQuery)}`, {
            headers: {'Accept': 'application/sparql-results+json'}
        });
        const cityIdData = await cityIdResponse.json();
        console.log("City ID Data in utils:", cityIdData);
        const cityId = cityIdData.results.bindings[0]?.city.value.split('/').pop();
        console.log("City ID in utils:", cityId);
        return cityId;
    } catch (error) {
        console.error("Error fetching city ID:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

export const fetchCityData = async (cityId) => {
    const cityDataQuery = `
        SELECT ?cityLabel ?population ?countryLabel ?coordinateLocation ?cityArea
        WHERE {
          BIND(wd:${cityId} AS ?city)
          ?city rdfs:label ?cityLabel.
          FILTER(LANG(?cityLabel) = "en").
          OPTIONAL { ?city wdt:P1082 ?population. } 
          OPTIONAL { ?city wdt:P17 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel) = "en"). } 
          OPTIONAL { ?city wdt:P625 ?coordinateLocation. }
          OPTIONAL { ?city wdt:P2046 ?cityArea }
        }
      `;
    const cityDataResponse = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(cityDataQuery)}`, {
        headers: {'Accept': 'application/sparql-results+json'}
    });
    const cityDataResult = await cityDataResponse.json();
    return cityDataResult.results.bindings[0];
};

export const fetchDBpediaData = async (cityName) => {
    const finalCityName = cityName.split(" ").join("_");
    const dbpediaUrl = `http://dbpedia.org/data/${finalCityName}.ttl`;

    const response = await axios.get(dbpediaUrl, {headers: {'Accept': 'text/turtle'}});
    let turtleData = response.data;
    turtleData = decodeUnicode(turtleData);

    const parser = new Parser();
    const store = new Store();

    await new Promise((resolve, reject) => {
        parser.parse(turtleData, (error, quad, prefixes) => {
            if (error) {
                reject(error);
            } else if (quad) {
                store.addQuad(quad);
            } else {
                resolve();
            }
        });
    });

    const cityResource = `http://dbpedia.org/resource/${finalCityName}`;
    const getLiteral = (predicate, lang = null) => {
        const quads = store.getQuads(DataFactory.namedNode(cityResource), DataFactory.namedNode(predicate), null, null);
        if (lang) {
            for (const quad of quads) {
                if (quad.object.language === lang) {
                    return quad.object.value;
                }
            }
            return null;
        } else {
            return quads.length > 0 ? quads[0].object.value : null;
        }
    };

    return {
        description: getLiteral('http://dbpedia.org/ontology/abstract', 'en'),
        image: getLiteral('http://dbpedia.org/ontology/thumbnail'),
        population: getLiteral('http://dbpedia.org/ontology/populationTotal'),
        country: getLiteral('http://dbpedia.org/ontology/country'),
        area: getLiteral('http://dbpedia.org/ontology/areaTotal'),
        latitude: getLiteral('http://www.w3.org/2003/01/geo/wgs84_pos#lat'),
        longitude: getLiteral('http://www.w3.org/2003/01/geo/wgs84_pos#long')
    };
};

export const fetchFullCountryName = async (cityName) => {
    const finalCityName = cityName.split(" ").join("_");

    // Define the SPARQL query to retrieve the country name in Turtle format
    const sparqlQuery = `
                PREFIX dbo: <http://dbpedia.org/ontology/>
                PREFIX dbr: <http://dbpedia.org/resource/>
                CONSTRUCT {
                    dbr:${finalCityName} dbo:country ?country.
                    ?country rdfs:label ?countryLabel.
                } WHERE {
                    dbr:${finalCityName} dbo:country ?country.
                    ?country rdfs:label ?countryLabel.
                    FILTER (langMatches(lang(?countryLabel), 'en'))
                }
            `;

    // DBpedia SPARQL endpoint URL
    const sparqlEndpoint = 'http://dbpedia.org/sparql';

    try {
        // Send SPARQL query to DBpedia SPARQL endpoint
        const response = await axios.get(sparqlEndpoint, {
            params: {
                query: sparqlQuery,
                format: 'text/turtle'
            },
            headers: {
                Accept: 'text/turtle'
            }
        });

        // Turtle data returned from the endpoint
        const turtleData = response.data;

        // Decode Unicode characters in the Turtle data
        const decodedData = decodeUnicode(turtleData);

        // Parse Turtle data using N3 library
        const parser = new Parser();
        const store = new Store();

        await new Promise((resolve, reject) => {
            parser.parse(decodedData, (error, quad, prefixes) => {
                if (error) {
                    reject(error);
                } else if (quad) {
                    store.addQuad(quad);
                } else {
                    console.log('Prefixes:', prefixes);
                    resolve();
                }
            });
        });

        const quads = store.getQuads(null, 'http://www.w3.org/2000/01/rdf-schema#label', null, null);

        console.log("quadssss: ", quads);
        let countryLabel = null;
        if (quads.length > 0) {
            countryLabel = quads[0].object.value;
        } else {
            countryLabel = 'No data found from DBpedia';
        }

        return countryLabel;

    } catch (error) {
        console.error('Error fetching full country abbreviation in utils (fetchFullCountryName):', error);
    }
}


export const fetchWeatherData = async (cityName) => {
    const finalCityName = cityName.split(" ").join("_");
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${finalCityName}&units=metric&mode=xml&appid=${process.env.REACT_APP_WEATHER_APP_ID}`;

    const response = await fetch(weatherURL);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const city = xmlDoc.getElementsByTagName("city")[0].getAttribute("name");
    const country = xmlDoc.getElementsByTagName("country")[0].textContent;
    const temperature = xmlDoc.getElementsByTagName("temperature")[0].getAttribute("value");
    const feelsLike = xmlDoc.getElementsByTagName("feels_like")[0].getAttribute("value");
    const humidity = xmlDoc.getElementsByTagName("humidity")[0].getAttribute("value");
    const pressure = xmlDoc.getElementsByTagName("pressure")[0].getAttribute("value");
    const windSpeed = xmlDoc.getElementsByTagName("speed")[0].getAttribute("value");
    const windDirection = xmlDoc.getElementsByTagName("direction")[0].getAttribute("name");
    const weatherIcon = xmlDoc.getElementsByTagName("weather")[0].getAttribute("icon");

    //https://openweathermap.org/weather-conditions
    const weatherMapping = {
        "01d": "sunny",
        "01n": "clear-night",
        "02d": "partlycloudy",
        "02n": "partlycloudy",
        "03d": "cloudy",
        "03n": "cloudy",
        "04d": "cloudy",
        "04n": "cloudy",
        "09d": "rainy",
        "09n": "rainy",
        "10d": "rainy",
        "10n": "rainy",
        "11d": "lightning",
        "11n": "lightning",
        "13d": "snowy",
        "13n": "snowy",
        "50d": "fog",
        "50n": "fog"
    };

    const weatherDescription = weatherMapping[weatherIcon] || "cloudy";
    return {
        city,
        country,
        temperature,
        feelsLike,
        humidity,
        pressure,
        windSpeed,
        windDirection,
        weatherDescription
    };
};

export const fetchCityImage = async (cityName) => {
    const imageURL = `https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=${process.env.REACT_APP_CITY_IMAGE_CLIENT_ID}`;

    const response = await fetch(imageURL);
    const data = await response.json();

    const results = data.results && data.results[0] ? data.results[0] : null;
    const cityImage = results && results.urls ? results.urls.small : "https://tile.loc.gov/image-services/iiif/service:pnp:highsm:12400:12458/full/pct:50/0/default.jpg";

    return cityImage;
};

export const fetchDescription = async (cityName) => {
    const finalCityName = cityName.split(" ").join("_");

    const sparqlQuery = `
                PREFIX dbo: <http://dbpedia.org/ontology/>
                PREFIX dbr: <http://dbpedia.org/resource/>
                CONSTRUCT {
                    dbr:${finalCityName} dbo:abstract ?abstract.
                } WHERE {
                    dbr:${finalCityName} dbo:abstract ?abstract.
                    FILTER (langMatches(lang(?abstract), 'en'))
                }
            `;

    const sparqlEndpoint = 'http://dbpedia.org/sparql';

    try {
        // Send SPARQL query to DBpedia SPARQL endpoint
        const response = await axios.get(sparqlEndpoint, {
            params: {
                query: sparqlQuery,
                format: 'text/turtle' // Request Turtle format
            },
            headers: {
                Accept: 'text/turtle' // Set Accept header for Turtle format
            }
        });

        // Turtle data returned from the endpoint
        const turtleData = response.data;
        console.log("turtle: .. ", turtleData);

        // Parse Turtle data using N3 library
        const parser = new Parser();
        const store = new Store();
        const quads = [];

        await new Promise((resolve, reject) => {
            parser.parse(turtleData, (error, quad, prefixes) => {
                if (error) {
                    reject(error);
                } else if (quad) {
                    quads.push(quad);
                } else {
                    console.log('Prefixes:', prefixes);
                    resolve();
                }
            });
        });

        console.log("Parsed Quads:", quads);

        // Extract the description from the parsed quads
        let description = null;
        if (quads.length > 0 && quads[0].object && quads[0].object.id) {
            description = quads[0].object.id;
        } else {
            description = "No description found";
        }

        return description;

    } catch (error) {
        console.error('Error fetching DBpedia data in  utils (fetchDescription):', error);
        throw error;
    }


}
