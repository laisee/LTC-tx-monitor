/**
 * @fileoverview LTC Transaction Monitor - Monitor Litecoin addresses for incoming transactions
 * @module app
 */

import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAddressList } from './utils/address.js';

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Assign app settings from environment || defaults
/** @type {number} */
const port = process.env.PORT || 8080;
/** @type {string} */
const name = process.env.HEROKU_APP_NAME || 'Unknown Name';
/** @type {string} */
const version = process.env.HEROKU_RELEASE_VERSION || 'Unknown Version';

/** @type {string[]} */
const deposit_address_list = process.env.LTC_ADDRESS_LIST
  ? getAddressList('ltc')
  : [];

/** @type {string} */
const LTC_TX_URL = 'https://chain.so/api/v2/get_tx_received/LTC/';
/** @type {string | undefined} */
const update_url = process.env.API_UPDATE_URL;

// Parse application/json (built into Express 4.16+)
app.use(express.json());

// Make express look in the public directory for assets (css/js/img)
app.use(express.static(join(__dirname, 'public')));

/**
 * Health check endpoint
 * @route GET /
 * @returns {Object} Application name and version
 */
app.get('/', (req, res) => {
  res.json({ name, version });
});

/**
 * Retrieve and process transactions sent to monitored LTC addresses
 * @route POST /transaction/update
 * @returns {Object} Status, count, and total of processed transactions
 */
app.post('/transaction/update', async (req, res) => {
  const errors = [];
  let count = 0;
  let total = 0;

  try {
    const promises = deposit_address_list.map(async (address) => {
      const url = `${LTC_TX_URL}${address}`;
      console.log(`Checking address ${url}`);

      try {
        const response = await axios.get(url);
        const { data } = response;

        // Process each transaction
        const txPromises = data.data.txs.map(async (txn) => {
          const txData = {
            wallet_address: 'TBD',
            tx_id: txn.txid,
            tx_hash: txn.script_hex,
            amount: txn.value,
            currency: 'LTC',
          };

          count++;
          total += txn.value;

          try {
            const updateResponse = await axios.post(update_url, txData);
            if (updateResponse.status === 200) {
              console.log(`Updated ${txData.tx_id} successfully for sending wallet ${txn.from}`);
            } else {
              console.log(
                `Update of txn ${txData.tx_id} failed. Status was ${updateResponse.status}`
              );
              errors.push(`Error ${updateResponse.status} while updating`);
            }
          } catch (error) {
            const status = error.response?.status || 'unknown';
            errors.push(`Error ${status} while updating`);
          }
        });

        await Promise.all(txPromises);
      } catch (error) {
        errors.push(error.message || error);
      }
    });

    await Promise.all(promises);

    if (errors.length > 0) {
      res.status(500).json({ status: 500, error: errors });
    } else {
      res.json({ status: 200, count, total });
    }
  } catch (error) {
    console.error('Error processing transactions:', error);
    res.status(500).json({ status: 500, error: error.message });
  }
});

/**
 * Retrieve total balance for a specific LTC address
 * @route GET /transaction/total
 * @returns {Object} Currency, total balance, and timestamp
 */
app.get('/transaction/total', async (req, res) => {
  try {
    const url = `https://blockchain.info/balance/${process.env.LTC_ADDR}?format=json`;
    const response = await axios.get(url);
    const { result: total } = response.data;
    const timestamp = Date.now();

    res.json({ currency: 'LTC', total, timestamp });
  } catch (err) {
    console.error('Error fetching transaction total:', err);
    res.status(500).json({ error: 'Failed to fetch transaction total' });
  }
});

// Start the app listening to default port
app.listen(port, () => {
  console.log(`${name} app is running on port ${port}`);
});
