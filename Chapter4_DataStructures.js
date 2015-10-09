var listOfNumbers = [2, 3, 5, 7, 11];
// The elements in an array are stored in properties.
// Because the names of these properties are numbers and we often need to get their name from a variable,
// we have to use the bracket syntax to access them.
console.log(listOfNumbers[1]);
console.log(listOfNumbers[1 - 1]);

// property: myString.length Math.max
// null and undefined do not have properties

// Difference between . and [] to access property
// Whereas value.x fetches the property of value named “x”, value[x] tries to
// evaluate the expression x and uses the result as the property name.


// string and array obejcts contain a number of properties that refer to function values.
// Properties that contain functions are generally called methods of the value the belong to.

var doh = "Doh";
console.log(typeof doh.toUpperCase);
console.log(doh.toUpperCase());

var mack = [];
mack.push("Mack");
mack.push("the", "Knife");
console.log(mack);
// → ["Mack", "the", "Knife"]
console.log(mack.join(" "));
// → Mack the Knife
console.log(mack.pop());
// → Knife
console.log(mack);
// → ["Mack", "the"]


// Objects
var day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running",
           "television"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false


// delete a property
var anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true

// Mutability
// Numbers, strings and Booleans are all immutable.

// == operator, when comparing objects, will return true only of both objects are precisely the same value. Comparing 
// different objects will return false, even if they have identical contents. There is no "deep" comparison operation 
// build into JavaScript, which looks object's content, but it is possible to write one on your own.

var map = {}
function storePhi(event, phi) {
  map[event] = phi;
}

// loop of map
for (var event in map) {
	console.log("The correlation for  '" + event + "' is " + map[event]);
}

var todoList = [];
function rememberTo(task) {
  todoList.push(task);
}
function whatIsNext() {
  return todoList.shift();
}
function urgentlyRememberTo(task) {
  todoList.unshift(task);
}

console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]

function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]


// string, number and Boolean are not objects, and are immutable and cannot add property to it.
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5

console.log("  okay \n ".trim());
// → okay

// The argument objects.
// Whenever a function is called, a special variable names arguments is added to the env in which the function body runs.
// This variable refers to an object that holds all of the arguments passed to the function.
// It is not an array, and u cannot use the properties of array.
journal = [];
function addEntry(squirrel) {
	var entry = {events : [], squirrel : squirrel};
	for (var i = 1; i < arguments.length; ++i) {
		entry.events.push(arguments[i]);
	}
	journal.push(entry);
} 

addEntry(true, "work", "touched tree", "pizza", "running", "television");


// Exercsie 1.
function range(start, end, step) {
	if (step == null) {
		step = 1;
	}

	var array = [];
	if (step > 0) {
		for (var i = start ; i <= end; i+=step) {
			array.push(i);
		}
	} else {
		for (var i = start; i >= end; i+=step) {
			array.push(i);

		}
	}
	return array;
}

function sum(array) {
	var sum = 0;
	for (var i = 0; i < array.length; ++i) {
		sum += array[i];
	}
	return sum;
}
test = [1,2,3,4,5,6,7,8,9,10];
console.log(sum(range(1, 10)));
console.log(sum(range(5,2,-1)));

// Exercise 2. Reverse array
function reverseArray(input) {
	var newArray = [];
	for (var i = input.length - 1; i >= 0; --i) {
		newArray.push(input[i]);
	}
	return newArray;
}

function reverseArrayInPlace(input) {
	var start = 0, end = input.length - 1;
	while (start < end) {
		var tmp = input[start];
		input[start] = input[end];
		input[end] = tmp;
		start++;
		end--;
	}
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]

// Exercise 3: List
function arrayToList(array) {
	var list = null;
	for (var i = array.length - 1; i >= 0; --i) {
		list = {
			value : array[i],
			rest : list
		}
	}
	return list;
}

function listToArray(list) {
	var array = [];
	while(list != null) {
		array.push(list.value);
		list = list.rest;
	}
	return array;
}

function prepend(x, list) {
	list = {
		value : x,
		rest : list
	}
	return list;
}

// function nth(list, n) {
// 	while (n--) {
// 		console.log(list);
// 		if (list != null) {
// 			list = list.rest;
// 		} else {
// 			return null;
// 		}	
// 	}
// 	if (list != null) {
// 		return list.value;
// 	} else {
// 		return null;
// 	}
// }

function nth(list, n) {
	if (list == undefined) {
		return undefined;
	} else if (n == 0) {
		return list.value;
	} else {
		return nth(list.rest, n - 1);
	}
}



console.log(arrayToList([10, 20, 30]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 2));
// → 20


// Exercise 4: Deep Equal
// JavaScript has both strict and type-converting equality comparison. For strict equality the objects being compared must have the same type and:

// Two strings are strictly equal when they have the same sequence of characters, same length, and same characters in corresponding positions.
// Two numbers are strictly equal when they are numerically equal (have the same number value). NaN is not equal to anything, including NaN. Positive and negative zeros are equal to one another.
// Two Boolean operands are strictly equal if both are true or both are false.
// Two objects are strictly equal if they refer to the same Object.
// Null and Undefined types are == (but not ===). [I.e. Null==Undefined (but not Null===Undefined0 == false   // true
// 0 === false  // false, because they are of a different type
// 1 == "1"     // true, automatic type conversion for value only
// 1 === "1"    // false, because they are of a different type
// null == undefined // true
// null === undefined // false
// '0' == false // true
// '0' === false // false
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (a == null || typeof a != "object" ||
      b == null || typeof b != "object")
    return false;

  // only compares when both are objects.
  // test for objects look something like : typeof x == "Object" && x != null
  var propsInA = 0, propsInB = 0;

  for (var prop in a)
    propsInA += 1;

  for (var prop in b) {
    propsInB += 1;
    if (!(prop in a) || !deepEqual(a[prop], b[prop]))
      return false;
  }

  return propsInA == propsInB;
}

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true

