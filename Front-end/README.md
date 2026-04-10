# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# AgriFarm - Seeds Selling Platform Documentation

## 1. Project Overview
AgriFarm is a full-stack e-commerce platform designed for selling agricultural seeds. It provides a seamless experience for both customers and administrators. Customers can browse products, manage their cart/wishlist, and securely place orders using multiple payment methods (Razorpay & COD). Administrators have access to a powerful dashboard for managing products, categories, orders, users, and viewing detailed business analytics.

---

## 2. Technology Stack
### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js
- **File Handling**: Multer (Local storage / Cloudinary)
- **Communication**: NodeMailer (for OTP and Invoices)
- **Utilities**: PDFKit (Invoice generation), Razorpay SDK (Payments)

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS, CSS Modulues
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide-React, FontAwesome, React Icons
- **HTTP Client**: Axios
- **UI Components**: Swiper (Slidrs), React Toastify (Notifications)

---

## 3. Project Structure
```text
AgriFarm/
├── Back-end/
│   ├── config/             # Configuration files (DB, Cloudinary)
│   ├── controllers/        # Business logic for API endpoints
│   ├── helpers/            # Helper functions for common tasks
│   ├── middleware/         # Auth and file upload middlewares
│   ├── models/             # Mongoose schemas (User, Product, etc.)
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility services (Email, Invoice)
│   ├── uploads/            # Local storage for product images
│   └── server.js           # Backend entry point
├── Front-end/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and CSS files
│   │   ├── Component/      # Reusable UI components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── user/       # Customer-specific components
│   │   │   ├── auth/       # Login/Register components
│   │   │   ├── context/    # State management (Admin, User Context)
│   │   │   └── layout/     # Common Layouts
│   │   ├── router/         # Application routing logic
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Frontend entry point
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
└── DOCUMENTATION.md        # This file
```

---

## 4. Backend Architecture

### 4.1 Database Models
- **UserModel**: Stores user credentials, contact info, and roles (Admin/User).
- **ProductModel**: Details about seeds (name, description, price, stock, category, images).
- **CategoryModel**: Grouping for products.
- **OrderModel**: Tracks orders, status, payment methods, and delivery info.
- **OrderItemModel**: Specific items within an order.
- **PaymentModel**: Records transaction details and payment status.
- **CartModel**: Temporary storage for user's selected products.
- **WishlistModel**: User's saved items.
- **NotificationModel**: System alerts for administrators (e.g., low stock, new orders).
- **ContactModel**: Stores inquiries submitted through the contact form.

### 4.2 API Routes
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | User registration with OTP verification. |
| `/api/auth/login` | POST | Secure user/admin login with JWT. |
| `/api/products` | GET | List all available seeds. |
| `/api/admin/stats` | GET | Dashboard high-level statistics (Admin only). |
| `/api/admin/orders` | GET | List all customer orders for management. |
| `/api/payment/create` | POST | Initialize Razorpay payment session. |
| `/api/cart` | POST/GET | Manage user shopping cart. |

---

## 5. Frontend Architecture

### 5.1 Route Structure
- **Public Routes**: Home, Shop, Product Details, Contact Us, About Us.
- **Protected User Routes**: Cart, Checkout, Order History, User Profile.
- **Protected Admin Routes**: Analytics Dashboard, Product Management, Order Fulfillment, Category Management, User Overview.

### 5.2 Context Providers
- **UserContext**: Manages authentication state, user profile, cart count, and wishlist.
- **AdminContext**: Simplifies management of admin-wide states like notifications and stats.

---

## 6. Key Features
- **OTP Verification**: Secure registration process using email-based OTP.
- **Advanced Dashboard**: Visual insights using charts (Revenue growth, top-selling products).
- **Inventory Management**: Automatic stock reduction on checkout and real-time low-stock alerts.
- **Invoice System**: Automated PDF invoice generation and email delivery upon successful payment or delivery.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Real-time Notifications**: Admin alerts for critical events.

---

## 7. Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary Account (for image hosting)
- Razorpay API Keys

### Backend Setup
1. Navigate to `Back-end` directory.
2. Run `npm install`.
3. Create a `.env` file with:
   ```env
   MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, EMAIL_USER, EMAIL_PASS, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   ```
4. Start server: `npm start`.

### Frontend Setup
1. Navigate to `Front-end` directory.
2. Run `npm install`.
3. Start development server: `npm run dev`.

---


