require('dotenv').config()
const express =  require("express");
const cors = require("cors");

const api = require("./routes/api");
const AppError = require("./utils/AppError");
const errorHandler = require("./utils/errorHandler");

const { PORT } = require("./constants");

const app = express();
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(express.json());
app.use("/v1", api);
app.all("*", (req, res, next) => {
 next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});
app.use(errorHandler);

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});

module.exports = app;