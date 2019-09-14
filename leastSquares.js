const {
  lusolve,
} = require('mathjs');

const X = [1, 2, 3, 4, 5];
const Y = [5.3, 6.3, 4.8, 3.8, 3.3];

if (X.length !== Y.length) {
  throw new Error('Length of X and Y have to be equal');
}

// ax + b
const sumX = X.reduce((acc, current) => acc + current);
let sumY = Y.reduce((acc, current) => acc + current);
let sumX2 = X.reduce((acc, current) => acc + current ** 2, 0);
let sumXY = X.reduce((acc, current, i) => acc + current * Y[i], 0);

// a ** 2 + bx + c
const sumX4 = X.reduce((acc, current) => acc + current ** 4, 0);
const sumX3 = X.reduce((acc, current) => acc + current ** 4, 0);
const sumX2Y = X.reduce((acc, current, i) => acc + current ** 2 * Y[i] , 0);

const linearApproximation = (
  sumX2, sumX,
  length,
  sumXY, sumY,
) => {
  const [aCoefs, bCoefs] = lusolve(
    [
      [sumX2, sumX],
      [sumX, length]
    ],
    [sumXY, sumY],
  );
  
  const [aCoef] = aCoefs;
  const [bCoef] = bCoefs;

  return {
    a: aCoef,
    b: bCoef,
  };
};

const quadraticApproximation = (
  sumX4, sumX3, sumX2,
  sumX2Y, sumXY, sumY,
  sumX, length,
) => {

  const [aCoefs, bCoefs, cCoefs] = lusolve(
    [
      [sumX4, sumX3, sumX2],
      [sumX3, sumX2, sumX],
      [sumX2, sumX, length],
    ],
    [sumX2Y, sumXY, sumY],
  );

  console.log('aCoefs', aCoefs);
  console.log('bCoefs', bCoefs);
  console.log('cCoefs', cCoefs);
  
  const [aCoef] = aCoefs;
  const [bCoef] = bCoefs;
  const [cCoef] = cCoefs;

  return {
    a: aCoef,
    b: bCoef,
    c: cCoef,
  };
};

const { a, b, c } = quadraticApproximation(
  sumX4, sumX3, sumX2,
  sumX2Y, sumXY, sumY,
  sumX, X.length,
);

console.log('aCoef', a);
console.log('bCoef', b);
console.log('cCoef', c);

console.log('\n');
// console.log(`f(x) = ${aCoef}x + ${bCoef}`);
console.log(`f(x) = ${a}x^2 + ${b}x + ${c}`);
