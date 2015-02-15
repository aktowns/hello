# Hello!

Hello is a toy `s-expression` language and runtime written in ES6 Javascript.  
Very much a learning experience and a work in progress.

## Usage

```bash
gulp
iojs compiled/src/main.js example.hl
```
    
## Example

```lisp
(define hello (:: (-> string string)) (str.concat "hello "))
(defun do-hello (x) (println (hello x)))

(do-hello "world")
```

## Features

### Higher order functions

```lisp
(ary.map [1 2 3] (lambda (x) (num.mul x 10))) -- [10 20 30]
```

### Partial function application

```lisp
(define prefix-woo (:: (string -> string)) (str.concat "woo "))
(prefix-woo "it works!") -- "woo it works"
```
    
### FFI

```lisp
(defun println (x) (ffi-call console.log x))
(println "Hello World")
```

### Require
 
```lisp
(require "awesome/library")
(awesome.something)
```

## In Progress

### Pattern matching

```lisp
(match (typeof obj)
  '(string (println "it's a string!"))
  '(number (println "it's a number!")))
```
