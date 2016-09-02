function randTemp (high, range) {
	var change = Math.floor(Math.random()*range);
	return high - change;
}

function randCond () {
	var select = Math.ceil(Math.random()*4).toString();
	var conditions = {1: "sunny", 2: "partly cloudy", 3: "cloudy", 4:"storms"};
	return conditions[select];
}

var training = [{name: "swim1",
				type: "swim",
				minTemp: 65,
				weather: ["partly cloudy", "sunny"],
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
				weather: ["partly cloudy", "cloudy"],
				spacingSameType: 2,
				restAfterAllType: 1,
				isBrick: true,
				time: 1},

				{name: "run2",
				type: "run",
				minTemp: 45,
				maxTemp: 70,
				weather: ["partly cloudy", "cloudy"],
				spacingSameType: 2,
				restAfterAllType: 1,
				time: 1.5},

				{name: "bike1",
				type: "bike",
				minTemp: 60,
				maxTemp: 80,
				weather: ["partly cloudy", "cloudy"],
				brick: "run1",
				spacingSameType: 2,
				restAfterAllType: 1,
				time: 2},

				{name: "bike2",
				type: "bike",
				minTemp: 60,
				maxTemp: 80,
				weather: ["partly cloudy", "cloudy"],
				spacingSameType: 2,
				restAfterAllType: 1,
				isBrick: true,
				time: 3}];

var weather = [{day: "mon",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()
				}},

			   {day: "tues",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}},

			   {day: "wed",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}},

			   {day: "thurs",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}},

			   {day: "fri",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}},

			   {day: "sat",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}},

			   {day: "sun",
				morning: {
					temp: randTemp(65,20),
					cond: randCond()
				},
				midDay: {
					temp: randTemp(100,20),
					cond: randCond()
				},
				night: {
					temp: randTemp(75,20),
					cond: randCond()}}];

