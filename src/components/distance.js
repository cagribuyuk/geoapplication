import { point } from '@turf/helpers';
import turfDistance from '@turf/distance';

export const calculateDistance = (start, end) => {
    const point1 = point(start);
    const point2 = point(end);
    return turfDistance(point1, point2, { units: 'kilometers' }).toFixed(2);
};
