const express = require("express");
const User = require("../models/UserModel.js");
const Product = require("../models/ProductModel.js");
const Category = require("../models/CategoryModel.js");
const Cart = require("../models/CartModel.js");
const Order = require("../models/OrderModel.js");
const OrderItem = require("../models/OrderItemModel.js");
const Payments = require("../models/PaymentModel.js");
const Notification = require("../models/NotificationModel.js");
const { getOrderDetails } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authmiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();

// High level stats for dashboard
router.get(
  "/api/admin/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const [
        totalUsers,
        totalProducts,
        totalCategories,
        totalCartItems,
        totalOrders,
        totalPayments,
        totalPendingPayments,
        totalPaidPayments,
        revenueResult,
        monthlyRevenueResult,
        monthlyPaymentsCount,
      ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Cart.countDocuments(),
        Order.countDocuments(),
        Payments.countDocuments(),

        // pending payments count
        Payments.countDocuments({ paymentStatus: "pending" }),

        // paid/success payments count
        Payments.countDocuments({ paymentStatus: "success" }),

        // total revenue from success payments
        Payments.aggregate([
          { $match: { paymentStatus: "success", amount: { $ne: null } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        // monthly revenue from success payments
        Payments.aggregate([
          {
            $match: {
              paymentStatus: "success",
              createdAt: { $gte: monthStart },
              amount: { $ne: null },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        // this month paid payments count
        Payments.countDocuments({
          paymentStatus: "success",
          createdAt: { $gte: monthStart },
        }),
      ]);

      const totalRevenue = revenueResult?.[0]?.total ?? 0;
      const monthlyRevenue = monthlyRevenueResult?.[0]?.total ?? 0;

      res.json({
        totalUsers,
        totalProducts,
        totalCategories,
        totalCartItems,
        totalOrders,
        totalPayments,
        totalPendingPayments,
        totalPaidPayments,
        totalRevenue,
        monthlyRevenue,
        monthlyPaymentsCount,
      });
    } catch (err) {
      console.error("ADMIN_STATS_ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Analytics & Growth Metrics
router.get(
  "/api/admin/analytics",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const today = new Date();
      // End of today
      today.setHours(23, 59, 59, 999);
      
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(today.getDate() - 14);
      fourteenDaysAgo.setHours(0, 0, 0, 0);

      const getStats = async (startDate, endDate) => {
        const [users, orders, revenueResult] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
          Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
          Payments.aggregate([
            { $match: { paymentStatus: "success", createdAt: { $gte: startDate, $lte: endDate }, amount: { $ne: null } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
        ]);

        return {
          users,
          orders,
          revenue: revenueResult?.[0]?.total || 0,
        };
      };

      const currentStats = await getStats(sevenDaysAgo, today);
      const previousStats = await getStats(fourteenDaysAgo, new Date(sevenDaysAgo.getTime() - 1));

      const calculateGrowth = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(2));
      };

      res.json({
        current: currentStats,
        previous: previousStats,
        growth: {
          users: calculateGrowth(currentStats.users, previousStats.users),
          orders: calculateGrowth(currentStats.orders, previousStats.orders),
          revenue: calculateGrowth(currentStats.revenue, previousStats.revenue),
        },
      });
    } catch (err) {
      console.error("ADMIN_ANALYTICS_ERROR:", err);
      res.status(500).json({ message: "Server error fetching analytics" });
    }
  }
);

// Dashboard Insights (Conversion Rate, Top Seeds, Graphs Data)
router.get(
  "/api/admin/dashboard-insights",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // 1. Conversion Rate
      const totalUsers = await User.countDocuments();
      const uniqueBuyers = await Order.distinct("userId");
      const conversionRate = totalUsers > 0 ? ((uniqueBuyers.length / totalUsers) * 100).toFixed(2) : 0;

      // 2. Top Selling Seeds (limit to 5)
      const topSellingItems = await OrderItem.aggregate([
        {
          $group: {
            _id: "$productId",
            totalQuantitySold: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" }
          }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products", // Ensure this matches actual DB collection name for products
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" }
      ]);

      const formattedTopSeeds = topSellingItems.map(item => ({
        _id: item._id,
        name: item.productDetails.name,
        image: item.productDetails.imagePath || item.productDetails.image,
        price: item.productDetails.price,
        totalQuantitySold: item.totalQuantitySold,
        totalRevenue: item.totalRevenue
      }));

      // 3. Graph Data (Last 6 Months Revenue)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const monthlyGraphData = await Payments.aggregate([
        {
          $match: {
            paymentStatus: "success",
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            revenue: { $sum: "$amount" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      const graphMonths = [];
      let current = new Date(sixMonthsAgo);
      for(let i=0; i<6; i++) {
         const m = current.getMonth() + 1;
         const y = current.getFullYear();
         
         const found = monthlyGraphData.find(d => d._id.month === m && d._id.year === y);
         graphMonths.push({
           name: monthNames[m - 1],
           revenue: found ? found.revenue : 0,
           orders: found ? found.orders : 0
         });

         current.setMonth(current.getMonth() + 1);
      }

      res.json({
        conversionRate,
        totalUsers,
        totalBuyers: uniqueBuyers.length,
        topSellingSeeds: formattedTopSeeds,
        monthlyGraphData: graphMonths
      });

    } catch (err) {
      console.error("DASHBOARD_INSIGHTS_ERROR:", err);
      res.status(500).json({ message: "Server error fetching insights" });
    }
  }
);

// List users (basic info, no passwords)
router.get(
  "/api/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Cart overview (acts like simple orders list)
router.get(
  "/api/admin/carts",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const carts = await Cart.find()
        .populate("userId", "firstname lastname email")
        .sort({ createdAt: -1 });

      res.json(carts);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Admin: Get all orders (with items)
router.get(
  "/api/admin/orders",
  authMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "firstname lastname email phone");

      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.find({ orderId: order._id }).populate(
            "productId",
            "name imagePath image price"
          );
          return {
            ...order._doc,
            items,
          };
        })
      );

      res.json({ data: ordersWithItems });
    } catch (err) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  }
);

// Admin: Get order details by ID
router.get(
  "/api/admin/orders/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      const order = await Order.findById(id)
        .populate("addressId")
        .populate("userId", "firstname lastname email mobile");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const items = await OrderItem.find({ orderId: order._id })
        .populate({
          path: "productId",
          select: "name imagePath image price categoryId",
          populate: {
            path: "categoryId",
            select: "name"
          }
        });

      res.json({ order, items });
    } catch (err) {
      console.error("GET_ADMIN_ORDER_DETAILS_ERROR:", err);
      res.status(500).json({ message: "Error fetching order details" });
    }
  }
);

// Admin: Update order status/payment (by order ID)
router.put(
  "/api/admin/orders/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (orderStatus) {
        // If changing TO cancelled from something else, restore stock
        if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
          const Payments = require("../models/PaymentModel");
          const payment = await Payments.findOne({ orderId: order._id });
          const stockWasReduced = payment && (payment.paymentMethod === "cod" || payment.paymentStatus === "success");

          if (stockWasReduced) {
            const itemsToRestore = await OrderItem.find({ orderId: order._id });
            for (const item of itemsToRestore) {
              if (item.productId) {
                await Product.findByIdAndUpdate(
                  item.productId,
                  { $inc: { stock: item.quantity } }
                );
              }
            }
          }
        }
        order.orderStatus = orderStatus;

        if (orderStatus === "delivered") {
          const Payments = require("../models/PaymentModel");
          const payment = await Payments.findOne({ orderId: order._id });
          const isCod = order.paymentMethod === "cod" || (payment && payment.paymentMethod === "cod");

          if (isCod) {
            order.paymentStatus = "paid";
            if (payment) {
              payment.paymentStatus = "success";
              await payment.save();
            }

            if (!order.invoiceGenerated) {
              try {
                const { generateInvoice } = require("../utils/invoiceService");
                const { sendInvoiceEmail } = require("../utils/emailService");
                const user = await User.findById(order.userId);
                const items = await OrderItem.find({ orderId: order._id }).populate("productId");

                const invoicePath = await generateInvoice({ ...order.toObject(), paymentStatus: "paid" }, user, items, payment);
                const sent = await sendInvoiceEmail(user.email, order._id, invoicePath);

                order.invoiceGenerated = true;
                order.invoiceSent = sent;
                order.invoicePath = invoicePath;
              } catch (err) {
                console.error("Invoice generation error on delivery:", err);
              }
            }
          }
        }
      }
      await order.save();

      const updatedOrder = await Order.findById(order._id)
        .populate("addressId")
        .populate("userId", "firstname lastname email mobile");

      // include items in response with proper category population
      const items = await OrderItem.find({ orderId: order._id })
        .populate({
          path: "productId",
          select: "name imagePath image price categoryId",
          populate: {
            path: "categoryId",
            select: "name"
          }
        });

      res.json({ message: "Order updated", order: updatedOrder, items });
    } catch (err) {
      res.status(500).json({ message: "Error updating order" });
    }
  }
);

