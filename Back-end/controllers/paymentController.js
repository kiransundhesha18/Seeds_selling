const crypto = require("crypto");
const Razorpay = require("../config/razorpayConfig");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");
const Payment = require("../models/PaymentModel");
const Notification = require("../models/NotificationModel");
const User = require("../models/UserModel");
const { validateAddress, saveShippingAddress } = require("../helpers/orderHelpers");

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

async function fetchItemsForOrder(userId, isBuyNow, productId, quantity) {
  if (isBuyNow) {
    if (!productId) throw new Error("productId is required for buy now");
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const qty = Math.max(1, Number(quantity || 1));
    if (qty > product.stock) {
      throw new Error(`Only ${product.stock} items left in stock for ${product.name}`);
    }

    const unitPrice = toNumber(product.currentPrice ?? product.price);
    return [{ product, quantity: qty, unitPrice, totalPrice: unitPrice * qty }];
  }

  const cartItems = await Cart.find({ userId }).populate("productId");
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = [];
  for (const cartItem of cartItems) {
    const product = await Product.findById(cartItem.productId?._id ?? cartItem.productId);
    if (!product || product.status !== "active") {
      throw new Error(`Product ${cartItem.name || cartItem.productId} is not available`);
    }

    if (cartItem.quantity > product.stock) {
      throw new Error(`Only ${product.stock} items left in stock for ${product.name}`);
    }

    const unitPrice = toNumber(product.currentPrice ?? product.price);
    items.push({ product, quantity: cartItem.quantity, unitPrice, totalPrice: unitPrice * cartItem.quantity, cartItemId: cartItem._id });
  }
  return items;
}

async function reduceStockAndClearCart(userId, items, isBuyNow) {
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.product._id, stock: { $gte: item.quantity } },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  if (bulkOps.length > 0) {
    const productResult = await Product.bulkWrite(bulkOps);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = item.product;
      const remaining = product.stock - item.quantity;
      if (remaining < 0) {
        throw new Error(`Only ${product.stock} items left in stock for ${product.name}`);
      }
      
      // Trigger low stock alert if stock drops to 10 or below
      if (product.stock > 10 && remaining <= 10) {
        await Notification.create({
          message: `Low stock alert: ${product.name} is running low on inventory (only ${remaining} left)`,
          type: "low_stock",
          referenceId: product._id,
          onModel: "Product"
        });
      }
    }
  }

  if (isBuyNow) {
    // For Buy Now, we don't clear the entire cart, but we can try to decrement the item if it exists in cart
    for (const item of items) {
      if (item.product && item.product._id) {
         const cartItem = await Cart.findOne({ userId, productId: item.product._id });
         if (cartItem) {
            if (cartItem.quantity > item.quantity) {
              cartItem.quantity -= item.quantity;
              await cartItem.save();
            } else {
              await Cart.deleteOne({ _id: cartItem._id });
            }
         }
      }
    }
  } else {
    await Cart.deleteMany({ userId });
  }
}

