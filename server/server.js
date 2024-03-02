const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); 
const PORT = 3001;

let data = [];
let addCount = 0;
let updateCount = 0;

app.use(bodyParser.json());

app.get('/api/data', (req, res) => {
  res.json(data);
});

app.post('/api/add', (req, res) => {
  data = req.body;
  addCount += 1;
  res.json({ message: 'Data added successfully', count: { add: addCount, update: updateCount } });
});

app.post('/api/update', (req, res) => {
  data = req.body;
  updateCount += 1;
  res.json({ message: 'Data updated successfully', count: { add: addCount, update: updateCount } });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
