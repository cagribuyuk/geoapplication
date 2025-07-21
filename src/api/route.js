import polyline from '@mapbox/polyline';

const BASE_URL = 'http://127.0.1.1:5000/route/v1/driving';

export const fetchRoute = async (startLat, startLng, endLat, endLng) => {
    if (!startLat || !startLng || !endLat || !endLng) {
        throw new Error('Missing start or end coordinates');
    }

    const url = `${BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=polyline`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = polyline.decode(route.geometry).map(coord => [coord[1], coord[0]]);
            return {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                }]
            };
        } else {
            throw new Error('No routes found in the data');
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        throw error;
    }
};
