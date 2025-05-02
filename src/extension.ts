// extension.ts
import * as vscode from 'vscode';
import { SidebarWebviewProvider } from './sidebarWebview';
import { CustomEditorProvider } from './customEditor';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "extension-template" is now active!');

	// Register the Hello World command
	let disposable = vscode.commands.registerCommand('extension-template.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from extension-template!');
	});

	context.subscriptions.push(disposable);

	// Register the Sidebar Webview Provider
	const sidebarProvider = new SidebarWebviewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarWebviewProvider.viewId, sidebarProvider)
	);

	// Register the Custom Editor Provider
	context.subscriptions.push(
		vscode.window.registerCustomEditorProvider(CustomEditorProvider.viewType, new CustomEditorProvider(context.extensionUri))
	);
}

export function deactivate() { }
