import { DBconnect } from "../db/database";

export async function register (req,res) {
    const {username,password} = req.body;
    const sql = 'INSERT INTO users (username,password) VALUES (?,?)';
    try {
const connection = await DBconnect();
await connection.query(sql,[username,password]);
res.json({
    msg:'usuario registrado correctamente'
});
connection.end();
    } catch(error) {
res.status(500).json({massage: 'error al registrar el usuario'})
    }
}

export async function login (req, res) {
    const { username, password } = req.body;

    // Buscar usuario
    const connection = DBconnect();
    const sql = 'SELECT * FROM users where username = ?';
    const [user] = (await connection).query(sql,[username,password]);

    if (user) {
        // Guardar información del usuario en la sesión
        req.session.userId = user.id;
        req.session.username = user.username;

        return res.json({ 
            message: 'Inicio de sesión exitoso', 
            user: { id: user.id, username: user.username } });
    } else {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
};

// Ruta para obtener los datos de la sesión
export async function session (req, res) {
    if (req.session.userId) {
        return res.json({ 
            loggedIn: true, 
            user: { id: req.session.userId, username: req.session.username } });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
};

// Ruta para cerrar la sesión
export async function logout (req, res) {
    console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
};