// The browser is really hostile programming environment.
// The haphazard way in which the Web was developed means that the resulting 
// system is not exactly a shining example of internal consistency.

// In HTML, an ampersand (&) character followed by a word and a semicolon (;
// is called an entity, and will be replaced by the character it encodes.
<h1>Testing alert</h1>
<script>alert("hello!");</script>

<h1>Testing alert</h1>
<script src="code/hello.js"></script>

// Some attributes can also contain a JavaScript program.
<button onclick="alert('Boom!');">DO NOT PRESS</button>

// The attraction of the Web is that you can surf it without necessarily
// trusting all the pages you visit.
// This is why browsers severely limit the things a JavaScript program may do:
// it can’t look at the files on your computer or modify anything not related
// to the web page it was embedded in.

// Isolating a programming environment in this way is called sandboxing.