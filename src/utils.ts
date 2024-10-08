import { parse } from "csv-parse";
import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";

type JsonObject = Record<string, any>;

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

export async function getDirectory(): Promise<string> {
  let directoryPath = await vscode.window.showInputBox({
    prompt: "i18n route",
    placeHolder: "/Projects/angular/src/assets/i18n/",
  });

  if (!directoryPath) {
    vscode.window.showErrorMessage("Path not provided.");
    return "";
  }
  //directoryPath = directoryPath.replace(/\s/g, "");
  if (directoryPath.substr(-1) !== "/") {
    directoryPath += "/";
  }

  if (
    !fs.existsSync(directoryPath) ||
    !fs.statSync(directoryPath).isDirectory()
  ) {
    vscode.window.showErrorMessage("The path provided is not a valid.");
    return "";
  }

  return directoryPath;
}


export function getFilesInDirectory(route: string): string[] {
  const files: string[] = [];

  const directoryFile = fs.readdirSync(route);

  directoryFile.forEach((item) => {
    const fullRoute = path.join(route, item);

    if (!fs.statSync(fullRoute).isDirectory()) {
      files.push(item);
    }
  });

  return files;
}

export function addKeys(...jsons: JsonObject[]): void {
  function addRecursiveKeys(
    obj1: JsonObject,
    obj2: JsonObject
  ): void {
    const keysObj1 = Object.keys(obj1);
    const keysObj2 = Object.keys(obj2);

    for (const key of keysObj1) {
      if (!(key in obj2)) {
        if (typeof obj1[key] === "object" && obj1[key] !== null) {
          obj2[key] = {};
          addRecursiveKeys(obj1[key], obj2[key]);
        } else {
          obj2[key] = "XXXX";
        }
      } else if (
        typeof obj1[key] === "object" &&
        obj1[key] !== null &&
        typeof obj2[key] === "object" &&
        obj2[key] !== null
      ) {
        addRecursiveKeys(obj1[key], obj2[key]);
      }
    }

    for (const key of keysObj2) {
      if (!(key in obj1)) {
        if (typeof obj2[key] === "object" && obj2[key] !== null) {
          obj1[key] = {};
          addRecursiveKeys(obj2[key], obj1[key]);
        } else {
          obj1[key] = "XXXX";
        }
      } else if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        typeof obj1[key] === "object" &&
        obj1[key] !== null
      ) {
        addRecursiveKeys(obj2[key], obj1[key]);
      }
    }
  }

  for (let i = 0; i < jsons.length; i++) {
    for (let j = i + 1; j < jsons.length; j++) {
      addRecursiveKeys(jsons[i], jsons[j]);
    }
  }
}
