import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Define the destination folder
      const uploadPath = './public/users';

      // Ensure the directory exists
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
       const randomName = '00' + req.params.id;    
      const extension = extname(file.originalname);
      cb(null, `${randomName}${extname(file.originalname)}`);      
    //   cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
};
