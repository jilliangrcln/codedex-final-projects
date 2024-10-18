async function fetchWeather() {
    // Create global variables and start inner functions
    let searchInput = document.getElementById('search').value; // Get the value entered in the search input field
    const weatherDataSection = document.getElementById("weather-data"); // Get the weather data display section
    weatherDataSection.style.display = "block"; // Make the weather data section visible

    const apiKey = " "; // Replace this with your actual API key for OpenWeatherMap

    // Check if the input is empty, if yes, display an error message and stop the function
    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return; // Exit the function if input is empty
    }

    // Function to get the latitude and longitude coordinates using the Geocoding API
    async function getLonAndLat() {
        const countryCode = 63; // Philippines country code (you can modify this or make it dynamic)
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL); // Fetch data from the geocoding API
        if (!response.ok) {
            console.log("Bad response! ", response.status); // Log an error if the response is not ok
            return; // Stop if there is an issue with the API request
        }

        const data = await response.json(); // Parse the JSON data from the response
        // Check if no results are returned (invalid city input)
        if (data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return; // Stop the function if no valid data is found
        } else {
            return data[0]; // Return the first result (lat and lon)
        }
    }

    // Function to get weather information using the coordinates from the Geocoding API
    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL); // Fetch data from the Current Weather API

        // Parse the weather data from the response
        const data = await response.json();
        weatherDataSection.style.display = "flex"; // Set display style to flex for better layout
        // Update the innerHTML of the weatherDataSection with the fetched weather info
        weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
            </div>
        `;
    }

    // Clear the input field after fetching data
    document.getElementById("search").value = "";

    // Fetch the latitude and longitude using the input city name
    const geocodeData = await getLonAndLat();
    
    // Use the latitude and longitude to fetch the actual weather data
    getWeatherData(geocodeData.lon, geocodeData.lat);
}
