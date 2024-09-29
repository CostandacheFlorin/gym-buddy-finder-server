import { Injectable, UseGuards } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  @UseGuards(AuthGuard)
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ success: boolean; url?: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(error);
          }

          resolve({
            success: true,
            url: result?.secure_url,
          });
        })
        .end(file.buffer);
    });
  }
}
