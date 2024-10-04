import { parse } from "csv-parse";
import * as fs from "fs";

export function parseCSV(filePath: string): Promise<any[][]> {
  let results: any[] = [];
  return new Promise<any[][]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse())
      .on('data', (row: any) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function generateHTMLTable(data: string[][]): string {
  let html = '<table border="1">'; 
  data.forEach((row, index) => {
    html += '<tr>';
    row.forEach(cell => {
      if (index === 0) {
        html += `<th>${cell}</th>`;
      } else {
        html += `<td>${cell}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</table>';
  return html;
}