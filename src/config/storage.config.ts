import { diskStorage } from 'multer';
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 }, //<1024kb
};
