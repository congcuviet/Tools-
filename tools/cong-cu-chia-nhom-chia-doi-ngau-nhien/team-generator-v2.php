<div class="tg2-wrap">
  <div class="tg2-grid">
    <div class="tg2-card tg2-form">
      <div class="tg2-row-between">
        <label class="tg2-label" for="tg2-members">Danh sách thành viên (mỗi người 1 dòng)</label>
        <button type="button" class="tg2-btn-small" id="tg2-load">📂 Tải DS cũ</button>
      </div>
      <textarea id="tg2-members" class="tg2-textarea" rows="8">An
Bình
Chi
Dũng
Hà
Khang
Linh
Minh
Ngọc
Phúc</textarea>
      <div class="tg2-count" id="tg2-count"></div>
      <div class="tg2-quick">
        <input type="number" id="tg2-quick" class="tg2-input" min="2" max="1000" placeholder="VD: 10">
        <button type="button" class="tg2-btn-secondary" id="tg2-quickbtn">🔢 Tạo nhanh 1–N</button>
      </div>
      <label class="tg2-label">Chế độ chia đội</label>
      <div class="tg2-seg" role="group" aria-label="Chế độ chia đội">
        <button type="button" class="tg2-seg-btn tg2-seg-active" id="tg2-mode-count" aria-pressed="true">Theo số lượng đội</button>
        <button type="button" class="tg2-seg-btn" id="tg2-mode-size" aria-pressed="false">Theo số người mỗi đội</button>
      </div>
      <label class="tg2-label" id="tg2-target-label" for="tg2-target">Số lượng đội</label>
      <input type="number" id="tg2-target" class="tg2-input" min="1" value="2">
      <div class="tg2-preview" id="tg2-preview"></div>
      <details class="tg2-adv">
        <summary>Tùy chọn nâng cao</summary>
        <label class="tg2-label" for="tg2-remainder">Người dư (khi chia không đều)</label>
        <select id="tg2-remainder" class="tg2-input">
          <option value="distribute" selected>Trải đều vào các đội</option>
          <option value="bench">Cho ra Dự bị / Trọng tài</option>
        </select>
        <label class="tg2-check"><input type="checkbox" id="tg2-balance"> Cân bằng sức mạnh ⚖️</label>
        <p class="tg2-hint">Khi bật cân bằng, nhập điểm cuối dòng theo mẫu “Tuấn - 9”. Người không có điểm hợp lệ được tính 0 điểm.</p>
      </details>
      <div class="tg2-error" id="tg2-error" hidden></div>
      <div class="tg2-actions">
        <button type="button" class="tg2-btn-primary" id="tg2-generate">TẠO ĐỘI NGAY ⚡</button>
        <button type="button" class="tg2-btn-secondary" id="tg2-clear">🧹 Xóa</button>
      </div>
    </div>
    <div class="tg2-card tg2-result">
      <div class="tg2-row-between">
        <h3 class="tg2-result-title">📦 Kết quả chia đội</h3>
        <span class="tg2-result-actions" id="tg2-result-actions" hidden>
          <button type="button" class="tg2-btn-small" id="tg2-copy">📋 Copy KQ</button>
          <button type="button" class="tg2-btn-small" id="tg2-download">⬇️ Tải txt</button>
        </span>
      </div>
      <div class="tg2-hero" id="tg2-hero"></div>
      <div id="tg2-output" class="tg2-output">
        <div class="tg2-empty">Danh sách các đội sẽ hiển thị ở đây...</div>
      </div>
    </div>
  </div>
  <div class="tg2-toast" id="tg2-toast" hidden></div>
</div>