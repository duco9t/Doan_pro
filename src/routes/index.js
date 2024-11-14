const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const CartRouter = require("./CartRouter");
const OtpRouter = require("./otpRoutes");
const GoogleRouter = require("./GoogleRouter");
const PaymentRouter =require("./PaymentRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/otp", OtpRouter);
  app.use("/", GoogleRouter);
  app.use("/api/payments", PaymentRouter);
};
module.exports = routes;
