#!/usr/bin/env node

/**
 * Script to calculate baked-out transformation matrices for star patterns
 * This pre-calculates the complex matrix multiplications from css_rhombus_star_demo.html
 */

// Matrix multiplication helper function
function multiplyMatrix(m1, m2) {
    return [
        m1[0] * m2[0] + m1[2] * m2[1],          // a
        m1[1] * m2[0] + m1[3] * m2[1],          // b
        m1[0] * m2[2] + m1[2] * m2[3],          // c
        m1[1] * m2[2] + m1[3] * m2[3],          // d
        m1[0] * m2[4] + m1[2] * m2[5] + m1[4],  // e
        m1[1] * m2[4] + m1[3] * m2[5] + m1[5]   // f
    ];
}

// Matrix inversion helper function for 2D transforms
function invertMatrix2D(matrix) {
    const [a, b, c, d, e, f] = matrix;

    // Calculate determinant
    const det = a * d - b * c;

    if (Math.abs(det) < 1e-10) {
        throw new Error('Matrix is not invertible (determinant is zero)');
    }

    // Calculate inverse - for child elements, we zero out translation
    return [
        d / det,           // a'
        -b / det,          // b'
        -c / det,          // c'
        a / det,           // d'
        0,                 // e' = 0 (no translation for children)
        0                  // f' = 0 (no translation for children)
    ];
}

function calculateStarMatrices(n) {
    const centralAngleRad = (2 * Math.PI) / n;
    const matrices = [];

    // Scale factor for 3-pointed star to make it larger
    const scaleFactor = n === 3 ? 1.3 : 1.0;

    for (let i = 0; i < n; i++) {
        // For star rays, we want each segment to:
        // 1. Apply squash transformation (rhombus shear)
        // 2. Rotate to orient the rhombus correctly for star pointing
        // 3. Rotate into final position around star
        // 4. Apply scale factor if needed
        // No translation needed since transform-origin handles positioning

        // 1. Apply squash transformation (rhombus shear)
        const cosAngle = Math.cos(centralAngleRad);
        const sinAngle = Math.sin(centralAngleRad);
        const squashMatrix = [1, 0, cosAngle, sinAngle, 0, 0];

        // 2. Rotate to orient the rhombus correctly for star pointing
        const orientAngle = -centralAngleRad / 2;
        const cosOrient = Math.cos(orientAngle);
        const sinOrient = Math.sin(orientAngle);
        const orientMatrix = [cosOrient, sinOrient, -sinOrient, cosOrient, 0, 0];

        // 3. Rotate into final position around star
        const finalAngle = (2 * Math.PI * i) / n - Math.PI / 2;
        const cosFinal = Math.cos(finalAngle);
        const sinFinal = Math.sin(finalAngle);
        const rotateFinal = [cosFinal, sinFinal, -sinFinal, cosFinal, 0, 0];

        // 4. Apply scale factor
        const scaleMatrix = [scaleFactor, 0, 0, scaleFactor, 0, 0];

        // Combine transformations: scaleMatrix × rotateFinal × orientMatrix × squashMatrix
        let combined = squashMatrix;
        combined = multiplyMatrix(orientMatrix, combined);
        combined = multiplyMatrix(rotateFinal, combined);
        combined = multiplyMatrix(scaleMatrix, combined);

        matrices.push(combined);
    }

    return matrices;
}

// Calculate matrices for N = 3, 4, 5, 6, 7, 8
const starConfigs = [3, 4, 5, 6, 7, 8];

console.log('/* Generated CSS variables for star transformation matrices */\n');

starConfigs.forEach(n => {
    console.log(`/* ${n}-pointed star - when there are exactly ${n} children */`);
    const matrices = calculateStarMatrices(n);

    matrices.forEach((matrix, i) => {
        const [a, b, c, d, e, f] = matrix.map(val => val.toFixed(6));
        const inverse = invertMatrix2D(matrix);
        const [ia, ib, ic, id, ie, if_] = inverse.map(val => val.toFixed(6));

        // Use nth-last-child trick: nth-last-child(N):nth-child(M)
        // selects the Mth child when there are exactly N total children
        const nthLastChild = n - i;  // How many children from the end
        const nthChild = i + 1;      // Which child (1-indexed)

        console.log(`.drop-star .drop-area:nth-last-child(${nthLastChild}):nth-child(${nthChild}) {`);
        console.log(`    --star-transform: matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f});`);
        console.log(`    --star-transform-inverse: matrix(${ia}, ${ib}, ${ic}, ${id}, ${ie}, ${if_});`);
        console.log(`}`);
    });
    console.log('');
});

// Special cases for 1 and 2 segments (non-star patterns)
console.log('/* Special cases: 1 and 2 segments (non-star patterns) */');

// Single segment - centered in the drop area
// Based on current dropzones.html implementation
const single_matrix = [2, 0, 0, 2, 0, 0];
const single_inverse = invertMatrix2D(single_matrix);
console.log('/* 1-pointed star (single) - when there\'s only 1 child */');
console.log('.drop-star .drop-area:nth-last-child(1):nth-child(1) {');
console.log(`    --star-transform: translate(calc(-1 * var(--segment-size)), calc(-1 * var(--segment-size))) matrix(${single_matrix.map(x => x.toFixed(6)).join(', ')});`);
console.log(`    --star-transform-inverse: matrix(${single_inverse.map(x => x.toFixed(6)).join(', ')});`);
console.log('    --hover-translate: translate(0, 0);');
console.log('}');
console.log('');

// Two segments - positioned as opposite rectangles
// Based on current dropzones.html implementation
const double1_matrix = [2, 0, 0, 1, 0, 0];
const double1_inverse = invertMatrix2D(double1_matrix);
const double2_matrix = [-2, 0, 0, -1, 0, 0];
const double2_inverse = invertMatrix2D(double2_matrix);

console.log('/* 2-pointed star (double) - when there are exactly 2 children */');
console.log('.drop-star .drop-area:nth-last-child(2):nth-child(1) {');
console.log(`    --star-transform: translate(calc(-1 * var(--segment-size)), calc(-1 * var(--segment-size))) matrix(${double1_matrix.map(x => x.toFixed(6)).join(', ')});`);
console.log(`    --star-transform-inverse: matrix(${double1_inverse.map(x => x.toFixed(6)).join(', ')});`);
console.log('}');
console.log('');
console.log('.drop-star .drop-area:nth-last-child(2):nth-child(1):hover {');
console.log('    --hover-translate: translate(0, 0.5em);');
console.log('}');
console.log('');
console.log('.drop-star .drop-area:nth-last-child(1):nth-child(2) {');
console.log(`    --star-transform: translate(calc(1 * var(--segment-size)), calc(1 * var(--segment-size))) matrix(${double2_matrix.map(x => x.toFixed(6)).join(', ')});`);
console.log(`    --star-transform-inverse: matrix(${double2_inverse.map(x => x.toFixed(6)).join(', ')});`);
console.log('}');
console.log('');
console.log('.drop-star .drop-area:nth-last-child(1):nth-child(2):hover {');
console.log('    --hover-translate: translate(0, 0.5em);');
console.log('}');
console.log('');

console.log('/* Calculation complete! Copy the above CSS into your stylesheet. */');
