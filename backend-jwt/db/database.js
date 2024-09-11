import { createConnection } from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config/config.js';

export const connect = async ()=> {
    try{
    return await createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });
}catch{
res.status(500).json ({message:'error al conectar a la base de datos'});
}
}