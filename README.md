# Hello!

Hello is a toy `s-expression` language written in ES6 Javascript.  
Very much a learning experience and a work in progress.

## Usage

    gulp
    iojs dist/hello.js example.hl
    
## Example
    
    (define hello (str.concat "hello "))
    (defun do-hello (x) (println (hello x)))
    
    (do-hello "world")
 

## Features

### Higher order functions

    (ary.map [1 2 3] (lambda (x) (num.mul x 10))) -- [10 20 30]

### Partial function application

    (define prefix-woo (str.concat "woo "))
    (prefix-woo "it works!") -- "woo it works"
    
### FFI

    (defun println (x) (ffi-call console.log x))
    (println "Hello World")
    
### Require
 
    (require "awesome/library")
    (awesome.something)

## In Progress

### Pattern matching

    (match (typeof obj)
      '(string (println "it's a string!"))
      '(number (println "it's a number!")))