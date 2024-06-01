import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure leaflet CSS is imported
import '../css/Map.css'; // Import your custom CSS
import { icon } from 'leaflet';

export default function Map() {
  const markers = [
    {
      geocode: [43.7733, -79.5030785],
      popUp: "Hello, I am pop up 1"
    },
    {
      geocode: [43.774, -79.5030785],
      popUp: "Hello, I am pop up 2"
    },
    {
      geocode: [43.775, -79.5030],
      popUp: "Hello, I am pop up 3"
    }
  ];
const customIcon = new icon({
  iconUrl : require("../assets/placeholder.png"),
  iconSize: [38, 38]

})
  return (
    <MapContainer
      center={[43.7735613, -79.5030785]}
      zoom={15}
      className="leaflet-container" // Apply the CSS class here
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
  {markers.map(marker => (
          <Marker position={marker.geocode } icon={customIcon} >
            <Popup><h2>hello i'm a Popup</h2></Popup>
          </Marker>
  ))}


    </MapContainer>
  );
}
