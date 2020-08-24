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

let city;
let currentHour;
let hourTemp;
let hourIcon;
let hour;
let day;
let icon;
let tempMin;
let tempMax;
let condition;
let array = [];
let cityName;
let url;

// --------------------------------------------background section------------------------------------------------
const background = {

    "Eclaircies": 'url(assets/eclaircies.jpg)',
    "Ensoleillé": 'url(assets/ensoleille.webp)',

    "Ciel voilé": 'url(assets/voile.jpg)',
    "Faiblement nuageux": 'url(assets/voile.jpg)',
    "Nuit claire": 'url(assets/nuitclaire.jpg)',

    "Brouillard": 'url(assets/brouillard.jpg)',
    "Stratus": 'url(assets/stratus.jpg)',
    "Stratus se dissipant": 'url(assets/brouillard.jpg)',
    "Fortement nuageux": 'url(assets/stratus.jpg)',

    "Pluie faible": 'url(assets/pluieday.jpg)',
    "Pluie forte": 'url(assets/pluieday.jpg)',
    "Pluie modérée": 'url(assets/pluieday.jpg)',
    "Averses de pluie modérée": 'url(assets/pluieday.jpg)',
    "Averses de pluie forte": 'url(assets/pluieday.jpg)',
    "Averses de pluie faible": 'url(assets/pluieday.jpg)',

    "Nuit avec averses": 'url(assets/pluienight.jpg)',
    "Couvert avec averses": 'url(assets/pluienight.jpg)',

    "Nuit légèrement voilée": 'url(assets/night.jpg)',
    "Faibles passages nuageux": 'url(assets/voile.jpg)',
    "Nuit bien dégagée": 'url(assets/nuitclaire.jpg)',
    "Nuit claire et stratus": 'url(assets/nuitclaire.jpg)',

    "Développement nuageux": 'url(assets/voile.jpg)',
    "Nuit avec développement nuageux": 'url(assets/nuitnuageuse.jpg)',
    "Nuit nuageuse": 'url(assets/nuit nuageuse.jpg)',

    "Faiblement orageux": 'url(assets/nuitnuageuse.jpg)',
    "Nuit faiblement orageuse": 'url(assets/nuitnuageuse.jpg)',
    "Orage modéré": 'url(assets/orage.jpg)',
    "Fortement orageux": 'url(assets/orage.jpg)',

    "Nuit avec averses de neige faible": 'url(assets/pluienight.jpg)',

    "Neige faible": 'url(assets/neige.jpg)',
    "Neige modérée": 'url(assets/neigeforte.jpeg)',
    "Neige forte": 'url(assets/neigeforte.jpeg)',
    "Averses de neige faible": 'url(assets/neige.jpg)',
    "Pluie et neige mêlée faible": 'url(assets/neige.jpg)',
    "Pluie et neige mêlée modérée": 'url(assets/neige.jpg)',
    "Pluie et neige mêlée forte": 'url(assets/neigeforte.jpeg)',
}

function getImages(key) {
    return background[key];
}

// --------------------------------------------section API METEO data-------------------------------------------- 
const meteo = function() {

    fetch(url)
        .then(valueSite => valueSite.json())
        .then(function(valueSite) {
            $name.innerHTML = valueSite.city_info.name;
            $temperate.innerHTML = valueSite.current_condition.tmp + '°C';
            $date.innerHTML = valueSite.fcst_day_0.day_long + " " + valueSite.current_condition.date;
            $iconMeteo.innerHTML = `<img src="` + valueSite.current_condition.icon_big + `">`;

            $hour.innerHTML = valueSite.current_condition.hour;
            currentHour = valueSite.current_condition.hour;
            condition = valueSite.current_condition.condition;

            for (i = 0; i < 4; i++) {
                const dayNumb = {
                    day: document.querySelector('.day' + (i + 1)),
                    dayLong: document.querySelector('.btn-day' + (i + 1))
                }
                array.push(dayNumb);
                const dayKey = "fcst_day_" + (i + 1);
                const dayWeather = valueSite[dayKey];
                array[i].dayLong.innerHTML = dayWeather.day_long;
                array[i].day.innerHTML = dayWeather.day_long + " " + dayWeather.date + " " +`<img src="` + dayWeather.icon + `">` + dayWeather.condition;
            }
            let result = getImages(valueSite.current_condition.condition);
            $body.style.backgroundImage = result;

            weatherbyHour(valueSite);
        })

    // control display elements and refresh accordion 
    .catch(function(error) {
        accordion.classList.remove('display');
        weatherDay.classList.add('disappearance');
        alert('Ville non reconnue' + error);
    })
}
$cityResearch.addEventListener('change', function() {
    accordion.classList.add('display');
    weatherDay.classList.remove('disappearance');
})

// --------------------------------------------weather hours per hours for actually day --------------------------------------------
const addHoursDay = function() {
    const $div = document.createElement('div');
    $div.className = 'dayHours';
    $div.innerHTML = '<p>' + hour + '</p>' + '<p> <img src="' + hourIcon + '"> </p>' + '<p>' + hourTemp + ' °C</p>';
    $divHoursDay.appendChild($div);
}

const weatherbyHour = function(valueSite) {
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
            hour = i + 'H00';
            hourIcon = valueSite.fcst_day_0.hourly_data[hour].ICON;
            hourTemp = valueSite.fcst_day_0.hourly_data[hour].TMP2m;
            addHoursDay();
            i += 1;
            j += 1;
        }
        i = 0;
        while (j < 24) {
            hour = i + 'H00';
            hourIcon = valueSite.fcst_day_1.hourly_data[hour].ICON;
            hourTemp = valueSite.fcst_day_1.hourly_data[hour].TMP2m;
            addHoursDay();
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
        .then(function(valueSite) {
            return valueSite.json();
        })
        .then(function(valueSite) {
            cityName = valueSite.name;
            url = 'https://prevision-meteo.ch/services/json/' + cityName;
            meteo();
            accordion.classList.add('display');
            weatherDay.classList.remove('disappearance');
        })
        .catch(function(error) {
            accordion.classList.remove('display');
            weatherDay.classList.add('disappearance');
            alert('Ville non reconnue' + error);
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
    notificationElement.innerHTML = "<p>Browser don't support geolocation</p>"
}

function getInputCity() {
    city = document.querySelector('.Citysearch').value;
    url = 'https://prevision-meteo.ch/services/json/' + city;
    meteo(url)
}
// --------------------------------------------auto completion-------------------------------------------- 
let data = [];
let listCity = `https://cors-anywhere.herokuapp.com/https://www.prevision-meteo.ch/services/json/list-cities`;
fetch(listCity)
    .then(function(valueSite) {
        return valueSite.json();
    })
    .then(function(valueSite) {
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