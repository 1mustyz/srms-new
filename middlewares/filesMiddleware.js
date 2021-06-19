const multer = require('multer');
const storage = require('../config/multerConfig');

const singleUpload = multer({
    storage: storage.storage,
    limits: {fileSize: 1024 * 1024 }
  }).single('profile_pic');



  module.exports = {
      singleUpload
     
  }