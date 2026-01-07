/**
 * Get the list of cryptocurrency addresses from environment variables
 * @param {string} coin - The cryptocurrency symbol (e.g., 'ltc', 'btc')
 * @returns {string[]} Array of addresses
 * @throws {Error} If the address list is not found in environment variables
 */
export const getAddressList = (coin) => {
  const envKey = `${coin.toUpperCase()}_ADDRESS_LIST`;

  if (!process.env[envKey]) {
    throw new Error(`${coin.toUpperCase()} Address list cannot be found in process.env`);
  }

  try {
    const list = process.env[envKey];
    return list ? list.split(',').map((addr) => addr.trim()) : [];
  } catch (err) {
    console.error(err);
    throw err;
  }
};
