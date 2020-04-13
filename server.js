const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const lodgingData = require('./lodgings.json');
console.log("== Lodging data:", lodgingData);

/*
 * Middleware functions
 */

app.get('/', function (req, res, next) {
  console.log("== Got a request");
  res.status(200).send("Hello world!");
});
// app.post();
// app.patch();

app.get('/lodgings', function (req, res, next) {
  res.status(200).send({
    lodgings: lodgingData
  });
});

app.post('/lodgings', function (req, res, next) {
  console.log(req.body);
  if (req.body && req.body.name && req.body.description && req.body.price) {
    lodgingData.push(req.body);
    res.status(201).send({
      id: lodgingData.length - 1
    });
  } else {
    res.status(400).send({
      err: "Request doesn't have required fields"
    })
  }
});

/*
 * /lodgings/5
 * /lodgings/8
 * /lodgings/{id}
 */
app.get('/lodgings/:id', function (req, res, next) {
  console.log("== req.params:", req.params);
  const id = req.params.id;
  if (lodgingData[id]) {
    res.status(200).send(lodgingData[id]);
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  console.log("== Inside this middle middleware function");
  next();
});

app.use('*', function (req, res, next) {
  res.status(404).send({
    err: `${req.originalUrl} doesn't exist`
  });
});

app.listen(8000, function () {
  console.log("== Server is listening on port 8000");
});
