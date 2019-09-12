const express = require('express');

const app = express();

app.use(express.static('public'));
// TODO
// 1. Add zoom and chartjs libs
// 2. Add bootstrap?

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(8080, () => {
  console.log('running on 8080');
});
