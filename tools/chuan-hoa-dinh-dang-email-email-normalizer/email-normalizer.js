document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const inputText = document.getElementById('emnorm-input-text');
    const outputText = document.getElementById('emnorm-output-text');
    
    const btnClear = document.getElementById('emnorm-btn-clear');
    const btnCopy = document.getElementById('emnorm-btn-copy');
    const btnDl = document.getElementById('emnorm-btn-dl');
    const badgeStatus = document.getElementById('emnorm-badge-status');

    // Thống kê
    const countValidEl = document.getElementById('emnorm-count-valid');
    const countDupesEl = document.getElementById('emnorm-count-dupes');
    const countInvalidEl = document.getElementById('emnorm-count-invalid');

    // Tùy chọn Options
    const optLower = document.getElementById('emnorm-opt-lower');
    const optDupes = document.getElementById('emnorm-opt-dupes');
    const optTags = document.getElementById('emnorm-opt-tags');
    const optDots = document.getElementById('emnorm-opt-dots');
    
    const allOptions = document.querySelectorAll('.emnorm-checkbox');

    // --- Thuật toán bóc tách và chuẩn hóa Email ---
    function processEmails() {
        const rawText = inputText.value;

        if (!rawText.trim()) {
            outputText.value = "";
            countValidEl.innerText = "0";
            countDupesEl.innerText = "0";
            countInvalidEl.innerText = "0";
            badgeStatus.innerText = "Chờ dữ liệu...";
            badgeStatus.classList.remove('active');
            return;
        }

        // 1. Dùng Regex để tách MỌI chuỗi có dấu @ từ đống văn bản lộn xộn
        // Tách bằng dấu cách, dấu phẩy, chấm phẩy, tab, hoặc xuống dòng
        const rawItems = rawText.split(/[\s,;]+/).map(i => i.trim()).filter(i => i);

        let validEmails = [];
        let invalidCount = 0;
        let dupesCount = 0;

        // Regex xác thực Email cơ bản
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        rawItems.forEach(item => {
            // Loại bỏ các dấu chấm câu bám ở đuôi (vd do dán nguyên câu văn: "... tại email admin@gmail.com.")
            let cleanItem = item.replace(/^[<"']|[>"'.]+$/g, '');

            if (!emailRegex.test(cleanItem)) {
                invalidCount++;
                return;
            }

            // Tách Local (Tên) và Domain (Tên miền)
            let [localPart, domain] = cleanItem.split('@');

            // --- ÁP DỤNG CÁC BỘ LỌC (RULES) ---

            // Chữ thường
            if (optLower.checked) {
                localPart = localPart.toLowerCase();
                domain = domain.toLowerCase();
            }

            // Xử lý đặc quyền cho Gmail (hoặc Googlemail)
            const isGmail = domain === 'gmail.com' || domain === 'googlemail.com';

            // Xóa Tag Alias (dấu +)
            if (optTags.checked) {
                // localPart.split('+')[0] sẽ lấy phần chữ đứng TRƯỚC dấu +
                localPart = localPart.split('+')[0];
            }

            // Xóa dấu chấm (.) trong Gmail
            if (optDots.checked && isGmail) {
                localPart = localPart.replace(/\./g, '');
                // Tiện thể quy hoạch luôn googlemail về gmail
                domain = 'gmail.com'; 
            }

            // Ghép lại thành email chuẩn
            validEmails.push(`${localPart}@${domain}`);
        });

        // Lọc trùng lặp
        if (optDupes.checked) {
            const originalLength = validEmails.length;
            validEmails = [...new Set(validEmails)]; // Set sẽ tự động xóa các phần tử trùng
            dupesCount = originalLength - validEmails.length;
        }

        // --- Render Kết quả ---
        outputText.value = validEmails.join('\n');
        
        countValidEl.innerText = validEmails.length;
        countDupesEl.innerText = dupesCount;
        countInvalidEl.innerText = invalidCount;

        badgeStatus.innerText = "✅ Đã xử lý xong";
        badgeStatus.classList.add('active');
    }

    // --- Lắng nghe sự kiện ---

    // Xử lý Real-time
    inputText.addEventListener('input', processEmails);

    // Tính lại ngay khi bật/tắt các Filter
    allOptions.forEach(opt => {
        opt.addEventListener('change', processEmails);
    });

    // Nút Xóa trắng
    btnClear.addEventListener('click', () => {
        inputText.value = "";
        processEmails();
        inputText.focus();
    });

    // Nút Copy
    btnCopy.addEventListener('click', async () => {
        if (!outputText.value) return;

        try {
            await navigator.clipboard.writeText(outputText.value);
            
            const originalText = btnCopy.innerText;
            const originalBg = btnCopy.style.background;
            
            btnCopy.innerText = '✅ ĐÃ COPY DANH SÁCH';
            btnCopy.style.background = 'var(--clr-green)';
            btnCopy.style.color = '#111';
            
            setTimeout(() => {
                btnCopy.innerText = originalText;
                btnCopy.style.background = originalBg;
                btnCopy.style.color = 'var(--clr-cyan)';
            }, 1500);
        } catch (err) {
            alert("Trình duyệt không hỗ trợ copy tự động!");
        }
    });

    // Nút Tải file .txt
    btnDl.addEventListener('click', () => {
        if (!outputText.value) return;
        
        const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cleaned_emails.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

});