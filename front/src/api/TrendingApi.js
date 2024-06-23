import axios from "axios";
export const MarketApi = async () => {
  try {
    const response = await axios.get("http://localhost:8090/api/Markets");
    return response.data; 
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

export const TrendingApi = async () => {
  try {
    const response = await axios.get("http://localhost:8090/api/Trending");
    return response.data; 
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error to be caught by the caller
  }
};
