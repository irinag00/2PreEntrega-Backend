import mongoose, { Schema } from "mongoose";

const cartCollection = "carts";
const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: { type: Number, required: true, integer: true },
});

const cartSchema = new mongoose.Schema({
  products: [productSchema],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
