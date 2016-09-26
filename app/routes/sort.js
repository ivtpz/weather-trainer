// Need to run weather tests for brick within weather
// test function instead of testing for workout weather
// and then testing for brick

var Forecast = require('forecast.io-bluebird');
var path = require('path');
var weatherAPIKey = require('./forecastAPIKey')

/*app.factory('forecastPlan', ['$http', function($http) {
	return $http.get('gttp://api.forecast.io/forecast/3fdb6a1db6e77e03ab524ab2931d0fde' + lat.toString() + ',' + long.toString())
		.success(function(data) {
			console.log(data);
		})
		.error(function(err) {
			return err;
		})
}])*/

// Get weather, sort plan based on weather
exports.index = function (req, res, err) {
	if(err) console.log(err);
	res.sendFile(path.join(__dirname, '../../public', 'sort_test.html'));
};
var training;
var plan;
exports.retrieveWeatherPlan = function (dbTraining) {
	plan  = [{day: "sun"}, {day: "mon"}, {day:"tues"}, {day: "wed"}, {day: "thurs"}, {day: "fri"}, {day: "sat"}];
	training = dbTraining;
	console.log(training);
	//Place workout with predefined day on that day
for (i = 0; i < training.length; i++) {
	if (training[i].day.length !== 0) {
		var dayName = training[i].day[0];
		var dayIndexer = indexer[dayName];
		//if workout is specified as a brick, place both workouts
		if (training[i].brick && training[i].brick !== -1) {
			var brickIndex = training[i].brick;
			plan[dayIndexer].activity = {};
			plan[dayIndexer].activity[training[i].name] = [training[i].day[1], 1];
			plan[dayIndexer].activity[training[brickIndex].name] = [training[i].day[1], 2];
			plan[dayIndexer].type = [training[i].type];
			plan[dayIndexer].type.push(training[brickIndex].type);
			placed.push(training[i].name, training[brickIndex].name);
			//Implement restrictions for 2nd workout (brick)
			restrict(brickIndex, dayName, training[brickIndex].type);
		} else {
			plan[dayIndexer].activity = {};
			plan[dayIndexer].activity[training[i].name] = [training[i].day[1]];
			placed.push(training[i].name);
		}
		//Implement restrictions for first workout
		restrict(i, dayName, training[i].type);
	}
}
var remain = rank(training);

//Rank which activity has the fewest possibilities
function rank(array) {
	var remain = [];
	for (var i = 0; i < array.length; i++) {
		//Check that the workout is not already scheduled / placed
		if (placed.indexOf(array[i].name) === -1) {
			var rank = 7;
			var restrictDayIndexes = [];
			for (var j = 0; j < plan.length; j++) {
				if (plan[j].activity) {
					rank--;
					restrictDayIndexes.push(indexer[plan[j].day]);
				} else if(plan[j].restrict !== undefined) {
					if (plan[j].restrict[0] === "all" || plan[j].restrict.indexOf(array[i].type) !== -1) {
					rank--;
					restrictDayIndexes.push(indexer[plan[j].day]);
					}
				}
			}
			remain.push({name: array[i].name, index: i, rank: rank, restrict: restrictDayIndexes});
		}
	}
	return remain.sort(function(a,b) {return a.rank > b.rank;});
}

function filterWeatherData (data) {
	console.log('83', data)
	return new Promise(function (resolve) {
	var weather = [];
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
// Finish plan once weather is filtered and sorted
	remain.forEach(function (workout) {
	for(var i = 0; i < plan.length; i++) {
		// check that workout is not already placed
		if (placed.indexOf(workout.name) !== -1) break;
		//check if rank function applied restriction for current plan day
		//if not, continue with other tests
		if (workout.restrict.indexOf(i) === -1) {
			if (plan[i].restrict === undefined || plan[i].restrict[0] !== "all" && plan[i].restrict.indexOf(training[workout.index].type) === -1) {
				//test weather, will return time of day for given dayIndex (i) to place workout, or undefined
				if(weatherTest(workout.name, workout.index, i, weather) !== undefined) {
					if(!plan[i].activity) {
						//check rest restrictions for following days before placing workout
						if(!checkAfter(workout)) continue;

						//run tests for brick
						if(training[workout.index].brick && training[workout.index].brick !== -1) {
							var brickIndex = training[workout.index].brick;
							if(!checkAfter(training[brickIndex]) || weatherTest(training[brickIndex].name, brickIndex, i, weather) === undefined) continue;
						}

						//place workout
						var name = workout.name;
						plan[i].activity = {};
						plan[i].activity[name] = [weatherTest(name, workout.index, i, weather), 1];
						plan[i].type = [training[workout.index].type];
						placed.push(name);
						restrict(workout.index, plan[i].day, training[workout.index].type);
						// place brick
						if(training[workout.index].brick && training[workout.index].brick !== -1){
							var brickName = training[training[workout.index].brick].name;
							var brickIndex = training[workout.index].brick;
							plan[i].activity[brickName] = [weatherTest(name, workout.index, i, weather) , 1];
							plan[i].type.push(training[brickIndex].type);
							placed.push(brickName);
							restrict(brickIndex, plan[i].day, training[brickIndex].type);
						}
						break;
					}
				}
			}
		}
	}
	if(placed.indexOf(workout.name) === -1) console.log(workout.name + " not placed.")
	});
	var newPlan = [];
	for (var i = 0; i < plan.length; i++) {
		if (plan[i].activity) {
			var dayPlan = {
				day: plan[i].day
			};
			var act = "";
			for (key in plan[i].activity) {
				act += key;
				act += " ";
			}
			dayPlan.activity = act;
			newPlan.push(dayPlan);
		}
	}
	console.log("new plan " + newPlan);
	resolve(newPlan);
});
};
	return new Promise(function(finalRes) {
		var forecast = new Forecast({
			key: weatherAPIKey.key
		});
		var lat = 34;
		var long = -84;
		var options = {
			exclude: 'daily,minutely',
			extend: 'hourly'
		};
		forecast.fetch(lat, long, options).then(filterWeatherData).then(function(plan) {finalRes(plan);
		});
	});
};


	// place remaining workouts into plan according to rank
	// iterate through non-scheduled workouts, check for restrictions, find
	// location that meets weather constraints and is not restricted



