const app = require("./app");
const pool = require("./services/mysql.service");
require('dotenv').config(); 

const PORT = 5000;

async function startServer() {
    try {
        const conexion = await pool.getConnection();

        console.log("Connection to MySQL successful");

        conexion.release();

        app.listen(PORT, () => {
            console.log(`Server running in http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error connecting to MySQL:", error.message);
    }
}

startServer();