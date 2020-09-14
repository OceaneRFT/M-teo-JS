const $name = document.querySelector('.name');
const $temperate = document.querySelector('.temperate');
const $cityResearch = document.querySelector('.Citysearch');
const $date = document.querySelector('.date');
const $iconMeteo = document.querySelector('.icon');
const $condition = document.querySelector('.condition');
const $hour = document.querySelector('.hour');
const accordion = document.querySelector('#accordionExample');
const weatherDay = document.querySelector('#weatherDayJ');
const $divHoursDay = document.querySelector('.hoursDay');
const $body = document.querySelector('body');
const apiKey = '750b94eb06c8709df87866b1e730d487';

let condition;
let array = [];

// --------------------------------------------background section------------------------------------------------
const background = {

    "Eclaircies": 'thinning',
    "Ensoleillé": 'sunny',

    "Ciel voilé": 'cloudy',
    "Faiblement nuageux": 'cloudy',
    "Nuit claire": 'clearNight',

    "Brouillard": 'mist',
    "Stratus": 'stratus',
    "Stratus se dissipant": 'mist',
    "Fortement nuageux": 'stratus ',

    "Pluie faible": 'rainDay',
    "Pluie forte": 'rainDay',
    "Pluie modérée": 'rainDay',
    "Averses de pluie modérée": 'rainDay',
    "Averses de pluie forte": 'rainDay',
    "Averses de pluie faible": 'rainDay',

    "Nuit avec averses": 'rainNight',
    "Couvert avec averses": 'rainNight',

    "Nuit légèrement voilée": 'night',
    "Faibles passages nuageux": 'cloudy',
    "Nuit bien dégagée": 'clearNight',
    "Nuit claire et stratus": 'clearNight',

    "Développement nuageux": 'cloudy',
    "Nuit avec développement nuageux": 'cloudyNight',
    "Nuit nuageuse": 'cloudyNight',

    "Faiblement orageux": 'cloudyNight',
    "Nuit faiblement orageuse": 'cloudyNight',
    "Orage modéré": 'storm',
    "Fortement orageux": 'storm',

    "Nuit avec averses de neige faible": 'rainNight',

    "Neige faible": 'snow',
    "Neige modérée": 'clearNight',
    "Neige forte": 'clearNight',
    "Averses de neige faible": 'snow',
    "Pluie et neige mêlée faible": 'snow',
    "Pluie et neige mêlée modérée": 'snow',
    "Pluie et neige mêlée forte": 'clearNight',
}

function getBodyClassName(key) {
    return background[key];
}

// --------------------------------------------section API METEO data-------------------------------------------- 
const meteo = function (url) {

    fetch(url)
        .then(valueSite => valueSite.json())
        .then(function (valueSite) {
            $name.innerHTML = valueSite.city_info.name;
            $temperate.innerHTML = valueSite.current_condition.tmp + '°C';
            $date.innerHTML = valueSite.fcst_day_0.day_long + " " + valueSite.current_condition.date;
            $iconMeteo.innerHTML = `<img src="` + valueSite.current_condition.icon_big + `">`;
            $hour.innerHTML = valueSite.current_condition.hour;
            let currentHour = valueSite.current_condition.hour;
            condition = valueSite.current_condition.condition;
            $condition.innerHTML = valueSite.current_condition.condition;
            for (i = 0; i < 4; i++) {
                const dayNumb = {
                    day: document.querySelector('.day' + (i + 1)),
                    dayLong: document.querySelector('.btn-day' + (i + 1))
                }
                array.push(dayNumb);
                const dayKey = "fcst_day_" + (i + 1);
                const dayWeather = valueSite[dayKey];
                array[i].dayLong.innerHTML = dayWeather.day_long;
                array[i].day.innerHTML = dayWeather.day_long + " " + dayWeather.date + " " + `<img src="` + dayWeather.icon + `">` + dayWeather.condition;
            }
            let className = getBodyClassName(valueSite.current_condition.condition);
            $body.className = className;

            weatherbyHour(valueSite, currentHour);
        })

        // control display elements and refresh accordion 
        .catch(function (error) {
            accordion.classList.remove('display');
            weatherDay.classList.add('disappearance');
            alert('Ville non reconnue, indiquez la plus bas');
        })
}
$cityResearch.addEventListener('change', function () {
    accordion.classList.add('display');
    weatherDay.classList.remove('disappearance');
})

