// Modules divide programs into clusters of code that, by some criterion, belong
// together.

// Structuring things cost energy. In the early stages of a project, when you are
// not quite sure yet what goes where or what kind of modules the program needs
// at all, I endorse a minimalist, structureless attitude.

// Namespacing.
// By default, everything that needs to be visible outside the scope of a top-level
// function is visible everywhere.
// Functions can be used to create an isolated, private namespace inside of a module.
// Objects can be used to create publicly accessible subnamespaces.

// Using functions as namespaces.
// Functions are the only things in JavaScript that create a new scope.
// So if we want out modules to have their own scope, we will have to base them
// on functions.
var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function dayName(number) {
	return names[number];
}

console.log(dayName(1));
// However, the names variable is in global scope. To fix this:
var dayName = function() {
	var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return function(number) {
		return names[number];
	};
}(); // the brackets here indicates a parameter to be passed.

// Another similar pattern to isolate code from outside world entirely. The following
// module logs a value to the console, but does not actually provide any values
// for other modules to use.
(function() {
	function square(x) { return x * x; }
	var hundred = 100;
	console.log(square(hundred));
})();
// In reality, it could be a module that adds a method to some prototype or sets
// up a widget on a web page.
// If an expression starts with the keyword function, it is a function expression.
// If a statement starts with function, it is a function declaration, which requires a name
// and, not being an expression, cannot be called by writing parentheses after it.
// The extra wrapping paratheses as a trick to force the function to be interpreted
// as an expression.

var weekDay = function() {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
  return {
    name: function(number) { return names[number]; },
    number: function(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday

(function(exports) {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];

  exports.name = function(number) {
    return names[number];
  };
  exports.number = function(name) {
    return names.indexOf(name);
  };
})(this.weekDay = {}); // Outside of a function, this refers to the global scope object.

console.log(weekDay.name(weekDay.number("Saturday")));
// → Saturday

// Detaching from the global scope.
// The previous pattern is commonly used by js modules intended for the browser.
// Problem: multiple modules happen to claim the same name or if you want to load two
// versions of a module alongside each other.


// Another pattern: allows one module to directly ask for the interface object of another
// module, without going through the global scope.
// For require, we need two things. First, we want a function readFile, which
// returns the content of a given file as a string. Second, we need to be able
// to actually execute this string as JavaScript code.

// Javascript : use of Function constructor.
// Take two arguments: a string containing a comma-separated list of argument
// names and a string containing the function's body.
var plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5

// One way to run the code.
function evalAndReturnX(code) {
	eval(code);
	return x;
}

console.log(evalAndReturnX("var x = 2"));

// REQUIRE
// readFile returns the cotent of a given file as a string.
// function require(name) {
// 	var code = new Function("exports", readFile(name));
// 	var exports = {};
// 	code(exports);
// 	return exports;
// }

// console.log(require("weekDay").name(1));
// Some disadvantages:
// 1. load a module every tiem it is required.
// 2. it is not possible for a module to directly export a value other than the
// exports object, such as a function.
function require(name) {
	if (name in require.cache) {
		return require.cache[name];
	}
	var code = new Function("exports, module", readFile(name));
	var exports = {}, module = {exports: exports};
	code(exports, module);

	require.cache[name] = module.exports;
	return module.exports;
}

require.cache = Object.create(null);
// This style of module system is called CommonJS modules, after the pseudostandard
// that first specified it.

// Slow-loading modules.
// Reading a file(module) from the Web is a lot slower than reading it from the
// hard disk.
// One way to resolve this is to run a program like Browserify on code before it
// serve on a web page.
// Another solution is to wrap the code that makes up your module in a function
// so that the module loader can first load its dependencies in the background
// and then call the function, initializing the module, whe the dependencies
// have been loaded. This is what the Asynchronous Module Definition (AMD) module
// system does.
define([], function() {
	var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
    return {
    	name : function(number) { return names[number]; },
    	number : function(name) { return names.indexOf(name); }
    };
});

// the implementaion of define will use objects that describe the state of modules.
// telling us whether they are available yet and providing their interface when
// they are.
var defineCache = Object.create(null);
var currentMod = null;

function getModule(name) {
	if (name in defineCache) {
		return defineCache[name];
	}
	var module = {exports: null, loaded: false, onLoad: []};
	defineCache[name] = module;
	backgroundReadFile(name, function(code) {
		currentMod = module;
		new Function("", code)();
	});
	return module;
}
// The loaded file also contains a single call to define. The currentMod
// variable is used to tell this call about the module object that is currently
// being loaded so that it can update this object when it finishes loading.
function define(depNames, moduleFunction) {
	var myMod = currentMod;
	// fetch or create the module objects for the current module's dependencies.
	var deps = depNames.map(getModule);
	deps.forEach(function(mod) {
		if (!mod.loaded) {
			// For this purpose, it defines a function whenDesLoaded that is added
			// to the onLoad array of all dependencies that are not yet loaded.
			mod.onLoad.push(whenDesLoaded);
		}
	});
	function whenDesLoaded() {
		if (!deps.every(function(m) {return m.loaded; })) {
			return;
		}
		var args = deps.map(function(m) { return m.exports});
		// call the functuons that are waiting for the module to load.
		var exports = moduleFunction.apply(null, args);
		if (myMod) {
			myMod.exports = exports;
			myMod.loaded = true;
			myMod.onLoad.forEach(functuon(f) { f(); });
		}
		whenDesLoaded();
	}
}
// This code is a lot harder to follow than the require function. Its execution
// does not follow a simple, predictable path. Instead, multiple operations are
// set up to happen at some unspecified time in the future, which obscures the
// way the code executes.

// Summary
// Modules provide structure to bigger programs by separating the code into different
// files and namespaces. Giving these modules well-defined interfaces makes them
// easier to use and reuse and makes it possible to continue using them as the module
// itself evolves.

// Though the js langauge is characteristically unhelpful when it comes to
// modules, the flexible functions and objects it provides make it possible to
// define rather nice module systems. Function scopes can be used as internal
// namespaces for the module, and objects can be used to store sets of exported
// values.

// There are two popular, well-defined approached to such modules. One is called
// CommonJS Modules and revolves around a require function that fetches a module
// by name and returns its interface. The other is called AMD, and uses a define
// function and, after loading the modules, runs the function with their interfaces
// as arguments.

// Exercises:
// Exercises1 : Month names.
var month = function() {
  var names = ["January", "February", "March", "April", "May",
               "June", "July", "August", "September", "October",
               "November", "December"];
  return {
    name: function(number) { return names[number]; },
    number: function(name) { return names.indexOf(name); }
  };
}();

console.log(month.name(2));
// → March
console.log(month.number("November"));
// → 10
