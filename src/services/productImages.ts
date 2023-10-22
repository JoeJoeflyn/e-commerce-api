import fs from "fs";
import { db } from "../utils/db.server";
import { v2 as cloudinary } from "cloudinary";

import path from "path";
import { GetBatchResult } from "@prisma/client/runtime/library";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

type Image = {
  product_id: number;
  name: string;
  size: number;
};

export const addImageProduct = async (
  images: Express.Multer.File[],
  productId: number
): Promise<{
  imagesAdded: GetBatchResult;
}> => {
  const promises = [];

  for (let i = 0; i < images.length; i++) {
    const uploadedImages = cloudinary.uploader.upload(images[i].path, {
      public_id: path.parse(images[i].originalname).name,
      resource_type: "image",
    });
    // pushing promise to array for promise.all
    promises.push(uploadedImages);
    // deleting img in uploads folder
    fs.unlinkSync(images[i].path);
  }

  const imagesInfo = await Promise.all(promises);
  // mapping to get array(name,size,product_id) result for creating data
  const imgsData = imagesInfo.map((img) => {
    return {
      product_id: productId,
      name: img.secure_url,
      size: img.bytes,
    };
  });
  // using createmany func to create data
  const imagesAdded = await db.productImage.createMany({
    data: imgsData,
    skipDuplicates: false,
  });

  return {
    imagesAdded,
  };
};
