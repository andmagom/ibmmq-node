const express = require('express')
const autenticateRoute = require('./routes/autenticate');
const queryRoute = require('./routes/query');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bodyParser = require('body-parser')

const port = 3000

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    console.log('New worker ' + i);
    cluster.fork(); //creating child process
  }
  cluster.on('exit', (worker, code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
} else {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api/auth', autenticateRoute)
  app.use('/api/query', queryRoute)

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
}