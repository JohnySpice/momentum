(function () {
  const time = document.querySelector(".time");
  const date = document.querySelector(".date");
  const quote = document.querySelector(".quote");
  const greeting = document.querySelector(".greeting");
  const nameField = document.querySelector(".name");
  const focusField = document.querySelector(".focus");
  const quote_refresh = document.querySelector(".quote_refresh");
  const bgRefresh = document.querySelector(".bg_refresh");
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherTemperature = document.querySelector(".weather-temperature");
  const airHumidity = document.querySelector(".air-humidity");
  const windSpeed = document.querySelector(".wind-speed");
  const cityName = document.querySelector(".city-name");
  const timesOfDayObject = {
    "morning": {
      "Images": [],
      "path": "assets/images/morning",
    },
    "afternoon": {
      "Images": [],
      "path": "assets/images/day",
    },
    "evening": {
      "Images": [],
      "path": "assets/images/evening",
    },
    "night": {
      "Images": [],
      "path": "assets/images/night",
    }
  };
  let currentTimeOfDay = "";
  let nameValue = "[Enter Name]";
  let focusValue = "[Enter Focus]";
  let rotateAngle = 0;
  let numberOfHours = -1;
  let imageCount = 0;
  let refreshImageCount = imageCount;
  let currentCity = localStorage.getItem("city") || cityName.innerHTML;

  function getImagePacks(timesOfDay) {
    let havingIndexes = [];
    for (let i = 0; i < 6; i++) {
      let randomNumber = (Math.floor(Math.random() * (20)) + 1).toString();
      if (havingIndexes.includes(randomNumber)) {
        i--;
        continue;
      }
      randomNumber = randomNumber.length === 1 ? 0 + randomNumber : randomNumber;
      havingIndexes.push(randomNumber);
      timesOfDayObject[timesOfDay]["Images"].push(`${timesOfDayObject[timesOfDay]["path"]}/${randomNumber}.jpg`);
      // imageList.push(`${path}/${randomNumber}.jpg`);
    }
  }

  function getBackGround(timesOfDay, whatTime) {
    if (numberOfHours === whatTime) return;
    numberOfHours = whatTime;
    document.body.style.backgroundImage = `URL(${timesOfDayObject[timesOfDay]["Images"][imageCount % timesOfDayObject[timesOfDay]["Images"].length]})`;
    imageCount++;
  }

  // bgRefresh.addEventListener("click", () => {
  //   let cTime = currentTimeOfDay;
  //   const timesOfDayList = ["morning", "afternoon", "evening", "night"]
  //   if (imageCount > timesOfDayObject[cTime]["Images"].length) {
  //     console.log(timesOfDayObject[cTime]["Images"].length);
  //     if (timesOfDayList.indexOf(cTime) + 1 !== -1) {
  //       cTime = timesOfDayList[timesOfDayList.indexOf(cTime) + 1]
  //     }
  //     else {
  //       cTime = timesOfDayList[0];
  //     }
  //     imageCount = 0;

  //   }
  //   console.log(timesOfDayObject[cTime]["Images"][imageCount % timesOfDayObject[cTime]["Images"].length]);
  //   document.body.style.backgroundImage = `URL(${timesOfDayObject[cTime]["Images"][imageCount % timesOfDayObject[cTime]["Images"].length]})`;
  //   imageCount++;
  //   // let allImages = [];
  //   // allImages = allImages.concat(timesOfDayObject["morning"]["Images"], timesOfDayObject["afternoon"]["Images"],
  //   //   timesOfDayObject["evening"]["Images"], timesOfDayObject["night"]["Images"]);
  //   // if (refreshImageCount > 24) refreshImageCount = 0;
  //   // document.body.style.backgroundImage = `URL(${allImages[refreshImageCount]})`;
  //   //
  //   // refreshImageCount++;
  // });

  function setTime() {
    let days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    };
    let month = {
      0: "january",
      1: "february",
      2: "march",
      3: "april",
      4: "may",
      5: "june",
      6: "july",
      7: "august",
      8: "september",
      9: "october",
      10: "november",
      11: "december",
    }
    setInterval(() => {
      let date = new Date();
      time.innerHTML = `${days[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]} <br> ${date.toLocaleTimeString()}`;  //date.toLocaleDateString() + "<br>" + date.toLocaleTimeString();
      if (date.getHours() >= 0 && date.getHours() < 6) {
        getGreeting("night");
        getBackGround("night", date.getHours());
        currentTimeOfDay = "night";
      }
      if (date.getHours() >= 6 && date.getHours() < 12) {
        getGreeting("morning");
        getBackGround("morning", date.getHours());
        currentTimeOfDay = "morning";
      }
      if (date.getHours() >= 12 && date.getHours() < 18) {
        getGreeting("afternoon");
        getBackGround("afternoon", date.getHours());
        currentTimeOfDay = "afternoon";
      }
      if (date.getHours() >= 18 && date.getHours() <= 23) {
        getGreeting("evening");
        getBackGround("evening", date.getHours());
        currentTimeOfDay = "evening";
      }
    }, 0);
  }

  function getName(name) {
    if (name) {
      nameField.innerHTML = name;
    }
    nameField.addEventListener("click", () => {
      nameValue = nameField.innerHTML;
      nameField.innerHTML = "";
    })
    nameField.addEventListener("input", () => {
      setLocalStorage(nameField, "name");
    });
    nameField.addEventListener("focusout", () => {
      focusoutHandler(nameField, nameValue);
    });
  }

  function getFocus(focus) {
    if (focus) {
      focusField.innerHTML = focus;
    }
    focusField.addEventListener("click", () => {
      focusValue = focusField.innerHTML;
      focusField.innerHTML = "";
    })
    focusField.addEventListener("input", () => {
      setLocalStorage(focusField, "focus");
    });
    focusField.addEventListener("focusout", () => {
      focusoutHandler(focusField, focusValue);
    });
  }

  function getGreeting(timesOfDay) {
    greeting.innerHTML = `Good ${timesOfDay}, `;
  }
  async function getQuote() {
    const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
    let response = await fetch(url);
    let commits = await response.json();
    quote.innerHTML = commits.quote.quoteText;
  }

  async function getWeather(city) {
    if (city === null || city === "[Enter your city]") return;
    cityName.innerHTML = localStorage.getItem("city");
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=d0a9555d87276f8f119dfc9c41d97b4a&units=metric`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.cod === "404") {
      weatherTemperature.innerHTML = data.message;
      weatherIcon.style.backgroundImage = "";
      airHumidity.innerHTML = "";
      windSpeed.innerHTML = "";
    }
    else {
      setWeather(data);
    }
  }

  function setWeather(weatherData) {
    console.log(weatherData);
    weatherIcon.style.backgroundImage = `URL(http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png)`;
    weatherTemperature.innerHTML = "Temperature: " + weatherData.main.temp + "&#8451;";
    airHumidity.innerHTML = "Humidity: " + weatherData.main.humidity + "%";
    windSpeed.innerHTML = "Wind speed: " + weatherData.wind.speed + " meter/sec";
  }

  function getBG() {

  }

  function setLocalStorage(field, fieldName) {
    localStorage.setItem(fieldName, field.innerHTML);
  }

  function focusoutHandler(field, value) {
    console.log(value);
    if (field.innerHTML === "") {
      field.innerHTML = value;
    }
  }

  quote_refresh.addEventListener("click", () => {
    rotateAngle += 360;
    quote_refresh.style.transform = `rotate(${rotateAngle}deg)`;
    getQuote().catch(err => quote.innerHTML = "Couldn't display quote <br> Too many requests");
  });

  cityName.addEventListener("focusout", (e) => {
    let target = e.target;
    console.log(target);
    console.log(target.innerHTML === currentCity);
    if (target.innerHTML === "" || target.innerHTML === currentCity) {
      target.innerHTML = currentCity;
      return;
    }
    currentCity = target.innerHTML;
    localStorage.setItem("city", target.innerHTML);
    getWeather(target.innerHTML).catch(err => {
      alert(err);
    });
  });
  cityName.addEventListener("click", () => {
    currentCity = cityName.innerHTML;
    cityName.innerHTML = "";
  });

  getWeather(localStorage.getItem("city"));
  getImagePacks("morning");
  getImagePacks("afternoon");
  getImagePacks("evening");
  getImagePacks("night");
  setTime();
  getName(localStorage.getItem("name"));
  getFocus(localStorage.getItem("focus"));
  getQuote().catch(err => quote.innerHTML = "Couldn't display quote <br> Too many requests");
})();














// (async () => {
//   const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
//   let response = await fetch(url);
//   let commits = await response.json();
//   quote.innerHTML = "<br>" + commits.quoteText;
// })();


// function getGreetingAndBackground(timesOfDay) {
//   document.body.style.backgroundImage = `url(assets/images/${timesOfDay}/${Math.floor(Math.random() * (20) + 1)}.jpg)`
//   greeting.innerHTML = `Good ${timesOfDay}`;
//   //console.log(greeting)
//   setInterval(() => {

//     document.body.style.backgroundImage = `url(assets/images/${timesOfDay}/${Math.floor(Math.random() * (20) + 1)}.jpg)`;
//     document.body.style.backgroundSize = "cover";
//   }, 60000);
//   console.log(document.body.style.backgroundImage)
// }
// window.onload = () => {

//   let date = new Date();
//   console.log("a");
//   if (date.getHours() >= 0 && date.getHours() < 6) {
//     document.body.style.color = "#ffffff";
//     getGreetingAndBackground("night");
//   }
//   if (date.getHours() >= 6 && date.getHours() < 12) {
//     getGreetingAndBackground("morning");
//   }
//   if (date.getHours() >= 12 && date.getHours() < 18) {
//     getGreetingAndBackground("day");
//   }
//   if (date.getHours() >= 18 && date.getHours() <= 23) {
//     document.body.style.color = "#ffffff";
//     getGreetingAndBackground("evening");

//   }
// }