// --------------------------------------------weather hours per hours for actually day --------------------------------------------
const addHoursDay = function (hour, hourIcon, hourTemp) {

    const $div = document.createElement('div');
    $div.className = 'dayHours';
    $div.innerHTML = '<p>' + hour + '</p>' + '<p> <img src="' + hourIcon + '"> </p>' + '<p>' + hourTemp + ' °C</p>';
    $divHoursDay.appendChild($div);
}

const weatherbyHour = function (valueSite, currentHour) {
    i = null;
    j = null;
    let iHour = "";
    while (iHour != currentHour) {
        if (i < 10) {
            iHour = '0' + i + ':00';
        } else if (i >= 10) {
            iHour = i + ':00';
        }
        i += 1;
    }
    $divHoursDay.innerHTML = "";
    while (i < 24) {
        let hour = i + 'H00';
        let hourIcon = valueSite.fcst_day_0.hourly_data[hour].ICON;
        let hourTemp = valueSite.fcst_day_0.hourly_data[hour].TMP2m;
        addHoursDay(hour, hourIcon, hourTemp);
        i += 1;
        j += 1;
    }
    i = 0;
    while (j < 24) {
        hour = i + 'H00';
        hourIcon = valueSite.fcst_day_1.hourly_data[hour].ICON;
        hourTemp = valueSite.fcst_day_1.hourly_data[hour].TMP2m;
        addHoursDay(hour, hourIcon, hourTemp);
        i += 1;
        j += 1;
    }
}
// --------------------------------------------section geolocation-------------------------------------------- 
function setPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}`;
    fetch(api)
        .then(function (valueSite) {
            return valueSite.json();
        })
        .then(function (valueSite) {
            let cityName = valueSite.name;
            let url = 'https://prevision-meteo.ch/services/json/' + cityName;
            meteo(url);
            accordion.classList.add('display');
            weatherDay.classList.remove('disappearance');
        })
        .catch(function (error) {
            accordion.classList.remove('display');
            weatherDay.classList.add('disappearance');
            alert('Ville non reconnue, indiquez la plus bas');
        })
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> {error.message} </p>`;
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Votre explorateur ne supporte pas la géocalisation</p>"
}

function getInputCity() {
    let city = document.querySelector('.Citysearch').value;
    url = 'https://prevision-meteo.ch/services/json/' + city;
    meteo(url)
}
// --------------------------------------------auto completion-------------------------------------------- 
let data = [];
let listCity = `https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities`;
fetch(listCity)
    .then(function (valueSite) {
        return valueSite.json();
    })
    .then(function (valueSite) {
        data = Object.values(valueSite);
        initAutocomplete(data);
    })

function initAutocomplete(list) {
    new autoComplete({
        data: {
            src: list,
            key: ["name"],
            cache: false
        },
        selector: ".Citysearch",
        threshold: 3,
        debounce: 300,
        searchEngine: "strict",
        resultsList: {
            render: true,
            container: source => {
                source.setAttribute("class", "results-list");
            },
            destination: document.querySelector(".Citysearch"),
            position: "afterend",
            element: "ul"
        },
        maxResults: 2,
        highlight: true,
        resultItem: {
            content: (data, source) => {
                source.innerHTML = data.match;
            },
            element: "li"
        },
        noResults: () => {
            const result = document.createElement("li");
            result.setAttribute("class", "no_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "No Results";
            document.querySelector("#autoComplete_list").appendChild(result);
        },
        onSelection: feedback => {
            console.log(feedback.selection.value);
            const city = feedback.selection.value;
            url = 'https://prevision-meteo.ch/services/json/' + city.url;
            meteo(url)
        }
    });
}
//-------------------------------------------------------------------------------------------------------------------------
