const express =  require("express");
const cors = require("cors");

const api = require("./routes/api");
const AppError = require("./utils/AppError");
const errorHandler = require("./utils/errorHandler");

const { PORT } = require("./constants");

const app = express();
app.use(cors())
app.all("*", (req, res, next) => {
 next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});
app.use(errorHandler);
app.use("/v1", api)

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});

module.exports = app;