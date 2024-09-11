import { connect } from "../db/database.js";
import { generarJWT } from "../helpers/generar-jwt.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
export async function register(req, res) {
  const { username, password } = req.body;
  const sql = "INSERT INTO users (username, password) VALUES(?, ?)";
  try {
    const connection = await connect();
    await connection.query(sql, [username, password]);
    res.json({
      msg: "Registrado correctamente",
    });
    connection.end();
  } catch (error) {
    res.status(500).json({ message: "error al registrar el usuario" });
  }
}
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const connection = await connect();
    const sql = "SELECT * FROM users WHERE username = ? AND password = ? ";
    const [user] = await connection.query(sql, [username,password]);
    // Validación de usuario
    if (!user[0].length === 0) {
      return res.status(401).json({ message: "no existe el usuario" });
    }
    if (user[0].password === password) {
      // Generar token JWT
      const token = await generarJWT(user[0].id);
      // Almacenar el token en la sesión del servidor
      req.session.token = token;
      // Almacenar el token en una cookie segura
      res.cookie("authToken", token, {
        httpOnly: true, // La cookie no es accesible desde JavaScript
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 3600000, // Expiración en milisegundos (1 hora)
      });
      return res.json({ message: "Inicio de sesión exitoso" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });
  }
}
// Endpoint de cierre de sesión (logout)
export async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.clearCookie("authToken");
      return res.json({ message: "Cierre de sesión exitoso" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });
  }
}
export async function session(req, res) {
  const user = validarJWT();
  if (user === !false) {
    console.log(req.user);
    return res.json({
      message: "acceso permitido a área protegida",
      user: req.user,
    });
  }
}
