document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    
    const btnCopyText = document.getElementById('btnCopyText');
    const btnClearText = document.getElementById('btnClearText');
    const toast = document.getElementById('toastCase');
    const caseButtons = document.querySelectorAll('.btn-case');

    function updateStats() {
        const text = textInput.value;
        charCount.innerText = new Intl.NumberFormat('vi-VN').format(text.length);
        
        const trimmedText = text.trim();
        const words = trimmedText === "" ? [] : trimmedText.split(/\s+/);
        wordCount.innerText = new Intl.NumberFormat('vi-VN').format(words.length);
    }

    textInput.addEventListener('input', updateStats);

    // Thuật toán Regex truyền thống (Hỗ trợ 100% trình duyệt cũ & mới)
    function toSentenceCase(str) {
        let lower = str.toLowerCase();
        return lower.replace(/(^\s*|[.!?]\s*)([^\s])/g, function(match, separator, char) {
            return separator + char.toUpperCase();
        });
    }

    function toCapitalizedCase(str) {
        let lower = str.toLowerCase();
        return lower.replace(/(^|\s)([^\s])/g, function(match, separator, char) {
            return separator + char.toUpperCase();
        });
    }

    caseButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            let currentText = textInput.value;
            
            if (!currentText) return;

            if (action === 'upper') {
                textInput.value = currentText.toUpperCase();
            } else if (action === 'lower') {
                textInput.value = currentText.toLowerCase();
            } else if (action === 'sentence') {
                textInput.value = toSentenceCase(currentText);
            } else if (action === 'capitalized') {
                textInput.value = toCapitalizedCase(currentText);
            }
            
            updateStats();
            textInput.focus();
        });
    });

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
            updateStats();
            textInput.focus();
        }
    });

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(function() { toast.classList.remove("show"); }, 2500);
    }
});