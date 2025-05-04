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

// Test Plan: Basic Graph View and Revision Switching
// Technical Approach:
// - Webview UI testing: Use message passing between the test suite and the webview.
// - Source Control Testing: Use Node.js `child_process` to execute `jj` commands.
//
// 1. Verify Graph Display and Initial Node:
//    - Open the graph view.
//    - Assert that the graph view is visible.
//    - Assert that a single commit node (circle) is displayed.
// 2. Verify Node Information:
//    - Get the displayed JJ changeset ID, Git commit hash, and commit description from the node via message passing from the webview.
//    - Compare these displayed values with the actual values obtained by running `jj status` using Node.js `child_process`. Assert that they match.
// 3. Verify Revision Switching on Click:
//    - Identify a different commit to switch to (if available, otherwise create a new one for testing).
//    - Send a message to the webview to simulate a single click on the node representing the target commit.
//    - Run `jj status` using Node.js `child_process` and assert that the working copy has been updated to the clicked commit's revision.
