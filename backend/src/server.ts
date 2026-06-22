import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes";
import lawyerRoutes from "./routes/lawyerRoutes";
import processRoutes from "./routes/processRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/processes", processRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Asimov Associates API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;
