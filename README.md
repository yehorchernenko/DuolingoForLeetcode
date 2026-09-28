# 🦉 LeetLingo: Duolingo for LeetCode

Bite-sized quizzes and flashcards for coding-interview patterns and time complexity.
It's one static page with no build step, no backend and no account. All progress lives in your browser's `localStorage`.

**200+ cards in 16 units:** Big-O analysis, Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search,
Linked Lists, Trees, Heaps, Backtracking, Graphs, Dynamic Programming, Greedy & Intervals, Tries/Bits/Math,
Sorting, and an Interview Playbook.

Cards come in two kinds:
- **"Which tool?"**: *"Find the top K frequent elements. What do you use?"* → hash map + bucket sort / size-k heap
- **"What's the complexity?"**: read a code snippet and pick its Big-O

## Features
- **Spaced repetition** (Leitner boxes: 1 → 3 → 7 → 16 → 35 days). A missed card resets and comes back soon.
- **Duolingo-style lessons**: 10 cards per lesson; a wrong answer goes back into the queue until you get it right.
- **Streaks, XP, a daily goal** and a 12-week activity heatmap.
- **Review due / Mixed practice / Fix mistakes** modes.
- **Cheat sheet** for each unit, for fast skimming before an interview.
- **Keyboard-first**: `1`–`9` pick, `Enter` check/continue, `Space` reveal, `Esc` quit.
- **Export/import** progress as JSON (Settings ⚙️: copy the text or download a file) to back up or move between devices.
- Dark mode follows your OS.

## Run it
```bash
git clone <this repo> && cd DuolingoForLeetcode
open index.html            # or: python3 -m http.server 8000
```
**Host it for free:** enable GitHub Pages on this repo (Settings → Pages → Deploy from branch → `/ (root)`).

## Add your own cards
Edit [`js/cards.js`](js/cards.js):
```js
{ id: "ah99", q: "Question with `inline code`?", c: "optional\ncode snippet",
  o: ["CORRECT answer always first", "wrong", "wrong"], e: "Explanation shown after answering." }
// or a self-graded flashcard:
{ id: "ah100", q: "Front", a: "Back" }
```
Options are shuffled when shown. Keep `id`s stable, because progress is keyed by id.

## Suggested study plan
1. **Every day (15–20 min):** clear *Review due* first, then do one new lesson. Protect the streak.
2. **Go in unit order:** Big-O → Hashing → Two Pointers → Sliding Window → Stack → Binary Search → Linked List → Trees → Heap → Backtracking → Graphs → DP → Greedy/Intervals.
3. **Pair each unit with real problems:** after a unit's lesson, solve 3–5 LeetCode problems from that pattern (NeetCode 150 / Blind 75 are organized the same way). The cards train *recognition*; typing solutions trains *implementation*. You need both.
4. **Weekly:** do *Fix mistakes* and one timed 45-minute mock problem, saying your complexity out loud.

## License
MIT
