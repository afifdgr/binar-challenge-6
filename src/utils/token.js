const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
   create: (payload) => {
      try {
        return jwt.sign(payload, SECRET_KEY, {expiresIn: "6h"});
      } catch (error) {
        console.log(error)
      }
   }
};
