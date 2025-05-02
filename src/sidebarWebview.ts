// src/sidebarWebview.ts
import * as vscode from 'vscode';
import * as path from 'path';

export class SidebarWebviewProvider implements vscode.WebviewViewProvider {

    public static readonly viewId = 'extensionTemplateSidebar';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const webviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'index.html'));

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Extension Template Webview</title>
			</head>
			<body>
				<h1>Hello from the Sidebar Webview!</h1>
				<img src="${webviewUri}" width="300" />
			</body>
			</html>`;
    }
}
