const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

const createOrder = async (
  userId,
  cartId,
  shippingAddress,
  productIds,
  name,
  phone,
  email
) => {
  try {
    // Kiểm tra giỏ hàng
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) {
      throw { status: 404, message: "Không tìm thấy giỏ hàng" };
    }

    // Lọc ra các sản phẩm hợp lệ dựa trên productIds
    const selectedProducts = cart.products.filter((item) =>
      productIds.includes(String(item.productId._id))
    );

    // Kiểm tra nếu không có sản phẩm hợp lệ
    if (selectedProducts.length === 0) {
      throw { status: 400, message: "Không có sản phẩm hợp lệ để thanh toán" };
    }

    // Lấy thông tin sản phẩm và tính toán tổng giá trị
    const products = await Promise.all(
      selectedProducts.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw {
            status: 404,
            message: `Không tìm thấy sản phẩm với ID ${item.productId}`
          };
        }
        return {
          productId: product._id,
          quantity: item.quantity,
          price: product.prices
        };
      })
    );

    // Tính tổng giá trị đơn hàng
    const totalPrice = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    // Tính toán phí vận chuyển và VAT
    const VATorder = totalPrice * 0.1;
    const shippingFee = totalPrice > 50000000 ? 0 : 800000;
    const orderTotal = totalPrice + shippingFee + VATorder;
    console.log(orderTotal);
    // Tạo đơn hàng mới
    const newOrder = new Order({
      name,
      phone,
      email,
      userId,
      cartId,
      products,
      shippingAddress,
      totalPrice,
      VATorder,
      shippingFee,
      orderTotal,
      status: "Pending"
    });
    console.log(newOrder);
    // Lưu đơn hàng
    await newOrder.save();

    // Cập nhật giỏ hàng bằng cách xóa các sản phẩm hợp lệ
    cart.products = cart.products.filter(
      (item) => !productIds.includes(String(item.productId._id))
    );

    await cart.save();

    return newOrder;
  } catch (error) {
    console.error("Lỗi trong createOrder service:", error);
    throw error;
  }
};

const getAllOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrdersByUser service:", error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find().populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Lỗi trong getAllOrders service:", error);
    throw error;
  }
};


const getOrderById = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId).populate("products.productId");
      if (!order) {
        return reject({
          status: "ERR",
          message: "Order not found"
        });
      }
      resolve(order);
    } catch (error) {
      reject({
        status: "ERR",
        message: "Error while retrieving order: " + error.message
      });
    }
  });
};
const cancelOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Nếu đơn hàng đã có trạng thái là 'Delivered' hoặc 'Cancelled', không thể hủy
    if (order.status === "Delivered" || order.status === "Cancelled") {
      throw { status: 400, message: "Order already delivered or cancelled" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Cancelled'
    order.status = "Cancelled";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in cancelOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const shipOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    if (order.status !== "Pending") {
      throw { status: 400, message: "Order is not in Pending status" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Shipped'
    order.status = "Shipped";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in shipOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

const deliverOrder = async (orderId) => {
  try {
    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    if (order.status !== "Shipped") {
      throw { status: 400, message: "Order is not in Shipped status" };
    }

    // Cập nhật trạng thái đơn hàng thành 'Delivered'
    order.status = "Delivered";

    // Lưu lại thay đổi
    await order.save();

    return order;
  } catch (error) {
    console.error("Error in deliverOrder service:", error);
    throw {
      status: error.status || 500,
      message: error.message || "Internal server error"
    };
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getAllOrders,
  getOrderById,
  cancelOrder,
  shipOrder,
  deliverOrder
};
