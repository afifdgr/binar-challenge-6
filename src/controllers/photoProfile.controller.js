const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const { imageKit } = require('../utils/imagekit');

module.exports = {
  uploadPhoto: async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: "Please upload a Photo" });
        }

        const newUrlPhoto = req.file.path;
        const urlPhoto = await prisma.photoProfile.create({
          data: {
            urlPhoto: newUrlPhoto,
            user: {
              connect: {
                 id: req.id
                },
            },
          },
        });
        res.status(201).json({ urlPhoto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updatePhoto: async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: "Please upload a Photo" });
        }

        const newUrlPhoto = req.file.path;
        const urlPhoto = await prisma.photoProfile.update({
          where: {
            user_id: req.id,
          },
          data: {
            urlPhoto: newUrlPhoto,
          },
        });
        res.status(201).json({ urlPhoto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  },

  uploadWithImagekit: async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: "Please upload a Photo" });
        }

        const email = req.email
        const parts = email.split("@");
        const name = parts[0];

        const createFolder =  await imageKit.createFolder({
          folderName: name,
          parentFolderPath: "uploads/photo"
        })

        const folderPath = `uploads/photo/${name}`

        const fileTostring = req.file.buffer.toString('base64');

        const uploadPhoto = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileTostring,
          folder: folderPath
        });

        const urlPhotoImageKit = uploadPhoto.url;
        const fileId = uploadPhoto.fileId

        const savePhoto = await prisma.photoProfile.create({
          data: {
            urlPhoto: urlPhotoImageKit,
            fileId: fileId,
            user: {
              connect: {
                 id: req.id
                },
            },
          },
        });
        res.status(201).json({ data: savePhoto, folder: createFolder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateWithImagekit: async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: "Please upload a Photo" });
        }

        const fileTostring = req.file.buffer.toString('base64');

        const email = req.email
        const parts = email.split("@");
        const name = parts[0];

        const folderPath = `uploads/photo/${name}`

        const uploadPhoto = await imageKit.upload({
          fileName: req.file.originalname,
          file: fileTostring,
          folder: folderPath
        });

        const urlPhotoImageKit = uploadPhoto.url;
        const newFileId = uploadPhoto.fileId

        const photo = await prisma.photoProfile.findUnique({
          where: {
            user_id: req.id
          }
        })
  
        const currentFileId = photo.fileId
  
        imageKit.deleteFile(currentFileId, function (error) {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed Remove File in ImageKit" });
          } else {
            prisma.photoProfile.update({
              where: {
                user_id: req.id,
              },
              data: {
                urlPhoto: urlPhotoImageKit,
                fileId: newFileId
              }
            }).then(() => {
              return res.status(201).json({ message: "Update Successfully" });
            }).catch((error) => {
              console.error(error);
              return res.status(500).json({ message: "Internal Server Error" });
            });
          }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deletePhotoLocal: async (req, res) => {
    try {
      const folderName = req.email;
      const folderPath = `src/public/${folderName}`;
  
      if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, { recursive: true });
        await prisma.photoProfile.delete({
          where: {
            user_id: req.id,
          }
        });
        return res.status(204).json({message: "Delete photo successfully"});
      } 

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deletePhotoImagekit: async (req, res) => {
    try {
      const photo = await prisma.photoProfile.findUnique({
        where: {
          user_id: req.id
        }
      })

      const fileId = photo.fileId

      imageKit.deleteFile(fileId, function (error) {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed Remove File in ImageKit" });
        } else {
          prisma.photoProfile.delete({
            where: {
              user_id: req.id,
            }
          }).then(() => {
            return res.status(204).json({ message: "Delete Successfully" });
          }).catch((error) => {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
          });
        }
      });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
  },

};
