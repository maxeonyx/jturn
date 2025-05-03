import * as vscode from 'vscode';

export function showGitGraph(extensionUri: vscode.Uri): vscode.WebviewPanel {
    const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

    const panel = vscode.window.createWebviewPanel(
        'jturn.gitGraph',
        'Git Graph',
        column || vscode.ViewColumn.One,
        {
            enableScripts: false
        }
    );

    panel.webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Git Graph View</title>
    </head>
    <body>
        <h1>Hello from J-Turn's Git Graph View!</h1>
    </body>
    </html>`;

    return panel;
}