// Admin: Get all payments
router.get(
  "/api/admin/payments",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const payments = await Payments.find()
        .populate("userId", "firstname lastname email")
        .sort({ createdAt: -1 });

      res.json({ data: payments });
    } catch (err) {
      res.status(500).json({ message: "Error fetching payments" });
    }
  }
);

// Admin: Get unread notifications
router.get(
  "/api/admin/notifications",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const notifications = await Notification.find({ isRead: false })
        .sort({ createdAt: -1 });
      
      const mappedNotifications = notifications.map(n => ({
        id: n._id,
        message: n.message,
        type: n.type,
        time: new Date(n.createdAt).toLocaleTimeString(),
        read: n.isRead,
        referenceId: n.referenceId || null
      }));

      res.json(mappedNotifications);
    } catch (err) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  }
);

// Admin: Mark notification as read
router.delete(
  "/api/admin/notifications/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      notification.isRead = true;
      await notification.save();
      
      res.json({ message: "Notification marked as read successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating notification" });
    }
  }
);

// Admin: Get Specific Monthly Insights
router.get(
  "/api/admin/monthly-insights",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { month } = req.query; // format: "YYYY-MM"
      if (!month) {
        return res.status(400).json({ message: "Month parameter is required (YYYY-MM)" });
      }

      const [yearStr, monthStr] = month.split("-");
      const year = parseInt(yearStr);
      const monthNum = parseInt(monthStr);

      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

      // 1. Calculate revenue for that specific month
      const revenueResult = await Payments.aggregate([
        {
          $match: {
            paymentStatus: "success",
            createdAt: { $gte: startDate, $lte: endDate },
            amount: { $ne: null }
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const revenue = revenueResult?.[0]?.total || 0;

      // 2. Find top selling seed for that specific month
      const ordersInMonth = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).select('_id');
      
      const orderIds = ordersInMonth.map(o => o._id);

      const topSellingItems = await OrderItem.aggregate([
        {
          $match: { orderId: { $in: orderIds } }
        },
        {
          $group: {
            _id: "$productId",
            totalQuantitySold: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" }
          }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" }
      ]);

      const topSeeds = topSellingItems.map(item => ({
        _id: item._id,
        name: item.productDetails.name,
        image: item.productDetails.imagePath || item.productDetails.image,
        totalQuantitySold: item.totalQuantitySold,
        totalRevenue: item.totalRevenue
      }));

      res.json({
        revenue,
        orders: orderIds.length,
        topSeeds
      });
    } catch (err) {
      console.error("MONTHLY_INSIGHTS_ERROR:", err);
      res.status(500).json({ message: "Error fetching monthly insights" });
    }
  }
);

module.exports = router;
