// This chapter describes JavaScript's rather eccentric take on objects and the way they
// relate to some classical object-oriented techniques.
function speak(line) {
	console.log("The " + this.type + " rabbit says '" + line + "'");
}

var whiteRabbit = {type: "white", speak : speak};
var fatRabbit = {type: "fat", speak : speak};

whiteRabbit.speak("Oh my earas and whskers, how late it's getting!");
fatRabbit.speak("I could sure use a carrot right now.");
// apply and bind methods both take a first argument that can be used to simulate method calls. 
// The first argument is in fact used to give a value to this.
speak.apply(fatRabbit, ["Burp!"]);
// call can be passed a specific this value. takes its arguments normally, ranther than an array.
speak.call({type: "old"}, "Oh my.");

var empty = {};
console.log(empty.toString);
//[Function: toString]
console.log(empty.toString());
//[object Object]

// In addition to their set of properties, almost all objects also have a prototype.
// A prototype is another object that is used as a fallback source of properties.
// When an object gets a request for a property that it does not have, its prototype will be searched for the property,
// then the prototype’s prototype, and so on.
console.log(Object.getPrototypeOf({}) == Object.prototype);
console.log(Object.getPrototypeOf(Object.prototype));

console.log(Object.getPrototypeOf(isNaN) == Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) == Array.prototype);
// → true

// Can use Object.create to create an object with a specific prototype.
var protoRabbit = {
	speak : function(line) {
		console.log("The " + this.type + " rabbit says '" + line + "'");
	}
};

var killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREEEE!");

// A more convenient way to create objects that derive from some shared prototype is to use a constructor. 
// In javascript, calling a function with the new keyword in front of it causes it to tbe treated as a 
// constructor. 
// Constructors (all functions) automatically get a property names prototype, which by default holds a plain.
// empty object that derives from Object.prototype. Every instance created with this constructor will have this 
// object as its prototype.
function Rabbit(type) {
	this.type = type;
}

Rabbit.prototype.speak  = function(line) {
	console.log("The " + this.type + " rabbit says '" + line + "'");
}

var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");
console.log(blackRabbit.type);
blackRabbit.speak("Doom...");
// This is wrong : Rabbit.speak("Hi");


// Note: difference between the way a prototype is associated with a constructor (through its prototype property)
// and the way objects have a prototype(can be retrieved with Object.getPrototypeOf). The actual prototype of a 
// a constructor is Function.prototype since constructors are functions. Its prototype property will be the prototype of 
// instances created through it but is not its own prototype.


// Overriding
// Add a property to an object, whether it is present in the prototype of not, the property is added to the object itself.
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth);
console.log(blackRabbit.teeth);
console.log(Rabbit.prototype.teeth);

console.log(Array.prototype.toString == Object.prototype.toString);
console.log([1, 2].toString()); // similar to .join(",")
console.log(Object.prototype.toString.call([1,2]));
// [object Array] since it does not know how to interpret array for an Object.

// A prototype can be used at any time to add new properties and methods to all objects based on it. 
Rabbit.prototype.dance = function() {
	console.log("The " + this.type + " rabbit dance a jig.");
};

killerRabbit.dance();

// some problem.
var map = {};
function storePi(event, phi) {
	map[event] = phi;
}
storePi("pizza", 0.7);
storePi("touched tree", -1);

Object.prototype.nonsense = "hi";
for (var name in map) {
	console.log(name);
}
console.log("nonsense" in map);
console.log("toString" in map);

// Delete the problematic property again.
delete Object.prototype.nonsense;
// why nonsense shows up in the loop but not toString? js distinguished between enumerable and noneumerable.
// All properties that we reate by simply assigning to them are enumerable. The standard properties in Object.prototype are all
// nonenumerable.
Object.defineProperty(Object.prototype, "hiddenNonsense", {enumerable : false, value : "hi"});

for (var name in map) {
	console.log(name);
}
console.log(map.hiddenNonsense);
console.log(map.hasOwnProperty("toString"));


// Create a fresh object from null to fix the problem of safety use of for /in loops.
var map = Object.create(null);
map["pizza"] = 0.069;
console.log("toString" in map);
console.log("pizza" in map);


