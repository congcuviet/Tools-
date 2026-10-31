document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('htmlInput');
    const textOutput = document.getElementById('textOutput');
    
    const optKeepNewlines = document.getElementById('optKeepNewlines');
    const optDecode = document.getElementById('optDecode');
    const optCleanSpaces = document.getElementById('optCleanSpaces');

    const btnStrip = document.getElementById('btnStrip');
    const btnCopyText = document.getElementById('btnCopyText');
    const btnClearText = document.getElementById('btnClearText');
    const toast = document.getElementById('toastHtml');

    function decodeHTMLEntities(text) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.documentElement.textContent;
    }

    btnStrip.addEventListener('click', () => {
        let content = htmlInput.value;

        if (!content.trim()) {
            alert("Vui lòng dán mã HTML vào ô đầu vào!");
            htmlInput.focus();
            return;
        }

        // 1. XÓA HOÀN TOÀN CÁC THẺ (VÀ NỘI DUNG) KHÔNG PHẢI VĂN BẢN
        const tagsToRemoveContent = ['script', 'style', 'noscript', 'iframe', 'svg', 'canvas', 'object', 'embed', 'applet'];
        tagsToRemoveContent.forEach(tag => {
            const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
            content = content.replace(regex, '');
        });
        // Xóa riêng các thẻ viết rút gọn không có thẻ đóng
        content = content.replace(/<(iframe|embed|object|canvas|svg)[^>]*\/>/gi, '');

        // 2. CHUYỂN ĐỔI THẺ BLOCK THÀNH DẤU XUỐNG DÒNG (\n)
        if (optKeepNewlines.checked) {
            const blockTags = 'br|hr|p|div|li|tr|h[1-6]|blockquote|article|section|header|footer|nav|aside|table|ul|ol|dl|dd|dt';
            const blockRegex = new RegExp(`</?(${blockTags})\\b[^>]*>`, 'gi');
            content = content.replace(blockRegex, '\n');
        }

        // 3. XÓA SẠCH MỌI THẺ HTML CÒN SÓT LẠI (Nhóm Inline như <b>, <span>, <a>)
        content = content.replace(/<[^>]+>/g, ' ');

        // 4. GIẢI MÃ KÝ TỰ (Entities)
        if (optDecode.checked) {
            content = decodeHTMLEntities(content);
        }

        // 5. DỌN DẸP KHOẢNG TRẮNG
        if (optCleanSpaces.checked) {
            // Biến nhiều dấu cách liền nhau thành 1 dấu cách (không đụng đến \n)
            content = content.replace(/[ \t]{2,}/g, ' ');
            // Xóa khoảng trắng ở đầu mỗi dòng
            content = content.replace(/^[ \t]+/gm, '');
            // Gộp nhiều dòng trống liên tiếp thành tối đa 2 dòng ngắt quãng (1 dòng trống)
            content = content.replace(/\n\s*\n/g, '\n\n');
        }

        textOutput.value = content.trim();
        btnCopyText.disabled = false;
    });

    btnClearText.addEventListener('click', () => {
        if (confirm("Bạn có chắc muốn xóa tất cả nội dung?")) {
            htmlInput.value = '';
            textOutput.value = '';
            btnCopyText.disabled = true;
            htmlInput.focus();
        }
    });

    btnCopyText.addEventListener('click', () => {
        const textToCopy = textOutput.value;
        if (!textToCopy) return;

        const copyHandler = (e) => {
            e.clipboardData.setData('text/plain', textToCopy);
            e.preventDefault();
        };

        document.addEventListener('copy', copyHandler);
        try {
            document.execCommand('copy');
            showToast("Đã copy văn bản!");
        } catch (err) {
            textOutput.select();
            document.execCommand('copy');
            showToast("Đã copy văn bản!");
        } finally {
            document.removeEventListener('copy', copyHandler);
        }
    });

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }
});