const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =  document.querySelector(".user-info-container");

//Initially variable needed
let currentTab = userTab;
const API_KEY = "bcb0d312e3100a798ea01505ddc37c65";
currentTab.classList.add("current-tab");
//maybe already presnt lat and lon ... so we have to call the fucntion one time
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //Before i was present on seachTab and now i want to move on the Your-Weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //Now i am at Your-Weather tab , we have to visible this tab. so lets check the local storage first 
            // then for cordinates if we have saved them there 
            getfromSessionStorage();//calling the function for display
        }
    }
};

userTab.addEventListener("click", ()=> {
    //Pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //Pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if we cannot found local coordinates
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
};

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon} = coordinates;
    //making grant-location container invisble
    grantAccessContainer.classList.remove("active");
    //Making Loader visible
    loadingScreen.classList.add("active");

    //API CALL 
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //Have to add something more please find it

    }
};

function renderWeatherInfo(weatherInfo){
    //First, we have to fetch the elements
    
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //Fetch value from Weather-Info  object and put in it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} km/h`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW- Show an alert for no geolocation support available

    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    if(searchInput.value === ""){
        return;
    } 
    else{
        fetchSearchWeatherInfo(searchInput.value);
    }

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await  response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        //yet to try by myself

    }
}

