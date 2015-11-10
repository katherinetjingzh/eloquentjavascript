<!doctype html>
<html>
  <head>
    <title>My home page</title>
  </head>
  <body>
    <h1>My home page</h1>
    <p>Hello, I am Marijn and this is my home page.</p>
    <p>I also wrote a book! Read it
      <a href="http://eloquentjavascript.net">here</a>.</p>
  </body>
</html>

// For each box in the web page element, there is an object, which we can inter-
// act with to find out things such as what HTML tag it represents and which 
// boxes and text it contains. This representation is called the Document Object
// Model, or DOM for short.

// Each DOM node object has a nodeType property, which contains a numeric code
// that identified the type of node.
// Regular elements have the value 1, whcih is also defined as the constant
// property document.Element_NODE. 
// Text nodes, representing a section of text in the document, have the value 3
// (document.TEXT_NODE).
// Comments have the value 8 (document.COMMENT_NODE).

// DOM is not designed for just js. Rather, it tries to define a language-neutral
// interface that can be used in other systems as well - not just HTML but also 
// XML, which is a generic data format with an HTML-like syntax.

// structures: childNodes, parentNode; firstChild, lastChild; previousSibling, 
// nextSibling.

// The following recursive function scans a document for text nodes containing
// a given string and returns true when it has found one:
function talksAbout(node, string) {
  if (node.nodeType == document.ELEMENT_NODE) {
    for (var i = 0; i < node.childNodes.length; i++) {
      if (talksAbout(node.childNodes[i], string))
        return true;
    }
    return false;
  } else if (node.nodeType == document.TEXT_NODE) {
    return node.nodeValue.indexOf(string) > -1;
  }
}

console.log(talksAbout(document.body, "book"));
// → true

// The example document’s body tag does not have just three children (<h1> and
// two <p> elements) but actually has seven: those three, plus the spaces before
// , after, and between them.
// Finding Elements.
var link = document.body.getElementsByTagName("a")[0];
console.log(link.href);

<p>My ostrich Gertrude:</p>
<p><img id="gertrude" src="img/ostrich.png"></p>

<script>
  var ostrich = document.getElementById("gertrude");
  console.log(ostrich.src);
</script>

// Changing the document.
// removeChild, appendChild, insertBefore, replaceChild
// replaceChild : the replaceed node must be a child of the element the method
// is called on.
// A node can exist in the document in only one place. 

// Creating Nodes.
// In the following example, we want to write a script that replaces all images
// (<img> tags) in the document with the text held in their alt attributes,
// which specifies an alternative textual representation of the image.
<p>The <img src="img/cat.png" alt="Cat"> in the
  <img src="img/hat.png" alt="Hat">.</p>

<p><button onclick="replaceImages()">Replace</button></p>

