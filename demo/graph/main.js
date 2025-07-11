document.addEventListener('DOMContentLoaded', () => {
    const graphSelect = document.getElementById('graph-select');
    const graphContainer = document.getElementById('graph-container');
    let resizeObserver;

    function renderGraph(graphName) {
        // Dynamically populate graph options
        // Clear existing options
        graphSelect.innerHTML = '';

        // Dynamically populate graph options with human-friendly names
        Object.entries(commitData).forEach(([graphKey, graphData]) => {
            const option = document.createElement('option');
            option.value = graphKey;
            option.textContent = graphData.name;
            graphSelect.appendChild(option);
        });

        const graphData = commitData[graphName];
        if (!graphData) {
            console.error(`Graph data for "${graphName}" not found.`);
            return;
        }
        const commits = graphData.commits;
        if (!commits) {
            console.error(`Graph data for "${graphName}" not found.`);
            return;
        }

        const layout = calculateLayout(commits);

        if (resizeObserver) resizeObserver.disconnect();

        const debouncedRender = debounce(() => render(layout, commits), 50);
        render(layout, commits);

        resizeObserver = new ResizeObserver(debouncedRender);
        resizeObserver.observe(graphContainer);
    }

    function calculateLayout(commits) {
        const layout = new Map();
        const commitMap = new Map(commits.map(c => [c.id, c]));
        const lanes = [];

        commits.forEach((commit, rowIndex) => {
            let columnIndex = lanes.indexOf(commit.id);
            if (columnIndex === -1) {
                columnIndex = lanes.findIndex(lane => !lane);
                if (columnIndex === -1) columnIndex = lanes.length;
            }
            lanes[columnIndex] = commit.id;

            commit.parents.slice(1).forEach(parentId => {
                const parentIndex = lanes.indexOf(parentId);
                if (parentIndex !== -1) lanes[parentIndex] = null;
            });

            layout.set(commit.id, { row: rowIndex, column: columnIndex, color: columnIndex % 8 });

            if (commit.parents.length > 0) {
                const parentId = commit.parents[0];
                lanes[columnIndex] = commitMap.has(parentId) ? parentId : null;
            } else {
                lanes[columnIndex] = null;
            }
        });
        return layout;
    }

    function render(layout, commits) {
        // This function uses a robust, two-pass "measure-then-draw" approach.
        //
        // Pass 1: Render all the HTML elements (grid cells and commit nodes).
        // The browser's engine handles the complex layout based on the CSS grid.
        // We don't make any assumptions about row heights or positions in this step.
        //
        // Pass 2: (Inside requestAnimationFrame) Measure the exact, rendered positions
        // of the commit nodes using getBoundingClientRect(). This gives us real-world
        // coordinates. We then use these coordinates to draw the SVG lines, ensuring
        // perfect alignment between the SVG overlay and the HTML grid.

        graphContainer.innerHTML = '';
        const maxColumns = Math.max(0, ...Array.from(layout.values()).map(l => l.column)) + 1;
        const columnWidth = 20;
        const graphWidth = maxColumns * columnWidth;
        graphContainer.style.setProperty('--graph-width', `${graphWidth}px`);

        // Pass 1: Render all HTML elements
        commits.forEach(commit => {
            const commitLayout = layout.get(commit.id);
            const cells = {
                graph: document.createElement('div'),
                message: document.createElement('div'),
                author: document.createElement('div'),
                date: document.createElement('div'),
            };

            cells.graph.className = 'cell graph-cell';
            cells.graph.style.setProperty('--max-columns', maxColumns);
            cells.graph.style.setProperty('--column-width', `${columnWidth}px`);

            const node = document.createElement('div');
            node.className = 'commit-node';
            node.dataset.commitId = commit.id;
            node.style.backgroundColor = `hsl(${commitLayout.color * 45}, 70%, 60%)`;
            node.style.gridColumn = commitLayout.column + 1;
            cells.graph.appendChild(node);

            cells.message.className = 'cell message-cell';
            cells.message.textContent = commit.message;
            cells.author.className = 'cell author-cell';
            cells.author.textContent = commit.author;
            cells.date.className = 'cell date-cell';
            cells.date.textContent = commit.date;

            [cells.graph, cells.message, cells.author, cells.date].forEach(cell => {
                cell.style.gridRow = commitLayout.row + 1;
                graphContainer.appendChild(cell);
            });
        });

        // Pass 2: Measure and draw SVG.
        // We use requestAnimationFrame to ensure the browser has completed the layout
        // from Pass 1 before we try to measure the node positions.
        requestAnimationFrame(() => {
            const nodePositions = new Map();
            const containerRect = graphContainer.getBoundingClientRect();

            document.querySelectorAll('.commit-node').forEach(node => {
                const nodeRect = node.getBoundingClientRect();
                const x = nodeRect.left - containerRect.left + nodeRect.width / 2;
                const y = nodeRect.top - containerRect.top + nodeRect.height / 2;
                nodePositions.set(node.dataset.commitId, { x, y });
            });

            const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svg.setAttribute('id', 'svg-container');

            commits.forEach(commit => {
                const commitLayout = layout.get(commit.id);
                commit.parents.forEach((parentId, i) => { // Added 'i' for parent index
                    const p1 = nodePositions.get(commit.id);
                    const p2 = nodePositions.get(parentId);
                    if (!p1 || !p2) return;

                    const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                    const cornerRadius = 8;
                    let d; // Declare d here
                    let sweepFlag; // Declare sweepFlag here

                    const parentIndex = i; // Use 'i' as the actual index
                    const xSign = p1.x < p2.x ? 1 : -1; // 1 for right, -1 for left
                    const ySign = p1.y < p2.y ? 1 : -1; // 1 for down, -1 for up (commits go down)

                    if (p1.x === p2.x) { // Straight vertical line (same column)
                        d = `M ${p1.x} ${p1.y} V ${p2.y}`;
                        // sweepFlag is not relevant for straight lines, but define it to avoid ReferenceError
                        sweepFlag = 0;
                    } else if (parentIndex === 0) { // Primary parent: V -> H (branching)
                        // Line goes vertically from child, then curves horizontally to parent's column
                        // The arc should bend "outward" from the vertical line
                        sweepFlag = p1.x < p2.x ? 0 : 1; // 0 for counter-clockwise (right), 1 for clockwise (left)
                        d = `M ${p1.x} ${p1.y} V ${p2.y - cornerRadius * ySign} A ${cornerRadius} ${cornerRadius} 0 0 ${sweepFlag} ${p1.x + cornerRadius * xSign} ${p2.y} H ${p2.x}`;
                    } else { // Secondary parent (merge): H -> V (merging)
                        // Line goes horizontally from child, then curves vertically to parent's row
                        // The arc should bend "outward" from the horizontal line
                        sweepFlag = p1.x < p2.x ? 1 : 0; // 1 for clockwise (right), 0 for counter-clockwise (left)
                        d = `M ${p1.x} ${p1.y} H ${p2.x - cornerRadius * xSign} A ${cornerRadius} ${cornerRadius} 0 0 ${sweepFlag} ${p2.x} ${p1.y + cornerRadius * ySign} V ${p2.y}`;
                    }

                    path.setAttribute('d', d);
                    path.setAttribute('class', 'svg-line');
                    path.style.stroke = `hsl(${commitLayout.color * 45}, 70%, 60%)`;
                    svg.appendChild(path);
                });
            });
            graphContainer.appendChild(svg);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Populate options and render the first graph
    Object.entries(commitData).forEach(([graphKey, graphData]) => {
        const option = document.createElement('option');
        option.value = graphKey;
        option.textContent = graphData.name;
        graphSelect.appendChild(option);
    });

    // Render the first graph after populating options
    renderGraph(Object.keys(commitData)[0]);

    graphSelect.addEventListener('change', (event) => {
        renderGraph(event.target.value);
    });
});
