import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: [],
  code: { type: Number, required: true, unique: true },
  stock: { type: Number, required: true },
  status: { type: String, enum: ["Stock-Disponible", "Sin-stock"] },
  category: { type: String, required: true },
});

productsSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productsCollection, productsSchema);
