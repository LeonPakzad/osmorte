
function showPosition(position) {
    document.getElementById('latitudeInput').value = position.coords.latitude;
    document.getElementById('longitudeInput').value = position.coords.longitude;
}

function requestLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else 
    {
        allert("Geolocation wird von diesem Browser leider nicht unterstützt");
    }
}

function updateDistanceSelect()
{
    if (distanceSelect.value === 'custom') 
    {
        distanceInput.style.display = 'inline-block';
        distanceInput.value = '';
        distanceInput.focus();
    } 
    else 
    {
        distanceInput.style.display = 'none';
    }
}

function calculateBoundingBox() {

    latitude = document.getElementById('latitudeInput').value;
    longitude = document.getElementById('longitudeInput').value;
    
    if(document.getElementById('distanceSelect').value != 'custom')
    {
        distance = document.getElementById('distanceSelect').value;
    } 
    else 
    {
        distance = document.getElementById('distanceInput').value;
    }

    // Radius der Erde in Kilometern
    const earthRadius = 6371;
    const halfGlobe = 180;

    // Konvertierung der Entfernung von Kilometer in Bogenmaß
    var distanceRad = distance / earthRadius;

    // Konvertierung Längengrad in Bogenmaß
    var latRad = latitude * Math.PI / halfGlobe;

    // Berechnung der Breiten- und Längengrad-Differenzen für die Bounding-Box
    var deltaLat = distanceRad * (halfGlobe / Math.PI);
    var deltaLon = distanceRad * (halfGlobe / Math.PI) / Math.cos(latRad);

    // Berechnung der Bounding-Box Koordinaten
    var minLat = (latitude  - deltaLat).toFixed(3);
    var maxLat = (parseFloat(latitude)  + parseFloat(deltaLat)).toFixed(3);
    var minLon = (longitude - deltaLon).toFixed(3);
    var maxLon = (parseFloat(longitude) + parseFloat(deltaLon)).toFixed(3);

    document.getElementById('bbox-input').value = minLat + ',' + minLon + ',' + maxLat + ',' + maxLon;
}