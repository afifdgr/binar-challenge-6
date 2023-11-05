module.exports = {
    success: (msg, data) => {
      const response = {};
      response.error = false;
      response.message = msg;
      response.data = data;
  
      return response;
    },
    error: (msg) => {
      const response = {};
      response.error = true;
      response.message = msg;
  
      return response;
    },
  };
  