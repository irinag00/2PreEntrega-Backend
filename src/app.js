import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { ProductRouter } from "./routers/productsDB.router.js";
import { CartRouter } from "./routers/cartsDB.router.js";
import { ViewsRouter } from "./routers/viewsDB.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { SessionRouter } from "./routers/sessionsDB.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productRouter = new ProductRouter();
const cartRouter = new CartRouter();
const sessionsRouter = new SessionRouter();
const viewsRouter = new ViewsRouter();

const app = express();
const PORT = 8080;
const mongoURL =
  "mongodb+srv://adminCoder:hola123@codercluster.cxl0ika.mongodb.net/ecommerce?retryWrites=true&w=majority";

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("MySecretKey"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      ttl: 900,
    }),
    secret: "coderSecret",
    resave: false,
    saveUninitialized: false,
  })
);

//routes
app.use("/api/products/", productRouter.getRouter());
app.use("/api/carts/", cartRouter.getRouter());
app.use("/api/sessions/", sessionsRouter.getRouter());
app.use("/", viewsRouter.getRouter());

//config handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//config passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//connection socket.io

const httpServer = app.listen(PORT, () =>
  console.log("Servidor con express en puesto: ", PORT)
);
const io = new Server(httpServer);

//connection mongo atlas

const environment = async () => {
  await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Conexión a la base de datos inicializada!");
    })
    .catch((error) => {
      console.log("Database connection error", error);
    });
};

environment();
