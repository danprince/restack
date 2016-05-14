-- primordial type system

5 number?
5 string? -- TypeError

-- type predicates check the type of the value
-- at the top of the stack and throw when it
-- doesn't match

-- they can be used to write shoddy typed functions

to square (number? dup *)

2 square print -- 4
"hello" square print -- TypeError

