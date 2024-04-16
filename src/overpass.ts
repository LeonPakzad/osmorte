import fetch from 'node-fetch';

const bbox = '51.477,-1.001,51.478,0.001';

const query = `
    [out:json][timeout:25];
    nwr["amenity"="restaurant"]({{bbox}});
    out;
`;

var overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query.replace('{{bbox}}', bbox))}`;
console.log('1: ' + overpassURL);

var _place = 'restaurant';
var _box = '51.477,-1.001,51.478,0.001'

var osmQuery = `
[out:json][timeout:25];
nwr["amenity"="place"]({{bbox}});
out;
`;

var boxedOSMQuery = osmQuery.replace('{{bbox}}', _box);
var placedOSMQuery = boxedOSMQuery.replace('place', _place);

overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`;

console.log('2: ' + overpassURL);

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