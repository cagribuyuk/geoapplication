import React from 'react';

const MapControls = ({ map, onFetchRoute, setStartLat, setStartLng, setEndLat, setEndLng }) => {
    const handleZoomIn = () => {
        if (map) {
            map.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map) {
            map.zoomOut();
        }
    };

    const handleDeleteRoute = () => {
        if (map && map.getSource('route')) {
            map.getSource('route').setData({
                type: 'FeatureCollection',
                features: []
            });
        }
    };

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Start Latitude"
                    className="w-full p-2 bg-gray-700 rounded focus:outline-none"
                    onChange={(e) => setStartLat(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Start Longitude"
                    className="w-full p-2 bg-gray-700 rounded focus:outline-none"
                    onChange={(e) => setStartLng(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="End Latitude"
                    className="w-full p-2 bg-gray-700 rounded focus:outline-none"
                    onChange={(e) => setEndLat(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="End Longitude"
                    className="w-full p-2 bg-gray-700 rounded focus:outline-none"
                    onChange={(e) => setEndLng(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    <button
                        className="flex-1 p-2 bg-blue-500 rounded hover:bg-blue-600"
                        onClick={onFetchRoute}
                    >
                        Fetch Route
                    </button>
                    <button
                        className="flex-1 p-2 bg-red-500 rounded hover:bg-red-600"
                        onClick={handleDeleteRoute}
                    >
                        Delete Route
                    </button>
                    <button
                        className="flex-1 p-2 bg-green-500 rounded hover:bg-green-600"
                        onClick={handleZoomIn}
                    >
                        Zoom In
                    </button>
                    <button
                        className="flex-1 p-2 bg-yellow-500 rounded hover:bg-yellow-600"
                        onClick={handleZoomOut}
                    >
                        Zoom Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapControls;
