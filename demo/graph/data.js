const commitData = {
    branch: [
        { id: 'a', parents: ['b'], author: 'Alice', date: '2025-07-05', message: 'feat: Initial commit' },
        { id: 'b', parents: ['c'], author: 'Bob', date: '2025-07-04', message: 'feat: Add README' },
        { id: 'd', parents: ['c'], author: 'Alice', date: '2025-07-04', message: 'feat: Add feature X' },
        { id: 'c', parents: [], author: 'Charlie', date: '2025-07-03', message: 'Initial commit' },
    ],
    trunk: [
        { id: 'a', parents: ['b', 'd'], author: 'Alice', date: '2025-07-05', message: 'merge: Merge feature branch' },
        { id: 'b', parents: ['c'], author: 'Bob', date: '2025-07-04', message: 'fix: Update main branch' },
        { id: 'd', parents: ['e'], author: 'Charlie', date: '2025-07-04', message: 'feat: Implement feature Y' },
        { id: 'e', parents: ['c'], author: 'Charlie', date: '2025-07-03', message: 'feat: Start feature Y' },
        { id: 'c', parents: ['f'], author: 'Bob', date: '2025-07-02', message: 'refactor: Tweak styles' },
        { id: 'f', parents: [], author: 'Alice', date: '2025-07-01', message: 'Initial commit' },
    ],
    complex: [
        { id: 'a', parents: ['b', 'c'], author: 'Alice', date: '2025-07-10', message: 'merge: Merge release branch' },
        { id: 'b', parents: ['d'], author: 'Bob', date: '2025-07-09', message: 'fix: Hotfix on main' },
        { id: 'c', parents: ['e', 'f'], author: 'Charlie', date: '2025-07-08', message: 'merge: Merge feature Z into release' },
        { id: 'd', parents: ['g'], author: 'Bob', date: '2025-07-07', message: 'feat: Main branch development' },
        { id: 'e', parents: ['h'], author: 'Dana', date: '2025-07-06', message: 'feat: Implement feature Z' },
        { id: 'f', parents: ['h'], author: 'Eve', date: '2025-07-05', message: 'feat: Implement feature W' },
        { id: 'g', parents: ['i'], author: 'Bob', date: '2025-07-04', message: 'refactor: Core logic' },
        { id: 'h', parents: ['g'], author: 'Charlie', date: '2025-07-03', message: 'chore: Start release branch' },
        { id: 'i', parents: [], author: 'Alice', date: '2025-07-01', message: 'Initial commit' },
    ],
    non_planar: [
        // 3 overlapping merges
        { id: 'a', parents: ['b', 'c'], message: 'Merge feature-A and feature-B', author: 'Alice', date: '2025-07-20' },
        { id: 'b', parents: ['d', 'e'], message: 'Merge sub-feature-A1 into feature-A', author: 'Bob', date: '2025-07-19' },
        { id: 'c', parents: ['f', 'g'], message: 'Merge sub-feature-B1 into feature-B', author: 'Charlie', date: '2025-07-18' },
        { id: 'd', parents: ['h'], message: 'Develop feature-A', author: 'Dana', date: '2025-07-17' },
        { id: 'e', parents: ['i'], message: 'Develop sub-feature-A1', author: 'Eve', date: '2025-07-16' },
        { id: 'f', parents: ['j'], message: 'Develop feature-B', author: 'Frank', date: '2025-07-15' },
        { id: 'g', parents: ['k'], message: 'Develop sub-feature-B1', author: 'Grace', date: '2025-07-14' },
        { id: 'h', parents: ['l'], message: 'Branch for feature-A', author: 'Heidi', date: '2025-07-13' },
        { id: 'i', parents: ['l'], message: 'Branch for sub-feature-A1', author: 'Ivan', date: '2025-07-12' },
        { id: 'j', parents: ['m'], message: 'Branch for feature-B', author: 'Judy', date: '2025-07-11' },
        { id: 'k', parents: ['m'], message: 'Branch for sub-feature-B1', author: 'Mallory', date: '2025-07-10' },
        { id: 'l', parents: ['n'], message: 'Develop on main', author: 'Niaj', date: '2025-07-09' },
        { id: 'm', parents: ['n'], message: 'Another development on main', author: 'Olivia', date: '2025-07-08' },
        { id: 'n', parents: [], message: 'Initial commit', author: 'Peggy', date: '2025-07-07' },
    ]
};
