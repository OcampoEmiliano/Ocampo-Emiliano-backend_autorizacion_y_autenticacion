import { createConnection } from 'mysql2/promise';
import { DB_HOST,DB_USER,DB_PASSWORD,DB_NAME } from '../config/config.js';
// Creamos una funcion para realizar la conexion a la bd.
export const DBconnect = async ()=> {
    return await createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    })
}