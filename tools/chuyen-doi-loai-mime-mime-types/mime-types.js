document.addEventListener('DOMContentLoaded', function() {
    
    // --- CƠ SỞ DỮ LIỆU MIME TYPES CHUẨN (Thường dùng nhất trong lập trình) ---
    const mimeDatabase = [
        // Web & Documents
        { ext: ".html", mime: "text/html" },
        { ext: ".htm", mime: "text/html" },
        { ext: ".css", mime: "text/css" },
        { ext: ".js", mime: "text/javascript" },
        { ext: ".mjs", mime: "text/javascript" },
        { ext: ".json", mime: "application/json" },
        { ext: ".xml", mime: "application/xml" },
        { ext: ".csv", mime: "text/csv" },
        { ext: ".txt", mime: "text/plain" },
        { ext: ".md", mime: "text/markdown" },
        { ext: ".yaml", mime: "text/yaml" },
        { ext: ".php", mime: "application/x-httpd-php" },
        { ext: ".pdf", mime: "application/pdf" },
        { ext: ".rtf", mime: "application/rtf" },
        
        // Images
        { ext: ".png", mime: "image/png" },
        { ext: ".jpg", mime: "image/jpeg" },
        { ext: ".jpeg", mime: "image/jpeg" },
        { ext: ".gif", mime: "image/gif" },
        { ext: ".svg", mime: "image/svg+xml" },
        { ext: ".webp", mime: "image/webp" },
        { ext: ".ico", mime: "image/vnd.microsoft.icon" },
        { ext: ".bmp", mime: "image/bmp" },
        { ext: ".tiff", mime: "image/tiff" },
        
        // Audio & Video
        { ext: ".mp3", mime: "audio/mpeg" },
        { ext: ".wav", mime: "audio/wav" },
        { ext: ".ogg", mime: "audio/ogg" },
        { ext: ".midi", mime: "audio/midi" },
        { ext: ".mp4", mime: "video/mp4" },
        { ext: ".webm", mime: "video/webm" },
        { ext: ".mpeg", mime: "video/mpeg" },
        { ext: ".avi", mime: "video/x-msvideo" },
        { ext: ".ts", mime: "video/mp2t" },
        
        // Fonts
        { ext: ".woff", mime: "font/woff" },
        { ext: ".woff2", mime: "font/woff2" },
        { ext: ".ttf", mime: "font/ttf" },
        { ext: ".otf", mime: "font/otf" },
        
        // Archives & Executables
        { ext: ".zip", mime: "application/zip" },
        { ext: ".rar", mime: "application/vnd.rar" },
        { ext: ".7z", mime: "application/x-7z-compressed" },
        { ext: ".tar", mime: "application/x-tar" },
        { ext: ".gz", mime: "application/gzip" },
        { ext: ".exe", mime: "application/x-msdownload" },
        { ext: ".apk", mime: "application/vnd.android.package-archive" },
        { ext: ".iso", mime: "application/x-apple-diskimage" },
        
        // Microsoft Office
        { ext: ".doc", mime: "application/msword" },
        { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ext: ".xls", mime: "application/vnd.ms-excel" },
        { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { ext: ".ppt", mime: "application/vnd.ms-powerpoint" },
        { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
        
        // Others
        { ext: ".bin", mime: "application/octet-stream" },
        { ext: ".sh", mime: "application/x-sh" },
        { ext: ".sql", mime: "application/sql" },
        { ext: ".wasm", mime: "application/wasm" }
    ];

    // --- Khai báo DOM ---
    const inputSearch = document.getElementById('mimet-input-search');
    const btnClear = document.getElementById('mimet-btn-clear');
    
    const tableBody = document.getElementById('mimet-results-body');
    const emptyState = document.getElementById('mimet-empty-state');
    const badgeStatus = document.getElementById('mimet-status-badge');
    const tableWrapper = document.querySelector('.mimet-table-wrapper');

    // --- Cập nhật danh sách (Render Table) ---
    function renderTable(dataList) {
        tableBody.innerHTML = '';

        if (dataList.length === 0) {
            tableWrapper.style.display = 'none';
            emptyState.style.display = 'block';
            badgeStatus.innerText = '0 Kết quả';
            badgeStatus.className = 'mimet-badge error';
            return;
        }

        tableWrapper.style.display = 'block';
        emptyState.style.display = 'none';
        
        if (dataList.length === mimeDatabase.length) {
            badgeStatus.innerText = `Tất cả (${dataList.length})`;
            badgeStatus.className = 'mimet-badge';
        } else {
            badgeStatus.innerText = `Tìm thấy: ${dataList.length}`;
            badgeStatus.className = 'mimet-badge active';
        }

        dataList.forEach(item => {
            const tr = document.createElement('tr');
            
            // Xóa dấu nháy đơn/kép để tránh lỗi khi gán vào onclick
            const safeMime = item.mime.replace(/'/g, "\\'");
            
            tr.innerHTML = `
                <td><span class="mimet-ext-tag">${item.ext}</span></td>
                <td>
                    ${item.mime}
                    <button class="mimet-btn-copy-td" onclick="copyMimeText(this, '${safeMime}')">Copy</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- Hàm Copy riêng cho Bảng ---
    // Gắn vào window để gọi từ onclick trong HTML
    window.copyMimeText = async function(btnElement, text) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = btnElement.innerText;
            btnElement.innerText = '✅ Copied';
            btnElement.style.background = '#111';
            btnElement.style.color = '#fff';
            
            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.background = '#fff';
                btnElement.style.color = '#111';
            }, 1200);
        } catch (err) {
            alert("Trình duyệt không hỗ trợ copy!");
        }
    };

    // --- Thuật toán Lọc (Real-time Filter) ---
    function processSearch() {
        // Dọn dẹp khoảng trắng, chuyển về chữ thường. Bỏ dấu chấm nếu người dùng lỡ gõ
        const query = inputSearch.value.trim().toLowerCase().replace(/^\./, '');

        if (!query) {
            // Rỗng thì hiển thị tất cả
            renderTable(mimeDatabase);
            return;
        }

        // Lọc dữ liệu: Khớp với Extension (không chứa dấu chấm) hoặc khớp 1 phần với MIME Type
        const filteredData = mimeDatabase.filter(item => {
            const extNoDot = item.ext.replace('.', '');
            return extNoDot.includes(query) || item.mime.toLowerCase().includes(query);
        });

        renderTable(filteredData);
    }

    // --- Lắng nghe sự kiện ---
    inputSearch.addEventListener('input', processSearch);

    btnClear.addEventListener('click', () => {
        inputSearch.value = '';
        processSearch();
        inputSearch.focus();
    });

    // Render toàn bộ database khi mới mở web
    renderTable(mimeDatabase);
});