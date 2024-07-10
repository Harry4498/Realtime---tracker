const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // got the latitude and longitude

      // send via socket connection
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.error(`Error: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000, //Every 15 seconds it send location
    }
  );
}
const map = L.map("map").setView([0, 0], 16); // Center of the earth with zoom of 10
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Harshit Raj", // adding name  to the map at the bottom right corner
}).addTo(map);



const markers = {};

// Now get data from the backend
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);
  // Working with the Taging
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // create a market ( inbuilt form leaflet)
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});


 socket.on("user-disconnected", (id) =>  {
    //checks if marker of user is still there
    if ( markers[id] ){
        map.removeLayer( markers[id] );
        delete markers[id];
    }
 })