import mongoose, { Schema } from "mongoose";

const cartCollection = "carts";
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  product: { type: Array, required: true },
  quantity: { type: Number, required: true, integer: true },
});

const cartSchema = new mongoose.Schema({
  product: [productSchema],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
