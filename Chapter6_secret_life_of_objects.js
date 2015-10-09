// This chapter describes JavaScript's rather eccentric take on objects and the way they
// relate to some classical object-oriented techniques.
function speak(line) {
	console.log("The " + this.type + " rabbit says '" + line + "'");
}

var whiteRabbit = {type: "white", speak : speak};
var fatRabbit = {type: "fat", speak : speak};

whiteRabbit.speak("Oh my earas and whskers, how late it's getting!");
fatRabbit.speak("I could sure use a carrot right now.");
// apply adn bind methods both take a first argument that can be used to simulate method calls. 
// The first argument is in fact used to give a value to this.
// call can be passed a specific this value. takes its arguments normailly, ranther than an array.
speak.apply(fatRabbit, ["Burp!"]);
speak.call({type: "old"}, "Oh my.");

var empty = {};
console.log(empty.toString);
[Function: toString]
console.log(empty.toString());
[object Object]