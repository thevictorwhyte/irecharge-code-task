require('dotenv').config()
const express =  require("express");
const cors = require("cors");

const api = require("./routes/api");
const AppError = require("./utils/AppError");
const errorHandler = require("./utils/errorHandler");

const { PORT } = require("./constants");

const app = express();
app.use(cors({
    origin: `http://localhost:${PORT}`
}))
app.use(express.json());
app.use("/v1", api);
app.all("*", (req, res, next) => {
    // handle error for nonexistent routes
    next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});
// global app error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});

module.exports = app;