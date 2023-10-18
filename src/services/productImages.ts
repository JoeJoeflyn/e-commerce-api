import express from "express";
import { db } from "../utils/db.server";
import { v2 as cloudinary } from "cloudinary";

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
  image: Omit<Image, "id">
): Promise<{ images: Image }> => {
  console.log(image);

  const { product_id, name, size } = image;

  const uploadedImage = await cloudinary.uploader.upload(name);
  const images = await db.productImage.create({
    data: {
      product_id,
      name: uploadedImage.secure_url,
      size,
    },
    select: {
      product_id: true,
      name: true,
      size: true,
    },
  });
  return {
    images,
  };
};
