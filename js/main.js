const API_KEY = "a5a5e9892a19ed5d0a715a750f23a374";

const form = document.querySelector("#form");
const input = document.querySelector(".form__input");

form.onsubmit = submitHandler;

async function submitHandler(e) {
    let city = "";
    const cityName = input.value.trim();

    e.preventDefault(); // Отменяем обновление страницы

    // Если не ввели название города
    if (!cityName) {
        city = "Enter City Name";
    } else {
        city = input.value.trim();
        input.value = "";
    }

    const cityInfo = await getGeo(city);

    console.log('cityInfo: ', cityInfo);

    // Если город не найден, выходим
    if (!cityInfo.length) {
        // Скрываем данные, если не найден город
        document.querySelector(".weather__info").classList.add("none");
        document.querySelector(".weather__details").classList.add("none");

        return;
    }

    const weatherInfo = await getWeather(
        cityInfo[0]["lat"],
        cityInfo[0]["lon"]
    );

    console.log(weatherInfo);
    console.log('City: ' + weatherInfo.name);
    // console.log('Temp: ' + weatherInfo.main.temp);
    // console.log('Humidity: ' + weatherInfo.main.humidity);
    // console.log('Wind: ' + weatherInfo.wind.speed);
    // console.log('Weather: ' + weatherInfo.weather[0].main);
    // console.log('Description: ' + weatherInfo.weather[0].description);

    // Записываем в объект все полученные данные
    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        speed: weatherInfo.wind.speed,
        main: weatherInfo.weather[0].main,
        desc: weatherInfo.weather[0].description
    };

    renderWeatherData(weatherData);
}

// Получить геолокацию по названию города
async function getGeo(city) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

    const response = await fetch(geoUrl);   // Запрос на получение
    const data = await response.json();     // Получаем json из данных
    
    return data;
}


// Получить погоду по геолокации
async function getWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
 
    const response = await fetch(weatherUrl);   // Запрос на получение
    const data = await response.json();     // Получаем json из данных

    console.log('-----  Weather -----');
    
    return data;
}

// Рендер полученных данных
function renderWeatherData(data) {
    // Если найден город, есть данные - показываем
    document.querySelector(".weather__info").classList.remove('none');
    document.querySelector(".weather__details").classList.remove("none");
    

    // Отображаем данные о погоде
    const temp = document.querySelector(".weather__temp");
    const city = document.querySelector(".weather__city");
    const humidity = document.querySelector("#humidity");
    const speed = document.querySelector('#speed');
    const desc = document.querySelector(".description");
    const img = document.querySelector(".weather__img");
    
    temp.innerText = Math.round(data.temp) + "°c";
    city.innerText = data.name;
    humidity.innerText = data.humidity + '%';
    speed.innerText = data.speed + ' km/h';
    desc.innerText = data.desc;

    // Clouds Clear Rain Snow
    // Вариант через switch()
    // switch (data.main) {
    //     case 'Clouds':
    //         img.src = './img/weather/clouds.png'
    //         break;
    //     case 'Rain':
    //         img.src = './img/weather/rain.png'
    //         break;
    //     case 'Clear':
    //         img.src = './img/weather/clear.png'
    //         break;
    //     case 'Snow':
    //         img.src = "./img/weather/snow.png";
    //         break;
    //     case 'Mist':
    //         img.src = "./img/weather/mist.png";
    //         break;
    //     case 'Drizzle':
    //         img.src = "./img/weather/drizzle.png";
    //         break;
    
    //     default:
    //         img = "./../img/weather/cloudy.svg";
    //         break;
    // }

    // Вариант через объект
    const fileNames = {
        Clouds: "clouds",
        Rain: "rain",
        Snow: "snow",
        Mist: "mist",
        Drizzle: "drizzle",
        Clear: "clear",
        Smoke: "mist",
    };

    if (fileNames[data.main]) {
        img.src = `./img/weather/${fileNames[data.main]}.png`;
    }
}
