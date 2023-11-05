const bcrypt = require("bcrypt");

module.exports = {
  create: async (data, saltRounds = 10) => {
    try {
      const hashedData = await bcrypt.hash(data, saltRounds);
      return hashedData;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  },

  verify: async (unhashed, hashed) => {
    try {
      const match = await bcrypt.compare(unhashed, hashed);
      return match;
    } catch (err) {
      throw err;
    }
  },
};
