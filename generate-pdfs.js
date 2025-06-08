import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function generatePDF(htmlFile, outputFile) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const htmlContent = fs.readFileSync(htmlFile, 'utf8');
  await page.setContent(htmlContent);
  
  await page.pdf({
    path: outputFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  await browser.close();
}

// Generate PDFs
await generatePDF('test.html', 'test1.pdf');
await generatePDF('test2.html', 'test2.pdf');

console.log('PDFs generated successfully!'); 