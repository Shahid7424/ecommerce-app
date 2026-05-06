import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: String,
    brand: String,
    images: [String],
    inStock: Boolean,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model("Product", ProductSchema);
