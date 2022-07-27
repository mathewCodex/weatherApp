//importing html..
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentweatherEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecast = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

//creating a certain rule function for updating date and time ..

//convert our values from 0-6 incase of day and 1-12 for month..by creating an array..
const days = [
  "Sunday",
  "Monday",
  "Tueday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
//month
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//API _ KEY..
const API_KEY = "5381808ef7ebf0696a58e2d56cdc3d0b";
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn24HourFormat = hour >= 13 ? hour % 12 : hour;
  const minute = time.getMinutes();
  const amPm = hour >= 12 ? "Pm" : "AM";

  //html display...
  timeEl.innerHTML =
    (hoursIn24HourFormat < 10
      ? `0` + hoursIn24HourFormat
      : hoursIn24HourFormat) +
    ":" +
    (minute < 10 ? `0` + minute : minute) +
    `` +
    `<span id="am-pm">${amPm}</span>`;

  //updating date...
  dateEl.innerHTML = days[day] + "," + date + " " + months[month];
}, 1000);
// fetch(
//    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=10&appid=5381808ef7ebf0696a58e2d56cdc3d0b`
//  )

//create a func to get our weather data..
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);

    //using object destructuring..
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherDate(data);
      });
  });
}
console.log(getWeatherData());
function showWeatherDate(data) {
  //getting the humidity..speed  an pressure data.. using object destructuring..
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  //getting the timeZone..
  timeZone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + "N" + data.lon + "E";
  //
  currentweatherEl.innerHTML = `<div class="weather-item">
<div>Humidity</div>
<div>${humidity}%</div>
</div>
<div class="weather-item">
<div>Pressure</div>
<div>${pressure}</div>
</div>
<div class="weather-item">
<div>Wind Speed</div>
<div>${wind_speed}</div>
</div>
<div class="weather-item">
<div>sunrise</div>
<div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
</div>
<div class="weather-item">
<div>Sunset</div>
<div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
</div>`;

  let otherDayForecast = "";
  data.daily.forEach((day, index) => {
    if (index == 0) {
      currentTempEl.innerHTML = `  <img
      src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
      alt="weather-icon"
      class="w-icon"
    />
    <div class="other">
      <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
      <div class="temp">Night- ${day.temp.night}&#176; c</div>
      <div class="temp">Day- ${day.temp.day}&#176; c</div>
    </div>`;
    } else {
      ///creating function for daily position..to display
      otherDayForecast += `
      <div class="weather-forecast-item">
      <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
      <img
        src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        alt="weather-icon"
        class="w-icon"
      />

      <div class="temp">Night- ${day.temp.night}&#176 c</div>
      <div class="temp">Day- ${day.temp.day}&#176 c</div>
    </div>
      `;
    }
  });

  weatherForecast.innerHTML = otherDayForecast;
}
