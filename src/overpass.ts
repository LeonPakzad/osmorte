import fetch from 'node-fetch';

const bbox = '51.477,-1.001,51.478,0.001';

const query = `
    [out:json][timeout:25];
    nwr["amenity"="restaurant"]({{bbox}});
    out;
`;

const overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query.replace('{{bbox}}', bbox))}`;

async function fetchRestaurantData() {
    try {
        const response = await fetch(overpassURL);
        console.log((JSON.stringify(await response.json())));
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        return [];
    }
}

fetchRestaurantData()
    .then(response => {
        console.log('Restaurant data:', response);
    })
    .catch(error => {
        console.error('Error:', error);
    });