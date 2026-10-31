<link rel="stylesheet" href="html-stripper.css?v=1784797637">

<div class="tool-container">
    <h2 class="tool-title">Lọc Thẻ HTML 🧹</h2>
    
    <div class="main-layout">
        <div class="input-box">
            <label for="htmlInput">Mã HTML đầu vào:</label>
            <textarea id="htmlInput" spellcheck="false" placeholder="Dán đoạn mã HTML của bạn vào đây..."></textarea>
        </div>
        <div class="input-box">
            <label for="textOutput">Văn bản đầu ra (Plain Text):</label>
            <textarea id="textOutput" readonly spellcheck="false" placeholder="Văn bản sạch sẽ hiển thị ở đây..."></textarea>
        </div>
    </div>

    <div class="options-panel">
        <label class="checkbox-container">
            <input type="checkbox" id="optKeepNewlines" checked> Giữ nguyên ngắt dòng (Thẻ &lt;br&gt;, &lt;p&gt;...)
        </label>
        <label class="checkbox-container">
            <input type="checkbox" id="optDecode" checked> Giải mã ký tự (&amp;amp; &rarr; &amp;)
        </label>
        <label class="checkbox-container">
            <input type="checkbox" id="optCleanSpaces" checked> Dọn dẹp khoảng trắng thừa & dòng trống
        </label>
    </div>

    <div class="action-buttons">
        <button type="button" class="btn-strip" id="btnStrip">LỌC VĂN BẢN ⚡</button>
        <button type="button" class="btn-copy" id="btnCopyText" disabled>COPY KẾT QUẢ</button>
        <button type="button" class="btn-clear" id="btnClearText">XÓA TRẮNG</button>
    </div>

    <div id="toastHtml">Đã copy văn bản!</div>
</div>

<script src="html-stripper.js?v=1784797648"></script>