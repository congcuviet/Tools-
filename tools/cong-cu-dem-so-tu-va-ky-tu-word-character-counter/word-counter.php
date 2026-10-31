<link rel="stylesheet" href="word-counter.css?v=1784800329">

<div class="tool-container">
    <h2 class="tool-title">Đếm Số Từ & Phân Tích Văn Bản 📝</h2>
    
    <!-- Bảng Phân Tích (Dashboard) -->
    <div class="stats-grid">
        <div class="stat-card bg-yellow">
            <h4>SỐ TỪ</h4>
            <div class="stat-number" id="countWord">0</div>
        </div>
        <div class="stat-card bg-green">
            <h4>SỐ KÝ TỰ</h4>
            <div class="stat-number" id="countChar">0</div>
        </div>
        <div class="stat-card bg-orange">
            <h4>KÝ TỰ (BỎ KHOẢNG TRẮNG)</h4>
            <div class="stat-number" id="countCharNoSpace">0</div>
        </div>
        <div class="stat-card bg-purple">
            <h4>SỐ CÂU</h4>
            <div class="stat-number" id="countSentence">0</div>
        </div>
        <div class="stat-card bg-blue">
            <h4>SỐ ĐOẠN VĂN</h4>
            <div class="stat-number" id="countParagraph">0</div>
        </div>
        <div class="stat-card bg-red">
            <h4>THỜI GIAN ĐỌC</h4>
            <div class="stat-number" id="readTime">0p</div>
        </div>
    </div>

    <!-- Khu vực nhập liệu -->
    <div class="text-area-wrapper">
        <label for="textInput">Nhập hoặc dán văn bản của bạn vào đây:</label>
        <textarea id="textInput" spellcheck="false" placeholder="Bắt đầu gõ hoặc dán nội dung vào đây, hệ thống sẽ tự động phân tích..."></textarea>
    </div>

    <div class="action-buttons">
        <button type="button" class="btn-copy" id="btnCopyText">COPY VĂN BẢN</button>
        <button type="button" class="btn-clear" id="btnClearText">XÓA TRẮNG</button>
    </div>

    <div id="toastCounter">Đã copy văn bản!</div>
</div>

<script src="word-counter.js?v=1784800335"></script>