import express from "express";
import { ProductManager } from "./desafio.js";

const path = "./products.json";
const PORT = 8080;
const productManager = new ProductManager(path);
const app = express();
