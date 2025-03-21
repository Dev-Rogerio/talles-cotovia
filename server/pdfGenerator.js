const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

async function generatePDF(templateData) {
  try {
    // Inicializa o Puppeteer
    const browser = await puppeteer.launch({
      headless: "new", // modo recomendado
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Caminho para o template HTML
    const templatePath = path.join(__dirname, "template.html");

    // Carregar o HTML do template
    const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Compilar template com Handlebars
    const template = handlebars.compile(htmlTemplate);
    const htmlContent = template(templateData);

    // Configura o conteúdo HTML no Puppeteer
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Gera o PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // Fecha o navegador
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    throw new Error("Erro ao gerar o PDF");
  }
}

module.exports = generatePDF;
