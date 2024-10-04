import * as vscode from "vscode";
import * as utils from "./utils";
import * as views from "./views";

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
}


export function deactivate() { }
