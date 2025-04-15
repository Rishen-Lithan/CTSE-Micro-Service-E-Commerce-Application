import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use("/s1", proxy("http://localhost:8001"));
app.use("/s2", proxy("http://localhost:8002"));
app.use("/s3", proxy("http://localhost:8003"));
app.use("/", proxy("http://localhost:8000"));

app.listen(PORT, () => {
    console.log(`Gateway is Listening to Port ${PORT}`);
});