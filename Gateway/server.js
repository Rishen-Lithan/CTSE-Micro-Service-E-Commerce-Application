import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import bodyParser from "body-parser";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Middleware to log the request method and URL
app.use("/s1", proxy("http://localhost:8001")); // Nuwandi
app.use("/s2", proxy("http://localhost:8002")); // Rishen
app.use("/s3", proxy("http://localhost:8003")); // Kushan
app.use("/s4", proxy("http://localhost:8004")); // Nayali
app.use("/", proxy("http://localhost:8000"));

app.listen(PORT, () => {
  console.log(`Gateway is Listening to Port ${PORT}`);
});
