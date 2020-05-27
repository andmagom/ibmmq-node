var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  res.send('Birds home page')
})

module.exports = router