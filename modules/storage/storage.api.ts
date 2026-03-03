import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
            Bucket: "store.fitcpx.com",
            Key: key,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
         }),
      );

      const imageUrl = `https://store.fitcpx.com/${key}`;

      return imageUrl;
   }

   async uploadFileBuffer(file: Buffer, key: string) {
      await this.s3Client.send(
         new PutObjectCommand({
            Bucket: "store.fitcpx.com",
            Key: key,
            Body: file,
            ACL: "public-read",
            ContentType: "application/pdf",
            // 2. Garante que o PDF abra no navegador (em vez de baixar automaticamente)
            ContentDisposition: "inline",
         }),
      );

      const imageUrl = `https://store.fitcpx.com/${key}`;

      return imageUrl;
   }

   //Not used
   async deleteFile(folder: string, id: string) {
      const params = {
         Bucket: "store.fitcpx.com",
         Key: `${folder}/${id}`,
      };

      const command = new DeleteObjectCommand(params);
      return this.s3Client.send(command);
   }
}
