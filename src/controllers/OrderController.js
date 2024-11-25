const OrderService = require("../services/OrderService");
const Order = require("../models/OrderModel");

const createOrder = async (req, res) => {
  try {
    const { userId, cartId, shippingAddress, productIds, name, phone, email } =
      req.body;
    const selectedProductIds = Array.isArray(productIds)
      ? productIds
      : [productIds];
    const newOrder = await OrderService.createOrder(
      userId,
      cartId,
      shippingAddress,
      selectedProductIds,
      name,
      phone,
      email
    );
    res.status(200).json({ status: "OK", data: newOrder });
  } catch (error) {
    console.error("Lỗi trong createOrder controller:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await OrderService.getAllOrdersByUser(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "ERR",
        message: "Không có đơn hàng nào được tìm thấy cho người dùng này"
      });
    }

    res.status(200).json({
      status: "OK",
      data: orders
    });
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUser controller:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: "ERR",
        message: "Không có đơn hàng nào được tìm thấy"
      });
    }

    res.status(200).json({
      status: "OK",
      data: orders
    });
  } catch (error) {
    console.error("Lỗi trong getAllOrdersController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Lỗi máy chủ nội bộ"
    });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("products.productId");
    console.log(order);
    if (!order) {
      return res.status(404).json({
        status: "ERR",
        message: "Order not found"
      });
    }

    // Trả về đơn hàng
    return res.status(200).json({
      status: "OK",
      data: order
    });
  } catch (error) {
    // Nếu có lỗi, trả về lỗi server
    console.error("Error in getOrderById controller:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error"
    });
  }
};
const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const canceledOrder = await OrderService.cancelOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order canceled successfully",
      data: canceledOrder
    });
  } catch (error) {
    console.error("Error in cancelOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

const shipOrder = async (req, res) => {
  const { orderId } = req.body;
  console.log(orderId);
  try {
    const shippedOrder = await OrderService.shipOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order shipped successfully",
      data: shippedOrder
    });
  } catch (error) {
    console.error("Error in shipOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

const deliverOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const deliveredOrder = await OrderService.deliverOrder(orderId);
    res.status(200).json({
      status: "OK",
      message: "Order delivered successfully",
      data: deliveredOrder
    });
  } catch (error) {
    console.error("Error in deliverOrderController:", error);
    res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  getAllOrdersByUser,
  getAllOrders,
  createOrder,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder
};
