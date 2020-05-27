const express = require('express')
const router = express.Router()
const auth = require('../domain/usecases/autenticate')

router.post('/', function (req, res) {
  const body = req.body;
  auth.transformAndSend(body)
    .then( msg => {
      res.status(200).send(msg);
    })
});

module.exports = router