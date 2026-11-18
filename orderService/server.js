import express from "express";
import cors from "cors";

import orderRoutes from "./src/routes/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Order Service REST API running on port ${PORT}`);
});
