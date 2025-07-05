### JJ (Jujutsu) in a nutshell

*A distilled guide for an AI helper that already “speaks Git” and wants the new-stuff only.*

---

#### 1. Mental model - what’s different and why it matters

| Concept                    | JJ twist                                                                                                 | Why it’s useful                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Working copy**           | *Always* a real commit; it auto-amends after every filesystem change.                                    | One consistent object model → simpler commands; no “staging area” to reason about. ([jj-vcs.github.io][1])                   |
| **Change ID vs Commit ID** | Each rewrite of a commit keeps the same *Change ID* (think Gerrit Change-Id) but gets a new *Commit ID*. | Safe, traceable history rewriting; you can refer to “the change” independent of rebases. ([jj-vcs.github.io][1])             |
| **Operation log**          | Top-level log of *repo-wide* mutations; powers `jj undo`, concurrent access, and forensic “time-travel”. | Full-repo undo that beats Git’s per-ref reflog; enables lock-free multi-machine ops. ([jj-vcs.github.io][2])                 |
| **Bookmarks**              | Optional lightweight refs; *no current branch* pointer.                                                  | New commits never silently move a ref—you update bookmarks explicitly, preventing hidden divergence. ([jj-vcs.github.io][3]) |
| **Revsets**                | Mercurial-style query language (`@`, `::`, `foo..bar`, `trunk()`, etc.).                                 | Precise graph slices for logs, rebases, and scripts; far more expressive than `git <rev-range>`. ([jj-vcs.github.io][1])     |
| **Conflicts**              | Can live in commits; nothing blocks you from committing and pushing with unresolved conflicts.           | Work can continue on other parts of the graph; conflicts are resolved when convenient. ([jj-vcs.github.io][1])               |

---

#### 2. Daily “happy-path” workflow

1. **Clone / init**

   ```bash
   jj git clone <url>         # Git-backed for now
   jj st                      # like git status
   ```

2. **Start work**

   ```bash
   jj describe -m "feat: add parser"   # sets message on the *current* change
   jj new                              # open a fresh empty change (= scratch)
   # hack in editor …
   jj squash -i                        # interactively stage/squash into the parent change
   jj diff                             # review
   ```

   *Why this feels different*: the pair “parent change” + “scratch @” replaces Git’s index. You gradually squash pieces upward. ([steveklabnik.github.io][4])

3. **Publishing**

   ```bash
   jj branch set main              # (optional) move bookmark
   jj git push                     # mirrors refs to origin
   ```

4. **Undo-anything safety net**

   ```bash
   jj op log                       # show past repo states
   jj op undo <op-id>              # roll back that whole operation
   ```

---

#### 3. Alternative “edit” workflow (index-less, amend-heavy)

* Keep **exactly one writable change**: work directly in `@`, and when the chunk is finished just `jj new` to fork a fresh empty `@`.
* To tweak an older change: `jj edit <rev>` makes it the new `@`; descendants auto-rebase.
* Great for stacked PR flows where each change maps 1-to-1 to a review. ([steveklabnik.github.io][5])

---

#### 4. Advanced graph kung-fu

| Goal                       | JJ command                                | Notes                                                      |
| -------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| Move commits elsewhere     | `jj rebase -d DEST <revset>`              | Descendants follow automatically.                          |
| Merge heads                | `jj merge A B`                            | Produces a merge commit; unresolved conflicts are allowed. |
| Split one commit into many | `jj split -i`                             | Opens an interactive hunks chooser.                        |
| Strip commit from history  | `jj abandon <rev>`                        | Creates “orphan” commits; safe to undo via op-log.         |
| Collapse linear series     | `jj squash -r X::Y`                       | Globs multiple commits into X.                             |
| Back out a bad change      | `jj backout <rev>`                        | Adds a new commit reverting the diff.                      |
| Query tricky sets          | `jj log -r 'trunk()..@ & file("src/**")'` | Any revset expression works.                               |

These ops are cheap to repeat because *everything* can be undone:

```bash
jj undo            # default = last operation
jj obslog @        # show how the current change evolved over rewrites
```

---

#### 5. Git interoperability tips

* **Import/export**: `jj git pull`, `jj git push` keep Git refs in sync; `origin/<branch>` appears as `<branch>@origin`.
* **No detached-HEAD confusion**: working on top of an imported branch doesn’t move it until you `jj branch set`.
* **Rewriting before push** is encouraged—descendants and bookmarks auto-follow, so `git push --force` pains disappear. ([jj-vcs.github.io][3])

---

#### 6. Surprises worth remembering

* **Implicit commits**: every file save is already part of history—don’t hunt for “untracked” files.
* **Multiple workspaces**: one repo directory can host several *workspaces* pointing at the same store (`jj workspace add ../dir`). Handy for parallel feature branches without extra clones. ([jj-vcs.github.io][1])
* **GUI extras**: the official *GG* UI and *Hunk.nvim* diff editor integrate out-of-the-box. ([jj-vcs.github.io][6])

---

### Cheat-sheet for the assistant

```bash
# quick status / diff
jj st | jj diff

# create / rename bookmark (branch)
jj branch list
jj branch set main

# daily amend workflows
jj describe -m "msg"    # edit message
jj squash [-i] [path]   # stage into parent
jj new                  # start next change
jj edit REV             # go back and amend

# safety & history
jj op log
jj op undo
jj obslog REV

# graph surgery
jj rebase -d DEST REVSET
jj split -i
jj merge A B
jj abandon REV
```

---

#### Bottom line

JJ streamlines local history editing by treating *everything* (working copy, conflicts, refs, even undo) as first-class graph data. For daily work you mostly juggle two commands—`jj new` and `jj squash`/`jj edit`. When you need power, revsets plus automatic descendant rebasing make complex history surgery almost effortless. An AI assistant can lean on these primitives to script or explain workflows that feel clumsy in vanilla Git, while staying fully compatible with existing Git servers.

[1]: https://jj-vcs.github.io/jj/latest/tutorial/ "Tutorial and bird's eye view - Jujutsu docs"
[2]: https://jj-vcs.github.io/jj/latest/operation-log/ "Operation log - Jujutsu docs"
[3]: https://jj-vcs.github.io/jj/latest/git-comparison/ "Git comparison - Jujutsu docs"
[4]: https://steveklabnik.github.io/jujutsu-tutorial/real-world-workflows/the-squash-workflow.html "The Squash Workflow - Steve's Jujutsu Tutorial"
[5]: https://steveklabnik.github.io/jujutsu-tutorial/real-world-workflows/intro.html "Real-world workflows - Steve's Jujutsu Tutorial"
[6]: https://jj-vcs.github.io/jj/latest/community_tools/?utm_source=chatgpt.com "Community-built tools - Jujutsu docs"
