const ibmmq = require('./../../infrastructure/drive-adapters/ibmmq/put')

function transformAndSend(msg) {
  return ibmmq.sendMessage(msg)
    .then(() => {
      console.log("MQPUT successful");
      return Promise.resolve(true);
    });
} 

module.exports = {
  transformAndSend,
}