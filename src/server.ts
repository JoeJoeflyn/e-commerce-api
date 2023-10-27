import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import { adminRouter, checkAdmin } from "./routes/admin";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/product";
import { categoryRouter } from "./routes/category";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = Number(process.env.PORT as string);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", (req, res) => {
  res.json({ message: "E Commerce API" });
});
app.use("/api/admin", checkAdmin, adminRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