exports.createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { address, paymentMethod = "razorpay", isBuyNow = false, productId, quantity } = req.body || {};

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ message: addressError });

    if (!["razorpay", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ message: "paymentMethod must be 'razorpay' or 'cod'" });
    }

    const orderItemsData = await fetchItemsForOrder(userId, isBuyNow, productId, quantity);

    const totalAmount = orderItemsData.reduce((acc, item) => acc + toNumber(item.totalPrice), 0);
    if (totalAmount <= 0) return res.status(400).json({ message: "Invalid order amount" });

    const savedAddress = await saveShippingAddress(userId, address);

    const order = await Order.create({
      userId,
      addressId: savedAddress._id,
      totalAmount,
      orderStatus: "processing",
      paymentStatus: "pending",
      paymentMethod,
    });

    const orderItems = await Promise.all(
      orderItemsData.map((item) =>
        OrderItem.create({
          orderId: order._id,
          productId: item.product._id,
          quantity: item.quantity,
          price: item.unitPrice,
          totalPrice: item.totalPrice,
        })
      )
    );

    if (paymentMethod === "cod") {
      await reduceStockAndClearCart(userId, orderItemsData, isBuyNow);
      await Payment.create({
        orderId: order._id,
        userId,
        paymentMethod,
        amount: totalAmount,
        currency: "INR",
        paymentStatus: "pending",
        transactionId: `COD_${Date.now()}`,
      });

      await Notification.create({
        message: `A new COD order has been placed`,
        type: "order",
        referenceId: order._id,
        onModel: "Order"
      });

      return res.status(201).json({
        message: "COD order placed successfully",
        orderId: order._id,
        type: "cod",
        order,
        orderItems,
      });
    }

    const razorpayPayload = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `${order._id}`,
      payment_capture: 1,
    };
    const razorpayOrder = await Razorpay.orders.create(razorpayPayload);

    await Payment.create({
      orderId: order._id,
      userId,
      paymentMethod,
      amount: totalAmount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
    });

    return res.status(201).json({
      message: "Razorpay order created",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_API_KEY,
      orderItems,
      razorpay: {
        amount: razorpayPayload.amount,
        currency: "INR",
        receipt: razorpayPayload.receipt,
      },
    });
  } catch (error) {
    console.error("CREATE_RAZORPAY_ORDER_ERROR", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = req.body || {};

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !orderId) {
      return res.status(400).json({ message: "Missing verification parameters" });
    }

    const paymentRecord = await Payment.findOne({ orderId, razorpayOrderId });
    if (!paymentRecord) return res.status(404).json({ message: "Payment record not found" });

    if (paymentRecord.paymentStatus === "success") {
      return res.status(200).json({ message: "Payment already verified", orderId });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      await Payment.findByIdAndUpdate(paymentRecord._id, { paymentStatus: "failed" });
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Validate with Razorpay server to ensure finality.
    const razorpayPayment = await Razorpay.payments.fetch(razorpayPaymentId);
    if (!razorpayPayment || razorpayPayment.status !== "captured") {
      await Payment.findByIdAndUpdate(paymentRecord._id, { paymentStatus: "failed" });
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
      return res.status(400).json({ message: "Payment is not captured" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Payment.findByIdAndUpdate(paymentRecord._id, {
      paymentStatus: "success",
      razorpayPaymentId,
      transactionId: razorpayPaymentId,
    });

    await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid", orderStatus: "processing" });

    const orderItems = await OrderItem.find({ orderId });
    const itemsWithProduct = await Promise.all(
      orderItems.map(async (orderItem) => {
        const product = await Product.findById(orderItem.productId);
        return { product, quantity: orderItem.quantity };
      })
    );

    // we need to know if the order was buy now. Since we don't store isBuyNow on the order,
    // we can check if it had 1 item and compare, but actually it's better to store isBuyNow in the order.
    // However, if we assume online orders clear the cart, it's safer to not clear the whole cart if we only process what was in the order.
    // Since we don't know `isBuyNow` here easily without expanding the model, we can pass `isBuyNow = orderItems.length === 1 ? true : false` as an estimation
    // But it's risky. Instead, let's just use `isBuyNow = false` for now or wait: if they checked out a cart, the cart items should be removed.
    // If they checked out 'Buy Now', only that item was removed. 
    // To be safe, we can just remove from cart EXACTLY what they bought!
    // But reduceStockAndClearCart handles either true/false. Since we don't know, we'll assume `false` (clear cart) for now. 
    // Wait, the API `/api/payment/create-order` creates the order. We can store `order.paymentMethod` and add an `orderType` or similar? 
    // Actually, `Cart.deleteMany({ userId })` is what the old verify did. 
    
    // Instead of completely guessing isBuyNow on verify, let's look at how we can remove the bought items from the cart.
    for (const oi of orderItems) {
      const cartItem = await Cart.findOne({ userId, productId: oi.productId });
      if (cartItem) {
        if (cartItem.quantity > oi.quantity) {
          cartItem.quantity -= oi.quantity;
          await cartItem.save();
        } else {
          await Cart.deleteOne({ _id: cartItem._id });
        }
      }
    }
    // We already do the above in verify Razorpay instead of `deleteMany` to be perfectly safe for both buy-now and cart!
    
    // So for verify, we only reduce stock:
    const bulkOps = itemsWithProduct.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    if (bulkOps.length > 0) {
       await Product.bulkWrite(bulkOps);
    }

    await Notification.create({
      message: `A new order has been placed via Razorpay`,
      type: "order",
      referenceId: orderId,
      onModel: "Order"
    });

    const user = await User.findById(userId);
    if (!order.invoiceGenerated) {
       try {
           const { generateInvoice } = require("../utils/invoiceService");
           const { sendInvoiceEmail } = require("../utils/emailService");
           
           const invoicePath = await generateInvoice({ ...order.toObject(), paymentStatus: "paid" }, user, itemsWithProduct, paymentRecord);
           const sent = await sendInvoiceEmail(user.email, order._id, invoicePath);
           await Order.findByIdAndUpdate(order._id, { invoiceGenerated: true, invoiceSent: sent, invoicePath });
       } catch (err) {
           console.error("Invoice generation error:", err);
       }
    }

    return res.status(200).json({ message: "Payment verified successfully", orderId });
  } catch (error) {
    console.error("VERIFY_RAZORPAY_PAYMENT_ERROR", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
