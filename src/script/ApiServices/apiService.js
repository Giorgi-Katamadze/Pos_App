const instance = async () => {
    try {
      const response = await axios.get('https://hplussport.com/api/products/order/price');
      const data = response.data;
      console.log(data);
      return data; 
    } catch (error) {
      console.error('Error:', error);
      throw error; 
    }
  };
  export default instance;
  