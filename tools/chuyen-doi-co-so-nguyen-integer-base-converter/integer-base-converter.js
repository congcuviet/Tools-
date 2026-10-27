document.addEventListener('DOMContentLoaded', function() {
    // --- KHAI BÁO DOM ---
    const selectBase = document.getElementById('ibasec-input-base');
    const customInputBase = document.getElementById('ibasec-custom-input-base');
    const inputNumber = document.getElementById('ibasec-input-number');
    const errorMsg = document.getElementById('ibasec-error-msg');
    
    const out10 = document.getElementById('ibasec-out-10');
    const out16 = document.getElementById('ibasec-out-16');
    const out8 = document.getElementById('ibasec-out-8');
    const out2 = document.getElementById('ibasec-out-2');
    
    const customOutputBase = document.getElementById('ibasec-custom-output-base');
    const outCustom = document.getElementById('ibasec-out-custom');
    
    const copyBtns = document.querySelectorAll('.ibasec-btn-copy');

    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

    // --- THUẬT TOÁN BIGINT CUSTOM (Xử lý số siêu dài) ---
    
    // Parse chuỗi về BigInt (Hệ cơ số bất kỳ từ 2 đến 36)
    function parseBigInt(str, base) {
        if (!str) return 0n;
        str = str.toLowerCase().replace(/\s+/g, ''); // Xóa khoảng trắng
        let res = 0n;
        let bigBase = BigInt(base);
        
        for (let i = 0; i < str.length; i++) {
            let val = ALPHABET.indexOf(str[i]);
            // Nếu ký tự không nằm trong bảng chữ cái, hoặc lớn hơn cơ số cho phép
            if (val === -1 || val >= base) return null; 
            res = (res * bigBase) + BigInt(val);
        }
        return res;
    }

    // Convert BigInt sang chuỗi (Hệ cơ số bất kỳ từ 2 đến 36)
    function bigIntToString(big, base) {
        if (big === 0n) return '0';
        let res = '';
        let bigBase = BigInt(base);
        
        while (big > 0n) {
            let remainder = Number(big % bigBase);
            res = ALPHABET[remainder] + res;
            big = big / bigBase;
        }
        return res;
    }

    // --- HÀM XỬ LÝ CHÍNH ---
    function convert() {
        const rawStr = inputNumber.value.trim();
        errorMsg.style.display = 'none';

        if (!rawStr) {
            out10.value = ''; out16.value = ''; out8.value = ''; out2.value = ''; outCustom.value = '';
            return;
        }

        // Xác định cơ số đầu vào
        let inBase = selectBase.value;
        if (inBase === 'custom') {
            inBase = parseInt(customInputBase.value);
            if (inBase < 2 || inBase > 36 || isNaN(inBase)) inBase = 10;
        } else {
            inBase = parseInt(inBase);
        }

        // Tính toán BigInt
        const bigVal = parseBigInt(rawStr, inBase);

        if (bigVal === null) {
            errorMsg.style.display = 'block';
            out10.value = 'Error'; out16.value = 'Error'; out8.value = 'Error'; out2.value = 'Error'; outCustom.value = 'Error';
            return;
        }

        // Xuất ra các cơ số mặc định
        out10.value = bigIntToString(bigVal, 10);
        out16.value = bigIntToString(bigVal, 16).toUpperCase();
        out8.value = bigIntToString(bigVal, 8);
        out2.value = bigIntToString(bigVal, 2);

        // Xuất ra cơ số tùy chỉnh
        let cOutBase = parseInt(customOutputBase.value);
        if (cOutBase >= 2 && cOutBase <= 36) {
            let customRes = bigIntToString(bigVal, cOutBase);
            // Viết hoa nếu cơ số > 10 để đẹp hơn
            outCustom.value = cOutBase > 10 ? customRes.toUpperCase() : customRes;
        } else {
            outCustom.value = 'Cơ số 2-36';
        }
    }

    // --- LẮNG NGHE SỰ KIỆN ---

    inputNumber.addEventListener('input', convert);
    
    selectBase.addEventListener('change', () => {
        if (selectBase.value === 'custom') {
            customInputBase.style.display = 'block';
        } else {
            customInputBase.style.display = 'none';
        }
        convert();
    });

    customInputBase.addEventListener('input', convert);
    customOutputBase.addEventListener('input', convert);

    // --- XỬ LÝ NÚT COPY ---
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const inputEl = document.getElementById(targetId);
            if (!inputEl.value || inputEl.value === 'Error') return;

            try {
                await navigator.clipboard.writeText(inputEl.value);
                const originalText = btn.innerHTML;
                
                // Hiệu ứng copy
                btn.innerHTML = '✅';
                btn.style.background = 'var(--clr-green)';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '#fff';
                }, 1200);
            } catch (err) {
                alert('Lỗi! Không thể copy.');
            }
        });
    });

    // Khởi tạo ban đầu
    convert();
});