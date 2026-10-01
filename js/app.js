(() => {
  "use strict";

  // ---------- Config ----------
  const STORAGE_KEY = "dfl-progress-v1";
  const LESSON_SIZE = 10;
  const MASTERED_BOX = 3;
  const MAX_BOX = 5;
  // Leitner box -> days until next review
  const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
  const XP_FIRST_TRY = 10;
  const XP_RETRY = 3;
  const XP_LESSON_BONUS = 10;
  const DAY_MS = 24 * 60 * 60 * 1000;

  const UNITS = window.UNITS;
  const CARDS = {};
  for (const u of UNITS) for (const c of u.cards) { c.unit = u.id; CARDS[c.id] = c; }
  const unitById = (id) => UNITS.find((u) => u.id === id);
  const PROBLEMS = window.PROBLEMS || {};
  const B75 = UNITS.filter((u) => u.track === "blind75");
  const B75_NUMS = [...new Set(B75.flatMap((u) => u.cards.map((c) => c.p)))];
  const solvedCount = () => B75_NUMS.filter((n) => S.solved[n]).length;

  // ---------- Storage ----------
  const defaultState = () => ({
    v: 1,
    cards: {},       // id -> { box, due, seen, right, wrong, last }
    xp: 0,
    streak: 0,
    best: 0,
    lastDay: null,   // "YYYY-MM-DD" of last activity
    days: {},        // "YYYY-MM-DD" -> xp earned that day
    goal: 50,
    solved: {},      // LeetCode problem number -> "YYYY-MM-DD" marked solved
  });

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch { /* storage full / blocked */ }
  }
  let S = load();

  // ---------- Dates ----------
  const dayKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const yesterdayKey = () => dayKey(new Date(Date.now() - DAY_MS));
  const todayXp = () => S.days[dayKey()] || 0;
  const currentStreak = () =>
    S.lastDay === dayKey() || S.lastDay === yesterdayKey() ? S.streak : 0;

  function markActivity(xp) {
    const today = dayKey();
    if (S.lastDay !== today) {
      S.streak = S.lastDay === yesterdayKey() ? S.streak + 1 : 1;
      S.lastDay = today;
    }
    S.best = Math.max(S.best, S.streak);
    S.xp += xp;
    S.days[today] = (S.days[today] || 0) + xp;
  }

  // ---------- Spaced repetition ----------
  const prog = (id) => S.cards[id];
  const isDue = (id, now = Date.now()) => { const p = prog(id); return p && p.due <= now; };
  const isMastered = (id) => { const p = prog(id); return p && p.box >= MASTERED_BOX; };

  function grade(id, correct) {
    const p = S.cards[id] || { box: 0, due: 0, seen: 0, right: 0, wrong: 0 };
    p.seen++;
    p.last = Date.now();
    if (correct) {
      p.right++;
      p.box = Math.min(p.box + 1, MAX_BOX);
    } else {
      p.wrong++;
      p.box = 0;
    }
    p.due = Date.now() + INTERVAL_DAYS[p.box] * DAY_MS;
    S.cards[id] = p;
  }

  function unitStats(u) {
    let seen = 0, mastered = 0, due = 0;
    const now = Date.now();
    for (const c of u.cards) {
      if (prog(c.id)) seen++;
      if (isMastered(c.id)) mastered++;
      if (isDue(c.id, now)) due++;
    }
    return { total: u.cards.length, seen, mastered, due };
  }
  const allIds = () => Object.keys(CARDS);
  const dueIds = () => { const now = Date.now(); return allIds().filter((id) => isDue(id, now)); };
  const mistakeIds = () => allIds().filter((id) => { const p = prog(id); return p && p.wrong > 0 && p.box <= 1; });

  // ---------- Helpers ----------
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const fmt = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\n/g, "<br>");
  const codeHtml = (src) => esc(src).replace("________", '<span class="blank">________</span>');
  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $("#app");

  // Pick cards: due first, then unseen, then weakest seen ones.
  function pickLesson(ids, size = LESSON_SIZE) {
    const now = Date.now();
    const due = ids.filter((id) => isDue(id, now)).sort((a, b) => prog(a).due - prog(b).due);
    const fresh = ids.filter((id) => !prog(id));
    const rest = shuffle(ids.filter((id) => prog(id) && !isDue(id, now)))
      .sort((a, b) => prog(a).box - prog(b).box);
    const picked = [...due, ...fresh, ...rest].slice(0, size);
    return shuffle(picked);
  }

  // ---------- Header ----------
  function renderHeader() {
    const due = dueIds().length;
    const pct = Math.min(100, Math.round((todayXp() / S.goal) * 100));
    $("#stats").innerHTML = `
      <span class="stat" title="Day streak (best: ${S.best})">🔥 ${currentStreak()}</span>
      <span class="stat" title="Total XP">⚡ ${S.xp}</span>
      <span class="stat" title="Cards due for review">🔁 ${due}</span>
      <span class="stat goal" title="Daily goal: ${todayXp()}/${S.goal} XP">
        <span class="ring" style="--p:${pct}"></span>${todayXp()}/${S.goal}
      </span>`;
  }

  // ---------- Home ----------
  function renderHome() {
    session = null;
    renderHeader();
    const due = dueIds().length;
    const mistakes = mistakeIds().length;
    const total = allIds().length;
    const mastered = allIds().filter(isMastered).length;

    app.innerHTML = `
      <section class="hero">
        <div>
          <h1>Keep your streak alive</h1>
          <p class="muted">${mastered} / ${total} cards mastered · ${todayXp() >= S.goal ? "Daily goal reached 🎉" : `${S.goal - todayXp()} XP to today's goal`}</p>
        </div>
        <div class="hero-actions">
          <button class="btn primary" data-act="review" ${due ? "" : "disabled"}>Review due (${due})</button>
          <button class="btn" data-act="mixed">Mixed practice</button>
          <button class="btn" data-act="mistakes" ${mistakes ? "" : "disabled"}>Fix mistakes (${mistakes})</button>
        </div>
      </section>
      <section class="path">
        ${renderUnits(UNITS.filter((u) => u.track !== "blind75"))}
      </section>
      ${B75.length ? `
      <section class="track-head">
        <h2>Blind 75</h2>
        <p class="muted">The Medium and Hard problems from the Blind 75 list, 3 cards each: the approach, the key line of code, and the trap. Solve each one on LeetCode too, then tick it off.</p>
        <div class="bar"><div style="width:${Math.round((solvedCount() / B75_NUMS.length) * 100)}%"></div></div>
        <p class="small muted">${solvedCount()} / ${B75_NUMS.length} solved on LeetCode</p>
      </section>
      <section class="path">
        ${renderUnits(B75)}
      </section>` : ""}`;
  }

  function renderUnits(units) {
    return units.map((u, i) => {
      const st = unitStats(u);
      const pct = Math.round((st.mastered / st.total) * 100);
      const started = st.seen > 0;
      const nums = [...new Set(u.cards.map((c) => c.p).filter(Boolean))];
      const solved = nums.filter((n) => S.solved[n]).length;
      return `
          <article class="unit ${pct === 100 ? "done" : ""}">
            <div class="unit-icon">${u.icon}</div>
            <div class="unit-body">
              <h2><span class="unit-num">${i + 1}</span> ${esc(u.title)}</h2>
              <p class="muted">${esc(u.desc)}</p>
              <div class="bar"><div style="width:${pct}%"></div></div>
              <p class="small muted">${st.mastered}/${st.total} mastered · ${st.seen - st.mastered} learning${st.due ? ` · <b class="due">${st.due} due</b>` : ""}${nums.length ? ` · ${solved}/${nums.length} solved` : ""}</p>
            </div>
            <div class="unit-actions">
              <button class="btn primary" data-act="unit" data-unit="${u.id}">${started ? "Continue" : "Start"}</button>
              <button class="btn ghost small" data-act="sheet" data-unit="${u.id}">${nums.length ? "Problems" : "Cheat sheet"}</button>
            </div>
          </article>`;
    }).join("");
  }

  // ---------- Lesson ----------
  let session = null;

  function startLesson(ids, title) {
    if (!ids.length) { renderHome(); return; }
    session = {
      title,
      queue: ids.map((id) => ({ id, retry: false })),
      total: ids.length,
      done: 0,
      firstTryRight: 0,
      xp: 0,
      graded: new Set(),
      state: "ask",   // ask | answered
      order: null,
      selected: null,
      startedMastered: ids.filter(isMastered).length,
      ids,
    };
    renderCard();
  }

  function renderCard() {
    renderHeader();
    const item = session.queue[0];
    const c = CARDS[item.id];
    const unit = unitById(c.unit);
    const pct = Math.round((session.done / (session.total)) * 100);
    const isFlash = !c.o;
    session.state = "ask";
    session.selected = null;
    if (!isFlash) session.order = shuffle(c.o.map((text, i) => ({ text, correct: i === 0 })));

    app.innerHTML = `
      <section class="lesson">
        <div class="lesson-top">
          <button class="icon-btn" data-act="quit" title="Quit lesson (Esc). Answers so far are saved.">✕</button>
          <div class="bar big"><div style="width:${pct}%"></div></div>
        </div>
        <p class="tag">${unit.icon} ${esc(unit.title)}${c.p ? ` · ${problemLink(c.p)}` : ""}${item.retry ? ' · <span class="retry">Try again</span>' : ""}${!prog(c.id) ? ' · <span class="new">New</span>' : ""}</p>
        <h2 class="question">${fmt(c.q)}</h2>
        ${c.c ? `<pre class="code"><code>${codeHtml(c.c)}</code></pre>` : ""}
        ${isFlash ? `
          <div class="flash" id="flash">
            <p class="muted">Think of your answer, then reveal.</p>
          </div>` : `
          <div class="options">
            ${session.order.map((o, i) => `
              <button class="option" data-act="pick" data-i="${i}">
                <span class="key">${i + 1}</span><span>${fmt(o.text)}</span>
              </button>`).join("")}
          </div>`}
      </section>
      <footer class="feedback" id="feedback">
        ${isFlash
          ? `<button class="btn primary wide" data-act="reveal">Show answer <kbd>Space</kbd></button>`
          : `<button class="btn primary wide" data-act="check" disabled>Check <kbd>Enter</kbd></button>`}
      </footer>`;
  }

  function problemLink(num) {
    const pr = PROBLEMS[num];
    if (!pr) return `#${num}`;
    return `<a href="${pr.url}" target="_blank" rel="noopener" class="lc-link">#${num} ${esc(pr.title)} ↗</a>`;
  }

  function pick(i) {
    if (session.state !== "ask") return;
    session.selected = i;
    app.querySelectorAll(".option").forEach((el, j) => el.classList.toggle("selected", j === i));
    $('[data-act="check"]').disabled = false;
  }

  function check() {
    if (session.state !== "ask" || session.selected == null) return;
    const correct = session.order[session.selected].correct;
    app.querySelectorAll(".option").forEach((el, j) => {
      el.disabled = true;
      if (session.order[j].correct) el.classList.add("right");
      else if (j === session.selected) el.classList.add("wrong");
    });
    finishCard(correct);
  }

  function reveal() {
    if (session.state !== "ask") return;
    const c = CARDS[session.queue[0].id];
    $("#flash").innerHTML = `<div class="answer">${fmt(c.a)}</div>`;
    $("#flash").classList.add("open");
    session.state = "self";
    $("#feedback").innerHTML = `
      <div class="self-grade">
        <button class="btn bad wide" data-act="self" data-v="0">Didn't know <kbd>1</kbd></button>
        <button class="btn good wide" data-act="self" data-v="1">Knew it <kbd>2</kbd></button>
      </div>`;
  }

  function finishCard(correct) {
    const item = session.queue[0];
    const c = CARDS[item.id];
    session.state = "answered";
    session.lastCorrect = correct;

    let gained = 0;
    if (!session.graded.has(item.id)) {
      session.graded.add(item.id);
      grade(item.id, correct);
      if (correct) { session.firstTryRight++; gained = XP_FIRST_TRY; }
    } else if (correct) {
      gained = XP_RETRY;
    }
    session.xp += gained;
    markActivity(gained);
    save();
    renderHeader();

    const correctText = c.o ? c.o[0] : null;
    const fb = $("#feedback");
    fb.className = `feedback show ${correct ? "ok" : "ko"}`;
    fb.innerHTML = `
      <div class="fb-text">
        <h3>${correct ? pickPraise() : "Not quite"}${gained ? ` <span class="xp">+${gained} XP</span>` : ""}</h3>
        ${!correct && correctText ? `<p><b>Answer:</b> ${fmt(correctText)}</p>` : ""}
        ${c.e ? `<p>${fmt(c.e)}</p>` : ""}
      </div>
      <button class="btn ${correct ? "good" : "bad"} wide" data-act="next">Continue <kbd>Enter</kbd></button>`;
  }

  function next() {
    if (session.state !== "answered") return;
    const item = session.queue.shift();
    if (session.lastCorrect) session.done++;
    else session.queue.push({ id: item.id, retry: true }); // Duolingo-style: repeat until correct
    if (session.queue.length) renderCard();
    else renderSummary();
  }

  function renderSummary() {
    const s = session;
    markActivity(XP_LESSON_BONUS);
    s.xp += XP_LESSON_BONUS;
    save();
    renderHeader();
    const acc = Math.round((s.firstTryRight / s.total) * 100);
    const masteredNow = s.ids.filter(isMastered).length;
    app.innerHTML = `
      <section class="summary">
        <div class="trophy">${acc === 100 ? "🏆" : acc >= 70 ? "🎉" : "💪"}</div>
        <h1>Lesson complete!</h1>
        <p class="muted">${esc(s.title)}</p>
        <div class="summary-stats">
          <div><b>${acc}%</b><span>first-try accuracy</span></div>
          <div><b>+${s.xp}</b><span>XP earned</span></div>
          <div><b>🔥 ${currentStreak()}</b><span>day streak</span></div>
          <div><b>${masteredNow - s.startedMastered >= 0 ? "+" : ""}${masteredNow - s.startedMastered}</b><span>cards mastered</span></div>
        </div>
        <div class="row">
          <button class="btn primary" data-act="again">Keep going <kbd>Enter</kbd></button>
          <button class="btn" data-act="home">Home</button>
        </div>
      </section>`;
    session.state = "summary";
  }

  const PRAISE = ["Nice!", "Correct!", "Great job!", "You got it!", "Excellent!", "Spot on!"];
  const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

  // Lesson launchers (remembered so "Keep going" repeats the same mode)
  let lastLaunch = null;
  const launchers = {
    unit: (unitId) => { const u = unitById(unitId); startLesson(pickLesson(u.cards.map((c) => c.id)), u.title); },
    review: () => startLesson(shuffle(dueIds()).slice(0, LESSON_SIZE * 2), "Spaced review"),
    mixed: () => {
      // Prefer units you've started; include a few new cards.
      const started = UNITS.filter((u) => unitStats(u).seen > 0);
      const pool = (started.length ? started : UNITS).flatMap((u) => u.cards.map((c) => c.id));
      startLesson(pickLesson(shuffle(pool)), "Mixed practice");
    },
    mistakes: () => startLesson(shuffle(mistakeIds()).slice(0, LESSON_SIZE), "Fix mistakes"),
    problem: (num) => {
      const ids = allIds().filter((id) => CARDS[id].p === +num);
      startLesson(shuffle(ids), `#${num} ${PROBLEMS[num] ? PROBLEMS[num].title : ""}`);
    },
  };
  function launch(kind, arg) {
    lastLaunch = [kind, arg];
    launchers[kind](arg);
  }

  // ---------- Cheat sheet ----------
  function renderSheet(unitId) {
    session = null;
    const u = unitById(unitId);
    if (u.track === "blind75") { renderProblems(u); return; }
    app.innerHTML = `
      <section class="sheet">
        <div class="row between">
          <button class="btn ghost" data-act="home">← Back</button>
          <button class="btn primary" data-act="unit" data-unit="${u.id}">Practice this unit</button>
        </div>
        <h1>${u.icon} ${esc(u.title)} — cheat sheet</h1>
        <p class="muted">${esc(u.desc)} Reading is good; recalling is better — practice after skimming.</p>
        ${u.cards.map(sheetCard).join("")}
      </section>`;
  }

  function sheetCard(c) {
    const p = prog(c.id);
    const badge = !p ? "" : isMastered(c.id) ? '<span class="pill ok">mastered</span>' : '<span class="pill">learning</span>';
    return `
          <details class="sheet-card">
            <summary>${fmt(c.q)} ${badge}</summary>
            ${c.c ? `<pre class="code"><code>${codeHtml(c.c)}</code></pre>` : ""}
            <p class="sheet-answer">${fmt(c.o ? c.o[0] : c.a)}</p>
            ${c.e ? `<p class="muted">${fmt(c.e)}</p>` : ""}
          </details>`;
  }

  function renderProblems(u) {
    const nums = [...new Set(u.cards.map((c) => c.p))];
    app.innerHTML = `
      <section class="sheet">
        <div class="row between">
          <button class="btn ghost" data-act="home">← Back</button>
          <button class="btn primary" data-act="unit" data-unit="${u.id}">Practice this unit</button>
        </div>
        <h1>${u.icon} Blind 75: ${esc(u.title)}</h1>
        <p class="muted">Practice the cards for a problem, then solve it on LeetCode without notes and tick it off. Expand a card to see its answer.</p>
        ${nums.map((n) => {
          const pr = PROBLEMS[n] || { title: "", diff: "" };
          const cards = u.cards.filter((c) => c.p === n);
          const mastered = cards.filter((c) => isMastered(c.id)).length;
          return `
          <article class="problem ${S.solved[n] ? "is-solved" : ""}">
            <div class="problem-head">
              <label class="solved" title="Mark as solved on LeetCode">
                <input type="checkbox" id="solved-${n}" data-solved="${n}" ${S.solved[n] ? "checked" : ""}>
                <span>Solved</span>
              </label>
              <div class="problem-title">
                ${problemLink(n)}
                <span class="pill diff-${pr.diff.toLowerCase()}">${pr.diff}</span>${pr.premium ? '<span class="pill">Premium</span>' : ""}
                <span class="small muted">${mastered}/${cards.length} cards mastered</span>
              </div>
              <button class="btn small" data-act="problem" data-p="${n}">Practice</button>
            </div>
            ${cards.map(sheetCard).join("")}
          </article>`;
        }).join("")}
      </section>`;
  }

  // ---------- Settings ----------
  function renderSettings() {
    session = null;
    const answered = Object.values(S.cards).reduce((n, p) => n + p.seen, 0);
    const right = Object.values(S.cards).reduce((n, p) => n + p.right, 0);
    const activeDays = Object.keys(S.days).length;
    app.innerHTML = `
      <section class="settings">
        <button class="btn ghost" data-act="home">← Back</button>
        <h1>Progress & settings</h1>
        <div class="summary-stats">
          <div><b>${S.xp}</b><span>total XP</span></div>
          <div><b>${S.best}</b><span>best streak</span></div>
          <div><b>${activeDays}</b><span>active days</span></div>
          ${B75_NUMS.length ? `<div><b>${solvedCount()}/${B75_NUMS.length}</b><span>Blind 75 solved</span></div>` : ""}
          <div><b>${answered ? Math.round((right / answered) * 100) : 0}%</b><span>accuracy (${answered} answers)</span></div>
        </div>
        ${renderHeatmap()}
        <h2>Daily goal</h2>
        <div class="row">
          ${[20, 50, 100, 200].map((g) => `<button class="btn ${S.goal === g ? "primary" : ""}" data-act="goal" data-v="${g}">${g} XP</button>`).join("")}
        </div>
        <h2>Your data</h2>
        <p class="muted">Progress lives only in this browser's localStorage. Export it to back up or move to another device.</p>
        <div class="row">
          <button class="btn" data-act="export">Export</button>
          <label class="btn">Import file<input type="file" accept="application/json,.json" id="import" hidden></label>
          <button class="btn bad" data-act="reset">Reset all progress</button>
        </div>
        <p id="data-msg" class="small" role="status"></p>
        <div id="export-box" hidden>
          <p class="small muted">Copy this text and keep it somewhere safe. To restore, paste it back here and press Load.</p>
          <textarea id="export-text" rows="6" spellcheck="false"></textarea>
          <div class="row">
            <button class="btn" data-act="copy">Copy</button>
            ${window.self === window.top ? '<button class="btn" data-act="download">Download file</button>' : ""}
            <button class="btn" data-act="load">Load pasted text</button>
          </div>
        </div>
        <h2>Keyboard</h2>
        <p class="muted"><kbd>1</kbd>–<kbd>9</kbd> pick option · <kbd>Enter</kbd> check / continue · <kbd>Space</kbd> reveal flashcard · <kbd>Esc</kbd> quit lesson</p>
      </section>`;
    $("#import").addEventListener("change", importData);
  }

  function renderHeatmap() {
    const cells = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const xp = S.days[dayKey(d)] || 0;
      const lvl = xp === 0 ? 0 : xp < S.goal / 2 ? 1 : xp < S.goal ? 2 : 3;
      cells.push(`<span class="hm l${lvl}" title="${dayKey(d)}: ${xp} XP"></span>`);
    }
    return `<h2>Last 12 weeks</h2><div class="heatmap">${cells.join("")}</div>`;
  }

  function dataMsg(text, ok = true) {
    const el = $("#data-msg");
    if (el) { el.textContent = text; el.style.color = ok ? "var(--good)" : "var(--bad)"; }
  }

  function exportData() {
    $("#export-box").hidden = false;
    const ta = $("#export-text");
    ta.value = JSON.stringify(S);
    ta.focus();
    ta.select();
  }

  function copyExport() {
    const ta = $("#export-text");
    const fallback = () => { ta.focus(); ta.select(); dataMsg("Text selected. Press Ctrl/Cmd+C to copy."); };
    try {
      navigator.clipboard.writeText(ta.value).then(() => dataMsg("Copied to clipboard."), fallback);
    } catch { fallback(); }
  }

  function downloadExport() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leetlingo-progress-${dayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function applyImport(txt) {
    try {
      const data = JSON.parse(txt);
      if (typeof data !== "object" || !data || !data.cards) throw new Error("bad file");
      S = Object.assign(defaultState(), data);
      save();
      renderSettings();
      renderHeader();
      dataMsg("Progress imported.");
    } catch {
      dataMsg("That doesn't look like exported progress. Paste the full text from Export.", false);
    }
  }

  function importData(ev) {
    const file = ev.target.files[0];
    if (file) file.text().then(applyImport);
  }

  let resetArmed = false;
  function reset(btn) {
    if (!resetArmed) {
      resetArmed = true;
      btn.textContent = "Click again to delete everything";
      setTimeout(() => { resetArmed = false; if (btn.isConnected) btn.textContent = "Reset all progress"; }, 4000);
      return;
    }
    resetArmed = false;
    S = defaultState();
    save();
    renderHome();
  }

  // ---------- Events ----------
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const act = el.dataset.act;
    switch (act) {
      case "home": renderHome(); break;
      case "settings": renderSettings(); break;
      case "unit": launch("unit", el.dataset.unit); break;
      case "review": case "mixed": case "mistakes": launch(act); break;
      case "problem": launch("problem", el.dataset.p); break;
      case "sheet": renderSheet(el.dataset.unit); window.scrollTo(0, 0); break;
      case "pick": pick(+el.dataset.i); break;
      case "check": check(); break;
      case "reveal": reveal(); break;
      case "self": finishCard(el.dataset.v === "1"); break;
      case "next": next(); break;
      case "quit": renderHome(); break;
      case "again": lastLaunch ? launch(...lastLaunch) : renderHome(); break;
      case "goal": S.goal = +el.dataset.v; save(); renderSettings(); renderHeader(); break;
      case "export": exportData(); break;
      case "reset": reset(el); break;
      case "copy": copyExport(); break;
      case "download": downloadExport(); break;
      case "load": applyImport($("#export-text").value); break;
    }
  });

  document.addEventListener("keydown", (ev) => {
    if (!session || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const k = ev.key;
    if (session.state === "summary") {
      if (k === "Enter") { ev.preventDefault(); lastLaunch ? launch(...lastLaunch) : renderHome(); }
      return;
    }
    if (k === "Escape") { $('[data-act="quit"]').click(); return; }
    const c = CARDS[session.queue[0].id];
    if (session.state === "ask") {
      if (c.o && /^[1-9]$/.test(k) && +k <= session.order.length) { pick(+k - 1); }
      else if (c.o && k === "Enter") { ev.preventDefault(); check(); }
      else if (!c.o && (k === " " || k === "Enter")) { ev.preventDefault(); reveal(); }
    } else if (session.state === "self") {
      if (k === "1") finishCard(false);
      else if (k === "2") finishCard(true);
    } else if (session.state === "answered" && (k === "Enter" || k === " ")) {
      ev.preventDefault(); next();
    }
  });

  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (!el.matches || !el.matches("[data-solved]")) return;
    const n = el.dataset.solved;
    if (el.checked) S.solved[n] = dayKey(); else delete S.solved[n];
    save();
    el.closest(".problem").classList.toggle("is-solved", el.checked);
  });

  // Keep multiple tabs in sync.
  window.addEventListener("storage", (ev) => {
    if (ev.key === STORAGE_KEY) { S = load(); if (!session) renderHome(); else renderHeader(); }
  });

  renderHome();
})();
