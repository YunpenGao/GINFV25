import prompt from 'prompt-sync';
import { evaluate } from 'mathjs';
const input = prompt();
console.log("Hello, World!");

const name = input("What is your name? ");

console.log(`Hello, ${name}!`);
const  calculation = input("Enter a mathematical expression to evaluate: ");

const result = evaluate(calculation);
const decision = result<0 ? "negative" : result>0 ? "positive" : "zero";

console.log(`The result of the calculation is: ${result}, which is a ${decision} number.`);
