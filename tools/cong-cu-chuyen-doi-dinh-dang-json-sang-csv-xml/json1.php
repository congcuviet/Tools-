<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Công Cụ Chuyển Đổi JSON ➔ CSV/XML</title>
    <!-- Gọi file CSS -->
    <link rel="stylesheet" href="style-json1.css">
</head>
<body>

    <div class="tool-container">
        <h1>Chuyển đổi JSON ➔ CSV/XML</h1>
        
        <div class="input-group">
            <label for="jsonFileInput">Chọn file JSON (Tối đa 5MB):</label>
            <input type="file" id="jsonFileInput" class="file-input-brutalism" accept=".json">
        </div>

        <div class="action-buttons">
            <button type="button" class="btn-csv" id="btnPreviewCSV">Xem trước CSV</button>
            <button type="button" class="btn-xml" id="btnPreviewXML">Xem trước XML</button>
            <button type="button" class="btn-clear" id="btnClearData">Xóa / Chọn lại</button>
        </div>
        
        <div id="statusMessage" class="status-message"></div>

        <!-- KHU VỰC PREVIEW (Mặc định ẩn) -->
        <div class="preview-group" id="previewGroup" style="display: none;">
            <label for="previewBox">Xem trước dữ liệu (Hiển thị tối đa 10 dòng):</label>
            <textarea id="previewBox" readonly spellcheck="false" placeholder="Dữ liệu xem trước sẽ hiển thị ở đây..."></textarea>
            
            <button type="button" class="btn-download" id="btnDownloadActual">Tải xuống File</button>
        </div>
    </div>

    <!-- Gọi file JavaScript -->
    <script src="script-json1.js"></script>

</body>
</html>