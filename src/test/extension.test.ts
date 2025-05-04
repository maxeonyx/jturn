// extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';

// Issue: Running tests requires a display server.
// When running tests in an environment without a graphical display (e.g., via SSH without proper X11 forwarding),
// the VS Code test runner fails with "Missing X server or $DISPLAY".
//
// Considered Solutions:
// 1. Set display environment variables (`DISPLAY`, `XDG_RUNTIME_DIR`, `DBUS_SESSION_BUS_ADDRESS`) in the SSH session.
//    - Attempted this, but it did not fully resolve the issue, possibly due to X11 forwarding or authorization complexities over SSH.
// 2. Use a virtual display server like `Xvfb`.
//    - This is the approach used in the CI workflow (`.github/workflows/ci.yaml`) and is a standard method for running graphical applications in headless environments.
//    - This is the recommended approach for reliable test execution in such environments.

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

suite('Graph View Tests', () => {
	test('Graph view should display a single commit node initially', async () => {
		// TODO: Implement logic to open the graph view
		// TODO: Implement logic to check if the graph view is visible
		// TODO: Implement logic to check for a single commit node (circle)

		// This test will fail until the graph view and initial node are implemented.
		assert.fail('Graph view and initial node not yet implemented');
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
