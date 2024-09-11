import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";
import { connect } from "../db/database.js";

// Middleware para verificar el token JWT
export const validarJWT = async (req, res, next) => {
  console.log(req.session);
  console.log("-----------");
  console.log(req.cookies);
  const token = req.cookies.authToken || req.session.token;

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    // Usamos el método verify para verificar el token.
    // El primer parámetro es el token que recibimos por el header, y el segundo el secret con el que firmamos el token.
    const decoded = jwt.verify(token, SECRET_KEY);

    const connection = await connect();

    // Buscamos el usuario por id.
    const [user] = await connection.query(
      "SELECT * FROM users WHERE id=? LIMIT 1",
      [decoded.id]
    );

    // En caso de que no exista retornamos un error.
    if (!user) {
      return res.status(401).json({ message: "Token inválido" });
    } else {
      // Caso contrario, agregamos la información del usuario decodificada al request.
      req.user = user;
    }
  } catch (error) {
    // Si ocurre un error retornamos un error.
    return res.status(401).json({ message: "Token inválido" });
  }
};