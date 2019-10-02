const X = [0, 1, 2, 3];
const Y = [-2, 5, 0, -4];

let lagrangePol = 0;

for (let i = 0; i < X.length; i += 1) {
  let basicsPol = 1;

  for (let j = 0; j < X.length; j += 1) {
    if (i === j) continue;

    basicsPol *= (0 - X[j]) / (X[i] - X[j]);
  }

  lagrangePol += basicsPol * Y[i];
}

console.log('lagrangePol', lagrangePol);
