import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

export const uploadMiddleware = (req, res, next) => {
  if (req.files && req.files.length === 1) {
    upload.single('Images')(req, res, next);
  } else {
    upload.array('Images')(req, res, next);
  }
};
