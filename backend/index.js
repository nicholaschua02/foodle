const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const schedule = require('node-schedule');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let vegetables = [];
let fruits = [];
let breads = [];
let dailyVegetable = null;
let dailyFruit = null;
let dailyBread = null;

// Read the CSV files and load the data
fs.createReadStream(path.join(__dirname, 'vegetables.csv'))
  .pipe(csv())
  .on('data', (row) => {
    vegetables.push(row);
  })
  .on('end', () => {
    console.log('Vegetables CSV file successfully processed');
    setDailyVegetable();
  });

fs.createReadStream(path.join(__dirname, 'fruits.csv'))
  .pipe(csv())
  .on('data', (row) => {
    fruits.push(row);
  })
  .on('end', () => {
    console.log('Fruits CSV file successfully processed');
    setDailyFruit();
  });

fs.createReadStream(path.join(__dirname, 'breads.csv'))
  .pipe(csv())
  .on('data', (row) => {
    breads.push(row);
  })
  .on('end', () => {
    console.log('Breads CSV file successfully processed');
    setDailyBread();
  });

const getRandomVegetable = () => {
  const vegetable = vegetables[Math.floor(Math.random() * vegetables.length)];
  return vegetable;
};

const getRandomFruit = () => {
  const fruit = fruits[Math.floor(Math.random() * fruits.length)];
  return fruit;
};

const getRandomBread = () => {
  const bread = breads[Math.floor(Math.random() * breads.length)];
  return bread;
};

const setDailyVegetable = () => {
  dailyVegetable = getRandomVegetable();
  console.log(`New daily vegetable set: ${dailyVegetable.name}`);
};

const setDailyFruit = () => {
  dailyFruit = getRandomFruit();
  console.log(`New daily fruit set: ${dailyFruit.name}`);
};

const setDailyBread = () => {
  dailyBread = getRandomBread();
  console.log(`New daily bread set: ${dailyBread.name}`);
};

// Schedule the job to run at midnight AWST every day
const timeZone = 'Australia/Perth';
schedule.scheduleJob({ hour: 0, minute: 0, tz: timeZone }, () => {
  setDailyVegetable();
  setDailyFruit();
  setDailyBread();
});

// Endpoint to get the daily vegetable
app.get('/api/daily-vegetable', (req, res) => {
  res.json(dailyVegetable);
});

// Endpoint to get the daily fruit
app.get('/api/daily-fruit', (req, res) => {
  res.json(dailyFruit);
});

// Endpoint to get the daily bread
app.get('/api/daily-bread', (req, res) => {
  res.json(dailyBread);
});

// Endpoint to get the list of vegetables
app.get('/api/vegetables', (req, res) => {
  res.json(vegetables);
});

// Endpoint to get the list of fruits
app.get('/api/fruits', (req, res) => {
  res.json(fruits);
});

// Endpoint to get the list of breads
app.get('/api/breads', (req, res) => {
  res.json(breads);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch all handler to serve the React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
