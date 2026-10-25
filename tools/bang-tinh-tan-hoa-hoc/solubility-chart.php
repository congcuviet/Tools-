<link rel="stylesheet" href="/wp-content/themes/bricks-child/solubility-chart.css?v=1.0">

<div class="sol-neo-wrapper">
    <div class="sol-header">
        <h2>Tra Cứu Bảng Tính Tan Hoá Học</h2>
        <p>Bảng tính tan tương tác 2 chiều. Hỗ trợ chuyển đổi danh pháp Tiếng Việt / Tiếng Anh (IUPAC).</p>
    </div>

    <!-- KHU VỰC ĐIỀU KHIỂN -->
    <div class="sol-controls">
        <!-- Chú thích -->
        <div class="sol-legend">
            <span class="sol-badge badge-t"><b>T</b> Tan</span>
            <span class="sol-badge badge-k"><b>K</b> Không tan</span>
            <span class="sol-badge badge-i"><b>I</b> Ít tan</span>
            <span class="sol-badge badge-x"><b>-</b> Không tồn tại / Phân hủy</span>
        </div>

        <!-- Công tắc IUPAC -->
        <div class="sol-toggle-wrapper">
            <span class="toggle-label">Tên SGK Cũ</span>
            <label class="sol-switch">
                <input type="checkbox" id="iupacToggle">
                <span class="sol-slider"></span>
            </label>
            <span class="toggle-label iupac-hl">IUPAC (Mới)</span>
        </div>
    </div>

    <!-- KHU VỰC MA TRẬN TÍNH TAN -->
    <div class="sol-table-container">
        <table class="sol-table" id="solubilityTable">
            <!-- JS Sẽ render ma trận vào đây -->
        </table>
    </div>

    <!-- TOOLTIP HIỂN THỊ CÔNG THỨC NỔI (Render bằng JS) -->
    <div id="solFloatingBox" class="sol-floating-box hidden">
        <div class="sf-formula" id="sfFormula">BaSO<sub>4</sub></div>
        <div class="sf-name" id="sfName">Barium sulfate</div>
        <div class="sf-status" id="sfStatus">Kết tủa trắng (Không tan)</div>
    </div>
</div>

<script src="/wp-content/themes/bricks-child/solubility-chart.js?v=1.0"></script>