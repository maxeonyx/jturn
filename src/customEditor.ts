// src/customEditor.ts
import * as vscode from 'vscode';

export class CustomEditorProvider implements vscode.CustomEditorProvider {

    public static readonly viewType = 'extensionTemplateCustomEditor';

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) { }

    public async resolveCustomEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        // Setup initial state of the webview
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        // Get the HTML content for the webview
        webviewPanel.webview.html = this._getHtmlForWebview(webviewPanel.webview);

        // Handle messages from the webview
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'info':
                    vscode.window.showInformationMessage(e.value);
                    return;
                case 'error':
                    vscode.window.showErrorMessage(e.value);
                    return;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const webviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'index.html'));

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Custom Editor Webview</title>
			</head>
			<body>
				<h1>Hello from the Custom Editor Webview!</h1>
				<img src="${webviewUri}" width="300" />
			</body>
			</html>`;
    }
}
