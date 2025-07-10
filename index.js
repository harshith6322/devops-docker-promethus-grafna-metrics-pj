import express from "express";
import client from "prom-client";
import { metricsMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());
app.use(metricsMiddleware);

//------------not scaleble for monitoring---------
// const middleware = (req, res, next) => {
//   const startTime = Date.now();
//   next();
//   const endTime = Date.now();
//   console.log(`Request took ${endTime - startTime}ms`);
//   console.log(req.ip, req.path);
// };
// app.use(middleware);

app.get("/user", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
    ...user,
    id: 1,
  });
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3003, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3003");
});
