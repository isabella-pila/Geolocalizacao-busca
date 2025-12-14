export const getHaversineDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {

  const toRad = (value: number) => (value * Math.PI) / 180;

  const _lat1 = Number(lat1);
  const _lon1 = Number(lon1);
  const _lat2 = Number(lat2);
  const _lon2 = Number(lon2);

  const R = 6371e3; 

  const dLat = toRad(_lat2 - _lat1);
  const dLon = toRad(_lon2 - _lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(_lat1)) * Math.cos(toRad(_lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const clampedA = Math.min(1, Math.max(0, a));

  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));

  return R * c; 
};