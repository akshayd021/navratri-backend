const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DateRoutes = require("./router/date");
const passRoutes = require("./router/pass");
const AdminPassRoutes = require("./router/AdminPass");
const authRoutes = require("./router/Admin");
const promoCodeRoutes = require("./router/Promo");

const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use auth routes
// app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", passRoutes);
app.use("/api", DateRoutes);
app.use("/api/admin", AdminPassRoutes);
app.use("/api/promos", promoCodeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
