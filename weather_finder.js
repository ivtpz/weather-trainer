var Forecast = require('forecast.io');
var options = {
  APIKey: '3fdb6a1db6e77e03ab524ab2931d0fde',
  exclude: 'minutely,daily',
  extend: 'hourly'
}
var forecast = new Forecast(options);
var lat = 34;
var long = -84;
var weather = [];
//Get weather
var test = forecast.get(lat, long, options, function(err, res, data) {
  if (err) throw err;
  var week = data.hourly.data;
	var initialized = false;
  for (var i = 0; i < week.length; i++) {
    var date = new Date(week[i].time*1000);
		if (date.getHours() === 18) {
			if(!initialized) {
				var position = 0;
				weather.push({day: date.getDay()});
				weather[position].morning = "unavailable";
				weather[position].midDay = "unavailable";
				initialized = true;
			}
      weather[position].night = {
				temp: week[i].temperature,
				cond: translateCondition(week[i].icon)
			};
			position++;
      //6 AM
    } else if (date.getHours() === 6) {
			if (!initialized) {
				var position = 0;
				initialized = true;
			}
			weather.push({day: date.getDay()});
			weather[position].morning = {
				temp: week[i].temperature,
				cond: translateCondition(week[i].icon)
			};      //noon
    } else if (date.getHours() === 12) {
			if(!initialized) {
				var position = 0;
				weather.push({day: date.getDay()});
				weather[position].morning = "unavailable";
				initialized = true;
			}
			weather[position].midDay = {
				temp: week[i].temperature,
				cond: translateCondition(week[i].icon)
			}
		}
  }
	if (weather[7]) {
		weather = weather.slice(0,7);
	}
});
setTimeout(function () {console.log(weather)}, 2000);
exports.weatherData = weather;

//Take condition given by icon in data, return
//in form of condition inputted by user
function translateCondition(cond) {
	var trans;
	switch (cond) {
		case "clear-day":
			trans = "clear";
			break;
		case "clear-night":
			trans = "clear";
			break;
		case "rain":
			trans = "rain";
			break;
		case "snow":
			trans = "snow";
			break;
		case "sleet":
			trans = "sleet";
			break;
		case "wind":
			trans = "windy";
			break;
		case "fog":
			trans = "foggy";
			break;
		case "cloudy":
			trans = "cloudy";
			break;
		case "partly-cloudy-day":
			trans = "partly cloudy";
			break;
		case "partly-cloudy-night":
			trans = "partly cloudy";
			break;
		default:
			trans = "storms";
	}
	return trans;
}
