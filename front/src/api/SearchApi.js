import axios from "axios";

export const SearchApi = async (coinName) => {
  try {
    if (coinName !== "") {
      const response = await axios.get(
        `http://localhost:8090/api/SearchByName?q=${coinName}`
      );
      return response?.data;
    }
    return {
      message: "You don't save anything",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const SingleCoinApi = async (coinName) => {
  try {
    const response = await axios.get(
      `http://localhost:8090/api/SingleCoin?q=${coinName}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const CoinChart = async (coinName, days) => {
  coinName = coinName?.toLowerCase();
  try {
    const response = await axios.get(
      `http://localhost:8090/api/SingleCoinChart?q=${coinName}&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const SavedApi = async (coinName) => {
  try {
    if (coinName !== "") {
      const response = await axios.get(
        `http://localhost:8090/api/Search?coin=${coinName}`
      );
      return response?.data;
    }
    return {
      message: "You don't save anything",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