//test data
var MOUNTAINS = [
  {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
  {name: "Everest", height: 8848, country: "Nepal"},
  {name: "Mount Fuji", height: 3776, country: "Japan"},
  {name: "Mont Blanc", height: 4808, country: "Italy/France"},
  {name: "Vaalserberg", height: 323, country: "Netherlands"},
  {name: "Denali", height: 6168, country: "United States"},
  {name: "Popocatepetl", height: 5465, country: "Mexico"}
];

if (typeof module != "undefined" && module.exports)
  module.exports = MOUNTAINS;

// Create table-building system.
// rows is an array of array
// return value is an array of values : use map
function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

// it is like this in c++: outer is col_num: inner is row_num;
// int[] colWidth(int [] rows, int row_num, int col_num) {
// 	for (int j = 0; j < col_num; ++j) {
// 	  for (int i = 0; i < row_num; ++i) {
// 		if (rows[i].minWidth() > rows[0].minWidth()) {
// 			rows[0],minWidth() = rows[i].minWidth();
// 		}
// 	  }
// 	}
// }

function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}

function repeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++)
    result += string;
  return result;
}

function TextCell(text) {
  this.text = text.split("\n");
}
TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};
TextCell.prototype.minHeight = function() {
  return this.text.length;
};
TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};

var rows = [];
for (var i = 0; i < 5; i++) {
   var row = [];
   for (var j = 0; j < 5; j++) {
     if ((j + i) % 2 == 0)
       row.push(new TextCell("##"));
     else
       row.push(new TextCell("  "));
   }
   rows.push(row);
}
console.log(drawTable(rows));
console.log("\n");

// A way to extend types is throught composition.
// UnderlinedCell builds on another cell object by simply storing it in a property
// and forwarding method calls to it in its own methods.
function UnderlinedCell(inner) {
  this.inner = inner;
};
UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};
UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
};
UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1)
    .concat([repeat("-", width)]);
};

// Javascript provides a technique: get or set notation.
// We can sepcify properties that, from the outside, look like normal properties
// but secretly have methods associated with them.
var pile = {
  elements: ["eggshell", "orange peel", "worm"],
  get height() {
    return this.elements.length;
  },
  set height(value) {
    console.log("Ignoring attempt to set height to", value);
  }
};

console.log(pile.height);
// → 3
pile.height = 100;
// → Ignoring attempt to set height to 100

// defineProperty can be used to create nonenumerable properties.
Object.defineProperty(TextCell.prototype, "heightProp", {
  get: function() { return this.text.length; }
});

var cell = new TextCell("no\nway");
console.log(cell.heightProp);
// → 2
cell.heightProp = 100;
console.log(cell.heightProp);
// → 2


// Inheritance:
function RTextCell(text) {
  TextCell.call(this, text);
}
RTextCell.prototype = Object.create(TextCell.prototype);
RTextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(repeat(" ", width - line.length) + line);
  }
  return result;
};

function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      var value = row[name];
      // This was changed:
      if (typeof value == "number")
        return new RTextCell(String(value));
      else
        return new TextCell(String(value));
    });
  });
  return [headers].concat(body);
}

console.log(drawTable(dataTable(MOUNTAINS)));

// The instanceof operator
// The operator see through inherited types, eg : almost every object is an instance of Object. 
console.log(new RTextCell("A") instanceof RTextCell);
// → true
console.log(new RTextCell("A") instanceof TextCell);
// → true
console.log(new TextCell("A") instanceof RTextCell);
// → false
console.log([1] instanceof Array);
// → true

