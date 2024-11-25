const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR"
      });
    }
    const { payload } = user;
    if (payload?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR"
      });
    }
  });
};

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR"
      });
    }
    const { payload } = user;
    if (payload?.isAdmin || payload?.id === userId) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR"
      });
    }
  });
};

const authAdminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    if (!decoded.payload || !decoded.payload.isAdmin) {
      return res.status(403).json({ message: "Access denied! Admins only." });
    }

    req.user = decoded.payload;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error.message);
    return res.status(401).json({ message: "Invalid token!" });
  }
};
const authUserMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    if (!decoded.payload) {
      return res
        .status(403)
        .json({ message: "Access denied! User login only." });
    }

    req.user = decoded.payload;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error.message);
    return res.status(401).json({ message: "Invalid token!" });
  }
};
module.exports = {
  authMiddleWare,
  authUserMiddleWare,
  authAdminMiddleware,
  authUserMiddleware
};
