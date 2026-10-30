<link rel="stylesheet" href="case-converter.css?v=<?php echo file_exists('case-converter.css') ? filemtime('case-converter.css') : '1.0'; ?>">

<div class="tool-container">
    <h2 class="tool-title">Chuyển Đổi Chữ Hoa / Thường 🔠</h2>
    
    <div class="converter-layout">
        <!-- Khu vực nhập/xuất -->
        <div class="text-area-wrapper">
            <label for="textInput">Nhập văn bản của bạn vào đây:</label>
            <textarea id="textInput" spellcheck="false" placeholder="Xin chào, hãy dán đoạn văn bản cần chuyển đổi vào ô này..."></textarea>
            <div class="stats-bar">
                <span>Số từ: <strong id="wordCount">0</strong></span>
                <span>Số ký tự: <strong id="charCount">0</strong></span>
            </div>
        </div>

        <!-- Bảng nút bấm chức năng chuyển đổi -->
        <div class="conversion-buttons">
            <button type="button" class="btn-case btn-sentence" data-action="sentence">Sentence case</button>
            <button type="button" class="btn-case btn-lower" data-action="lower">lower case</button>
            <button type="button" class="btn-case btn-upper" data-action="upper">UPPER CASE</button>
            <button type="button" class="btn-case btn-capitalized" data-action="capitalized">Capitalized Case</button>
        </div>
        
        <div class="action-buttons">
            <button type="button" class="btn-copy" id="btnCopyText">COPY VĂN BẢN</button>
            <button type="button" class="btn-clear" id="btnClearText">XÓA TRẮNG</button>
        </div>
    </div>

    <div id="toastCase">Đã copy văn bản!</div>
</div>

<script src="case-converter.js?v=<?php echo file_exists('case-converter.js') ? filemtime('case-converter.js') : '1.0'; ?>"></script>