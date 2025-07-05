/*
REQUIREMENTS:
- User can drag elements with .draggable class
- Drop zones (.drop-area) become visible and interactive during drag
- Visual feedback shows current drop target during drag operation
- Customizable callbacks for drag start, move, end, and drop events
- Drag preview follows mouse cursor during drag operation
- Drop zones only appear on elements other than the one being dragged
- Library manages all CSS classes automatically (drag-active, dragging)
- Works with any HTML structure that follows the expected classes
- createDragPreview and updateDragCursor behaviors are customizable via callbacks
*/

/**
 * Dropzones Drag and Drop Library
 * A flexible drag and drop system for radial drop targets (drop stars)
 *
 * Usage:
 * const dropzones = new Dropzones({
 *   onDragStart: (element, data) => { ... },
 *   onDragMove: (element, dropTarget, data) => { ... },
 *   onDrop: (sourceElement, dropTarget, data) => { ... },
 *   onDragEnd: (element, data) => { ... }
 * });
 */
class Dropzones {
    constructor(options = {}) {
        this.options = {
            // Drag threshold before starting drag operation
            dragThreshold: 5,

            // Selectors for draggable elements and drop areas
            draggableSelector: '.draggable',
            dropAreaSelector: '.drop-area',
            dragCursorSelector: '.drag-cursor',

            // Callbacks
            onDragStart: options.onDragStart || (() => { }),
            onDragMove: options.onDragMove || (() => { }),
            onDrop: options.onDrop || (() => { }),
            onDragEnd: options.onDragEnd || (() => { }),

            // Allow custom data extraction
            getDragData: options.getDragData || this.getDefaultDragData.bind(this),
            
            // Allow custom drag preview and cursor
            createDragPreview: options.createDragPreview || this.getDefaultCreateDragPreview.bind(this),
            updateDragCursor: options.updateDragCursor || this.getDefaultUpdateDragCursor.bind(this),

            ...options
        };

        this.dragState = null;
        this.setupEventListeners();
    }