// Exercise 1: A vector type.
// Constructor. (just like a function)
function Vector(x, y) {
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(another) {
	return new Vector(this.x + another.x , this.y + another.y);
}

Vector.prototype.minus = function(another) {
	return new Vector(this.x - another.x , this.y - another.y);
}

// This is wrong, it creates a methond instead of a property.
// Vector.prototype.length = function() {
// 	return Math.sqrt(x * x + y * y);
// } 
Object.defineProperty(Vector.prototype, "length", 
{
	get : function() { return Math.sqrt(this.x * this.x + this.y * this.y); }
});


console.log(new Vector(1, 2).plus(new Vector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(new Vector(3, 4).length);
// → 5

// Exercise 2: Stretched Cell. Wraps around a textCell
function StretchCell(inner, min_width, min_height) {
	this.inner = inner;
	this.min_width = min_width;
	this.min_height = min_height;
}

StretchCell.prototype.minWidth = function() {
	return Math.max(this.inner.minWidth(), this.min_width);
}

StretchCell.prototype.minHeight = function() {
	return Math.max(this.inner.minHeight(), this.min_height);
}

UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1)
    .concat([repeat("-", width)]);
};
StretchCell.prototype.draw = function(width, height) {
	return this.inner.draw(width, height);

};

var sc = new StretchCell(new TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
// → 2
console.log(sc.draw(3, 2));
// → ["abc", "   "]
console.log("\n");

// Exercise 3: SEQUENCE INTERFACE.
// MyEnumerable function() {
// 	var hasNext()
// }
// I am going to use a system where a sequence object has two methods:
//
// * next(), which returns a boolean indicating whether there are more
//   elements in the sequence, and moves it forward to the next
//   element when there are.
//
// * current(), which returns the current element, and should only be
//   called after next() has returned true at least once.
function logFive(sequence) {
	for (var i = 0; i < 5; ++i) {
		if (!sequence.hasNext()) {
			break;
		}
		console.log(sequence.current());
	}
}

function ArraySeq(array) {
	this.m_array = array;
	this.current_index = 0;
}

ArraySeq.prototype.hasNext = function() {
	return this.current_index < this.m_array.length;
}

ArraySeq.prototype.current = function() {
	var result = this.m_array[this.current_index];
	this.current_index++;
	return result;
}

logFive(new ArraySeq([1, 2]));
logFive(new ArraySeq([1, 0, - 1]));
logFive(new ArraySeq([1, 2, 3, 4, 5, 6]));
// → 1
// → 2
// logFive(new RangeSeq(100, 104));
// → 100
// → 101
// → 102
// → 103
// → 104

function RangeSeq(from, to) {
	this.from = from;
	this.to = to;
}

RangeSeq.prototype.hasNext = function() {
	// including the last element.
	if (this.from <= this.to) {
		return true;
	}
	return false;
}

RangeSeq.prototype.current = function() {
	var result = this.from;
	this.from++;
	return result;
}

logFive(new RangeSeq(100, 108));
logFive(new RangeSeq(100, 103));
logFive(new RangeSeq(1,1));
logFive(new RangeSeq(1, -1)); // Note : this version can only go in the forward direction.


// This alternative approach represents the empty sequence as null,
// and gives non-empty sequences two methods:
//
// * head() returns the element at the start of the sequence.
// 
// * rest() returns the rest of the sequence, or null if there are no
//   elemements left.
//
// Because a JavaScript constructor can not return null, we add a make
// function to constructors of this type of sequence, which constructs
// a sequence, or returns null if the resulting sequence would be
// empty.

// This version is to remove the side effects.
function logFive2(sequence) {
  for (var i = 0; i < 5 && sequence != null; i++) {
    console.log(sequence.head());
    sequence = sequence.rest();
  }
}

function ArraySeq2(array, offset) {
  this.array = array;
  this.offset = offset;
}
ArraySeq2.prototype.rest = function() {
  return ArraySeq2.make(this.array, this.offset + 1);
};
ArraySeq2.prototype.head = function() {
  return this.array[this.offset];
};
ArraySeq2.make = function(array, offset) {
  if (offset == null) offset = 0;
  if (offset >= array.length)
    return null;
  else
    return new ArraySeq2(array, offset);
};

function RangeSeq2(from, to) {
  this.from = from;
  this.to = to;
}
RangeSeq2.prototype.rest = function() {
  return RangeSeq2.make(this.from + 1, this.to);
};
RangeSeq2.prototype.head = function() {
  return this.from;
};
RangeSeq2.make = function(from, to) {
  if (from > to)
    return null;
  else
    return new RangeSeq2(from, to);
};

logFive2(ArraySeq2.make([1, 2]));
// → 1
// → 2
logFive2(RangeSeq2.make(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104
