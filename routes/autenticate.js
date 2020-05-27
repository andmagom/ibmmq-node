const express = require('express')
const router = express.Router()
const transformAndSend = require('../domain/usecases/autenticate')

router.post('/', function (req, res) {
  const body = req.body;
  transformAndSend(body)
    .then( msg => {
      res.status(200).send(msg);
    })
});

module.exports = router