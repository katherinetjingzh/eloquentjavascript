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








