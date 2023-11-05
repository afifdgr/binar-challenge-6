const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({message: "unauntheticated"});

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);

    req.id = jwtPayload.id
    req.email = jwtPayload.email
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal Server Error"});
  }
};

module.exports = {verifyToken};
