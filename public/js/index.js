function chartClicked(event, chart) {
  const yTop = chart.chartArea.top;
  const yBottom = chart.chartArea.bottom;

  const yMin = chart.scales['y-axis-0'].min;
  const yMax = chart.scales['y-axis-0'].max;
  let newY = 0;

  if (event.offsetY <= yBottom && event.offsetY >= yTop) {
    newY = Math.abs((event.offsetY - yTop) / (yBottom - yTop));
    newY = (newY - 1) * -1;
    newY = newY * (Math.abs(yMax - yMin)) + yMin;
  }

  const xTop = chart.chartArea.left;
  const xBottom = chart.chartArea.right;
  const xMin = chart.scales['x-axis-0'].min;
  const xMax = chart.scales['x-axis-0'].max;
  let newX = 0;

  if (event.offsetX <= xBottom && event.offsetX >= xTop) {
    newX = Math.abs((event.offsetX - xTop) / (xBottom - xTop));
    newX = newX * (Math.abs(xMax - xMin)) + xMin;
  }

  console.log(newX, newY);

  return {
    x: newX,
    y: newY,
  };
}

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
  // const step = document.getElementById('step');
  // const result = document.getElementById('resultDot');
  const editBtn = document.getElementById('edit');

  let isEditable = true;

  editBtn.addEventListener('click', () => {
    if (isEditable) {
      editBtn.innerHTML = 'Enable edit';
      isEditable = false;
    } else {
      editBtn.innerHTML = 'Disable edit';
      isEditable = true;
    }
  });


  const canvas = document.getElementById('chart');
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
          borderColor: 'blue',
          lineTension: 0,
          cubicInterpolationMode: 'monotone',
          label: 'dots',
          data: [],
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'green',
          pointBorderColor: 'green',
          borderColor: 'green',
          // lineTension: 0.3,
          cubicInterpolationMode: 'monotone',
          label: 'gaus_1',
          data: [],
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'red',
          pointBorderColor: 'red',
          borderColor: 'red',
          // lineTension: 0.3,
          cubicInterpolationMode: 'monotone',
          label: 'gaus_2',
          data: [],
        },
        {
          backgroundColor: 'transparent',
          pointBackgroundColor: 'yellow',
          pointBorderColor: 'yellow',
          borderColor: 'yellow',
          // lineTension: 0.3,
          cubicInterpolationMode: 'monotone',
          label: 'gaus_3',
          data: [],
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

  const dotsArr = [];
  canvas.addEventListener('click', (e) => {
    if (!isEditable) {
      return;
    }

    const newDot = chartClicked(e, chart);

    dotsArr.push(newDot);
    chart.data.datasets[0].data = [...dotsArr];
    chart.update();
  });

  calculateButton.addEventListener('click', async () => {
    if (!isEditable) {
      return;
    }

    // TODO: do math
    const data = await fetch('http://localhost:5000/api/v1/gauss_1', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        x: dotsArr.map((item) => item.x),
        y: dotsArr.map((item) => item.y),
        step: 0.1,
      }),
    });
    const parsedData = await data.json();
    const data2 = await fetch('http://localhost:5000/api/v1/gauss_2', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        x: dotsArr.map((item) => item.x),
        y: dotsArr.map((item) => item.y),
        step: 0.1,
      }),
    });
    const parsedData2 = await data2.json();

    const data3 = await fetch('http://localhost:5000/api/v1/gauss_3', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        x: dotsArr.map((item) => item.x),
        y: dotsArr.map((item) => item.y),
        step: 0.1,
      }),
    });
    const parsedData3 = await data3.json();

    chart.data.datasets[1].data = parsedData.new_x.map((item, i) => ({
      x: item,
      y: parsedData.new_y[i],
    }));
    chart.data.datasets[2].data = parsedData2.new_x.map((item, i) => ({
      x: item,
      y: parsedData2.new_y[i],
    }));
    chart.data.datasets[3].data = parsedData3.new_x.map((item, i) => ({
      x: item,
      y: parsedData3.new_y[i],
    }));
    chart.update();
  });
};
