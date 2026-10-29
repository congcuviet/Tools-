document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const modeRadios = document.querySelectorAll('input[name="txtbin-mode"]');
    const cardInput = document.getElementById('txtbin-card-input');
    
    const lblInput = document.getElementById('txtbin-lbl-input');
    const lblOutput = document.getElementById('txtbin-lbl-output');
    
    const inputText = document.getElementById('txtbin-input-text');
    const outputText = document.getElementById('txtbin-output-text');
    
    const btnClear = document.getElementById('txtbin-btn-clear');
    const btnSwap = document.getElementById('txtbin-btn-swap');
    const btnCopy = document.getElementById('txtbin-btn-copy');
    
    const badgeStatus = document.getElementById('txtbin-status-badge');

    let currentMode = 'encode'; // 'encode' (Text->Bin) hoặc 'decode' (Bin->Text)

    // --- 1. Thay đổi UI theo Mode ---
    function updateModeUI() {
        currentMode = document.querySelector('input[name="txtbin-mode"]:checked').value;
        badgeStatus.innerText = "Sẵn sàng";
        badgeStatus.className = "txtbin-badge";

        if (currentMode === 'encode') {
            cardInput.style.backgroundColor = 'var(--clr-yellow)';
            lblInput.innerText = 'Văn bản thuần (Text):';
            lblOutput.innerText = 'Mã nhị phân (Binary):';
            inputText.placeholder = 'Nhập chữ vào đây (VD: Hello)...';
        } else {
            cardInput.style.backgroundColor = 'var(--clr-cyan)';
            lblInput.innerText = 'Mã nhị phân (Binary):';
            lblOutput.innerText = 'Văn bản gốc (Text):';
            inputText.placeholder = 'Nhập chuỗi 01010101 vào đây...';
        }
    }

    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateModeUI();
            processConversion(); 
        });
    });

    // --- 2. THUẬT TOÁN DỊCH ASCII/UTF-8 <-> NHỊ PHÂN ---

    // Chuyển Chữ -> Nhị Phân (Hỗ trợ UTF-8)
    function textToBinary(str) {
        // Dùng TextEncoder để lấy mảng byte UTF-8 chuẩn xác
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        
        // Map từng byte sang chuỗi nhị phân 8-bit
        return Array.from(bytes).map(byte => {
            return byte.toString(2).padStart(8, '0');
        }).join(' ');
    }

    // Chuyển Nhị Phân -> Chữ (Hỗ trợ UTF-8)
    function binaryToText(binStr) {
        // Xóa mọi thứ không phải số 0 và 1 (ví dụ: khoảng trắng, dấu phẩy...)
        const cleanBin = binStr.replace(/[^01]/g, '');
        
        if (cleanBin.length === 0) return '';

        const bytes = [];
        // Cắt chuỗi thành từng cụm 8 bit
        for (let i = 0; i < cleanBin.length; i += 8) {
            const byteStr = cleanBin.substring(i, i + 8);
            if (byteStr.length === 8) { 
                bytes.push(parseInt(byteStr, 2));
            }
        }

        // Dùng TextDecoder để chuyển mảng byte về chuỗi Text UTF-8
        try {
            const uintArray = new Uint8Array(bytes);
            const decoder = new TextDecoder('utf-8');
            // Cờ fatal: false giúp nó tự bỏ qua các byte hỏng thay vì văng lỗi
            return decoder.decode(uintArray);
        } catch (e) {
            throw new Error("Lỗi giải mã nhị phân");
        }
    }

    // --- 3. Xử lý Logic thời gian thực (Real-time) ---
    function processConversion() {
        const text = inputText.value;

        if (!text) {
            outputText.value = "";
            badgeStatus.innerText = "Chờ nhập liệu...";
            badgeStatus.className = "txtbin-badge";
            return;
        }

        try {
            if (currentMode === 'encode') {
                outputText.value = textToBinary(text);
                badgeStatus.innerText = "✅ Đã chuyển đổi";
                badgeStatus.className = "txtbin-badge active";
            } else {
                const result = binaryToText(text);
                if(result === "") {
                    outputText.value = "";
                } else {
                    outputText.value = result;
                    badgeStatus.innerText = "✅ Đã giải mã";
                    badgeStatus.className = "txtbin-badge active";
                }
            }
        } catch (error) {
            outputText.value = "LỖI: Mã nhị phân không hợp lệ!";
            badgeStatus.innerText = "❌ Lỗi định dạng";
            badgeStatus.className = "txtbin-badge error";
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