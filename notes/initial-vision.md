# Initial Vision for J-Turn GUI Project

## Project Overview
The project aims to create a visual GUI for the JJ Version Control System (VCS). JJ is a modern source control system with unique features:
1. **Auto-Snapshots**: JJ automatically snapshots everything as a commit, ensuring no work is ever lost.
2. **Delayed Conflict Resolution**: Unlike Git, JJ allows conflict resolution to be delayed during commit graph operations like squash and rebase. Conflicted state markers are saved in commit objects.

These features provide the potential for an exceptional graphical experience.

## Goals
- **Primary Goal**: Develop a web-based UI for J-Turn that integrates seamlessly within VSCode and a proprietary website.
- **Stretch Goal**: Integrate JOSH for advanced workflows.

## Approach
### 1. Technical Spike: Very Small Individual Demos
- **Drag-and-Drop**: Implement drag-and-drop functionality using HTML/CSS.
- **Commit Graph Rendering**: Visualize commit graphs effectively.
- **Using JJ from Rust**: Explore JJ as a library.
- **Minimal Rust Server**: Create a fake data server.
- **VSCode Extension**: Develop a "hello world" extension.

### 2. Progressive Integration: A Few Combined Demos
- **Drag-and-Drop ↔ Commit Graph**: Synchronize interactions.
- **JJ ↔ Rust Server ↔ VSCode Extension**: Establish communication.
- **Commit Graph ↔ VSCode Extension**: Use fake data for initial integration.

### 3. Full Integration: First End-to-end Prototype
Beautiful commit graph visualization, a few drag-and-drop operations, a functional VSCode extension, a minimal Rust server, and a basic JJ library integration. End-to-end communication: UI ↔ Extension ↔ Server ↔ JJ ↔ Server ↔ Extension ↔ UI.

### 4. Feature expansion

TBC

### 5. Polish

TBC

## UI/UX Focus
The primary innovation of this project lies in the user experience of a source control system. The focus will be on:
- Simplifying workflows for source control operations.
- Designing intuitive interfaces for commit graph manipulation.
- Ensuring seamless integration within VSCode and proprietary websites.

## Technical Requirements
- **Commit Graph**: A beautiful and interactive visualization.
- **Drag-and-Drop**: Performant with immediate feedback.
- **Remote JJ Server Operations**: Efficient communication with JJ.
- **Rust Server Process**: Backend support for the UI, used by the VSCode extension.
- **JJ as a Library**: Utilize JJ beyond its CLI capabilities. Don't require users to install JJ CLI.