var indexer = {sun: 0, mon: 1, tues: 2, wed: 3, thurs: 4, fri: 5, sat: 6};

var placed = [];




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

// Looks at the plan for the days after a workout would be placed
//to make sure rest restrictions aren't violated
function checkAfter(workout) {
  if(training[workout.index].restSameType) {
    var rest = training[workout.index].restSameType;
    for (var j = 1; j <= rest; j++) {
      if (plan.length > i + j && plan[i+j].type && plan[i + j].type.indexOf(training[workout.index].type) !== -1) {
        return false;
      }
    }
  }
  if(training[workout.index].restAllType) {
    var rest = training[workout.index].restAllType;
    for (var j = 1; j <= rest; j++) {
      if (plan.length > i + j && plan[i+j].activity) {
        return false;
      }
    }
  }
  return true;
}

//Implement limitations after a workout has been placed
//index is location of workout in training array
//day is day where workout was placed
function restrict(index, day, type) {
	var workout = training[index];
	var dayIndexer = indexer[day];
	if(workout.restAllType) {
		var rest = workout.restAllType;
		for (var i = 1; i <= rest && i < 7 - dayIndexer; i++) {
			plan[dayIndexer + i].restrict = ["all"];
		}
	}
	if(workout.restSameType) {
		var rest = workout.restSameType;
		for (var i = 1; i <= rest && i < 7 - dayIndexer; i++) {
			if (!plan[dayIndexer + i].restrict){
				plan[dayIndexer + i].restrict = [type];
			} else if (plan[dayIndexer + i].restrict[0] !== "all" && plan[dayIndexer + i].restrict.indexOf(type) === -1) {
				plan[dayIndexer + i].restrict.push(type);
			}
		}
	}
}








// returns earliest possible time of day, or undefined if
// workout cannot be placed that day
function weatherTest(workoutName, workoutIndex, dayIndex, weather) {
//convert day index to position of first day in weatherTest
//to access correct position in weather array
	dayIndex -= weather[0].day;
	if (dayIndex < 0) dayIndex += weather.length;

	var timesOfDay = ["morning", "midDay", "night"];
	for (var j = 0; j < timesOfDay.length; j++) {
		var timeOfDay = timesOfDay[j];
		var currWorkout = training[workoutIndex];
		var testWeather = weather[dayIndex][timeOfDay];
		if(testWeather === "unavailable") continue;
		if (currWorkout.maxTemp) {
			if (currWorkout.maxTemp < testWeather.temp) {
				continue;
			}
		}
		if(currWorkout.minTemp) {
			if (currWorkout.minTemp > testWeather.temp) {
				continue;
			}
		}
		if(currWorkout.weather) {
			if (currWorkout.weather.indexOf(testWeather.cond) === -1) {
				continue;
			}
		}
		return timeOfDay;
	}
	return;
}
