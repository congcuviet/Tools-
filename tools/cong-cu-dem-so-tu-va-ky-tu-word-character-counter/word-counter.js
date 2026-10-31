document.addEventListener('DOMContentLoaded', function() {
    // --- Lấy các phần tử DOM ---
    const textInput = document.getElementById('textInput');
    
    const uiWord = document.getElementById('countWord');
    const uiChar = document.getElementById('countChar');
    const uiCharNoSpace = document.getElementById('countCharNoSpace');
    const uiSentence = document.getElementById('countSentence');
    const uiParagraph = document.getElementById('countParagraph');
    const uiReadTime = document.getElementById('readTime');
    
    const btnCopyText = document.getElementById('btnCopyText');
    const btnClearText = document.getElementById('btnClearText');
    const toast = document.getElementById('toastCounter');

    // Hàm Format số (thêm dấu phẩy)
    function formatNumber(num) {
        return new Intl.NumberFormat('vi-VN').format(num);
    }

    // --- THUẬT TOÁN ĐẾM VÀ PHÂN TÍCH (Chạy Real-time) ---
    function analyzeText() {
        const text = textInput.value;
        const trimmedText = text.trim();

        // 1. Đếm Ký tự (Có khoảng trắng)
        const charCount = text.length;

        // 2. Đếm Ký tự (Không khoảng trắng)
        const charNoSpaceCount = text.replace(/\s/g, '').length;

        // 3. Đếm Từ
        // Tách chuỗi theo các khoảng trắng (bao gồm space, tab, ngắt dòng)
        const words = trimmedText === "" ? [] : trimmedText.split(/\s+/);
        const wordCount = words.length;

        // 4. Đếm Đoạn văn
        // Tách chuỗi theo dấu ngắt dòng (\n), lọc bỏ các dòng trống
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        const paragraphCount = paragraphs.length;

        // 5. Đếm Câu
        // Tách chuỗi theo các dấu chấm, chấm hỏi, chấm than.
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = trimmedText === "" ? 0 : sentences.length;

        // 6. Tính thời gian đọc (Trung bình người lớn đọc 200 từ/phút)
        let readTimeText = "0p";
        if (wordCount > 0) {
            const minutes = Math.floor(wordCount / 200);
            const seconds = Math.round((wordCount % 200) / (200 / 60));
            
            if (minutes === 0) {
                readTimeText = seconds + "s";
            } else {
                readTimeText = minutes + "p " + seconds + "s";
            }
        }

        // --- CẬP NHẬT LÊN GIAO DIỆN ---
        uiChar.innerText = formatNumber(charCount);
        uiCharNoSpace.innerText = formatNumber(charNoSpaceCount);
        uiWord.innerText = formatNumber(wordCount);
        uiParagraph.innerText = formatNumber(paragraphCount);
        uiSentence.innerText = formatNumber(sentenceCount);
        uiReadTime.innerText = readTimeText;
    }

    // Gắn sự kiện "input" để đếm ngay khi gõ hoặc dán nội dung
    textInput.addEventListener('input', analyzeText);

    // --- SỰ KIỆN COPY & XÓA TRẮNG ---
    btnCopyText.addEventListener('click', function() {
        const textToCopy = textInput.value;
        if (!textToCopy) return;

        const copyHandler = function(e) {
            e.clipboardData.setData('text/plain', textToCopy);
            e.preventDefault();
        };

        document.addEventListener('copy', copyHandler);
        try {
            document.execCommand('copy');
            showToast("Đã copy văn bản!");
        } catch (err) {
            textInput.select();
            document.execCommand('copy');
            showToast("Đã copy văn bản!");
        } finally {
            document.removeEventListener('copy', copyHandler);
        }
    });

    btnClearText.addEventListener('click', function() {
        if (confirm("Bạn có chắc muốn xóa tất cả nội dung?")) {
            textInput.value = '';
            analyzeText(); // Cập nhật lại các số về 0
            textInput.focus();
        }
    });

    // Hàm hiển thị thông báo Toast
    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(function() { toast.classList.remove("show"); }, 2500);
    }
});