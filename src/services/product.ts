import express from "express";
import { db } from "../utils/db.server";

type Product = {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  contact: string;
  location: string;
};

export const addProduct = async (
  product: Omit<Product, "id">
): Promise<{
  newProduct: {
    category_id: number;
    name: string;
    description: string;
    price: number;
    discount_price: number;
    quantity: number;
    contact: string;
    location: string;
  };
}> => {
  const {
    categoryId,
    name,
    description,
    price,
    discountPrice,
    quantity,
    contact,
    location,
  } = product;

  const newProduct = await db.product.create({
    data: {
      category_id: categoryId,
      name,
      description,
      price,
      discount_price: discountPrice,
      quantity,
      contact,
      location,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
  return {
    newProduct,
  };
};

export const listProduct = async (
  req: express.Request
): Promise<{
  products: {
    category_id: number;
    name: string;
    description: string;
    price: number;
    discount_price: number;
    quantity: number;
    contact: string;
    location: string;
  }[];
  total: number;
}> => {
  const { page, limit } = req.query as {
    page: string;
    limit: string;
  };

  const offset = (+page - 1) * +limit;

  const products = await db.product.findMany({
    take: +limit,
    skip: offset,
    include: {
      category: true,
      product_images: true,
    },
  });

  const total = await db.product.count();

  return {
    total,
    products,
  };
};

export const getProduct = async (
  id: number
): Promise<{
  getProduct: {
    category_id: number;
    name: string;
    description: string;
    price: number;
    discount_price: number;
    quantity: number;
    contact: string;
    location: string;
  } | null;
}> => {
  const getProduct = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
  return {
    getProduct,
  };
};

export const updateProduct = async (
  product: Omit<Product, "id">,
  id: number
): Promise<{
  category_id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number;
  quantity: number;
  contact: string;
  location: string;
}> => {
  const {
    categoryId,
    name,
    description,
    price,
    discountPrice,
    quantity,
    contact,
    location,
  } = product;

  return db.product.update({
    where: {
      id,
    },
    data: {
      category_id: categoryId,
      name,
      description,
      price,
      discount_price: discountPrice,
      quantity,
      contact,
      location,
    },
    select: {
      category_id: true,
      name: true,
      description: true,
      price: true,
      discount_price: true,
      quantity: true,
      contact: true,
      location: true,
    },
  });
};
