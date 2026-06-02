export function getUberDeeplink(lat: number, lng: number, nickname?: string) {
  return `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}${nickname ? `&dropoff[nickname]=${encodeURIComponent(nickname)}` : ''}`;
}

export function getOlaDeeplink(lat: number, lng: number) {
  return `ola://booking?drop_lat=${lat}&drop_lng=${lng}`;
}

export function getRapidoDeeplink(lat: number, lng: number) {
  return `https://rapido.bike/booking?drop_lat=${lat}&drop_lng=${lng}`;
}
