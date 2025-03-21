const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const sendEmailWithPDF = require("./emailSender"); // Supondo que sua função esteja aqui
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post("/send-pedido", async (req, res) => {
  const templateData = req.body;
  console.log("Dados recebidos no servidor:", templateData);

  try {
    // Aqui você pode gerar o PDF com a biblioteca PDFKit, se necessário
    const doc = new PDFDocument();
    const filePath = "output.pdf";
    doc.pipe(fs.createWriteStream(filePath));
    doc.text("Este é um PDF gerado pelo Node.js!");
    doc.end();

    // Enviando e-mail com o PDF gerado
    await sendEmailWithPDF(
      { to: "roger.ngt3494@gmail.com" },
      templateData,
      filePath
    );

    console.log("E-mail enviado com sucesso!");
    res.status(200).json({ message: "Pedido enviado com sucesso!" }); // resposta em JSON
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar o pedido" }); // resposta em JSON
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
