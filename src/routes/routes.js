const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/auth.controller"),
  photoController =  require("../controllers/photoProfile.controller"),
  multer = require('../middlewares/multer'),
  multerLib = require('multer')(),
  {verifyToken} = require("../middlewares/verify.token");

/* AUTH Route */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.me);

/* Photo Route Local */
router.post("/photo-profile", verifyToken, multer.image.single('photoProfile'), photoController.uploadPhoto);
router.put("/photo-profile", verifyToken, multer.image.single('photoProfile'), photoController.updatePhoto);
router.delete("/photo-profile", verifyToken, photoController.deletePhotoLocal);

/* Photo Route ImageKit */
router.post("/photo-profile-imagekit", verifyToken, multerLib.single('photoProfile'), photoController.uploadWithImagekit);
router.put("/photo-profile-imagekit", verifyToken, multerLib.single('photoProfile'), photoController.updateWithImagekit);
router.delete("/photo-profile-imagekit", verifyToken, photoController.deletePhotoImagekit);


module.exports = router;
