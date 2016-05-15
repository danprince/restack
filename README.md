![restack](https://rawgit.com/danprince/restack/master/logo.svg)

[![Build Status](https://travis-ci.org/danprince/restack.svg?branch=master)](https://travis-ci.org/danprince/restack)

Restack is a concatenative, stack based language heavily inspired by [Factor][1].

Everything revolves around a single stack of values, which can be modified with functions.

```hs
"Hello, world" print
```

This program pushes the string `"Hello, world"` onto the stack, then calls the `print` function. The print function pops a value from the stack and writes it on screen.

The same idea can be used to work with numbers.

```hs
2 5 +
-- [7]
```

First `2`, then `5` are added to the stack, then the `+` function is called. `+` pops all values from the stack, adds them together and pushes the result back onto the (now empty) stack.

## Functions
Reusable code can be named with the `to` keyword.

```hs
to add-two (2 +)

5 add-two
-- [7]
```

The lack of syntax means that almost any character can be used in function names.

```hs
to +2 (2 +)

10 +2
-- [12]
```

Functions can also be defined in terms of other functions.

```hs
to inc (1 +)
to +2 (inc inc)

3 +2
-- [5]
```

## Anonymous Functions
Not all functions need to be named.

```hs
1 2 3 (2 *) map
-- [2 4 6]

1 2 3 -- puts 1 2 3 onto the stack
(2 * ) -- puts anonymous function onto the stack
map -- pops anon function and calls it on each values
```

For instance, the built in function `map` takes an anonymous function and maps it over each value in the stack.

## Conditionals
Conditionals are quite strange in postfix languages.

```hs
3 "3" =
("true") ("false") if
-- ["false"]
```

The `if` function expects the top of the stack to have the following values in order:

1. An else-branch anonymous function
2. A then-branch anonymous function
3. A boolean

The function pops all three values and uses the boolean value to evaluate the appropriate function.

There's also a `when` function for conditionals where the `else` branch doesn't matter.

```hs
3 "3" = ("bad") when
-- []

3 3 = ("good") when
-- ["good"]
```

## Variables
There's no such thing as a variable in restack, instead functions are used to define constant values.

```hs
to name ( "restack" )

"hello" name
" " join print
-- hello restack
```

The `name` function simply pushes the string `"restack"` onto the top of the stack, whenever it's called.

The same idea can be used to represent lists.

```hs
to xs ( 0 3 6 9 )

xs (/ 3) map
-- [ 0 1 2 3]
```

## Types
There is a very basic type system using _peek predicates_. A peek predicate is a special function which checks the type of the top value on the stack (without popping it) and throws an error if it doesn't match the predicated type.

```hs
3 number?
-- [3]

"3" number?
-- TypeError!

"3" string?
-- ["3"]
```

These peek predicates can be used to write primitively typed functions.

```hs
to square (number? dup *)

3 square
-- [9]

drop
-- []

"3" square
-- TypeError!
```

Remember that the type of a value cannot be checked until it's at the top of a stack. Rather than having a function having a type signature,  predicates should be called just before values are used.

## Macros
There's also a simple, but powerful macro system for runtime macros. A macro is like a function, except it's declared with a leading '@' sign.

```hs
to @flip (reverse)

(print "Hello, macro") @flip
```

Rather than operating on the stack, a macro __always__ operates on an anonymous function, as though it was the stack. This allows macros to be composed from all the regular functions for working with the stack.

```hs
to @infix (swap)

(3 + 5) @infix
-- [8]
```

Macros can even be composed from other macros and runtime functions.

```hs
to @calltwice (dup)
to @callthrice ((dup) @calltwice)

(3) @callthrice
```

> Note: literal values don't work in macros at the moment.

## Timers
The language comes with a timer model, that allows a program to branch and start executing periodic instructions on multiple stacks.

```hs
(5 print) every second
-- 5
-- 5
...
```

A timer command is made up of three parts. An anonymous function, a limiter and a generator.

The generator generates periodic events, which are passed to the limiter, when the limiter allows it, the function is called. The simplest limiter is `every` which allows every generated event to call the function.

The `some` limiter can be used to randomly allow roughly half the generated events.

```hs
("Surprise!" print) some second
```

There are also parameterized generators which create events at a given rate.

```hs
("examples/kick.wav" play) every 2 seconds 
("examples/hihat.wav" play) every 500 ms
```

## Examples
To run one of the files in the `examples/` folder, you'll need Node v6 and npm.

```
npm install
node run-example.js examples/func.r_
```

## Caveats
This is a super-early working version for a concept that I've thought about for a while. The lexer and parser need do an OK job, but extending either is difficult. The interpreter is straight up awful and has pretty much just grown for some test code I used to check the AST.

There are a number of standard features which aren't supported at the moment.

* Values in macros
* Modules (support in syntax, but not runtime)
* Debugging
* File export (exposing for modules)
* Errors
* Stack traces
* Proper standard library

There are a number of features I'd like to add, too.

* Work with blocks as though they were stacks -> easier combinators
* One nestable data structure (probably a list)
* Object format (but not necessarily a literal)
* REPL (needs interpreter rewrite)
* Better combinator libraries

The eventual goal is to build a robust interpreter that can be used to grow the language whilst I build a compiler that generates JavaScript or Web Assembly from the AST.

[1]: http://factorcode.org/

