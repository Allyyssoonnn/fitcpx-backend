import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageAPI {
   private s3Client: S3Client;

   constructor() {
      this.s3Client = new S3Client({
         region: "sa-east-1",
         credentials: {
            accessKeyId: "[REDACTED_CREDENTIAL]",
            secretAccessKey: "[REDACTED_CREDENTIAL]",
         },
         requestHandler: {
            metadata: { timeout: 300000 },
         },
      });
   }

   async uploadFile(file: Express.Multer.File, key: string) {
      await this.s3Client.send(
         new PutObjectCommand({
            Bucket: "media.fitcpx.com",
            Key: key,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
         })
      );

      const imageUrl = `https://media.fitcpx.com/${key}`;

      return imageUrl;
   }
}
