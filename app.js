const addy        = require('./utils/address');      
const bodyParser  = require('body-parser');
const express 	  = require('express');
const axios       = require('axios');

const app         = express()

// assign app settings from envvironment || defaults
const port    = process.env.PORT || 8080;
const name    = process.env.HEROKU_APP_NAME || 'Unknown Name';
const version = process.env.HEROKU_RELEASE_VERSION || 'Unknown Version';

let deposit_address_list = process.env.LTC_ADDRESS_LIST
  ? process.env.LTC_ADDRESS_LIST.split(',').map(address => address.trim())
  : [];

const LTC_TX_URL = "https://chain.so/api/v2/get_tx_received/LTC/";
const update_url = process.env.API_UPDATE_URL;

// parse application/json
app.use(bodyParser.json())

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    res.json({"name": name,"version": version}); 	
});

//
// Retrieve last transaction sent to pre-sale/sale LTC address
//
app.post('/transaction/update', function(req, res) {
  const promises = [];
  const errors = [];
  let count = 0;
  let total = 0;
  for (var address of deposit_address_list) {
    const url = LTC_TX_URL + address;
    console.log("Checking address "+url);
    promises.push(
      axios.get(url)
      .then(function(response) { 
        const body = response.data;
        //console.log("Transactions "+JSON.stringify(body.data.txs));
        for (var txn of body.data.txs) {
          let data = {};
          data["wallet_address"] = "TBD";
          data["tx_id"] = txn.txid;
          data["tx_hash"] = txn.script_hex;
          data["amount"] = txn.value;
          data["currency"] = 'LTC';
          count++;
          total += txn.value;;
          axios.post(update_url, data)
          .then(function(response) {
            if (response.status === 200) {
              console.log("Updated "+data.tx_id+" successfully for sending wallet"+txn.from);
            } else {
              console.log("Update of txn "+data.tx_id+ " failed. status was "+response.status);
              errors.push("Error " +response.status+"  while updating");
            }
          })
          .catch(function(error) {
            errors.push("Error " +error.response.status+"  while updating");
          });
        }
      })
      .catch(function(error) {
        errors.push(error);
      })
    );
  }
  Promise.all(promises).then(function(values) {
    if (errors && errors.length > 0) {
      res.send({ status: 500, error: errors });
    } else {
      res.send({ status: 200 });
    }
  });
});

//
// Retrieve total transactions sent to LTC address
//
app.get('/transaction/total', function(req, res) {
    const uri = "https://blockchain.info/balance/" + LTC_ADDR + "?format=json";
    var options = { 
       uri: url,
       json: true
    };
    axios.get(url)
    .then(function(response) {
        const body = response.data;
        const total = body.result;
        const ts = +new Date()
        res.json({"currency": "LTC","total": total, "timestamp": ts});
    })
    .catch(function (err) {
        res.status(500);
    });
});

// Start the app listening to default port
app.listen(port, function() {
   console.log(name + ' app is running on port ' + port);
});
