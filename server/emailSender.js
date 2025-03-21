require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const generatePDF = require("./pdfGenerator");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithPDF({ to }, templateData) {
  try {
    console.log("Gerando PDF com dados:", templateData);

    const pdfBuffer = await generatePDF(templateData);

    const msg = {
      to: to || process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM,
      subject: `Pedido Nº ${templateData.id} - ${templateData.client}`,
      text: `Segue em anexo o pedido de ${templateData.client}`,
      html: `<p>Segue em anexo o pedido do cliente <strong>${templateData.client}</strong>.</p>`,
      attachments: [
        {
          content: Buffer.from(pdfBuffer).toString("base64"), // <- Aqui corrigido
          filename: `Pedido-${templateData.client}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
    console.log("E-mail enviado com sucesso!");
  } catch (error) {
    a;
    console.error(
      "Erro ao enviar e-mail:",
      error.response ? error.response.body : error
    );
    throw new Error("Erro ao enviar o e-mail");
  }
}

module.exports = sendEmailWithPDF;
