// https://en.wikipedia.org/wiki/Least_squares
// http://mathprofi.ru/metod_naimenshih_kvadratov.html

const {
  lusolve,
} = require('mathjs');

const X = [1, 2, 3, 4, 5];
const Y = [5.3, 6.3, 4.8, 3.8, 3.3];

if (X.length !== Y.length) {
  throw new Error('Length of X and Y have to be equal');
}

const sumX = X.reduce((acc, current) => acc + current);
let sumY = Y.reduce((acc, current) => acc + current);
let sumXSquared = X.reduce((acc, current) => acc + current ** 2, 0);
let sumXY = X.reduce((acc, current, i) => acc + current * Y[i], 0);

console.log('\nSums:')
console.log('sumX', sumX);
console.log('sumY', sumY);
console.log('sumXSquared', sumXSquared);
console.log('sumXY', sumXY);
console.log('\n');

const [aCoefs, bCoefs] = lusolve(
  [
    [sumXSquared, sumX],
    [sumX, X.length]
  ],
  [sumXY, sumY],
);

const [aCoef] = aCoefs;
const [bCoef] = bCoefs;

console.log('aCoef', aCoef);
console.log('bCoef', bCoef);

console.log('\n');
console.log(`f(x) = ${aCoef}x + ${bCoef}`);
