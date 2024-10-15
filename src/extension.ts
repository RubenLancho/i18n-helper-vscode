import * as vscode from "vscode";
import * as utils from "./utils";
import * as views from "./views";

import * as jsonc from "jsonc-parser";

import * as fs from "fs";



export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-i18n-helper" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-i18n-helper.visualizeCSV', async () => {
      const panel = vscode.window.createWebviewPanel(
        'CSVViewer',
        'Visualize CSV',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      let csvFilePath = await vscode.window.showInputBox({
        prompt: "Enter route CSV",
        placeHolder: "/translations.csv",
      });

      if (!csvFilePath) {
        vscode.window.showErrorMessage("Path not provided.");
        return;
      }

      let csv = await utils.parseCSV(csvFilePath);
      const htmlContent = utils.generateHTMLTable(csv);
      panel.webview.html = views.getWebviewContent(htmlContent);
    }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-i18n-helper.compareJSON', async () => {
      const directoryPath = await utils.getDirectory("i18n route", "/Projects/angular/src/assets/i18n/");

      if (directoryPath === "") {
        return;
      }

      const pathFiles = utils.getFilesInDirectory(directoryPath);

      let files: any[] = [];
      pathFiles.forEach((filePath) => {
        files.push(fs.readFileSync(directoryPath + filePath, "utf-8"));
      });

      let jsonObjs: any = [];

      files.forEach((file) => {
        try {
          jsonObjs.push(jsonc.parse(file));
        } catch (error) {
          vscode.window.showErrorMessage("Error to parse JSON: " + error);
          return;
        }
      });

      utils.addKeys(...jsonObjs);

      pathFiles.forEach((element, index) => {
        const sortedAndFilledJsonText = JSON.stringify(
          jsonObjs[index],
          null,
          2
        );

        fs.writeFileSync(
          directoryPath + element,
          sortedAndFilledJsonText,
          "utf-8"
        );
      });

      vscode.window.showInformationMessage(
        "JSON sorted and completed successfully"
      );
    }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-i18n-helper.generateCSV', async () => {
      utils.generarCSV();
      vscode.window.showInformationMessage(
        "CSV sorted and completed successfully"
      );
    }
    )
  );

}


export function deactivate() { }
