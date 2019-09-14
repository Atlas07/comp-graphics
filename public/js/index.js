const fpFix = (n) => (
  Math.round(n * 100) / 100
);

const calculateApproximation = (X, Y) => {
  const sumX = X.reduce((acc, current) => acc + current, 0);
  const sumY = Y.reduce((acc, current) => acc + current, 0);
  const sumXSquared = X.reduce((acc, current) => acc + current ** 2, 0);
  const sumXY = X.reduce((acc, current, i) => acc + current * Y[i], 0);

  const [aCoefs, bCoefs] = math.lusolve(
    [
      [sumXSquared, sumX],
      [sumX, X.length]
    ],
    [sumXY, sumY],
  );
  
  const [aCoef] = aCoefs;
  const [bCoef] = bCoefs;
 
  const aCoefFixed = fpFix(aCoef);
  const bCoefFixed = fpFix(bCoef);

  console.log('\n');
  console.log(`f(x) = ${aCoefFixed}x + ${bCoefFixed}`);

  const approximateY = X.map(x => fpFix(aCoefFixed * x + bCoefFixed));

  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: X,
      datasets:[
        {
          type: 'line',
          label: '# 2 of Votes',
          lineTension: 0,
          data: approximateY,
          backgroundColor: "transparent",
          borderColor: "rgba(218,83,79, 1)",
          borderWidth: 3,
        },
        {
          type: 'bubble',
          label: '# 1 of Votes',
          data: Y,
          backgroundColor: 'rgba(25, 25, 200, 1)',
          borderColor: 'rgba(25, 25, 200, 1)',
          borderWidth: 2,
        },
      ]
    },
    options: {
      elements: {
        line: {
            tension: 0
        },
      },
    },
  });
};

const X = [1, 2, 3, 4, 5];
const Y = [5.3, 6.3, 4.8, 3.8, 3.3];

const addDot = (container) => {
  const inputs = document.createElement('div');
  const inputX = document.createElement('input');
  const inputY = document.createElement('input');

  inputs.classList.add('inputs');
  inputX.setAttribute('placeholder', 'x');
  inputY.setAttribute('placeholder', 'y');

  inputs.appendChild(inputX);
  inputs.appendChild(inputY);

  container.appendChild(inputs);
};

const getDotsValues = () => {
  const inputs = document.querySelectorAll('.inputs');
  const inputsData = [];

  inputs.forEach(input => {
    const x = input.children[0].value;
    const y = input.children[1].value;

    inputsData.push({ x, y });
  });

  const x = inputsData.map(item => +item.x);
  const y = inputsData.map(item => +item.y);

  return { x, y };
};

window.onload = () => {
  const calculateButton = document.getElementById('calculate');
  const addDotButton = document.getElementById('add-dot');
  const inputsContainer = document.getElementById('inputs-container');

  calculateButton.addEventListener('click', () => {
    const { x, y } = getDotsValues(inputsContainer);

    console.log('x', x);
    console.log('y', y);

    calculateApproximation(x, y);
  });

  addDotButton.addEventListener('click', () => {
    addDot(inputsContainer);
  });

  // for intial chart render
  calculateApproximation([], []);
}

