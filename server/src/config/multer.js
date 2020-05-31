import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, callBack) =>
    callBack(null, `${__dirname}/../public/images`),
  filename: (req, file, callBack) =>
    callBack(null, `${file.fieldname}-${Date.now()}.jpg`),
});

const upload = multer({ storage });
export default upload;
