// Regular expressions are a way to describe patterns in string data.
// A regular expression is a type of object. It can either be constructed with 
// the RegExp constructor or writtern as a literal value by enclosing the pattern
// in forward slash(/) characters.
var re1 = new RegExp("abc");
var re2 = /abc/;

// Backslashes that are not part of special character codes will be preserved.
// var blackSlash = /\/; // wrong
var blackSlash = /\\/;
console.log(blackSlash); 
// -> /\\/

var eighteenPlus = /eighteen\+/;
console.log(eighteenPlus);
// -> /eighteen\+/

// Testing: if you pass a string, test function will return a Boolean telling you
// whether the string contains a match of the pattern in the expression.
console.log(/abc/.test("abcde"));
console.log(/abc/.test("abxde"));

console.log(/[0123456789]/.test("in 1992"));
console.log(/[0-9]/.test("in 1992"));

// There are a number of common character groups that have their own built-in
// shortcuts.
// \d  Any digit character
// \w  An alphanumeric character("word character")
// \s  Any whitespcae character(space, tab, newline, and similar)
// \D  A character that is not a digit
// \W  A nonalphanumeric character
// \S  A nonwhitespace character
// .   Any character except for newline
var dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("30-01-2003 15:20"));
// → true
console.log(dateTime.test("30-jan-2003 15:20"));
// → false

// These backslash codes can also be used inside square brackets.
// For example, [\d.] means any digit or a period character. But note that the period 
// itself, when used between square brackets, loses its special meaning.
// to invert a set of characters, to express that you want to match any 
// character except the ones in the set.
var notBinary = /[^01]/;
console.log(notBinary.test("1100100010100110"));
// → false
console.log(notBinary.test("1100100010200110"));
// → true
console.log(/'\d+'/.test("'123'"));
// → true
console.log(/'\d+'/.test("''"));
// → false
console.log(/'\d*'/.test("'123'"));
// → true
console.log(/'\d*'/.test("''"));
// → true

var neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true

var dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("30-1-2003 8:45"));
// → true

// Grouping subexpressions.
// i in the only make it case-insensitive
var cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// → true

// matches and groups
// Exec method return null if no match was foudn and return an object with info
// about the match otherwise.
var match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
console.log("one two 100".match(/\d+/));
// → ["100"]

// The whole match is always the first element. The next element is the part matched
// by the first group (the one whose opening paranthesis comes first in the expressionn),
// then the second group, and so on.
var quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// → ["'hello'", "hello"]

// When a group does not end up being matched at all(eg: when followed by a ?),
// its position in the output array will hold undefined.
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
// When a group is matched multiple times, only the last match end up in the array.
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
// Groups can be useful for extracting parts of a string.


// Date object.
// current date;
console.log(new Date());
console.log(new Date(2009, 11, 9));
// → Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Wed Dec 09 2009 12:59:59 GMT+0100 (CET)
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Thu Dec 19 2013 00:00:00 GMT+0100 (CET)

// Javascript uses a convention where month numbers start at zero(so Dec is 11),
// yet day numbers start at one.
function findDate(string) {
  var dateTime = /(\d{1,2})-(\d{1,2})-(\d{4})/;
  var match = dateTime.exec(string);
  return new Date(Number(match[3]),
                  Number(match[2]) - 1,
                  Number(match[1]));
}
console.log(findDate("30-1-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)

// Word and String boundaries.
// If we want to enforce that the match must span the whole string, we can add
// the markers ^ and $. 
// /^\d+$/ matches a string consisting entirely of one or more digits, /^!/ 
// matches any string that starts with an exclamation mark, and /x^/ does not
// match any string (there cannot be an x before the start of the string).

// On other hand, we can use the marker \b.
console.log(/cat/.test("concatenate"));
// → true
console.log(/\bcat\b/.test("concatenate"));
// → false

// Choice patterns.
var animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pigchickens"));
// → false

// The replace method.
// The first argument can also be a regular repression, in which the first match
// of the regular expression is replaced.
console.log("papa".replace("p", "m"));
// → mapa
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar

// $1 and $2 in the replacement string refer to the parenthesized groups
// in the pattern.$1 is replaced by the text that matched against the first
// group, $2 by the second, and so on, up to $9. Whole match can be referred to
// with $&.
console.log(
  "Hopper, Grace\nMcCarthy, John\nRitchie, Dennis"
    .replace(/([\w ]+), ([\w ]+)/g, "$2 $1"));
// → Grace Hopper
//   John McCarthy
//   Dennis Ritchie

var s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, function(str) {
  return str.toUpperCase();
}));
// → the CIA and FBI

var stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) // only one left, remove the 's'
    unit = unit.slice(0, unit.length - 1);
  else if (amount == 0)
    amount = "no";
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// → no lemon, 1 cabbage, and 100 eggs

// Use replace to remove contents.
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}

console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
// Because of this behavior, we say the repetition operators (+, *, ?, and {})
// re greedy, meaning they match as much as they can and backtrack from there. 
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1


// If you put a question mark after them (+?, *?, ??, {}?), they become
// nongreedy and start by matching as little as possible, matching more only
// when the remaining pattern does not fit the smaller match.
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1

// Dynamically creating RegExp objects.
var name = "harry";
var text = "Harry is a suspicious character.";
var regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → _Harry_ is a suspicious character.

