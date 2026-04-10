const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = async (order, user, items, payment) => {
  return new Promise((resolve, reject) => {
    try {
      if (order.invoiceGenerated) {
         if (order.invoicePath && fs.existsSync(order.invoicePath)) {
             return resolve(order.invoicePath);
         }
      }

      const invoiceDir = path.join(__dirname, "../uploads/invoices");
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const userName = `${user.firstname || 'user'}_${user.lastname || ''}`.trim().replace(/\s+/g, '_').toLowerCase();
      const invoiceFileName = `invoice_${userName}_${order._id}.pdf`;
      const invoicePath = path.join(invoiceDir, invoiceFileName);

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(invoicePath);
      
      doc.pipe(stream);

      // -----------------------------------------------------
      // HEADER SECTION (BRANDS & INVOICE INFO)
      // -----------------------------------------------------
      doc.fillColor("#059669")
         .fontSize(28)
         .font("Helvetica-Bold")
         .text("AgriFarm", 50, 50);

      doc.fillColor("#64748b")
         .fontSize(10)
         .font("Helvetica")
         .text("Premium Seeds & Agricultural Products", 50, 80);

      doc.fillColor("#0f172a")
         .fontSize(24)
         .font("Helvetica-Bold")
         .text("INVOICE", 0, 50, { align: "right", width: 545 });
         
      doc.fillColor("#64748b")
         .fontSize(10)
         .font("Helvetica")
         .text(`Order ID: ${order._id}`, 0, 80, { align: "right", width: 545 });
         
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 0, 95, { align: "right", width: 545 });

      // Horizontal Line
      doc.moveTo(50, 120).lineTo(545, 120).strokeColor("#e2e8f0").lineWidth(1).stroke();

      // -----------------------------------------------------
      // CUSTOMER & PAYMENT DETAILS
      // -----------------------------------------------------
      const customerY = 140;
      doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text("Billed To:", 50, customerY);
      doc.font("Helvetica").fillColor("#334155")
         .text(`${user.firstname} ${user.lastname}`, 50, customerY + 15)
         .text(`${user.email}`, 50, customerY + 30);
         
      if (user.mobile || user.phone) {
         doc.text(`Phone: ${user.mobile || user.phone}`, 50, customerY + 45);
      }

      const paymentMethodStr = order.paymentMethod || (payment ? payment.paymentMethod : "N/A");
      
      doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text("Payment Info:", 350, customerY);
      doc.font("Helvetica").fillColor("#334155")
         .text(`Method: ${paymentMethodStr.toUpperCase()}`, 350, customerY + 15)
         .text(`Status: ${order.paymentStatus.toUpperCase()}`, 350, customerY + 30);

      if (order.expectedDelivery) {
         doc.text(`Delivery: ${new Date(order.expectedDelivery).toLocaleDateString()}`, 350, customerY + 45);
      }

      // Horizontal Line
      doc.moveTo(50, 220).lineTo(545, 220).strokeColor("#e2e8f0").lineWidth(1).stroke();

      // -----------------------------------------------------
      // ITEMS TABLE HEADER
      // -----------------------------------------------------
      let currentY = 240;
      
      // Background for header
      doc.rect(50, currentY - 5, 495, 25).fillColor("#059669").fill();
      
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
      doc.text("Product Details", 60, currentY);
      doc.text("Qty", 320, currentY, { width: 50, align: "center" });
      doc.text("Unit Price", 380, currentY, { width: 80, align: "right" });
      doc.text("Total", 460, currentY, { width: 75, align: "right" });

      currentY += 30;

      // -----------------------------------------------------
      // ITEMS ROWS
      // -----------------------------------------------------
      doc.fillColor("#334155").font("Helvetica").fontSize(10);
      
      let alternateBg = false;

      items.forEach((item, i) => {
        const prod = item.productId || item.product;
        const productName = prod?.name || "Unknown Product";
        const quantity = item.quantity || 1;
        const price = item.price || (item.totalPrice ? item.totalPrice / quantity : (prod?.currentPrice || prod?.price || 0));
        const itemTotal = price * quantity;
        
        // Alternate row background
        if (alternateBg) {
           doc.rect(50, currentY - 5, 495, 25).fillColor("#f8fafc").fill();
           doc.fillColor("#334155"); // Restore text color
        }
        
        doc.text(productName, 60, currentY, { width: 250 });
        doc.text(quantity.toString(), 320, currentY, { width: 50, align: "center" });
        doc.text(`Rs. ${Math.round(price).toFixed(2)}`, 380, currentY, { width: 80, align: "right" });
        doc.text(`Rs. ${Math.round(itemTotal).toFixed(2)}`, 460, currentY, { width: 75, align: "right" });
        
        currentY += 25;
        alternateBg = !alternateBg;
      });

      // Horizontal Line
      doc.moveTo(50, currentY + 5).lineTo(545, currentY + 5).strokeColor("#e2e8f0").lineWidth(1).stroke();

      // -----------------------------------------------------
      // TOTALS
      // -----------------------------------------------------
      currentY += 20;
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(12);
      doc.text("Grand Total:", 360, currentY, { align: "right", width: 80 });
      doc.fillColor("#059669").text(`Rs. ${order.totalAmount.toFixed(2)}`, 460, currentY, { align: "right", width: 75 });

      // Footer
      doc.fillColor("#94a3b8").font("Helvetica").fontSize(9);
      doc.text("Thank you for shopping with AgriFarm!", 50, 750, { align: "center", width: 495 });

      doc.end();

      stream.on("finish", () => {
        resolve(invoicePath);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
