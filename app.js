const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '638cde9056d5d60096c5ecc2',
  };

  next();
});

app.use(bodyParser.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).json({ message: 'Not found' }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening to port: ${PORT}!`);
  });
});
