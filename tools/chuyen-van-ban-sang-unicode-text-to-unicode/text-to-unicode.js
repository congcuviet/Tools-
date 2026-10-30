document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const modeRadios = document.querySelectorAll('input[name="uni-mode"]');
    const cardInput = document.getElementById('uni-card-input');
    
    const lblInput = document.getElementById('uni-lbl-input');
    const lblOutput = document.getElementById('uni-lbl-output');
    
    const inputText = document.getElementById('uni-input-text');
    const outputText = document.getElementById('uni-output-text');
    
    const btnClear = document.getElementById('uni-btn-clear');
    const btnSwap = document.getElementById('uni-btn-swap');
    const btnCopy = document.getElementById('uni-btn-copy');
    
    const badgeStatus = document.getElementById('uni-status-badge');

    let currentMode = 'encode'; // 'encode' (Text -> Unicode) hoặc 'decode' (Unicode -> Text)

    // --- 1. Thay đổi UI theo Mode ---
    function updateModeUI() {
        currentMode = document.querySelector('input[name="uni-mode"]:checked').value;
        badgeStatus.innerText = "Sẵn sàng";
        badgeStatus.className = "uni-badge";

        if (currentMode === 'encode') {
            cardInput.style.backgroundColor = 'var(--clr-yellow)';
            lblInput.innerText = 'Văn bản thuần (Text):';
            lblOutput.innerText = 'Mã Unicode (\\uXXXX):';
            inputText.placeholder = 'Nhập văn bản vào đây... (Ví dụ: Xin chào 🚀)';
        } else {
            cardInput.style.backgroundColor = 'var(--clr-cyan)';
            lblInput.innerText = 'Mã Unicode (\\uXXXX):';
            lblOutput.innerText = 'Văn bản gốc (Text):';
            inputText.placeholder = 'Nhập mã Unicode vào đây (Ví dụ: \\u0058\\u0069\\u006e)...';
        }
    }

    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateModeUI();
            processConversion(); 
        });
    });

    // --- 2. THUẬT TOÁN DỊCH TEXT <-> UNICODE ---

    // Chuyển Chữ -> Unicode (\uXXXX)
    function textToUnicode(str) {
        let result = '';
        // JS sử dụng UTF-16, vòng lặp này sẽ tự động tách Emoji ra thành 2 mã Surrogate
        for (let i = 0; i < str.length; i++) {
            let hex = str.charCodeAt(i).toString(16).padStart(4, '0');
            result += '\\u' + hex;
        }
        return result;
    }

    // Chuyển Unicode -> Chữ (Hỗ trợ nhiều định dạng)
    function unicodeToText(str) {
        // Dùng Regex siêu mạnh để giải mã 4 định dạng phổ biến nhất của Unicode / Hex
        return str
            // 1. Dạng chuẩn: \uXXXX (Ví dụ: \u0041)
            .replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            })
            // 2. Dạng ES6: \u{XXXXX} (Ví dụ: \u{1F680} cho Emoji)
            .replace(/\\u\{([0-9a-fA-F]+)\}/g, (match, grp) => {
                return String.fromCodePoint(parseInt(grp, 16));
            })
            // 3. Dạng mở rộng: \UXXXXXXXX (8 số)
            .replace(/\\U([0-9a-fA-F]{8})/g, (match, grp) => {
                return String.fromCodePoint(parseInt(grp, 16));
            })
            // 4. Dạng Hex ngắn: \xXX (Ví dụ: \x41)
            .replace(/\\x([0-9a-fA-F]{2})/g, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            });
    }

    // --- 3. Xử lý Logic thời gian thực (Real-time) ---
    function processConversion() {
        const text = inputText.value;

        if (!text) {
            outputText.value = "";
            badgeStatus.innerText = "Chờ nhập liệu...";
            badgeStatus.className = "uni-badge";
            return;
        }

        try {
            if (currentMode === 'encode') {
                outputText.value = textToUnicode(text);
                badgeStatus.innerText = "✅ Đã chuyển đổi";
                badgeStatus.className = "uni-badge active";
            } else {
                const result = unicodeToText(text);
                if(result === "") {
                    outputText.value = "";
                } else {
                    outputText.value = result;
                    badgeStatus.innerText = "✅ Đã giải mã";
                    badgeStatus.className = "uni-badge active";
                }
            }
        } catch (error) {
            outputText.value = "LỖI: Định dạng Unicode không hợp lệ!";
            badgeStatus.innerText = "❌ Lỗi định dạng";
            badgeStatus.className = "uni-badge error";
        }
    }

    // --- Lắng nghe sự kiện ---

    // Gõ đến đâu tính đến đó
    inputText.addEventListener('input', processConversion);

    // Xóa trắng
    btnClear.addEventListener('click', () => {
        inputText.value = "";
        processConversion();
        inputText.focus();
    });

    // Hoán đổi (Swap)
    btnSwap.addEventListener('click', () => {
        const currentOut = outputText.value;
        if (!currentOut || currentOut.includes("LỖI")) return;
        
        // Đảo Mode
        if (currentMode === 'encode') {
            document.querySelector('input[value="decode"]').checked = true;
        } else {
            document.querySelector('input[value="encode"]').checked = true;
        }
        updateModeUI();

        // Chuyển kết quả cũ sang Input mới
        inputText.value = currentOut;
        processConversion();
    });

    // Copy Kết quả
    btnCopy.addEventListener('click', async () => {
        if (!outputText.value || outputText.value.includes("LỖI")) return;

        try {
            await navigator.clipboard.writeText(outputText.value);
            
            const originalText = btnCopy.innerText;
            const originalBg = btnCopy.style.background;
            
            btnCopy.innerText = '✅ ĐÃ COPY THÀNH CÔNG';
            btnCopy.style.background = 'var(--clr-green)';
            btnCopy.style.color = '#111';
            
            setTimeout(() => {
                btnCopy.innerText = originalText;
                btnCopy.style.background = originalBg;
                btnCopy.style.color = 'var(--clr-cyan)';
            }, 1500);
        } catch (err) {
            alert("Lỗi sao chép!");
        }
    });

    // Khởi tạo giao diện lần đầu
    updateModeUI();
});