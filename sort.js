//Major issue: checks for restrictions already in place,
//but doesn't check, for example, that when rest after is required
//the next day is empty before placing workout

//Only get 7 days of weather data at a time

//also need to handle bricks better

var weatherFinder = require('./weather_finder');
console.log(weatherFinder.weatherData, "line10");
var weather = weatherFinder.weatherData;

var plan  = [{day: "sun"}, {day: "mon"}, {day:"tues"}, {day: "wed"}, {day: "thurs"}, {day: "fri"}, {day: "sat"}];

var indexer = {sun: 0, mon: 1, tues: 2, wed: 3, thurs: 4, fri: 5, sat: 6};

var placed = [];



var training = [{name: "swim1",
				type: "swim",
				minTemp: 65,
				weather: ["partly cloudy", "clear"],
				spacingSameType: 2,
				spacingAllType: 1,
				brick: "bike2",
				time: 1
				//day:["wed", "morning"]
				},

				{name: "run1",
				type: "run",
				minTemp: 45,
				maxTemp: 70,
				weather: ["partly cloudy", "cloudy", "clear"],
				spacingSameType: 2,
				restAfterAllType: 1,
				isBrick: true,
				time: 1},

				{name: "run2",
				type: "run",
				minTemp: 45,
				maxTemp: 75,
				weather: ["partly cloudy", "cloudy"],
				spacingSameType: 2,
				restAfterAllType: 1,
				time: 1.5},

				{name: "bike1",
				type: "bike",
				minTemp: 60,
				maxTemp: 80,
				weather: ["partly cloudy", "cloudy", "clear"],
				brick: "run1",
				spacingSameType: 2,
				restAfterAllType: 1,
				time: 2},

				{name: "bike2",
				type: "bike",
				minTemp: 60,
				maxTemp: 80,
				weather: ["partly cloudy", "cloudy", "clear"],
				spacingSameType: 2,
				restAfterAllType: 1,
				isBrick: true,
				time: 3}];




//Place workout with predefined day on that day
for (i = 0; i < training.length; i++) {
	if (training[i].day) {
		var dayName = training[i].day[0];
		var dayIndexer = indexer[dayName];
		//if workout is specified as a brick, place both workouts
		if (training[i].brick) {
			plan[dayIndexer].activity = {};
			plan[dayIndexer].activity[training[i].name] = [training[i].day[1], 1]
			plan[dayIndexer].activity[training[i].brick] = [training[i].day[1], 2];
			placed.push(training[i].name, training[i].brick);
			//Find index of second part of training (aka brick)
			for(var j = 0; j < training.length; j++) {
				if (training[j].name === training[i].brick) {
					var brickIndex = j;
				}
			}
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


//Implement limitations after a workout has been placed
//index is location of workout in training array
//day is day where workout was placed
function restrict(index, day, type) {
	var workout = training[index];
	var dayIndexer = indexer[day];
	if(workout.spacingAllType) {
		var rest = workout.spacingAllType;
		for (var i = -rest; i <= rest; i++) {
			if (i === 0 || plan[dayIndexer - i] === undefined) {
				continue;
			}
			plan[dayIndexer - i].restrict = ["all"];
		}
	}
	if(workout.spacingSameType) {
		var rest = workout.spacingSameType;
		for (var i = -rest; i <= rest; i++) {
			if (i === 0 || plan[dayIndexer - i] === undefined) {
				continue;
			}
			if (!plan[dayIndexer - i].restrict){
				plan[dayIndexer - i].restrict = [type];
			} else if (plan[dayIndexer - i].restrict[0] !== "all" && plan[dayIndexer - i].restrict.indexOf(type) === -1) {
				plan[dayIndexer - i].restrict.push(type);
			}
		}
	}
	if(workout.restAfterAllType) {
		var rest = workout.restAfterAllType;
		for (var i = 1; i <= rest; i++) {
			if(plan[dayIndexer + 1]) {
				plan[dayIndexer + i].restrict = ["all"];
			}
		}
	}
}

//iterate through non-scheduled workouts, check for restrictions, find
//location that meets weather constraints and is not restricted

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
var remain = rank(training);

function whenAvailable(name, callback, arg1, arg2) {
    var interval = 10; // ms
    setTimeout(function() {
        if (name.length > 6) {
            callback(arg1, arg2);
        } else {
            setTimeout(arguments.callee, interval);
        }
    }, interval);
}


//place remaining workouts into plan according to rank
remain.forEach(function (workout) {
	for(var i = 0; i < plan.length; i++) {
		if (workout.restrict.indexOf(i) === -1) {
			console.log("here");
			if (plan[i].restrict === undefined || plan[i].restrict[0] !== "all" && plan[i].restrict.indexOf(training[workout.index].type) === -1) {
				if(whenAvailable(weather, weatherTest, workout.name, i) !== undefined) {
					console.log("working");
					if(!plan[i].activity) {
						var name = workout.name;
						plan[i].activity = {};
						plan[i].activity[name] = [weatherTest(name, i), 1];
						placed.push(name);
						restrict(workout.index, plan[i].day, training[workout.index].type);
						if(training[workout.index].brick){
							var brickName = training[workout.index].brick;
						}
						break;
					}
				}
			}
		}
	}
});
setTimeout(function(){console.log(plan)}, 4000);
/*
plan.forEach(function (dayPlan) {
	console.log(dayPlan.day + " ");
	for(var key in dayPlan.activity) {
		console.log(dayPlan.activity[key][0] + ": " + key)
	};
});*/

// returns earliest possible time of day, or undefined if
// workout cannot be placed that day
function weatherTest(workoutName, dayIndex) {
//convert day index to position of first day in weatherTest
//to access correct position in weather array
	dayIndex -= weather[0].day;
	if (dayIndex < 0) dayIndex += weather.length;
	//find index in training array of workout passed into
	//function as argument
	for (var i = 0; i < training.length; i++) {
		if (training[i].name === workoutName) {
			var workoutIndex = i;
			break;
		}
	}
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
