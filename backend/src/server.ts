import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Asimov Associates API está funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
