import React from 'react';
import { SliderPicker } from 'react-color';

const VisualPreferences = ({ routeColor, onColorChange }) => {
    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-3">Visual Preferences</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Route Color</label>
                <SliderPicker
                    color={routeColor}
                    onChangeComplete={(color) => onColorChange(color.hex)}
                />
            </div>
        </div>
    );
};

export default VisualPreferences;
