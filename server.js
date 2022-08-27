const http = require("http");
require('dotenv').config();
const { PORT } = require("./constants");
const { mysqlConnect } = require("./services/mysql")

const app = require("./app");

const server = http.createServer(app);

const startServer = () => {
    mysqlConnect()
    server.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
};

startServer();
