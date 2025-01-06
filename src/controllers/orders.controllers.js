import { Mongoose } from "mongoose"; 
import Orders from "../models/order.models.js";

const placeOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Products are required." });
    }

    const newOrder = new Orders({
      user: userId,
      products,
      totalPrice,
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

const listOrdersForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Orders.find({ user: userId }).populate("products");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get details of a single order
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }

    const order = await Order.findById(orderId).populate("products").exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Ensure the user can only access their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  placeOrder,
  listOrdersForUser,
  getOrderDetails,
};
