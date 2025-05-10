const multer = require("multer");
const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()} - ${file.originalname}`);
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "profileImageUrl") { // Resize only this field
      return {
        folder: "Uploads",
        allowedFormats: ["jpeg", "png", "jpg"],
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      };
    }
    return {
      folder: "Uploads",
      allowedFormats: ["jpeg", "png", "jpg"],
    };
  },
});

// file filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and JPEG are allowed."),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