<script>
  function replaceImages() {
    var images = document.body.getElementsByTagName("img");
    for (var i = images.length - 1; i >= 0; i--) {
      var image = images[i];
      if (image.alt) {
        var text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>

// The loop that goes over the images starts at the end of the list of nodes.
// This is necessary because the node list returned by a method like
// getElementsByTagName (or a property like childNodes) is live. That is, it is
// updated as the document changes. If we started from the front, removing the
// first image would cause the list to lose its first element so that the secon
// time the loop repeats, where i is 1, it would stop because the length of the
// collection is now also 1.

// If we want a solid collection of nodes, as opposed to a live one, we can convert
// the collection to a real array by calling the array slice method on it.
var arrayish = {0: "one", 1: "two", length: 2};
var real = Array.prototype.slice.call(arrayish, 0);
real.forEach(function(elt) { console.log(elt); });
// → one
//   two

// To create regular element nodes, we can use the document.createElement method.
// This method takes a tag name and returns a new empty node of the given type.
// The following defines a utility elt, which creates an element node and treats
// the rest of its arguments as children to that node. This function is then used
// to add a simple attribution to a quote.
<blockquote id="quote">
  No book can ever be finished. While working on it we learn
  just enough to find it immature the moment we turn away
  from it.
</blockquote>

<script> 
  function elt(type) {
  	var node = document.createElement(type);
  	for (var i = 1; i < arguments.length; ++i) {
		var child = arguments[i];
		if (typeof child == "string") {
			child = document.createTextNode(child);
		}
		node.appendChild(child);
  	}
  	return node;
  }

  document.getElementById("quote").appendChild(
    elt("footer", "—",
        elt("strong", "Karl Popper"),
        ", preface to the second editon of ",
        elt("em", "The Open Society and Its Enemies"),
        ", 1950"));
</script>

// Attributes.
<p data-classified="secret">The launch code is 00000000.</p>
<p data-classified="unclassified">I have two feet.</p>

<script>
  var paras = document.body.getElementsByTagName("p");
  Array.prototype.forEach.call(paras, function(para) {
    if (para.getAttribute("data-classified") == "secret")
      para.parentNode.removeChild(para);
  });
</script>

// syntax highlighter that looks for <pre> tags with a datalangauge attribute 
// and crudely tries to highlight the keywords for that langauge.
function highlightCode(node, keywords) {
  var text = node.textContent;
  node.textContent = ""; // Clear the node

  var match, pos = 0;
  while (match = keywords.exec(text)) {
    var before = text.slice(pos, match.index);
    node.appendChild(document.createTextNode(before));
    var strong = document.createElement("strong");
    strong.appendChild(document.createTextNode(match[0]));
    node.appendChild(strong);
    pos = keywords.lastIndex;
  }
  var after = text.slice(pos);
  node.appendChild(document.createTextNode(after));
}

var languages = {
  javascript: /\b(function|return|var)\b/g /* … etc */
};

function highlightAllCode() {
  var pres = document.body.getElementsByTagName("pre");
  for (var i = 0; i < pres.length; i++) {
    var pre = pres[i];
    var lang = pre.getAttribute("data-language");
    if (languages.hasOwnProperty(lang))
      highlightCode(pre, languages[lang]);
  }
}

<p>Here it is, the identity function:</p>
<pre data-language="javascript">
function id(x) { var i = 1; return x; }
</pre>

<script>highlightAllCode();</script>

// Layout
// Different types of elements are laid out differently.
// Some, such as paragraphs<p> or headings <h1> take up the whole width of the
// document and are rendered on seperate lines. These are called block elements.
// Others, such as links <a> or the <strong> element used in the previous example,
// are rendered on the same line with their surroudning text. Such elements are
// called inline elements.

// The size and position of an element can be accessed from js.
// offsetWidth and offsetHeight properties give the space the element takes up 
// in pixels.
// clientWidth and clientHeight gives the size of the space inside the element,
// ignoring border width. 
<p style="border: 3px solid red">
  I am boxed in
</p>

<script>
  var para = document.body.getElementsByTagName("p")[0];
  console.log("clientHeight:", para.clientHeight);
  console.log("offsetHeight:", para.offsetHeight);
</script>

// getBoundingClientRect method, returns an object with top, bottom, left, and
// right properties, indicating the pixel positions of the sides of the element
// relative to the top left of the screen.

// JavaScript code can directly manipulate the style of an element through the
// node's style property. This property holds an object that has properties for
// all possible style properties. The values of these properties are strings, 
// which we can write to in order to change a particular aspect of the element's
// style.
<p id="para" style="color: purple">
  Pretty text
</p>

<script>
  var para = document.getElementById("para");
  console.log(para.style.color);
  para.style.color = "magenta";
</script>

// cascading in the name refers to the fact that multiple such rules are combined
// to produce the final style for an element. When multiple rules define a value
// for the same property, the most recently read rule gets a higher precedence
// and wins. 
// Styles in a style attribute applied directly to the node have the highest 
// precedence and always win.
// .abc applies to all elements with "abc" in their class attributes. 
// A rule for #xyz applis to the element with an id attribute of "xyz".
.subtle {
  color: gray;
  font-size: 80%;
}
#header {
  background: blue;
  color: white;
}
/* p elements, with classes a and b, and id main */
p.a.b#main {
  margin-bottom: 20px;
}

// The precedence rule favouring the most recently defined rule holds true only
// when the rules have the same specificity. A rule's specificity is a measure of
// how preciesely it describes matching elements.
// For example, a rule that targets p.a is more specific than rules that target 
// p or just .a, and thus would take precedence over them.

// The notation p > a {...} applies the given styles to all <a> tags that are 
// direct children of  p.

// p a {...} applies to all <a> tags inside <p> tags, whether they are direct
// or indirect children.

// Query selectors.
<p>And if you go chasing
  <span class="animal">rabbits</span></p>
<p>And you know you're going to fall</p>
<p>Tell 'em a <span class="character">hookah smoking
  <span class="animal">caterpillar</span></span></p>
<p>Has given you the call</p>

<script>
  function count(selector) {
    return document.querySelectorAll(selector).length;
  }
  console.log(count("p"));           // All <p> elements
  // → 4
  console.log(count(".animal"));     // Class animal
  // → 2
  console.log(count("p .animal"));   // Animal inside of <p>
  // → 2
  console.log(count("p > .animal")); // Direct child of <p>
  // → 1
</script>

// Unlike methods such as getElementsByTagName, the object returned by 
// querySelectorAll is not live. It won't change when you change the document.


// Positioning and animating
// The position style property influences layout in a powerful way.
// 1. static(default):the element sits in its normal place in the document.
// 2. relative : the element still takes up spcae in the document, but now the 
// top and left style proerties can be used to move it relative to its normal
// place. 
// 3. absolute : the element is removed from the normal document flow(possible 
// overlap with other elements). its top and left properties can be used to
// absolutely position it relative to the top-left corner of the nearest enclosing 
// element whose position property is not static, or relative to the document
// if no such enclosing element exists.
<p style="text-align: center">
  <img src="img/cat.png" style="position: relative">
</p>
<script>
  var cat = document.querySelector("img");
  var angle = 0, lastTime = null;
  function animate(time) {
    if (lastTime != null)
      angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 20) + "px";
    cat.style.left = (Math.cos(angle) * 200) + "px";
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>

// Browsers do not update their display while a JavaScript program is running,
// nor do they allow any interaction with the page.

// Exercises
// Exercise 1: Build a table.

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
<style>
  /* Defines a cleaner look for tables */
  table  { border-collapse: collapse; }
  td, th { border: 1px solid black; padding: 3px 8px; }
  th     { text-align: left; }
</style>

<table>
  <tr>
    <th>name</th>
    <th>height</th>
    <th>country</th>
  </tr>
  <tr>
    <td>Kilimanjaro</td>
    <td>5895</td>
    <td>Tanzania</td>
  </tr>
</table>

<script>
  function buildTable(data) {
    var table = document.createElement("table");
  
    var fields = Object.keys(data[0]);
    var headRow = document.createElement("tr");
    fields.forEach(function(field) {
      var headCell = document.createElement("th");
      headCell.textContent = field;
      headRow.appendChild(headCell);
    });
    table.appendChild(headRow);

    data.forEach(function(object) {
      var row = document.createElement("tr");
      fields.forEach(function(field) {
        var cell = document.createElement("td");
        cell.textContent = object[field];
        if (typeof object[field] == "number")
          cell.style.textAlign = "right";
        row.appendChild(cell);
      });
      table.appendChild(row);
    });

    return table;
  }

  document.body.appendChild(buildTable(MOUNTAINS));
</script>

// Exercise 2: Implement getElementsByTagName.
<!doctype html>
<script src="code/mountains.js"></script>
<script src="code/chapter/13_dom.js"></script>

<body style="min-height: 200px">

<img src="img/cat.png" id="cat" style="position: absolute">
<img src="img/hat.png" id="hat" style="position: absolute">

<script>
  var cat = document.querySelector("#cat");
  var hat = document.querySelector("#hat");

  var angle = 0, lastTime = null;
  function animate(time) {
    if (lastTime != null)
      angle += (time - lastTime) * 0.0015;
    lastTime = time;

    cat.style.top = (Math.sin(angle) * 50 + 80) + "px";
    cat.style.left = (Math.cos(angle) * 200 + 230) + "px";
    // By adding π to the angle, the hat ends up half a circle ahead of the cat
    var hatAngle = angle + Math.PI;
    hat.style.top = (Math.sin(hatAngle) * 50 + 80) + "px";
    hat.style.left = (Math.cos(hatAngle) * 200 + 230) + "px";

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>

</body>