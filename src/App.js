import React, { useState } from 'react';
import Header from './components/header';
import MapComponent from './components/mapcomponent';
import MapControls from './components/mapcontrols';
import VisualPreferences from './components/visualpref';
import { fetchRoute } from './api/route';

const App = () => {
    const [startLat, setStartLat] = useState('');
    const [startLng, setStartLng] = useState('');
    const [endLat, setEndLat] = useState('');
    const [endLng, setEndLng] = useState('');
    const [map, setMap] = useState(null);
    const [routeColor, setRouteColor] = useState('#5d87ff');

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserverLoopErr = () => {
            console.error('ResizeObserver loop error suppressed.');
        };

        try {
            const observer = new ResizeObserver(() => {});
            observer.observe(document.body);
        } catch (e) {
            resizeObserverLoopErr();
        }
    }

    const handleFetchRoute = async () => {
        try {
            const routeGeoJSON = await fetchRoute(startLat, startLng, endLat, endLng);
            if (map) {
                const source = map.getSource('route');
                if (source) {
                    source.setData(routeGeoJSON);
                    console.log('Route source data updated');
                } else {
                    console.error('Map source "route" not found');
                }
            } else {
                console.error('Map instance is not available');
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex flex-grow">
                <div className="flex-1">
                    <MapComponent setMap={setMap} routeColor={routeColor} />
                </div>
                <div className="w-full md:w-1/3 p-4 bg-gray-100">
                    <MapControls
                        map={map}
                        onFetchRoute={handleFetchRoute}
                        setStartLat={setStartLat}
                        setStartLng={setStartLng}
                        setEndLat={setEndLat}
                        setEndLng={setEndLng}
                    />
                    <VisualPreferences
                        routeColor={routeColor}
                        onColorChange={setRouteColor}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
