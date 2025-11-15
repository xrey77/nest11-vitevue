import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import sharp = require('sharp');

@Injectable()
export class ImageCompressionPipe implements PipeTransform {
  async transform(file: Express.Multer.File, metadata: ArgumentMetadata): Promise<Express.Multer.File> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Process the image buffer using sharp
    const compressedImageBuffer = await sharp(file.buffer)
      .resize(800, 600, { // Optional: resize the image to specific dimensions
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
      .toBuffer(); // Convert the processed image back to a buffer

    // Update the file buffer and size with the compressed version
    file.buffer = compressedImageBuffer;
    file.size = compressedImageBuffer.length;
    file.mimetype = 'image/jpeg'; // Update mimetype if format changed

    return file;
  }
}
