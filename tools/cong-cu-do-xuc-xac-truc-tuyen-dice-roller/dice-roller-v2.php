<div class="dr2-soft-wrapper">
  <div class="dr2-toprow">
    <div class="dr2-tabs" role="tablist">
      <button type="button" class="dr2-tab active" data-target="tab-roll">🎲 Tung Thực Tế</button>
      <button type="button" class="dr2-tab" data-target="tab-sim">📊 Giả Lập Xác Suất</button>
    </div>
    <button type="button" class="dr2-sound" id="dr2-btnSound" title="Bật/Tắt âm thanh">🔊</button>
  </div>

  <div class="dr2-controls">
    <div class="dr2-group">
      <label class="dr2-label" for="dr2-diceType">Loại xúc xắc</label>
      <select id="dr2-diceType" class="dr2-select">
        <option value="4">D4 (4 mặt)</option>
        <option value="6" selected>D6 (6 mặt)</option>
        <option value="8">D8 (8 mặt)</option>
        <option value="10">D10 (10 mặt)</option>
        <option value="12">D12 (12 mặt)</option>
        <option value="20">D20 (20 mặt)</option>
      </select>
    </div>
    <div class="dr2-group" id="dr2-ctrl-roll">
      <label class="dr2-label" for="dr2-diceCount">Số viên</label>
      <div class="dr2-stepper">
        <button type="button" class="dr2-step" id="dr2-countMinus" aria-label="Giảm số viên">−</button>
        <input type="number" id="dr2-diceCount" class="dr2-input dr2-step-input" value="2" min="1" max="6">
        <button type="button" class="dr2-step" id="dr2-countPlus" aria-label="Tăng số viên">+</button>
      </div>
    </div>
    <div class="dr2-group" id="dr2-ctrl-sim" style="display:none">
      <label class="dr2-label" for="dr2-simCount">Số lần tung (tối đa 10.000)</label>
      <input type="number" id="dr2-simCount" class="dr2-input" value="100" min="1" max="10000">
    </div>
  </div>

  <details class="dr2-adv">
    <summary>Nâng cao: điểm cộng/trừ (modifier)</summary>
    <div class="dr2-adv-body">
      <label class="dr2-label" for="dr2-modifier">Cộng vào tổng (từ −99 đến +99)</label>
      <div class="dr2-stepper">
        <button type="button" class="dr2-step" id="dr2-modMinus" aria-label="Giảm modifier">−</button>
        <input type="number" id="dr2-modifier" class="dr2-input dr2-step-input" value="0" min="-99" max="99">
        <button type="button" class="dr2-step" id="dr2-modPlus" aria-label="Tăng modifier">+</button>
      </div>
      <p class="dr2-note">Tổng = tổng các mặt + modifier. Ký hiệu hiển thị dạng 2D6+3.</p>
    </div>
  </details>

  <div class="dr2-arena" id="dr2-flipperWrapper">
    <div id="dr2-result-board" class="dr2-result-board dr2-hidden">
      <span id="dr2-main-result" class="dr2-main-text"></span>
      <span id="dr2-notation" class="dr2-notation"></span>
      <span id="dr2-detail-result" class="dr2-sub-text"></span>
      <span id="dr2-minmax" class="dr2-minmax"></span>
    </div>
    <div id="dr2-dice-arena" class="dr2-dice-arena"></div>
    <p class="dr2-hint">👆 Nhấn vào màn hình để tung</p>
  </div>

  <div class="dr2-sim-arena" id="dr2-simArena" style="display:none">
    <p class="dr2-sim-stats" id="dr2-simStats">Chưa có dữ liệu thống kê.</p>
    <p class="dr2-error dr2-hidden" id="dr2-simError"></p>
    <p class="dr2-note dr2-hidden" id="dr2-simNote"></p>
    <div id="dr2-simBars"></div>
  </div>

  <p class="dr2-error dr2-hidden" id="dr2-rollError"></p>
  <button type="button" class="dr2-roll-big" id="dr2-btnAction">TUNG NGAY ⚡</button>

  <div class="dr2-history" id="dr2-historyWrap" style="display:none">
    <h3 class="dr2-history-title">Lịch sử 5 lượt gần nhất</h3>
    <ul class="dr2-history-list" id="dr2-historyList"></ul>
    <div class="dr2-actions">
      <button type="button" class="dr2-btn" id="dr2-btnCopy">Sao chép kết quả</button>
      <button type="button" class="dr2-btn" id="dr2-btnTxt">Tải file .txt</button>
    </div>
  </div>
</div>