    /**
     * Set up global event listeners for drag and drop
     */
    setupEventListeners() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Prevent default drag behavior on draggable elements
        document.addEventListener('dragstart', (e) => {
            if (e.target.closest(this.options.draggableSelector)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Extract default data from draggable element
     */
    getDefaultDragData(element) {
        return {
            id: element.dataset.id,
            element: element,
            ...element.dataset
        };
    }

    /**
     * Handle mouse down on draggable elements
     */
    handleMouseDown(e) {
        const draggable = e.target.closest(this.options.draggableSelector);
        if (!draggable) return;

        e.preventDefault();

        const dragData = this.options.getDragData(draggable);

        this.dragState = {
            element: draggable,
            data: dragData,
            startX: e.clientX,
            startY: e.clientY,
            isDragging: false,
            preview: null
        };

        document.body.style.cursor = 'grabbing';
    }

    /**
     * Handle mouse movement for drag operations
     */
    handleMouseMove(e) {
        if (!this.dragState) return;

        const dx = e.clientX - this.dragState.startX;
        const dy = e.clientY - this.dragState.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Start dragging if moved enough
        if (!this.dragState.isDragging && distance > this.options.dragThreshold) {
            this.startDrag(e);
        }

        if (this.dragState.isDragging) {
            this.updateDrag(e);
        }
    }

    /**
     * Handle mouse up to end drag operations
     */
    handleMouseUp(e) {
        if (!this.dragState) return;

        if (this.dragState.isDragging) {
            this.endDrag(e);
        }

        this.dragState = null;
        document.body.style.cursor = 'default';
    }

    /**
     * Start the drag operation
     */
    startDrag(e) {
        this.dragState.isDragging = true;

        // Add CSS classes for drag state
        this.dragState.element.classList.add('dragging');

        // Add dragging class to parent container if it exists
        const container = this.dragState.element.closest('.node-container');
        if (container) {
            container.classList.add('dragging');
        }

        document.body.classList.add('drag-active');

        // Create drag preview
        this.createDragPreview();

        // Notify callback
        this.options.onDragStart(this.dragState.element, this.dragState.data);
    }

    /**
     * Update drag operation during mouse movement
     */
    updateDrag(e) {
        // Update drag preview position
        if (this.dragState.preview) {
            this.dragState.preview.style.left = e.clientX + 'px';
            this.dragState.preview.style.top = e.clientY + 'px';
        }

        // Check for drop target
        const dropTarget = this.getDropTarget(e.clientX, e.clientY);
        this.updateDragCursor(e, dropTarget);

        // Notify callback
        this.options.onDragMove(this.dragState.element, dropTarget, this.dragState.data);
    }

    /**
     * End the drag operation
     */
    endDrag(e) {
        // Remove CSS classes for drag state
        this.dragState.element.classList.remove('dragging');

        const container = this.dragState.element.closest('.node-container');
        if (container) {
            container.classList.remove('dragging');
        }

        document.body.classList.remove('drag-active');

        // Remove drag preview
        if (this.dragState.preview) {
            this.dragState.preview.remove();
        }

        // Hide drag cursor
        this.hideDragCursor();

        // Check for successful drop
        const dropTarget = this.getDropTarget(e.clientX, e.clientY);
        if (dropTarget) {
            this.options.onDrop(this.dragState.element, dropTarget, this.dragState.data);
        }

        // Always notify drag end
        this.options.onDragEnd(this.dragState.element, this.dragState.data);
    }

    /**
     * Create a visual preview that follows the cursor
     */
    createDragPreview() {
        this.options.createDragPreview(this.dragState);
    }

    /**
     * Default implementation for creating drag preview
     */
    getDefaultCreateDragPreview(dragState) {
        const original = dragState.element;
        const preview = original.cloneNode(true);

        preview.classList.add('drag-preview');
        preview.classList.remove(this.options.draggableSelector.slice(1)); // Remove class prefix
        preview.style.left = dragState.startX + 'px';
        preview.style.top = dragState.startY + 'px';

        document.body.appendChild(preview);
        dragState.preview = preview;
    }

    /**
     * Find drop target at the given coordinates
     */
    getDropTarget(x, y) {
        const elements = document.elementsFromPoint(x, y);
        const dropArea = elements.find(el => el.classList.contains(this.options.dropAreaSelector.slice(1)));

        if (dropArea) {
            return {
                element: dropArea,
                action: dropArea.dataset.action,
                target: dropArea.dataset.target,
                ...dropArea.dataset
            };
        }

        return null;
    }

    /**
     * Update the drag cursor visual feedback
     */
    updateDragCursor(e, dropTarget) {
        this.options.updateDragCursor(e, dropTarget, this.options.dragCursorSelector);
    }

    /**
     * Default implementation for updating drag cursor
     */
    getDefaultUpdateDragCursor(e, dropTarget, dragCursorSelector) {
        const cursor = document.querySelector(dragCursorSelector);
        if (!cursor) return;

        if (dropTarget) {
            cursor.textContent = dropTarget.action ? dropTarget.action.toUpperCase() : 'DROP';
            cursor.className = `${dragCursorSelector.slice(1)} active ${dropTarget.action || ''}`;
        } else {
            cursor.textContent = 'DRAG';
            cursor.className = `${dragCursorSelector.slice(1)} active`;
        }

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    /**
     * Hide the drag cursor
     */
    hideDragCursor() {
        const cursor = document.querySelector(this.options.dragCursorSelector);
        if (cursor) {
            cursor.classList.remove('active');
        }
    }

    /**
     * Destroy the dropzones instance and clean up event listeners
     */
    destroy() {
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        // Clean up any ongoing drag state
        if (this.dragState) {
            if (this.dragState.isDragging) {
                this.dragState.element.classList.remove('dragging');
                const container = this.dragState.element.closest('.node-container');
                if (container) {
                    container.classList.remove('dragging');
                }
                document.body.classList.remove('drag-active');
            }

            if (this.dragState.preview) {
                this.dragState.preview.remove();
            }

            this.hideDragCursor();
            this.dragState = null;
        }

        document.body.style.cursor = 'default';
    }
}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dropzones;
} else if (typeof window !== 'undefined') {
    window.Dropzones = Dropzones;
}
