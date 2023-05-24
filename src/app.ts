import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const apiKey = 'AIzaSyAYPKINiHxLCET8lezuVHIVa7v-BwDHb6M';
console.log("apiKey : ", apiKey);

type GoogleGeocodingResponse = {
   results: { geometry: { location: { lat: number; lng: number } } }[];
   status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
   event.preventDefault();
   const enteredAddress = addressInput.value;

   axios
      .get<GoogleGeocodingResponse>(
         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
            enteredAddress
         )}&key=${apiKey}`
      )
      .then((response) => {
         if (response.data.status !== "OK") {
            throw new Error("Could not fetch location!");
         }
         const coordinates = response.data.results[0].geometry.location;
         // console.log("coordinates : ", coordinates);
         function initMap(): void {
            const myLatLng = coordinates;

            const map = new google.maps.Map(
               document.getElementById("map") as HTMLElement,
               {
                  zoom: 15,
                  center: myLatLng,
               }
            );

            new google.maps.Marker({
               position: myLatLng,
               map,
               title: "Testing google maps!",
            });
         }

         initMap();
      })
      .catch((err) => {
         alert(err.messages);
         console.log(err);
      });
}

form.addEventListener("submit", searchAddressHandler);
