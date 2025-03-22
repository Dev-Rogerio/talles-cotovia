const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const chromium = require("chrome-aws-lambda");

const generatePDF = async (data) => {
  try {
    // Lê o template HTML
    const templatePath = path.join(__dirname, "template.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    // Renderiza o template com os dados
    const html = ejs.render(template, data);

    // Inicia o browser usando chrome-aws-lambda
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Define o conteúdo da página
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Gera o PDF
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    throw error;
  }
};

module.exports = generatePDF;
