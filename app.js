const express =  require("express");
const cors = require("cors");

const router = require("./routes");
const AppError = require("./utils/AppError");
const errorHandler = require("./utils/errorHandler");

const { PORT } = require("./constants");

app.use(api, router);

app.all("*", (req, res, next) => {
 next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});
app.use(errorHandler);

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});

module.exports = app;