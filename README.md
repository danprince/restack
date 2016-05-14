# restack

Restack is a concatenative, stack based language heavily inspired by [Factor][1].

Everything revolves around a single stack of values, which we can modify with functions.

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
restack allows you to name a piece of reusable code with the `to` keyword.

```hs
to add-two (2 +)

5 add-two
-- [7]
```

The lack of syntax in restack means that you can use almost any character in your function names.

```hs
to +2 (2 +)

10 +2
-- [12]
```

You can also define functions in terms of other functions.

```hs
to inc (1 +)
to +2 (inc inc)

3 +2
-- [5]
```

## Anonymous Functions
Not all functions need to be named either.

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

First we'll need a boolean value at the top of the stack, then we provide an anonymous function for each logical branch. Finally, we can call `if` which will evaluate the correct function based on the boolean condition.

There's also a `when` function for conditionals where the `else` branch doesn't matter.

```hs
3 "3" = ("bad") when
-- []

3 3 = ("good") when
-- ["good"]
```

## Variables
There's no such thing as a variable in restack, instead we use functions to define constant values.

```hs
to name ( "restack" )

"hello" name
" " join print
-- hello restack
```

The `name` function simply pushes the string `"restack"` onto the top of the stack, whenever it's called.

We can use the same idea to represent lists.

```hs
to xs ( 0 3 6 9 )

xs (/ 3) map
-- [ 0 1 2 3]
```

## Types
Restack comes with a very basic type system of _peek predicates_. A peek predicate is a special function which checks the type of the top value on the stack (without popping it) and throws an error if it doesn't match the predicated type.

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

Remember that you can't check the type of a value until it's at the top of a stack. Rather than writing a type signature for your function, use predicates to check values as-and-when you use them.

## Macros
restack has a simple, but powerful macro system for runtime macros. A macro is like a function, except it's declared with a leading '@' sign.

```hs
to @flip (reverse)

(print "Hello, macro") @flip
```

Rather than operating on the stack, a macro __always__ operates on an anonymous function, as though it was the stack. This allows us to compose macros out of all the regular tools and functions for working with the stack.

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

[1]: http://factorcode.org/
