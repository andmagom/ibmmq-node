'use strict';

var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

var qMgr = "QM1";
var qName = "DEV.QUEUE.1";

var ghObj;
var ghConn;

function formatErr(err) {
  return "MQ call failed in " + err.message;
}

// When we're done, close queues and connections
function cleanup(hConn, hObj) {
  mq.Close(hObj, 0, function (err) {
    if (err) {
      console.log("Cleanup: ", formatErr(err));
    } else {
      console.log("MQCLOSE successful");
    }
    mq.Disc(hConn, function (err) {
      if (err) {
        console.log("Cleanup: ", formatErr(err));
      } else {
        console.log("MQDISC successful");
      }
    });
  });
}

var cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client

if (true) {
  var csp = new mq.MQCSP();
  csp.UserId = "app";
  csp.Password = "pass";
  cno.SecurityParms = csp;
}

mq.ConnxPromise(qMgr, cno)
  .then(hConn => {
    console.log("MQCONN to %s successful ", qMgr);
    ghConn = hConn;
    var od = new mq.MQOD();
    od.ObjectName = qName;
    od.ObjectType = MQC.MQOT_Q;
    var openOptions = MQC.MQOO_OUTPUT;
    return mq.OpenPromise(hConn, od, openOptions);
  })
  .then(hObj => {
    console.log("MQOPEN of %s successful", qName);
    ghObj = hObj;
    return Promise.resolve(true);
  })
  .catch(err => {
    console.log(formatErr(err));
    cleanup(ghConn, ghObj);
  });

  /*
  .then(() => {
    console.log("MQPUT successful");
    return mq.ClosePromise(ghObj, 0);
  })
  .then(() => {
    console.log("MQCLOSE successful");
    return mq.DiscPromise(ghConn);
  })
  */

function sendMessage( msg ) {
  var mqmd = new mq.MQMD(); // Defaults are fine.
  var pmo = new mq.MQPMO();
  // Describe how the Put should behave
  pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
    MQC.MQPMO_NEW_MSG_ID |
    MQC.MQPMO_NEW_CORREL_ID;
  return mq.PutPromise(hObj, mqmd, pmo, msg);
}

module.exports = {
  sendMessage,
}