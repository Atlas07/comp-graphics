const drawChart = (dots, linear, lagrange) => {
  const ctx = document.getElementById('chart').getContext('2d');
  // eslint-disable-next-line
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'blue',
          pointBorderColor: 'blue',
          borderColor: 'transparent',
          label: 'dots',
          data: dots,
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'green',
          pointBorderColor: 'green',
          borderColor: 'green',
          // lineTension: 0.3,
          cubicInterpolationMode: 'monotone',
          label: 'linear',
          data: linear,
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'red',
          pointBorderColor: 'red',
          borderColor: 'red',
          label: 'Lagrange',
          data: lagrange,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            maxRotation: 0,
          },
          scaleLabel: {
            labelString: 'X',
            display: true,
          },
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            maxRotation: 0,
          },
          scaleLabel: {
            labelString: 'Y',
            display: true,
          },
        }],
      },
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            enabled: true,
            mode: 'xy',
          },
        },
      },
    },
  });
};

const findRange = (arr, value) => {
  for (let i = 0; i < arr.length - 1; i += 1) {
    if (value >= arr[i] && value <= arr[i + 1]) {
      return i;
    }
  }
};

const calculateLagrange = (x, X, Y) => {
  let lagrangePol = 0;

  for (let i = 0; i < X.length; i += 1) {
    let basicsPol = 1;

    for (let j = 0; j < X.length; j += 1) {
      if (i === j) continue;

      basicsPol *= (x - X[j]) / (X[i] - X[j]);
    }

    lagrangePol += basicsPol * Y[i];
  }

  return lagrangePol;
};

const calculateLinear = (X, Y) => {
  const a = [];
  const b = [];

  for (let i = 0; i < X.length - 1; i += 1) {
    const ai = (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]);
    const bi = Y[i] - ai * X[i];

    a.push(ai);
    b.push(bi);
  }

  return {
    a,
    b,
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

  inputs.forEach((input) => {
    const x = input.children[0].value;
    const y = input.children[1].value;

    inputsData.push({ x, y });
  });

  const x = inputsData.map((item) => +item.x);
  const y = inputsData.map((item) => +item.y);

  return { x, y };
};

window.onload = () => {
  const calculateButton = document.getElementById('calculate');
  const addDotButton = document.getElementById('add-dot');
  const inputsContainer = document.getElementById('inputs-container');
  const step = document.getElementById('step');

  calculateButton.addEventListener('click', () => {
    const { x, y } = getDotsValues();

    // Linear
    const { a, b } = calculateLinear(x, y);

    const newX = [];
    const newF = [];

    // TODO: use reduce
    for (let i = x[0]; i <= x[x.length - 1]; i += +step.value) {
      newX.push(i);
    }
    // TODO: refactor: use reduce
    newX.forEach((item) => {
      const index = findRange(x, item);
      newF.push(a[index] * item + b[index]);
    });

    // Lagrange
    const lagrangeF = newX.map((xi) => calculateLagrange(xi, x, y));

    drawChart(
      x.map((x, i) => ({ x, y: y[i] })),
      newX.map((x, i) => ({ x, y: newF[i] })),
      newX.map((x, i) => ({ x, y: lagrangeF[i] })),
    );
  });

  addDotButton.addEventListener('click', () => {
    addDot(inputsContainer);
  });

  drawChart(
    [],
    [],
    [],
  );
};
