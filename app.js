const express =  require("express");
const cors = require("cors");

const api = require("./routes/api");
const AppError = require("./utils/AppError");
const errorHandler = require("./utils/errorHandler");

const { PORT } = require("./constants");

const app = express();
app.use(cors())
app.use(express.json());
app.use("/v1", api)

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});

module.exports = app;