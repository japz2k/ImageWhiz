import * as pdfjsLib from 'pdfjs-dist/build/pdf';

export async function extractPdfTextPerPage(file) {
  const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
  const numPages = pdf.numPages;
  const pages = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join all text items for the page
    const pageText = content.items.map(item => item.str).join(' ');
    pages.push({ pageNum: i, text: pageText });
  }
  return pages;
}
