// extension.ts
import * as vscode from 'vscode';
import { SidebarWebviewProvider, SidebarTreeViewProvider } from './sidebarWebview';
import { showGitGraph } from './gitGraph';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "jturn" is now active!');

	// Register the Hello World command which will show the git graph panel
	let disposable = vscode.commands.registerCommand('jturn.helloWorld', () => {
		showGitGraph(context.extensionUri);
	});

	context.subscriptions.push(disposable);

	// Register the Sidebar Tree View Provider
	const treeViewProvider = new SidebarTreeViewProvider();
	const disp = vscode.window.registerTreeDataProvider('jturn.jturnTreeview', treeViewProvider);
	context.subscriptions.push(disp);

	const outputChannel = vscode.window.createOutputChannel('J-Turn Logs');
	outputChannel.appendLine('Registering Sidebar Webview Provider'); // Log to custom output channel

	const sidebarWebviewProvider = new SidebarWebviewProvider(context.extensionUri, outputChannel);
	const disp2 = vscode.window.registerWebviewViewProvider('jturn.jturnwebview', sidebarWebviewProvider);
	context.subscriptions.push(disp2);
}

export function deactivate() { }
