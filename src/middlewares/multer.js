const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const email = req.email;
      const folder = `src/public/${email}`;
      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const email = req.email;
      const parts = email.split("@");
      const name = parts[0];
      const extension = file.originalname.split(".").pop();
      cb(null, file.fieldname + "-" + name + "." + extension);
    },
  });
  
  const allowed_file_types = ["image/jpeg", "image/jpg", "image/png"];
  const max_file_size = 1 * 1024 * 1024;
  
  const filter = (req, file, cb) => {
    if (!allowed_file_types.includes(file.mimetype)) {
      const error = {
        message: "File type not supported",
      };
      return cb(error);
    }
  
    if (file.size > max_file_size) {
      const error = {
        message: "File too large",
      };
      return cb(error);
    }
  
    cb(null, true);
  };

module.exports = {
    image: multer({
        storage: storage,
        fileFilter: filter,
        limits: {
            fileSize: max_file_size,
        },
        onError: (err, next) => {
            next(err)
        }
    })
}