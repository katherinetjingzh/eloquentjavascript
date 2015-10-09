// Exercise 1
for (var line = "#"; line.length < 8; line += "#") {
	console.log(line);
}

// Exercise 2
for (var i = 1; i < 100; ++i) {
	if (i  % 3 == 0 && i % 5 == 0) { 
		console.log("FizzBuzz");
	} else if (i % 3 == 0) {
		console.log("Fizz");
	} else if (i % 5 == 0) {
		console.log("Buzz");
	} else {
		console.log(i);
	}
}

for (var n = 1; n <= 100; ++n) {
	var output = "";
	if (n % 3 == 0) {
		output += "Fizz";
	}
	if (n % 5 == 0) {
		output += "Buzz";
	}
	console.log(output || n);
}
// Exercise 3
var first = "";
var second = "";

for (var n = 0; n < 4; ++n) {
	first += " #";
	second += "# ";
}

for (var n = 1; n <= 8; n+=2) {
	console.log(first);
	console.log(second);
}

var size = 8;
var board = "";

for (var y = 0; y < size; ++y) {
	for (var x = 0; x < size; ++x) {
		if ((x + y) % 2 == 0) {
			board += " ";
		} else {
			board += "#";
		}
	}
	board += "\n";
}

console.log(board);
