import { PlaybackPoint } from "../vehicles.types";

/**
 * Linearly interpolate between two geographic coordinates [longitude, latitude].
 */
export function interpolateCoordinates(
  coord1: [number, number],
  coord2: [number, number],
  fraction: number
): [number, number] {
  const lng = coord1[0] + (coord2[0] - coord1[0]) * fraction;
  const lat = coord1[1] + (coord2[1] - coord1[1]) * fraction;
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
}

/**
 * Interpolate heading angle along the shortest angular distance.
 * Handles 360-degree boundary wrap-around smoothly (e.g. 355° -> 5°).
 */
export function interpolateHeading(h1: number, h2: number, fraction: number): number {
  const diff = ((h2 - h1 + 540) % 360) - 180;
  const interpolated = (h1 + diff * fraction + 360) % 360;
  return Math.round(interpolated);
}

export interface InterpolatedState {
  position: [number, number]; // [lng, lat]
  heading: number;
  speed: number;
  ignition: boolean;
  stoppage?: boolean;
  locationName?: string;
  timestamp: string;
}

/**
 * Compute the interpolated vehicle state at a given fractional index (e.g. 3.45).
 */
export function getInterpolatedVehicleState(
  points: PlaybackPoint[],
  progress: number
): InterpolatedState | null {
  if (!points || points.length === 0) return null;
  if (points.length === 1 || progress <= 0) {
    const pt = points[0];
    return {
      position: [pt.longitude, pt.latitude],
      heading: pt.heading,
      speed: pt.speed,
      ignition: pt.ignition,
      stoppage: pt.stoppage,
      locationName: pt.locationName,
      timestamp: pt.timestamp
    };
  }

  const maxIndex = points.length - 1;
  if (progress >= maxIndex) {
    const pt = points[maxIndex];
    return {
      position: [pt.longitude, pt.latitude],
      heading: pt.heading,
      speed: pt.speed,
      ignition: pt.ignition,
      stoppage: pt.stoppage,
      locationName: pt.locationName,
      timestamp: pt.timestamp
    };
  }

  const index = Math.floor(progress);
  const fraction = progress - index;
  const p1 = points[index];
  const p2 = points[index + 1];

  const position = interpolateCoordinates(
    [p1.longitude, p1.latitude],
    [p2.longitude, p2.latitude],
    fraction
  );
  const heading = interpolateHeading(p1.heading, p2.heading, fraction);
  const speed = Math.round(p1.speed + (p2.speed - p1.speed) * fraction);

  return {
    position,
    heading,
    speed,
    ignition: fraction < 0.5 ? p1.ignition : p2.ignition,
    stoppage: fraction < 0.5 ? p1.stoppage : p2.stoppage,
    locationName: fraction < 0.5 ? p1.locationName : p2.locationName,
    timestamp: fraction < 0.5 ? p1.timestamp : p2.timestamp
  };
}

/**
 * Split route coordinates into traversed (past) and remaining (upcoming) segments
 * for dual-tone dynamic polyline rendering.
 */
export function splitRouteCoordinates(
  points: PlaybackPoint[],
  currentPosition: [number, number],
  progress: number
): {
  traversed: [number, number][];
  remaining: [number, number][];
} {
  if (!points || points.length === 0) {
    return { traversed: [], remaining: [] };
  }

  const index = Math.floor(progress);
  const allCoords = points.map((p) => [p.longitude, p.latitude] as [number, number]);

  // Traversed includes points from 0 up to index, plus current interpolated position
  const traversed = allCoords.slice(0, index + 1);
  traversed.push(currentPosition);

  // Remaining starts from current interpolated position through end of route
  const remaining = [currentPosition, ...allCoords.slice(index + 1)];

  return { traversed, remaining };
}
