// Note: most of the code in this chapter is commented, since they are realted 
// to exceptions or debuggings and cannot run on my terminal.

// JavaScript can be made a little more strict by enabling strict mode. This is
// done by putting the string "use strict" at the top of a file or a function
// body. 


// When you forget to put var in front of your variable, js quitely creates a
// global variable and uses that.
// In strict mode, however, an error is reported instead.
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++)
    console.log("Happy happy");
}
// → ReferenceError: counter is not defined

// Another change in strict mode is that the this binding holds the value 
// undefined in functions that are not called as methods. When making such a
// call outside of strict mode, this refers to the global scope object. So if 
// you accidently call a method or constructor incorrectly in strict mode, js
// will produce an error as soon as it tries to read something from this, rather
// than happily working with the global object, creating and reading global
// variables.

// For example, which calls a constructor without the new keyword so that its 
// this will not refer to a newly constructed object.
function Person(name) {
	this.name = name;
}

var feridnand = Person("Ferdinand");
console.log(name);
// console.log(feridnand.name); // Cannot read property 'name' of undefined

"use strict";
function Person(name) { this.name = name; }
// Oops, forgot 'new'
var ferdinand = Person("Ferdinand");
// → TypeError: Cannot set property 'name' of undefined

// Strict mode does a few more things. It disallows giving a function multiple
// parameters with the same name and removes certain problematic language 
// features entirely.

// Debugging method:
// 1. Console.log
// 2. Set breakpoint at Web developer.
// 3. Another way to set a breakpoint is to include a debugger statement
// (consisting of simply that keyword) in your program.

// Exceptions: raising an exception somewhat resembles a super-charged return
// from a function : it kumps out of not just the current function but also out
// of its callers, all the way down to the first call that started the current
// execution. This is called unwinding the stack.
function promptDirection(question) {
  var result = prompt(question, "");
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L")
    return "a house";
  else
    return "two angry bears";
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
}

// After the catch block finishes—or if the try block finishes without
// problems—control proceeds beneath the entire try/catch statement.
// Error constructor can create our exception value. 
// It creates an object with a message property.
// in modern js environments, instances of this constructor also gather info 
// about the call stack that existed when the exception was created, a so-called
// stack trace. The info is stored in the stack property and can be helpful when
// trying to debug a problem.

// When an exception makes it all the way to the bottom of the stack without 
// being caught, it gets handled by the envirnment. 

// Invalid uses of the languages, such as referencing a nonexistent variable,
// looking up a property on null, or calling something that's not a function.
// will also result in exceptions being raised.

function InputError(message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
InputError.prototype = Object.create(Error.prototype);
InputError.prototype.name = "InputError";

function promptDirection(question) {
  var result = prompt(question, "");
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}

for (;;) {
  try {
    var dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError)
      console.log("Not a valid direction. Try again.");
    else
      throw e;
  }
}

// Assertions are a tool to do basic sanity checking for programmer errors. 
// Assertions are a way to make sure mistakes cause failures at the point of the 
// mistake, rather than silently producing nonsense values that may go on to
// cause trouble in an unrelated part of the system.
function AssertionFailed(message) {
  this.message = message;
}
AssertionFailed.prototype = Object.create(Error.prototype);

function assert(test, message) {
  if (!test)
    throw new AssertionFailed(message);
}

function lastElement(array) {
  assert(array.length > 0, "empty array in lastElement");
  return array[array.length - 1];
}

// Exercise 1 : RETRY
function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5)
    return a * b;
  else
    throw new MultiplicatorUnitFailure();
}

function reliableMultiply(a, b) {
	while (true) {
		try {
			return primitiveMultiply(a, b);
		} catch(e) {
			if (! e instanceof MultiplicatorUnitFailure) {
				throw e;
			}
		}
	}
}

console.log(reliableMultiply(8, 8));
// → 64

// Exercise 2: Locked box (simulation of lock).
var box = {
  locked: true,
  unlock: function() { this.locked = false; },
  lock: function() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
  var locked = box.locked;
  if (!locked) {
  	return body();
  }
  box.unlock();
  try {
  	return body();
  } finally {
  	box.locked();
  }
};

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}
console.log(box.locked);
// → true