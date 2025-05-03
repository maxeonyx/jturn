// src/sidebarWebview.ts
import * as vscode from 'vscode';
import * as path from 'path';

export class SidebarWebviewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private outputChannel: vscode.OutputChannel;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        outputChannel: vscode.OutputChannel
    ) {
        this.outputChannel = outputChannel;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        // Set options for the webview
        this._view.webview.options = {
            enableScripts: false,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media')
            ]
        };

        // Set initial HTML content
        this._view.webview.html = this._getHtmlContent();

        this.outputChannel.appendLine('Webview resolved successfully');
    }

    private _getHtmlContent(): string {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>J-Turn Webview</title>
            </head>
            <body>
                <h1>Hello from J-Turn's Sidebar Webview!</h1>
            </body>
            </html>`;
    }
}

export class SidebarTreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            return Promise.resolve([new vscode.TreeItem('Hello from Tree View')]);
        }
        return Promise.resolve([]);
    }
}
