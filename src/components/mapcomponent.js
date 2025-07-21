import React, { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import MaplibreGlDraw from 'maplibre-gl-draw';
import lineChunk from '@turf/line-chunk';
import length from '@turf/length';
import { calculateDistance } from './distance';
import zingchart from 'zingchart/es6';

let chartData = [];
let geojson = {
    type: 'FeatureCollection',
    features: []
};

function drawChart() {
    const myConfig = {
        type: 'line',
        scaleX: {
            lineColor: 'none',
            item: { visible: false },
            tick: { lineColor: 'none' }
        },
        scaleY: {
            lineColor: 'none',
            item: { visible: false },
            tick: { lineColor: 'none' }
        },
        plotarea: { margin: '20 20' },
        series: [{ values: chartData }],
        plot: {
            aspect: 'spline',
            marker: {
                visible: true,
                size: 10,
                backgroundColor: '#FF5722',
                borderWidth: 1,
                borderColor: '#FF5722'
            }
        }
    };

    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}

const MapComponent = ({ setMap, routeColor }) => {
    const [map, setMapInstance] = useState(null);
    const [sliderValue, setSliderValue] = useState(0);
    const [mapStyle, setMapStyle] = useState('https://api.maptiler.com/maps/topo-v2-pastel/style.json?key=eSa2l6QMH0DDEHVHlLz5');
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const mapInstance = new maplibregl.Map({
            container: 'map',
            zoom: 12,
            center: [8.5417, 47.3769],
            pitch: 45,
            maxPitch: 70,
            minZoom: 4,
            style: mapStyle
        });

        setMapInstance(mapInstance);
        setMap(mapInstance);

        const draw = new MaplibreGlDraw({
            displayControlsDefault: false,
            controls: {
                point: true,
                line_string: true,
                polygon: true,
                trash: true
            }
        });

        mapInstance.addControl(draw);

        const linestring = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        };

        mapInstance.on('styledata', () => {
            if (mapInstance.getStyle().layers) {
                if (!mapInstance.getSource('geojson')) {
                    mapInstance.addSource('geojson', {
                        type: 'geojson',
                        data: geojson
                    });

                    mapInstance.addLayer({
                        id: 'measure-points',
                        type: 'circle',
                        source: 'geojson',
                        paint: {
                            'circle-radius': 5,
                            'circle-color': '#000'
                        },
                        filter: ['in', '$type', 'Point']
                    });

                    mapInstance.addLayer({
                        id: 'measure-lines',
                        type: 'line',
                        source: 'geojson',
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        paint: {
                            'line-color': '#000',
                            'line-width': 2.5
                        },
                        filter: ['in', '$type', 'LineString']
                    });

                    mapInstance.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: []
                        }
                    });

                    mapInstance.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        paint: {
                            'line-color': routeColor,
                            'line-width': 7
                        }
                    });
                } else {
                    mapInstance.getSource('geojson').setData(geojson);
                }

                mapInstance.off('styledata');
            }
        });

        mapInstance.on('click', async (e) => {
            const features = mapInstance.queryRenderedFeatures(e.point, {
                layers: ['measure-points']
            });

            if (geojson.features.length > 1) geojson.features.pop();

            if (features.length) {
                const id = features[0].properties.id;
                geojson.features = geojson.features.filter(point => point.properties.id !== id);
            } else {
                const pointFeature = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [e.lngLat.lng, e.lngLat.lat]
                    },
                    properties: {
                        id: String(new Date().getTime())
                    }
                };
                geojson.features.push(pointFeature);
            }

            if (geojson.features.length > 1) {
                linestring.geometry.coordinates = geojson.features.map(point => point.geometry.coordinates);
                geojson.features.push(linestring);

                const lineLength = length(linestring, { units: 'meters' });
                const divisionLength = lineLength / 20;
                const newLine = lineChunk(linestring, divisionLength, { units: 'meters' });

                const elevationPromises = newLine.features.map(async (chunk) => {
                    const elevation = await fetchElevation(chunk.geometry.coordinates[0]);
                    return elevation;
                });

                try {
                    const elevations = await Promise.all(elevationPromises);
                    chartData = elevations;
                    drawChart();
                } catch (error) {
                    console.error('Error fetching elevations:', error);
                }

                if (geojson.features.length >= 2) {
                    const [start, end] = geojson.features.map(feature => feature.geometry.coordinates);
                    const distanceInKm = calculateDistance(start, end);
                    setDistance(distanceInKm);
                }
            }

            mapInstance.getSource('geojson').setData(geojson);
        });

        return () => mapInstance.remove();
    }, [setMap, mapStyle]);

    useEffect(() => {
        if (map && map.isStyleLoaded()) {
            if (map.getLayer('route')) {
                map.setPaintProperty('route', 'line-color', routeColor);
            }
        }
    }, [routeColor, map]);

    const fetchElevation = async (coordinate) => {
        return Math.random() * 1000;
    };

    const moveCameraAlongRoute = (value) => {
        if (map) {
            const routeCoordinates = geojson.features.find(feature => feature.geometry.type === 'LineString')?.geometry.coordinates;
            if (routeCoordinates) {
                const index = Math.floor((value / 100) * (routeCoordinates.length - 1));
                const nextCoord = routeCoordinates[index];
                map.jumpTo({
                    center: nextCoord,
                    zoom: map.getZoom(),
                    pitch: map.getPitch(),
                    bearing: map.getBearing()
                });
            }
        }
    };

    const handleSliderChange = (event) => {
        const value = event.target.value;
        setSliderValue(value);
        moveCameraAlongRoute(value);
    };

    const switchMapStyle = () => {
        setMapStyle(prevStyle =>
            prevStyle === 'https://api.maptiler.com/maps/topo-v2-pastel/style.json?key=eSa2l6QMH0DDEHVHlLz5'
                ? 'https://api.maptiler.com/maps/hybrid/style.json?key=eSa2l6QMH0DDEHVHlLz5'
                : 'https://api.maptiler.com/maps/topo-v2-pastel/style.json?key=eSa2l6QMH0DDEHVHlLz5'
        );
    };

    function clearRoute() {
        geojson.features = [];
        map.getSource('geojson').setData(geojson);
        chartData = [];
        drawChart();
        setDistance(null);
    }

    return (
        <div>
            <div id="map" style={{width: '100%', height: '500px'}}></div>
            <div className="flex justify-between items-center mt-1">
                <button onClick={switchMapStyle} className="mt-2 p-2 bg-blue-500 text-white">
                    Switch Map
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="mt-2 w-56"
                />
                <button onClick={clearRoute} className="p-2 bg-red-500 text-white">
                    Clear Draw
                </button>
                {distance !== null && (
                    <div className="text-right">
                        <p>Distance: {distance} km</p>
                    </div>
                )}
            </div>
            <div id="myChart" style={{width: '100%', height: '300px'}}></div>
        </div>
    );
};

export default MapComponent;
