import passport from "passport";
import local from "passport-local";
import githubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { userModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { UserManager } from "../dao/managerDB/UserManagerDB.js";

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const extractJWT = jwt.ExtractJwt;
const userManager = new UserManager();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, { message: "Faltan campos obligatorios" });
          }
          const user = await userManager.getUserByEmail(username);
          if (user) {
            return done(null, false, {
              message: "El usuario ya está registrado",
            });
          }
          user = await userManager.createUser({
            first_name,
            last_name,
            email: username,
            age,
            password,
          });

          return done(null, user);
        } catch (error) {
          return done(null, false, { message: "Error al registrarse" });
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return done(null, false, {
              message: "Falta completar campos obligatorios",
            });
          }
          const user = await userManager.getUserByEmail(username);
          if (!user) {
            return done(null, false, { message: "El usuario no existe" });
          }
          if (!isValidPassword(password, user)) {
            return done(null, false, {
              message: "La contraseña es incorrecta",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: "Error al iniciar sesión" });
        }
      }
    )
  );

  passport.use(
    "github",
    new githubStrategy.Strategy(
      {
        clientID: "Iv1.9877bba8417fe171",
        clientSecret: "00a13989994aecc61594badee8399bd0b4af3bde",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile._json);
        try {
          const user = await userManager.getUserByEmail(profile._json.email);
          if (!user) {
            user = {
              first_name: profile._json.name,
              email: profile._json.email,
            };
            user = await userManager.createUser(user);
            return done(null, user);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findOne({ _id: id });
      done(null, user);
    } catch (error) {
      done(`Error al deserializar el usuario: ${error}`);
    }
  });

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "MySecretKey",
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
