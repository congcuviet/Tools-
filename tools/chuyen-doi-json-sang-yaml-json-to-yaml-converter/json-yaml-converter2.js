document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const h1Title = document.getElementById('omni-h1-title');
    const h1Desc = document.getElementById('omni-h1-desc');
    
    const selectLeft = document.getElementById('omni-select-left');
    const selectRight = document.getElementById('omni-select-right');
    const inputLeft = document.getElementById('omni-input-left');
    const inputRight = document.getElementById('omni-input-right');
    
    const badgeLeft = document.getElementById('omni-badge-left');
    const errorBox = document.getElementById('omni-error-box');
    const errorMsg = document.getElementById('omni-error-msg');
    
    const btnSwap = document.getElementById('omni-btn-swap');
    const btnClear = document.getElementById('omni-btn-clear');
    const btnCopy = document.getElementById('omni-btn-copy');

    // --- 1. TÁCH VỎ - GỘP LÕI (ĐIỀU HƯỚNG BẰNG URL) ---
    const currentUrl = window.location.href.toLowerCase();
    
    if (currentUrl.includes('yaml-to-json')) {
        selectLeft.value = 'yaml';
        selectRight.value = 'json';
        h1Title.innerText = "🔄 Chuyển đổi YAML sang JSON";
        h1Desc.innerText = "Trình chuyển đổi dữ liệu từ định dạng YAML sang JSON trực tuyến, siêu tốc và an toàn.";
    } else {
        selectLeft.value = 'json';
        selectRight.value = 'yaml';
        h1Title.innerText = "🔄 Chuyển đổi JSON sang YAML";
        h1Desc.innerText = "Chuyển đổi cú pháp JSON sang định dạng YAML trực tuyến, hỗ trợ kiểm tra lỗi cú pháp.";
    }

    // --- 2. HÀM CHUYỂN ĐỔI CỐT LÕI (CORE ENGINE) ---
    function convertData() {
        const rawText = inputLeft.value.trim();
        const modeIn = selectLeft.value;
        const modeOut = selectRight.value;

        // Reset trạng thái
        errorBox.style.display = 'none';
        
        if (!rawText) {
            inputRight.value = "";
            badgeLeft.innerText = "Chờ nhập liệu...";
            badgeLeft.className = "omni-badge";
            return;
        }

        try {
            let parsedObj;

            // BƯỚC 1: PARSE (Đọc dữ liệu)
            if (modeIn === 'json') {
                parsedObj = JSON.parse(rawText);
            } else if (modeIn === 'yaml') {
                parsedObj = jsyaml.load(rawText);
            }

            // Kiểm tra bảo mật cơ bản
            if (typeof parsedObj !== 'object' || parsedObj === null) {
                throw new Error("Dữ liệu gốc không phải là một Object hoặc Array hợp lệ.");
            }

            // BƯỚC 2: DUMP (Xuất dữ liệu)
            if (modeOut === 'json') {
                inputRight.value = JSON.stringify(parsedObj, null, 2);
            } else if (modeOut === 'yaml') {
                inputRight.value = jsyaml.dump(parsedObj, { indent: 2, lineWidth: -1 });
            }

            badgeLeft.innerText = "✅ Hợp lệ";
            badgeLeft.className = "omni-badge active";

        } catch (error) {
            badgeLeft.innerText = "❌ Lỗi cú pháp";
            badgeLeft.className = "omni-badge error";
            
            inputRight.value = "";
            errorMsg.innerText = error.message;
            errorBox.style.display = 'block';
        }
    }

    // --- 3. LẮNG NGHE SỰ KIỆN ---
    inputLeft.addEventListener('input', convertData);

    btnClear.addEventListener('click', () => {
        inputLeft.value = "";
        convertData();
        inputLeft.focus();
    });

    // Nút Swap
    btnSwap.addEventListener('click', () => {
        const tempText = inputRight.value;
        
        const tempMode = selectLeft.value;
        selectLeft.value = selectRight.value;
        selectRight.value = tempMode;
        
        inputLeft.value = tempText;
        
        convertData();
        
        btnSwap.style.background = 'var(--clr-cyan)';
        btnSwap.style.color = '#111';
        setTimeout(() => {
            btnSwap.style.background = '#111';
            btnSwap.style.color = 'var(--clr-yellow)';
        }, 500);
    });

    // Nút Copy
    btnCopy.addEventListener('click', async () => {
        if (!inputRight.value || errorBox.style.display === 'block') return;

        try {
            await navigator.clipboard.writeText(inputRight.value);
            
            const originalText = btnCopy.innerText;
            const originalBg = btnCopy.style.background;
            
            btnCopy.innerText = '✅ ĐÃ COPY';
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

    if(inputLeft.value) convertData();
});