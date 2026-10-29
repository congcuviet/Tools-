document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const inputArabic = document.getElementById('romanc-input-arabic');
    const inputRoman = document.getElementById('romanc-input-roman');
    
    const errorArabic = document.getElementById('romanc-error-arabic');
    const errorRoman = document.getElementById('romanc-error-roman');
    
    const btnCopyArabic = document.getElementById('romanc-copy-arabic');
    const btnCopyRoman = document.getElementById('romanc-copy-roman');

    // --- Biến cờ (Cờ hiệu) để tránh lặp vô hạn khi 2 input cập nhật chéo nhau ---
    let isTypingArabic = false;
    let isTypingRoman = false;

    // --- Thuật toán Number -> Roman ---
    const numberToRoman = (num) => {
        const lookup = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 };
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    };

    // --- Thuật toán Roman -> Number ---
    const romanToNumber = (s) => {
        const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
        let num = 0;
        for (let i = 0; i < s.length; i++) {
            let curr = map[s[i]];
            let next = map[s[i + 1]];
            if (next && curr < next) {
                num -= curr;
            } else {
                num += curr;
            }
        }
        return num;
    };

    // Regex siêu chuẩn để validate chuỗi La Mã (Chặn IIII, VV, IL...)
    const isValidRoman = (str) => {
        const regex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
        return regex.test(str);
    };

    // --- Xử lý sự kiện nhập số thường ---
    inputArabic.addEventListener('input', (e) => {
        if (isTypingRoman) return; 
        isTypingArabic = true;

        const val = e.target.value.trim();
        errorArabic.style.display = 'none';
        errorRoman.style.display = 'none';

        if (val === '') {
            inputRoman.value = '';
            isTypingArabic = false;
            return;
        }

        const num = parseInt(val);
        if (isNaN(num) || num < 1 || num > 3999) {
            errorArabic.style.display = 'block';
            inputRoman.value = '';
        } else {
            inputRoman.value = numberToRoman(num);
        }

        isTypingArabic = false;
    });

    // --- Xử lý sự kiện nhập số La Mã ---
    inputRoman.addEventListener('input', (e) => {
        if (isTypingArabic) return;
        isTypingRoman = true;

        let val = e.target.value.trim().toUpperCase();
        errorArabic.style.display = 'none';
        errorRoman.style.display = 'none';

        if (val === '') {
            inputArabic.value = '';
            isTypingRoman = false;
            return;
        }

        if (!isValidRoman(val)) {
            errorRoman.style.display = 'block';
            inputArabic.value = '';
        } else {
            inputArabic.value = romanToNumber(val);
        }

        isTypingRoman = false;
    });

    // --- Hàm xử lý Copy ---
    const handleCopy = async (btn, inputEl) => {
        if (!inputEl.value) return;
        
        try {
            await navigator.clipboard.writeText(inputEl.value);
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '✅ Đã Copy';
            btn.style.background = 'var(--clr-green)';
            btn.style.color = '#fff';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#fff';
                btn.style.color = '#111';
            }, 1200);
        } catch (err) {
            alert('Không thể sao chép. Vui lòng thử lại!');
        }
    };

    btnCopyArabic.addEventListener('click', () => handleCopy(btnCopyArabic, inputArabic));
    btnCopyRoman.addEventListener('click', () => handleCopy(btnCopyRoman, inputRoman));
});