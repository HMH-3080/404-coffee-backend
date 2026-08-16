const express = require("express");
const cors = require("cors");

const userRoutes = require("./modules/users/user.routes");

const authRoutes = require("./modules/auth/auth.routes");

const returnRoutes = require("./modules/returns/return.routes");


const rawMaterialRoutes = require("./modules/raw-materials/raw-material.routes");

const permissionRoutes = require("./modules/users/permission.routes");

const supplierRoutes = require("./modules/suppliers/supplier.routes");


const productRoutes = require("./modules/products/product.routes");


const saleRoutes = require("./modules/sales/sale.routes");
const purchaseRoutes = require("./modules/purchases/purchase.routes");
const customerRoutes = require("./modules/customers/customer.routes");

const delegateRoutes = require("./modules/delegates/delegate.routes");

const orderRoutes = require("./modules/orders/order.routes");

const cashDrawerShiftRoutes = require("./modules/cash-drawer-shifts/cash-drawer-shift.routes");

const auditLogRoutes = require("./modules/audit-logs/audit-log.routes");

const settingRoutes = require("./modules/settings/setting.routes");

const warningRoutes = require("./modules/warnings/warning.routes");

const financialReportRoutes = require("./modules/financial-reports/financial-report.routes");

const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

const chatRoutes = require("./modules/chat/chat.routes");



const errorHandler = require("./middlewares/error.middleware");


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "404 Coffee API is running",
  });
});


// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);



app.use("/api/sales", saleRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/raw-materials", rawMaterialRoutes);


app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);


app.use("/api/returns", returnRoutes);

app.use("/api/delegates", delegateRoutes);

// Permission routes
app.use("/api/permissions", permissionRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/cash-drawer-shifts", cashDrawerShiftRoutes);

app.use("/api/audit-logs", auditLogRoutes);

app.use("/api/settings", settingRoutes);

app.use("/api/warnings", warningRoutes);

app.use("/api/financial-reports", financialReportRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/chat", chatRoutes);







// Error handler must be after routes
app.use(errorHandler);

module.exports = app;