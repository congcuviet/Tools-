document.addEventListener('DOMContentLoaded', function() {
    
    // Đảm bảo thư viện CryptoJS đã được tải
    if (typeof CryptoJS === 'undefined') {
        alert("Lỗi: Không thể tải thư viện mã hóa CryptoJS. Vui lòng kiểm tra kết nối mạng.");
        return;
    }

    // --- Khai báo DOM Elements ---
    const inputEl = document.getElementById('hashc-input');
    const chkUppercase = document.getElementById('hashc-opt-uppercase');
    const btnClear = document.getElementById('hashc-btn-clear');
    
    const outMD5 = document.getElementById('hashc-out-md5');
    const outSHA1 = document.getElementById('hashc-out-sha1');
    const outSHA256 = document.getElementById('hashc-out-sha256');
    const outSHA512 = document.getElementById('hashc-out-sha512');
    
    const copyBtns = document.querySelectorAll('.hashc-btn-copy');

    // --- Hàm Tính Toán Mã Băm (Real-time) ---
    function generateHashes() {
        const text = inputEl.value;
        const isUpper = chkUppercase.checked;

        if (text === "") {
            // Xóa rỗng nếu không có dữ liệu
            outMD5.value = "";
            outSHA1.value = "";
            outSHA256.value = "";
            outSHA512.value = "";
            return;
        }

        // Tạo mã băm bằng CryptoJS
        let md5Val = CryptoJS.MD5(text).toString();
        let sha1Val = CryptoJS.SHA1(text).toString();
        let sha256Val = CryptoJS.SHA256(text).toString();
        let sha512Val = CryptoJS.SHA512(text).toString();

        // Xử lý viết hoa nếu được check
        if (isUpper) {
            md5Val = md5Val.toUpperCase();
            sha1Val = sha1Val.toUpperCase();
            sha256Val = sha256Val.toUpperCase();
            sha512Val = sha512Val.toUpperCase();
        }

        // Hiển thị ra các ô input
        outMD5.value = md5Val;
        outSHA1.value = sha1Val;
        outSHA256.value = sha256Val;
        outSHA512.value = sha512Val;
    }

    // --- Lắng nghe sự kiện ---

    // Tính toán ngay khi gõ phím
    inputEl.addEventListener('input', generateHashes);
    
    // Tính toán lại khi bật/tắt nút Viết hoa
    chkUppercase.addEventListener('change', generateHashes);

    // Nút Xóa trắng
    btnClear.addEventListener('click', () => {
        inputEl.value = "";
        generateHashes();
        inputEl.focus(); // Đưa con trỏ lại vào ô nhập
    });

    // Các Nút Copy
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (!targetInput.value) return; // Bỏ qua nếu rỗng

            try {
                // Copy vào Clipboard
                await navigator.clipboard.writeText(targetInput.value);
                
                // Hiệu ứng nút
                const originalText = btn.innerText;
                const originalBg = btn.style.background;
                
                btn.innerText = '✅';
                btn.style.background = 'var(--clr-yellow)';
                
                // Trả lại trạng thái cũ sau 1.5s
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = originalBg;
                }, 1500);
            } catch (err) {
                alert("Lỗi! Không thể copy mã băm.");
            }
        });
    });

    // Kích hoạt hàm lần đầu (trong trường hợp trình duyệt tự fill form)
    generateHashes();
});