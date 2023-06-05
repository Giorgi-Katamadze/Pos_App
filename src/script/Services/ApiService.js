// Create axios instance
const instance = axios.create({
  baseURL: "https://hplussport.com/api",
  Headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Define api endpoints
export const getProducts = () => instance.get("/products/order/price");
