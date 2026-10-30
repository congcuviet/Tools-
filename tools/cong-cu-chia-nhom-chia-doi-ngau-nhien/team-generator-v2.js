document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const membersEl = $('tg2-members'), countEl = $('tg2-count'), quickEl = $('tg2-quick'),
    modeCountBtn = $('tg2-mode-count'), modeSizeBtn = $('tg2-mode-size'),
    targetEl = $('tg2-target'), targetLabel = $('tg2-target-label'),
    previewEl = $('tg2-preview'), remainderEl = $('tg2-remainder'), balanceEl = $('tg2-balance'),
    errorEl = $('tg2-error'), heroEl = $('tg2-hero'), outputEl = $('tg2-output'),
    actionsEl = $('tg2-result-actions'), toastEl = $('tg2-toast');
  const STORAGE_KEY = 'teamGen_LastMembers';
  const ICONS = ['🛡️', '⚔️', '🏆', '🎯', '🔥', '⚡', '🚀', '🌟', '💎', '🦁'];
  const COLORS = ['tg2-c1', 'tg2-c2', 'tg2-c3', 'tg2-c4', 'tg2-c5', 'tg2-c6'];
  let mode = 'count';
  let lastTeams = [];
  let lastBalance = false;

  function randInt(n) {
    if (window.crypto && window.crypto.getRandomValues) {
      const max = Math.floor(4294967296 / n) * n;
      const buf = new Uint32Array(1);
      let x;
      do { window.crypto.getRandomValues(buf); x = buf[0]; } while (x >= max);
      return x % n;
    }
    return Math.floor(Math.random() * n);
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function fmtNum(x) {
    const r = Math.round(x * 100) / 100;
    return Number.isInteger(r) ? String(r) : String(r);
  }
  function readLines() {
    return membersEl.value.split('\n').map((s) => s.trim()).filter((s) => s !== '');
  }
  function parseMembers() {
    const lines = readLines();
    if (!balanceEl.checked) return lines.map((name) => ({ name, score: 0 }));
    return lines.map((line) => {
      const m = line.match(/^(.+?)[\s\-–—]+(-?\d+(?:\.\d+)?)$/);
      if (m) return { name: m[1].trim(), score: parseFloat(m[2]) };
      return { name: line, score: 0 };
    });
  }
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    outputEl.textContent = '';
    const empty = document.createElement('div');
    empty.className = 'tg2-empty';
    empty.textContent = 'Danh sách các đội sẽ hiển thị ở đây...';
    outputEl.appendChild(empty);
    heroEl.textContent = '';
    actionsEl.hidden = true;
    lastTeams = [];
  }
  function clearError() { errorEl.hidden = true; errorEl.textContent = ''; }
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    setTimeout(() => { toastEl.hidden = true; }, 2500);
  }
  function updateCountPreview() {
    const lines = readLines();
    const seen = new Set();
    let dup = 0;
    lines.forEach((l) => { if (seen.has(l)) dup++; else seen.add(l); });
    let countText = 'Đã nhập: ' + lines.length + ' người';
    if (dup > 0) countText += ' · ' + dup + ' tên trùng (vẫn tính riêng từng dòng)';
    countEl.textContent = countText;
    const raw = targetEl.value.trim();
    const n = lines.length;
    if (n < 2 || raw === '' || !Number.isInteger(Number(raw))) {
      previewEl.textContent = 'Nhập ít nhất 2 người và một số mục tiêu nguyên để xem trước số đội.';
      return;
    }
    const t = Number(raw);
    let k;
    if (mode === 'count') {
      if (t < 1 || t > n) { previewEl.textContent = 'Số đội phải từ 1 đến ' + n + ' (bằng số người đã nhập).'; return; }
      k = t;
    } else {
      if (t < 1) { previewEl.textContent = 'Số người mỗi đội phải từ 1 trở lên.'; return; }
      k = Math.floor(n / t);
      if (k === 0) { previewEl.textContent = 'Không đủ người để lập dù chỉ 1 đội với mục tiêu này.'; return; }
    }
    const q = Math.floor(n / k), r = n % k;
    if (remainderEl.value === 'bench') {
      const bench = n - k * q;
      previewEl.textContent = 'Sẽ tạo ' + k + ' đội × ' + q + ' người' + (bench > 0 ? ' + ' + bench + ' người dự bị' : '') + '.';
    } else {
      const sizes = [];
      for (let i = 0; i < k; i++) sizes.push(q + (i < r ? 1 : 0));
      previewEl.textContent = 'Sẽ tạo ' + k + ' đội, quân số: ' + sizes.join(', ') + ' người.';
    }
  }
  function setMode(m) {
    mode = m;
    const isCount = m === 'count';
    modeCountBtn.classList.toggle('tg2-seg-active', isCount);
    modeSizeBtn.classList.toggle('tg2-seg-active', !isCount);
    modeCountBtn.setAttribute('aria-pressed', isCount ? 'true' : 'false');
    modeSizeBtn.setAttribute('aria-pressed', !isCount ? 'true' : 'false');
    targetLabel.textContent = isCount ? 'Số lượng đội' : 'Số người mỗi đội';
    updateCountPreview();
  }
  function buildPlainText(teams, balance) {
    let text = '🎲 KẾT QUẢ CHIA ĐỘI 🎲\n\n';
    teams.forEach((team) => {
      const scoreStr = (balance && team.colorClass !== 'tg2-cbench') ? ' [Tổng SM: ' + fmtNum(team.totalScore) + ']' : '';
      text += team.icon + ' ' + team.name + scoreStr + ':\n';
      team.members.forEach((member, i) => {
        const ms = (balance && member.score > 0) ? ' (' + fmtNum(member.score) + 'đ)' : '';
        text += '  ' + (i + 1) + '. ' + member.name + ms + '\n';
      });
      text += '\n';
    });
    return text;
  }
  function renderTeams(teams, balance) {
    outputEl.textContent = '';
    teams.forEach((team) => {
      const card = document.createElement('div');
      card.className = 'tg2-team';
      const title = document.createElement('div');
      title.className = 'tg2-team-title ' + team.colorClass;
      const left = document.createElement('span');
      left.textContent = team.icon + ' ' + team.name + ' (' + team.members.length + ' người)';
      title.appendChild(left);
      if (balance && team.colorClass !== 'tg2-cbench') {
        const badge = document.createElement('span');
        badge.className = 'tg2-score';
        badge.textContent = 'Sức mạnh: ' + fmtNum(team.totalScore);
        title.appendChild(badge);
      }
      const ul = document.createElement('ol');
      ul.className = 'tg2-team-list';
      team.members.forEach((member) => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.textContent = member.name;
        li.appendChild(nameSpan);
        if (balance && member.score > 0) {
          const s = document.createElement('span');
          s.className = 'tg2-member-score';
          s.textContent = ' ⭐ ' + fmtNum(member.score);
          li.appendChild(s);
        }
        ul.appendChild(li);
      });
      card.appendChild(title);
      card.appendChild(ul);
      outputEl.appendChild(card);
    });
  }
  function generate() {
    clearError();
    const lines = readLines();
    const members = parseMembers();
    const n = members.length;
    if (n < 2) { showError('Cần ít nhất 2 người để chia đội.'); return; }
    const raw = targetEl.value.trim();
    if (raw === '' || !Number.isInteger(Number(raw))) { showError('Số mục tiêu phải là một số nguyên.'); return; }
    const t = Number(raw);
    let k;
    if (mode === 'count') {
      if (t < 1 || t > n) { showError('Số đội phải từ 1 đến ' + n + ' (bằng số người đã nhập).'); return; }
      k = t;
    } else {
      if (t < 1) { showError('Số người mỗi đội phải từ 1 trở lên.'); return; }
      k = Math.floor(n / t);
      if (k === 0) { showError('Không đủ người để lập dù chỉ 1 đội với mục tiêu này.'); return; }
    }
    try { localStorage.setItem(STORAGE_KEY, membersEl.value); } catch (e) { /* storage unavailable */ }
    const balance = balanceEl.checked;
    const remainder = remainderEl.value;
    const teams = [];
    for (let i = 0; i < k; i++) {
      teams.push({ name: 'Đội ' + (i + 1), icon: ICONS[i % ICONS.length], colorClass: COLORS[i % COLORS.length], members: [], totalScore: 0 });
    }
    let bench = [];
    if (balance) {
      const sorted = shuffle(members).sort((a, b) => b.score - a.score);
      const limit = remainder === 'bench' ? k * Math.floor(n / k) : n;
      sorted.forEach((member, idx) => {
        if (idx >= limit) { bench.push(member); return; }
        let best = 0;
        for (let i = 1; i < teams.length; i++) {
          if (teams[i].totalScore < teams[best].totalScore ||
            (teams[i].totalScore === teams[best].totalScore && teams[i].members.length < teams[best].members.length)) {
            best = i;
          }
        }
        teams[best].members.push(member);
        teams[best].totalScore += member.score;
      });
    } else {
      const shuffled = shuffle(members);
      const q = Math.floor(n / k), r = n % k;
      let idx = 0;
      for (let i = 0; i < k; i++) {
        let size = q;
        if (remainder === 'distribute' && i < r) size += 1;
        teams[i].members = shuffled.slice(idx, idx + size);
        idx += size;
      }
      if (remainder === 'bench' && idx < shuffled.length) bench = shuffled.slice(idx);
    }
    if (bench.length > 0) {
      teams.push({ name: 'Đội Dự bị / Trọng tài', icon: '⏱️', colorClass: 'tg2-cbench', members: bench, totalScore: 0 });
    }
    renderTeams(teams, balance);
    let hero = 'Đã chia ' + n + ' người thành ' + k + ' đội';
    if (bench.length > 0) hero += ' + ' + bench.length + ' người dự bị';
    heroEl.textContent = hero + '.';
    actionsEl.hidden = false;
    lastTeams = teams;
    lastBalance = balance;
  }
  modeCountBtn.addEventListener('click', () => setMode('count'));
  modeSizeBtn.addEventListener('click', () => setMode('size'));
  membersEl.addEventListener('input', updateCountPreview);
  targetEl.addEventListener('input', updateCountPreview);
  remainderEl.addEventListener('change', updateCountPreview);
  balanceEl.addEventListener('change', updateCountPreview);
  $('tg2-generate').addEventListener('click', generate);
  $('tg2-quickbtn').addEventListener('click', () => {
    const raw = quickEl.value.trim();
    if (raw === '' || !Number.isInteger(Number(raw))) { showError('Nhập số lượng cần tạo nhanh (số nguyên từ 2 trở lên).'); return; }
    const num = Number(raw);
    if (num < 2 || num > 1000) { showError('Số lượng tạo nhanh phải từ 2 đến 1000.'); return; }
    clearError();
    const list = [];
    for (let i = 1; i <= num; i++) list.push('Người ' + i);
    membersEl.value = list.join('\n');
    updateCountPreview();
  });
  $('tg2-load').addEventListener('click', () => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
    if (saved) {
      membersEl.value = saved;
      updateCountPreview();
      showToast('Đã tải danh sách gần nhất!');
    } else {
      showError('Chưa có danh sách nào được lưu trên trình duyệt này.');
    }
  });
  $('tg2-clear').addEventListener('click', () => {
    membersEl.value = '';
    quickEl.value = '';
    clearError();
    outputEl.textContent = '';
    const empty = document.createElement('div');
    empty.className = 'tg2-empty';
    empty.textContent = 'Danh sách các đội sẽ hiển thị ở đây...';
    outputEl.appendChild(empty);
    heroEl.textContent = '';
    actionsEl.hidden = true;
    lastTeams = [];
    updateCountPreview();
  });
  $('tg2-copy').addEventListener('click', () => {
    if (lastTeams.length === 0) return;
    const text = buildPlainText(lastTeams, lastBalance);
    const done = () => showToast('Đã copy danh sách đội!');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
    function fallbackCopy(t, cb) {
      const ta = document.createElement('textarea');
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
      document.body.removeChild(ta);
      cb();
    }
  });
  $('tg2-download').addEventListener('click', () => {
    if (lastTeams.length === 0) return;
    const blob = new Blob([buildPlainText(lastTeams, lastBalance)], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chia-doi.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  updateCountPreview();
});