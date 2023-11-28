const axios = require("axios");

const getStockCode = async (stockType) => {
  const url = `https://bgapidatafeed.vps.com.vn/getlistckindex/${stockType}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getListStockData = async (listStock) => {
  const url = `https://bgapidatafeed.vps.com.vn/getliststockdata/${listStock}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getStockCode, getListStockData };
