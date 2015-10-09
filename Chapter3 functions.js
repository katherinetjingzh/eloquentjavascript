var square = function(x) {
	return x * x;
}

console.log(square(12));


// variables created inside of functions including their parameters, are local to the function. 
var powerBasic = function(base, exponent) {
	var result = 1;
	for (var count = 0; count < exponent; ++count) {
		result *= base;
	}
	return result;
}

console.log(powerBasic(2, 10));

// Global variable and local variable.
var x = "outside";

var f1 = function() {
  var x = "inside f1";
};
f1();
console.log(x);
// → outside

var f2 = function() {
  x = "inside f2";
};
f2();
console.log(x);
// → inside f2

// nested scope.
// Each local scope can also see all the local scopes that contain it. 
// Lexcial scoping.
// In js, functions are the only things that create a new scope.
var landscape = function() {
  var result = "";
  var flat = function(size) {
    for (var count = 0; count < size; count++)
      result += "_";
  };
  var mountain = function(size) {
    result += "/";
    for (var count = 0; count < size; count++)
      result += "'";
    result += "\\";
  };

  flat(3);
  mountain(4);
  flat(6);
  mountain(1);
  flat(1);
  return result;
};

console.log(landscape());


// Difference between a function value and function name.
var launchMissiles = function(value) {
  missileSystem.launch("now");
};
if (true)
  launchMissiles = function(value) {/* do nothing */console.log(value)};
  
launchMissiles(999);

// A shorter way to declare a function.
function square(x) {
	return x * x;
}

// functions can be conceptually moved to the top of their scope and can be used by all the code in that scope.
console.log("The future says:", future());

function future() {
	return "We STILL have no flying cars.";
}

// Optional arguments
function power(base, exponent) {
	if (exponent == undefined) 
		exponent = 2;
	var result = 1;
	for (var count = 0; count < exponent; ++count) {
		result *= base;
	}
	return result;
}

console.log(power(4));
console.log(power(4 ,3));

console.log("R", 2, "D", 2);

// The feature - being able to reference a specific instance of local variables in an enclosing function - is called closure.
// The function that closes over some local variable is called a closure.
function multiplier(factor) {
	return function (number) {
		return number * factor;
	};
}

var twice = multiplier(2);
console.log(twice(5));


// An example using recursive
function findSolution(target) {
	function find(start, history) {
		if (start == target) 
			return history;
		else if (start > target) 
			return null;
		else 
			return find(start + 5, "(" + history + " + 5)") ||
		           find(start * 3, "(" + history + " * 3)");
	}
	return find(1, "1");
}

console.log(findSolution(24));

// How to desing a function.
// called for its return values.
function zeroPad(number, width) {
	var string = String(number);
	while (string.length < width) {
		string = "0" + string;
	}
	return string;
}

// 
function printFarmInventory(cows, chickens, pigs) {
	console.log(zeroPad(cows, 3) + " Cows");
	console.log(zeroPad(chickens, 3) + " chickens");
	console.log(zeroPad(pigs, 3) + " Pigs");
}

printFarmInventory(1, 2 , 3);

// A pure function is a specific kind of value-producing function that not only has no side effects, but also doesn't 
// rely on side effects from other code - for example, it doesn't read global variables that are occasionally changed
// by other code.

// Two ways to declare a function.
// Create a function value f.
var f = function(a) {
	console.log(a + 2);
}

// Declare g to be a function
function g(a, b) {
	return a * b * 3.5;
}


// Exercise 1.
function min(a, b) {
	if (a < b) {
		return a;
	} else {
		return b;
	}
}

console.log(min(0, 10));
console.log(min(0, -10));

// Exercise 2.
function isEven(num) {
	if (num < 0 ) {
		num = -num;
	}
	if (num == 0) {
		return true;
	}
	if (num == 1) {
		return false;
	}
	return isEven(num - 2);
} 

console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-1));

// Exercise 3.
function countChar(string, c) {
	var count = 0;
	for (var i = 0; i < string.length; ++i) {
		if (string.charAt(i) == c) {
			count++;
		}
	}
	return count;
}

function countBs(string) {
	return countChar(string, "B");
}
console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4


