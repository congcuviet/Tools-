document.addEventListener('DOMContentLoaded', function () {
  var btnSound = document.getElementById('dr2-btnSound');
  var tabs = document.querySelectorAll('.dr2-tab');
  var diceType = document.getElementById('dr2-diceType');
  var diceCount = document.getElementById('dr2-diceCount');
  var countMinus = document.getElementById('dr2-countMinus');
  var countPlus = document.getElementById('dr2-countPlus');
  var simCount = document.getElementById('dr2-simCount');
  var modifier = document.getElementById('dr2-modifier');
  var modMinus = document.getElementById('dr2-modMinus');
  var modPlus = document.getElementById('dr2-modPlus');
  var ctrlRoll = document.getElementById('dr2-ctrl-roll');
  var ctrlSim = document.getElementById('dr2-ctrl-sim');
  var arena = document.getElementById('dr2-flipperWrapper');
  var diceArena = document.getElementById('dr2-dice-arena');
  var resultBoard = document.getElementById('dr2-result-board');
  var mainResult = document.getElementById('dr2-main-result');
  var notationEl = document.getElementById('dr2-notation');
  var detailResult = document.getElementById('dr2-detail-result');
  var minmaxEl = document.getElementById('dr2-minmax');
  var simArena = document.getElementById('dr2-simArena');
  var simStats = document.getElementById('dr2-simStats');
  var simBars = document.getElementById('dr2-simBars');
  var simError = document.getElementById('dr2-simError');
  var simNote = document.getElementById('dr2-simNote');
  var rollError = document.getElementById('dr2-rollError');
  var btnAction = document.getElementById('dr2-btnAction');
  var historyWrap = document.getElementById('dr2-historyWrap');
  var historyList = document.getElementById('dr2-historyList');
  var btnCopy = document.getElementById('dr2-btnCopy');
  var btnTxt = document.getElementById('dr2-btnTxt');

  var isSoundOn = true;
  var currentMode = 'roll';
  var isRolling = false;
  var diceElements = [];
  var history = [];
  var lastResultText = '';
  var audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }
  function tone(freq, dur, type, vol, delay) {
    if (!isSoundOn) return;
    var ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    var t0 = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type || 'sine'; osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol || 0.2, t0);
    gain.gain.exponentialRampToValueAtTime(0.01, t0 + dur);
    osc.start(t0); osc.stop(t0 + dur);
  }
  function playDiceSound() { for (var i = 0; i < 6; i++) tone(200 + Math.random() * 400, 0.05, 'triangle', 0.3, i * 0.12); }
  function playDingSound() { tone(880, 0.5, 'sine', 0.2, 0); }

  /* CSPRNG with rejection sampling; Math.random only as fallback. */
  function secureInt(n) {
    if (window.crypto && window.crypto.getRandomValues) {
      var limit = Math.floor(4294967296 / n) * n;
      var buf = new Uint32Array(1);
      var v;
      do { window.crypto.getRandomValues(buf); v = buf[0]; } while (v >= limit);
      return (v % n) + 1;
    }
    return Math.floor(Math.random() * n) + 1;
  }
  function fmt(n) { return n.toLocaleString('vi-VN'); }
  function clampInt(v, lo, hi) { if (isNaN(v)) return lo; return Math.max(lo, Math.min(hi, v)); }
  function getCount() { return clampInt(parseInt(diceCount.value, 10), 1, 6); }
  function getModifier() { return clampInt(parseInt(modifier.value, 10), -99, 99); }
  function notation(count, type, mod) {
    var s = count + 'D' + type;
    if (mod > 0) s += '+' + mod;
    if (mod < 0) s += String(mod);
    return s;
  }
  function setControlsDisabled(dis) {
    diceType.disabled = dis; diceCount.disabled = dis; countMinus.disabled = dis;
    countPlus.disabled = dis; simCount.disabled = dis; modifier.disabled = dis;
    modMinus.disabled = dis; modPlus.disabled = dis;
    tabs.forEach(function (t) { t.style.pointerEvents = dis ? 'none' : ''; t.style.opacity = dis ? '0.6' : ''; });
  }
  function show(el) { el.classList.remove('dr2-hidden'); }
  function hide(el) { el.classList.add('dr2-hidden'); }

  btnSound.addEventListener('click', function () {
    isSoundOn = !isSoundOn;
    btnSound.textContent = isSoundOn ? '🔊' : '🔇';
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (isRolling) return;
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      if (tab.getAttribute('data-target') === 'tab-roll') {
        currentMode = 'roll';
        ctrlRoll.style.display = 'flex'; ctrlSim.style.display = 'none';
        arena.style.display = 'block'; simArena.style.display = 'none';
        btnAction.textContent = 'TUNG NGAY ⚡'; btnAction.classList.remove('dr2-sim');
        renderArena();
      } else {
        currentMode = 'sim';
        ctrlRoll.style.display = 'none'; ctrlSim.style.display = 'flex';
        arena.style.display = 'none'; simArena.style.display = 'block';
        btnAction.textContent = 'CHẠY GIẢ LẬP 🚀'; btnAction.classList.add('dr2-sim');
      }
    });
  });

  var rotationsD6 = { 1: { x: 0, y: 0 }, 2: { x: 90, y: 0 }, 3: { x: 0, y: -90 }, 4: { x: 0, y: 90 }, 5: { x: -90, y: 0 }, 6: { x: 180, y: 0 } };
  var polyColors = { '4': '#dc2626', '8': '#059669', '10': '#0284c7', '12': '#ea580c', '20': '#7c3aed' };

  function renderArena() {
    var type = diceType.value;
    var count = getCount();
    diceArena.textContent = '';
    diceElements = [];
    resultBoard.classList.add('dr2-hidden');
    for (var i = 0; i < count; i++) {
      if (type === '6') {
        var diceCont = document.createElement('div');
        diceCont.className = 'dr2-dice';
        diceCont.style.transform = 'rotateX(-15deg) rotateY(15deg)';
        [1, 2, 3, 4, 5, 6].forEach(function (d) {
          var faceDiv = document.createElement('div');
          faceDiv.className = 'dr2-face dr2-face-' + d;
          for (var j = 0; j < d; j++) { var dot = document.createElement('div'); dot.className = 'dr2-dot'; faceDiv.appendChild(dot); }
          diceCont.appendChild(faceDiv);
        });
        diceArena.appendChild(diceCont);
        diceElements.push({ el: diceCont, type: '3D' });
      } else {
        var polyCont = document.createElement('div');
        polyCont.className = 'dr2-poly';
        polyCont.style.borderColor = polyColors[type];
        polyCont.style.color = polyColors[type];
        polyCont.setAttribute('data-type', 'D' + type);
        polyCont.textContent = type;
        diceArena.appendChild(polyCont);
        diceElements.push({ el: polyCont, type: '2D' });
      }
    }
  }

  function syncCount() { diceCount.value = getCount(); if (!isRolling) renderArena(); }
  diceType.addEventListener('change', function () { if (!isRolling) renderArena(); });
  diceCount.addEventListener('change', syncCount);
  countMinus.addEventListener('click', function () { diceCount.value = getCount() - 1; syncCount(); });
  countPlus.addEventListener('click', function () { diceCount.value = getCount() + 1; syncCount(); });
  function syncMod() { modifier.value = getModifier(); }
  modifier.addEventListener('change', syncMod);
  modMinus.addEventListener('click', function () { modifier.value = getModifier() - 1; syncMod(); });
  modPlus.addEventListener('click', function () { modifier.value = getModifier() + 1; syncMod(); });

  function pushHistory(text) {
    history.unshift(text);
    if (history.length > 5) history.pop();
    historyList.textContent = '';
    history.forEach(function (h) { var li = document.createElement('li'); li.textContent = h; historyList.appendChild(li); });
    historyWrap.style.display = 'block';
  }

  function handleRoll() {
    if (isRolling) return;
    var type = parseInt(diceType.value, 10);
    var count = getCount();
    var mod = getModifier();
    diceCount.value = count; modifier.value = mod;
    renderArena();
    isRolling = true;
    setControlsDisabled(true);
    btnAction.disabled = true;
    btnAction.textContent = 'ĐANG TUNG...';
    resultBoard.classList.add('dr2-hidden');
    hide(rollError);
    playDiceSound();

    var finals = [];
    var intervals = [];
    diceElements.forEach(function (diceObj) {
      var finalResult = secureInt(type);
      finals.push(finalResult);
      if (diceObj.type === '3D') {
        var targetRot = rotationsD6[finalResult];
        var extraX = (Math.floor(Math.random() * 4) + 4) * 360;
        var extraY = (Math.floor(Math.random() * 4) + 4) * 360;
        diceObj.el.style.transform = 'rotateX(' + (targetRot.x + extraX) + 'deg) rotateY(' + (targetRot.y + extraY) + 'deg)';
        diceObj.el.setAttribute('data-value', String(finalResult));
      } else {
        diceObj.el.classList.add('dr2-shaking');
        (function (el) {
          intervals.push(setInterval(function () { el.textContent = String(secureInt(type)); }, 50));
        })(diceObj.el);
      }
    });

    setTimeout(function () {
      intervals.forEach(function (iv) { clearInterval(iv); });
      diceElements.forEach(function (diceObj, idx) {
        if (diceObj.type === '2D') {
          diceObj.el.classList.remove('dr2-shaking');
          diceObj.el.textContent = String(finals[idx]);
        }
      });
      var faceTotal = finals.reduce(function (a, b) { return a + b; }, 0);
      var total = faceTotal + mod;
      var not = notation(count, type, mod);
      mainResult.textContent = fmt(total) + ' ĐIỂM';
      notationEl.textContent = not;
      if (count > 1 || mod !== 0) {
        var detail = finals.join(' + ');
        if (mod !== 0) detail += (mod > 0 ? ' + ' + mod : ' - ' + Math.abs(mod));
        detailResult.textContent = '(' + detail + ' = ' + fmt(total) + ')';
        detailResult.style.display = 'inline-block';
      } else {
        detailResult.style.display = 'none';
      }
      minmaxEl.textContent = 'Nhỏ nhất ' + fmt(Math.min.apply(null, finals)) + ' · Lớn nhất ' + fmt(Math.max.apply(null, finals));
      resultBoard.classList.remove('dr2-hidden');
      lastResultText = not + ': ' + finals.join(', ') + ' = ' + total + ' điểm';
      pushHistory(lastResultText);
      isRolling = false;
      setControlsDisabled(false);
      btnAction.disabled = false;
      btnAction.textContent = 'TUNG NGAY ⚡';
      playDingSound();
    }, 1200);
  }

  function handleSim() {
    hide(simError); hide(simNote);
    var raw = simCount.value;
    var type = parseInt(diceType.value, 10);
    if (raw === '' || raw === null || isNaN(parseInt(raw, 10))) {
      simError.textContent = 'Nhập số lần tung từ 1 đến 10.000.';
      show(simError);
      simBars.textContent = '';
      simStats.textContent = 'Chưa có dữ liệu thống kê.';
      return;
    }
    var times = parseInt(raw, 10);
    if (times < 1) {
      simError.textContent = 'Số lần tung tối thiểu là 1.';
      show(simError);
      simBars.textContent = '';
      simStats.textContent = 'Chưa có dữ liệu thống kê.';
      return;
    }
    if (times > 10000) {
      times = 10000; simCount.value = 10000;
      simNote.textContent = 'Đã kẹp về tối đa 10.000 lần tung để tránh kẹt trình duyệt.';
      show(simNote);
    }
    simStats.textContent = 'Đang mô phỏng ' + fmt(times) + ' lượt gieo xúc xắc D' + type + '...';
    simBars.textContent = '';
    btnAction.disabled = true;
    setTimeout(function () {
      var counts = [];
      for (var i = 0; i < type; i++) counts.push(0);
      for (var k = 0; k < times; k++) counts[secureInt(type) - 1]++;
      var maxCount = Math.max.apply(null, counts);
      var theory = (100 / type).toFixed(1).replace('.', ',');
      counts.forEach(function (count, index) {
        var percent = ((count / times) * 100).toFixed(1).replace('.', ',');
        var barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
        var row = document.createElement('div'); row.className = 'dr2-bar-row';
        var label = document.createElement('div'); label.className = 'dr2-bar-label'; label.textContent = 'Mặt ' + (index + 1);
        var track = document.createElement('div'); track.className = 'dr2-bar-track';
        var fill = document.createElement('div'); fill.className = 'dr2-bar-fill'; fill.style.width = barWidth + '%';
        track.appendChild(fill);
        var value = document.createElement('div'); value.className = 'dr2-bar-value'; value.textContent = fmt(count) + ' · ' + percent + '%';
        var theoryEl = document.createElement('div'); theoryEl.className = 'dr2-bar-theory'; theoryEl.textContent = 'LT ' + theory + '%';
        row.appendChild(label); row.appendChild(track); row.appendChild(value); row.appendChild(theoryEl);
        simBars.appendChild(row);
      });
      simStats.textContent = 'Thống kê ' + fmt(times) + ' lượt gieo xúc xắc D' + type + ' · Lý thuyết mỗi mặt ' + theory + '%';
      btnAction.disabled = false;
      playDingSound();
    }, 100);
  }

  btnAction.addEventListener('click', function () {
    if (currentMode === 'sim') handleSim(); else handleRoll();
  });
  arena.addEventListener('click', function () { if (currentMode === 'roll') handleRoll(); });

  btnCopy.addEventListener('click', function () {
    if (!lastResultText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastResultText);
    } else {
      var ta = document.createElement('textarea');
      ta.value = lastResultText; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
  });
  btnTxt.addEventListener('click', function () {
    if (!lastResultText) return;
    var blob = new Blob([lastResultText + '\nCongCuViet - congcuviet.com'], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ket-qua-do-xuc-xac.txt'; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  renderArena();
});
