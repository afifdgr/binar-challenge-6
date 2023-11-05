const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const HashData = require("../utils/hashData");
const JwtToken = require("../utils/token");


module.exports = {
  register: async (req, res) => {
    try {
      let { name, email, password } = req.body;

      const existingEmail = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail)
        return res
          .status(409)
          .json({message: "Email Already Register"});

      const hashedPassword = await HashData.create(password);
      const user = await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

      return res
        .status(201)
        .json({user});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "Internal Server Error"});
    }
  },

  login: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user)
        return res.status(200).json({message: "User Not Found"});

      const hashedPassword = user.password;
      const verifyPassword = await HashData.verify(
        req.body.password,
        hashedPassword
      );

      if (!verifyPassword)
        return res.status(409).json({message: "Wrong Password"});

      
      const payload = { id: user.id , email: user.email}
      const token = JwtToken.create(payload); 

      return res.status(200).json({token, user});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "Internal Server Error"});
    }
  },

  me: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          email: req.email
        },
        include: {
          photoProfile: true
        }
      })

      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        photoProfile: {
          urlPhoto: user.photoProfile.urlPhoto
        }
      }

      res.status(200).json({ data })
    } catch (error) {
        console.log(error)
    }
  }

};
