const findRange = (arr, value) => {
  for (let i = 0; i < arr.length - 1; i += 1) {
    if (value >= arr[i] && value <= arr[i + 1]) {
      return i;
    }
  }
};

const x = [0, 1, 2, 3, 4];
const y = x.map((value) => value - 3 * Math.sin(value));

console.log('\n initial values: \n');
x.forEach((x, i) => {
  console.log({
    x,
    y: y[i],
  });
});

const a = [];
const b = [];

for (let i = 0; i < x.length - 1; i += 1) {
  const ai = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
  const bi = y[i] - ai * x[i];

  a.push(ai);
  b.push(bi);
}

console.log('\n coefs: \n');
console.log('a', a);
console.log('b', b);

const newX = [];
const newF = [];

for (let i = 0; i <= 4; i += 0.25) {
  newX.push(i);
}

newX.forEach((item) => {
  const index = findRange(x, item);
  newF.push(a[index] * item + b[index]);
});

console.log('\n interpolated values: \n');
newX.forEach((x, i) => {
  console.log({
    newX: x,
    newF: newF[i],
  });
});