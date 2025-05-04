# J-Turn: Visual Interface for JJ Source Control

J-Turn is a Visual Studio Code extension that reimagines version control through an intuitive, visual interface for JJ - a modern, Git-compatible version control system. This document outlines the vision, core principles, and planned features of J-Turn.

## Vision

J-Turn transforms JJ's powerful but abstract version control operations into natural visual interactions. By leveraging JJ's unique characteristics - particularly its ability to make all operations undoable - J-Turn creates a more intuitive and less error-prone version control experience.

## Core Principles

### Visual-First Design
- Transform abstract VCS concepts into tangible, manipulatable objects
- Make complex operations as simple as drag-and-drop
- Maintain a compact but clear visualization
- Ensure all interactive elements are easily clickable

### Error Prevention
- Only show valid operations based on current state
- Ensure operation preconditions are visually clear
- Leverage JJ's undoable operations for safety
- Integrate with VS Code's undo system where possible

### Seamless VS Code Integration
- Native VS Code theming and styling
- Full integration with VS Code's undo system
- Consistent placement options (editor, sidebar, panel)
- Natural extension of VS Code's SCM features

## User Interface

### Graph View (Primary Interface)
The graph view is the central interface element, available in multiple locations:
- Editor tabs
- Side panel
- Bottom panel
- Sidebar

#### Visual Elements
- Compact but clear commit graph
- Minimal unique change IDs (using JJ's auto-shortening)
- Visual distinction for pushed/immutable commits
- Bookmark status indicators
- Color-coded parent relationships for merge commits

### Interactive Features

#### Drag & Drop Operations
1. Changes
   - Merge: Drop directly onto another change
   - Rebase: Drop into space above a change
   - Hunk-level: Drag individual hunks between changes

2. Bookmarks
   - Forward movement always allowed
   - Remote bookmark dragging triggers push
   - Visual indicators for push status

#### Merge Conflict Resolution
- Visual interface for resolving conflicts
- Color-coded conflict markers matching parent commits
- Drag-and-drop resolution of conflicting hunks
- Preview of resolution results
- Show diff against merge base for context during conflict resolution

#### Inline Commit Interface
- Expands inline when double-clicking a change
- Creates visual "hole" in the graph
- Shows file explorer and hunk view
- Supports drag-drop of hunks
- Integrates with graph view above and below

### Alternative Interaction Methods
- Context menus for all operations
- VS Code command palette integration
- VS Code SCM provider integration
- Keyboard shortcuts (stretch goal)

## Additional Features

### Operation Management
- Visual operation log
- Integration with VS Code's undo system
- Real-time feedback for all operations

### Remote Management
- Simplified remote repository interface
- No command line knowledge required
- Git compatibility maintained

### Testing & Reliability
- Comprehensive test suite using real JJ operations
- Headless browser testing for UI
- Integration tests for VS Code features

## Stretch Goals

### Accessibility
- Keyboard navigation of graph
- Screen reader support
- High contrast theme support

### Advanced Features
- Operation preview system
- Cross-workspace operations
