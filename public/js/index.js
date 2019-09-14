const fpFix = (n) => (
  Math.round(n * 100) / 100
);

const drawChart = (X, Y, approximateLinearY, approximateQuadraticY) => {
  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'red',
          pointBorderColor: 'red',
          borderColor: 'red',
          label: 'y = kx + b',
          data: X.map((x, i) => ({
            x,
            y: approximateLinearY[i],
          })),
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'green',
          pointBorderColor: 'green',
          borderColor: 'green',
          // lineTension: 0.3,
          cubicInterpolationMode: 'monotone',
          label: 'y = ax^2 + bx + c',
          data: X.map((x, i) => ({
            x,
            y: approximateQuadraticY[i],
          })),
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'blue',
          pointBorderColor: 'blue',
          borderColor: 'transparent',
          label: 'dots',
          data: X.map((x, i) => ({
            x,
            y: Y[i],
          })),
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            maxRotation: 0
          },
          scaleLabel: {
            labelString: 'X',
            display: true,
          },
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            maxRotation: 0
          },
          scaleLabel: {
            labelString: 'Y',
            display: true
          }
        }]
      },
      responsive:true,
      maintainAspectRatio: false,

      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy'
          },
          zoom: {
            enabled: true,
            mode: 'xy'
          }
        }
      },
    }
  });
};

const linearApproximation = (X, Y) => {
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

  return {
    a: aCoef,
    b: bCoef,
  };
};

const quadraticApproximation = (X, Y) => {
  const sumX = X.reduce((acc, current) => acc + current);
  const sumX2 = X.reduce((acc, current) => acc + current ** 2, 0);
  const sumX3 = X.reduce((acc, current) => acc + current ** 3, 0);
  const sumX4 = X.reduce((acc, current) => acc + current ** 4, 0);

  const sumY = Y.reduce((acc, current) => acc + current);
  const sumXY = X.reduce((acc, current, i) => acc + current * Y[i], 0);
  const sumX2Y = X.reduce((acc, current, i) => acc + current ** 2 * Y[i] , 0);

  const [aCoefs, bCoefs, cCoefs] = math.lusolve(
    [
      [sumX4, sumX3, sumX2],
      [sumX3, sumX2, sumX],
      [sumX2, sumX, X.length],
    ],
    [sumX2Y, sumXY, sumY],
  );

  const [aCoef] = aCoefs;
  const [bCoef] = bCoefs;
  const [cCoef] = cCoefs;

  return {
    a: aCoef,
    b: bCoef,
    c: cCoef,
  };
};

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

const setCoef = (node, value) => node.innerHTML = value;

window.onload = () => {
  const calculateButton = document.getElementById('calculate');
  const addDotButton = document.getElementById('add-dot');
  const inputsContainer = document.getElementById('inputs-container');


  calculateButton.addEventListener('click', () => {
    const { x, y } = getDotsValues(inputsContainer);
    const linearCoefs = linearApproximation(x, y);
    const quadraticCoefs = quadraticApproximation(x, y);

    const linearY = x.map(x => linearCoefs.a * x + linearCoefs.b);
    const quadraticY = x.map(x => quadraticCoefs.a * x * x + quadraticCoefs.b * x + quadraticCoefs.c);

    drawChart(x, y, linearY, quadraticY);
    
    setCoef(document.getElementById('a_1'), `a: ${linearCoefs.a}`);
    setCoef(document.getElementById('b_1'), `b: ${linearCoefs.b}`);

    setCoef(document.getElementById('a_2'), `a: ${quadraticCoefs.a}`);
    setCoef(document.getElementById('b_2'), `b: ${quadraticCoefs.b}`);
    setCoef(document.getElementById('c_2'), `c: ${quadraticCoefs.c}`);
  });

  addDotButton.addEventListener('click', () => {
    addDot(inputsContainer);
  });

  // for intial chart render
  drawChart([], [], []);
}