var name = "dea+hl[]rd";
var text = "This dea+hl[]rd guy is super annoying.";
var escaped = name.replace(/[^\w\s]/g, "\\$&");
console.log(escaped);
// Escape everything that's not alphanumeric or whitespace.
var regexp = new RegExp("\\b(" + escaped + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → This _dea+hl[]rd_ guy is super annoying.

// The search method.
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1

// Regular expression object have properties. One such property is source,
// which contains the string that expression was created from. Another property 
// is lastIndex, which controls, in some limited circumstances, where the next
// match will start. Those circumstances are that the regular expression must 
// have global (g) option enabled, and the match must happen through the exec 
// method. 
var pattern = /y/g;
pattern.lastIndex = 3;
var match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5

// Note there may be some problem if we are using a global regular expression for
// multiple calls, these automatic updates to the lastIndex property can cause 
// problems.
var digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// → ["1"]
console.log(digit.exec("and now: 1"));
// → null

// match is different from exec, match will find all matches of the pattern in 
// the string and return an array containing the matched strings.
console.log("Banana".match(/an/g));
// → ["an", "an"]

// We perform the match at the start of each iteration, save its result in a 
// variable, and stop looking when no more matches are found.
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40
var input = "A string with 3 numbers in it... 42 and 88.";
var number = /\b(\d+)\b/g;
var match;
while (match = number.exec(input))
  console.log("Found", match[1], "at", match.index);
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40

// Example : parsing a file of a certain format.
// earchengine=http://www.google.com/search?q=$1
// spitefulness=9.7

// ; comments are preceded by a semicolon...
// ; each section concerns an individual enemy
// [larry]
// fullname=Larry Doe
// type=kindergarten bully
// website=http://www.geocities.com/CapeCanaveral/11451

// [gargamel]
// fullname=Gargamel
// type=evil sorcerer
// outputdir=/home/marijn/enemies/gargamel
function parseINI(string) {
	// Start with an object to hold the top-level fields.
	var currentSection = {name : null, fields: {}};
	var categories = [currentSection];

	string.split(/\r?\n/).forEach(function(line) {
		var match;
		// test if it is comment: white lines or white lines with comments.
		if (/^\s*(;.*)?$/.test(line)) {
			return;
		} else if (match = line.match(/^\[(.*)\]$/)) {
			currentSection = {name: match[1], fields:[]};
			categories.push(currentSection);
		} else if (match = line.match(/^(\w+)=(.*)$/)) {
			currentSection.fields.push({name: match[1], value: match[2]});
		} else {
			throw new Error("Line '" + line + "' is invalid.");
		}
	});

    return categories;
}

// Note: the recurring use of ^ and $ is to make sure the expression 

// International characters.
// a word characters is only one of the 26 characters in the Latin alphabet and,
// for some reason, the underscore character.

// Summary

// /abc/	A sequence of characters
// /[abc]/	Any character from a set of characters
// /[^abc]/	Any character not in a set of characters
// /[0-9]/	Any character in a range of characters
// /x+/	One or more occurrences of the pattern x
// /x+?/	One or more occurrences, nongreedy
// /x*/	Zero or more occurrences
// /x?/	Zero or one occurrence
// /x{2,4}/	Between two and four occurrences
// /(abc)/	A group
// /a|b|c/	Any one of several patterns
// /\d/	Any digit character
// /\w/	An alphanumeric character (“word character”)
// /\s/	Any whitespace character
// /./	Any character except newlines
// /\b/	A word boundary
// /^/	Start of input
// /$/	End of input

// An regular expression has a method test to test whether a given string matches
// it. It also has an exec method, that, when a match is found, returns an array
// containing all matched groups. Such an array has an index property that indicates
// where the match started.

// Strings have a match method to match them against a regular expression and a
// search method to search for one, returning only the starting position of the 
// match. Their replace method can replace matches of a pattern with a replacement
// string. 

// Exercises
// Exercise 1: REGEXP GOLF
// Fill in the regular expressions
// car and cat
verify(/ca[rt]/,
       ["my car", "bad cats"],
       ["camper", "high art"]);

// pop and prop
verify(/pr?op/,
       ["pop culture", "mad props"],
       ["plop"]);

// ferret, ferry, and ferrari.
verify(/ferr(et|y|ari)/,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

// Any word ending in ious
verify(/ious\b/,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

// This one is not working.
// verify(/\s(.|,|.|;|)/,
//        ["bad punctuation ."],
//        ["escape the dot"]);
// A whitespace character followed by a dot, comma, colon, or semicolon.
verify(/\s[.,.;]/,
       ["bad punctuation ."],
       ["escape the dot"]);

// A word longer than six letters.
verify(/\w{7,}/,
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

// A word without the letter e.
verify(/\b[a-df-z]+\b/,
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  yes.forEach(function(s) {
    if (!regexp.test(s))
      console.log("Failure to match '" + s + "'");
  });
  no.forEach(function(s) {
    if (regexp.test(s))
      console.log("Unexpected match for '" + s + "'");
  });
}

// Exercise 2: Quoting style
// only replace quotes with a nonword character on at least one side.
var text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));
// → "I'm the cook," he said, "it's my job."

// Exercise 3: Javascript-style number
// Fill in this regular expression.
var number = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;

// var pre_test = /^(\+|-|)$/;
// + in [] do not need to be escaped, but if implemented as option() needed to 
// be escaped.
// ["+", "-", "", "++"].forEach(function(s) {
//   if (!pre_test.test(s))
//     console.log("Failed to match '" + s + "'");
// });

// Tests:
["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
 "1e+12"].forEach(function(s) {
  if (!number.test(s))
    console.log("Failed to match '" + s + "'");
});
["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
 "."].forEach(function(s) {
  if (number.test(s))
    console.log("Incorrectly accepted '" + s + "'");
});
