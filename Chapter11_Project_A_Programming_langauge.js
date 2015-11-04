// Building your own programming language is surprisingly easy and enlightening.
// We will build a programming langauge called Egg. It will be a tiny, simple
// language but one that is powerful enough to express any computation you can
// think of. It will also allow simple abstraction based on functions.

// An expression can be a variable, a number, a string, or an application.
// Applications are used for function calls but also for constructs such as
// if or while.

// Expressions of type "value" represent literal strings or numbers. 
// Their value property contains the string or number value that they represent.
// Expressions of type "word" are used for identifiers(names). Such objects have
// a name property that holds the identifier's name as a string.

// For example, >(x, 5)
// {
//   type: "apply",
//   operator: {type: "word", name: ">"},
//   args: [
//     {type: "word", name: "x"},
//     {type: "value", value: 5}
//   ]
// }

function parseExpression(program) {
  program = skipSpace(program);
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  // var first = string.search(/\S/);
  // if (first == -1) return "";
  // return string.slice(first);
  var skippable = string.match(/^(\s|#.*)*/);
  return string.slice(skippable[0].length);
}

function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(")
    return {expr: expr, rest: program};

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",")
      program = skipSpace(program.slice(1));
    else if (program[0] != ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}

function evaluate(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " +
                                 expr.name);
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in specialForms)
        return specialForms[expr.operator.name](expr.args,
                                                env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

var specialForms = Object.create(null);

specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};

specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};


var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;

var prog = parse("if(true, false, true)");
console.log(evaluate(prog, topEnv));
// → false

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return evaluate(body, localEnv);
  };
};


function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}

run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");
// → 11

run("do(define(pow, fun(base, exp,",
    "     if(==(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
// → 1024

// Or imagine you are building a giant robotic dinosaur and need to program its
// behavior. JavaScript might not be the most effective way to do this. You
// might instead opt for a language that looks like this:

// behavior walk
//   perform when
//     destination ahead
//   actions
//     move left-foot
//     move right-foot

// behavior attack
//   perform when
//     Godzilla in-view
//   actions
//     fire laser-eyes
//     launch arm-rockets
// This is what is usually called a domain-specific language, a language
// tailored to express a narrow domain of knowledge. Such a language can be more
// expressive than a general-purpose language because it is designed to express
// exactly the things that need expressing in its domain and nothing else.


// Exercise 
// Exercise 1:
// Array.prototype.slice can be used to convert an arguments array-like object
// into a regular array.
topEnv["array"] = function() {
	return Array.prototype.slice.call(arguments, 0);
};

topEnv["length"] = function(array) {
	array.length;
};

topEnv["element"] = function(array, i) {
	return array[i];
};

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6


// Exercise 3: Comment.
console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "x"},
//    args: []}

// Exercise 4 : Fixing Scope.
// Scopes do not derive from Object.prototype, so if you want to call
// hasOwnProperty on them, you have to use this clumsy expression.
specialForms["set"] = function(args, env) {
  // Your code here.
  if (args.length != 2 || args[0].type != "word") {
  	throw new SyntaxError("Bad use of set");
  }
  var varName = args[0].name;
  var value = evaluate(args[1], env);

  for (var scope = env; scope; scope = Object.getPrototypeOf(scope)) {
  	if (Object.prototype.hasOwnProperty.call(scope, varName)) {
  		scope[varName] = value;
  		return value;
  	}
  }
  throw new ReferenceError("Setting undefined variable " + varName);
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Some kind of ReferenceError






