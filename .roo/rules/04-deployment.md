# Instructions to the AI Assistant - Deployment Guidelines

## Deployment Process
The app is deployed via GitHub workflows to GitHub Pages. The AI assistant must follow these steps:

1. **Update Version**
   - Update the version in `package.json`.
   - Update the version history in `notes/release-notes.md`.
   - Commit

2. **Push Changes**
   - Run `git push` to push the latest changes to the repository.

3. **Monitor GitHub Actions**
   - Check the status of the latest workflows:
     - Run `gh run list --limit 5` to list recent workflows.
     - Run `gh run watch <run-id>` to monitor the progress of a specific workflow.

4. **Verify Deployment**
   - Confirm the new version is live:
     - Request `https://maxeonyx.github.io/jturn/version.json` to verify the deployed version.

5. **Provide Feedback**
   - If successful, share the link to the working application.

## Deployment Configuration
- **GitHub Pages**
  - Ensure GitHub Pages is enabled in repository Settings > Pages.
  - Set the source to "GitHub Actions".
- **Workflow File**
  - `.github/workflows/site.yml` is configured for deploying the Vue.js app.

## Deployment of Demos
- Deploy all demos as a conglomerate to GitHub Pages.
- Each demo will have its own path under the main application.

## Future Deployment Plans
- Deploy the VSCode extension as part of the project.

## Monitoring Commands
- `gh run list` - Check GitHub Actions workflow status.
- `gh run watch <run-id>` - View summary of a specific workflow run.
- `gh run view <run-id> --log-failed` - View only the failed steps in a workflow run.
- `gh run rerun <run-id>` - Rerun a failed workflow.

## Expansion
As the project evolves, this document should be updated to include specific deployment strategies for components (eg. VSCode extension).
