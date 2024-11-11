const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DateRoutes = require("./router/date");
const passRoutes = require("./router/pass");
const AdminPassRoutes = require("./router/AdminPass");
const promoCodeRoutes = require("./router/promo");


const authRoutes = require("./router/Admin")
const cors = require("cors");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://navratri:navratri@cluster0.pap9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api", passRoutes);
app.use("/api", DateRoutes);
app.use("/api/admin", AdminPassRoutes);
app.use("/api/promos", promoCodeRoutes);
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
