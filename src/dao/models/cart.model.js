import mongoose, { Schema } from "mongoose";

const cartCollection = "carts";
const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          integer: true,
        },
      },
    ],
    default: function () {
      return [];
    },
  },
});

cartSchema.pre("findOne", function (next) {
  this.populate("products.product");
  next();
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
