// extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {

	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be active', () => {
		// The extensionId is <publisher>.<name>
		const extension = vscode.extensions.getExtension('maxeonyx.jturn');
		assert.strictEqual(extension?.isActive, true);
	});

	test('Hello World command should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('jturn.helloWorld'));
	});
});
