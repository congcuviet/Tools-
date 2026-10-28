document.addEventListener('DOMContentLoaded', async function() {
    
    // --- KHAI BÁO DOM ---
    const h1Title = document.getElementById('tomlc-h1-title');
    const h1Desc = document.getElementById('tomlc-h1-desc');
    
    const selectLeft = document.getElementById('tomlc-select-left');
    const selectRight = document.getElementById('tomlc-select-right');
    const inputLeft = document.getElementById('tomlc-input-left');
    const inputRight = document.getElementById('tomlc-input-right');
    
    const badgeLeft = document.getElementById('tomlc-badge-left');
    const errorBox = document.getElementById('tomlc-error-box');
    const errorMsg = document.getElementById('tomlc-error-msg');
    
    const btnSwap = document.getElementById('tomlc-btn-swap');
    const btnClear = document.getElementById('tomlc-btn-clear');
    const btnCopy = document.getElementById('tomlc-btn-copy');

    // Biến toàn cục chứa thư viện TOML
    let tomlParse = null;
    let tomlStringify = null;

    // --- 0. TẢI THƯ VIỆN TOML AN TOÀN (CHỐNG CRASH SCRIPT) ---
    try {
        const tomlModule = await import('https://cdn.jsdelivr.net/npm/smol-toml@1.1.3/dist/index.mjs');
        tomlParse = tomlModule.parse;
        tomlStringify = tomlModule.stringify;
        // Nếu user load lại trang và có sẵn chữ, cho convert luôn
        if(inputLeft.value) convertData();
    } catch (err) {
        console.error("Lỗi tải module TOML:", err);
    }

    // --- 1. TÁCH VỎ - GỘP LÕI (BẮT URL & ĐIỀU HƯỚNG) ---
    function updateHeader(left, right) {
        const key = `${left}-to-${right}`;
        const titles = {
            'toml-to-json': { title: '🔄 Chuyển đổi TOML sang JSON', desc: 'Dịch mã cấu hình từ định dạng TOML sang JSON chuẩn xác, siêu tốc.' },
            'toml-to-yaml': { title: '🔄 Chuyển đổi TOML sang YAML', desc: 'Biến đổi cấu hình TOML thành cú pháp YAML dễ đọc.' },
            'yaml-to-toml': { title: '🔄 Chuyển đổi YAML sang TOML', desc: 'Trình chuyển đổi dữ liệu từ định dạng YAML sang TOML trực tuyến.' },
            'json-to-toml': { title: '🔄 Chuyển đổi JSON sang TOML', desc: 'Chuyển đổi cú pháp JSON sang định dạng cấu hình TOML trực tuyến.' }
        };
        
        if (titles[key]) {
            h1Title.innerText = titles[key].title;
            h1Desc.innerText = titles[key].desc;
        }
    }

    const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
    
    if (currentUrl.includes('toml-to-json') || currentUrl.includes('toml-sang-json')) {
        selectLeft.value = 'toml'; selectRight.value = 'json';
    } 
    else if (currentUrl.includes('toml-to-yaml') || currentUrl.includes('toml-sang-yaml')) {
        selectLeft.value = 'toml'; selectRight.value = 'yaml';
    }
    else if (currentUrl.includes('yaml-to-toml') || currentUrl.includes('yaml-sang-toml')) {
        selectLeft.value = 'yaml'; selectRight.value = 'toml';
    } 
    else {
        // Fallback mặc định
        selectLeft.value = 'json'; selectRight.value = 'toml';
    }
    
    // Cập nhật Title lần đầu tiên lúc tải trang
    updateHeader(selectLeft.value, selectRight.value);


    // --- 2. HÀM CHUYỂN ĐỔI CỐT LÕI (CORE ENGINE) ---
    function convertData() {
        const rawText = inputLeft.value.trim();
        const modeIn = selectLeft.value;
        const modeOut = selectRight.value;

        errorBox.style.display = 'none';
        
        if (!rawText) {
            inputRight.value = "";
            badgeLeft.innerText = "Chờ nhập liệu...";
            badgeLeft.className = "tomlc-badge";
            return;
        }

        try {
            let parsedObj;

            // BƯỚC 1: ĐỌC DỮ LIỆU
            if (modeIn === 'json') {
                parsedObj = JSON.parse(rawText);
            } else if (modeIn === 'yaml') {
                parsedObj = jsyaml.load(rawText);
            } else if (modeIn === 'toml') {
                if (!tomlParse) throw new Error("Thư viện TOML đang tải, vui lòng thử lại sau 1 giây...");
                parsedObj = tomlParse(rawText);
            }

            // Đảm bảo dữ liệu hợp lệ
            if (typeof parsedObj !== 'object' || parsedObj === null || Array.isArray(parsedObj)) {
                throw new Error("Dữ liệu gốc phải là một Object (Dictionary) hợp lệ.");
            }

            // BƯỚC 2: XUẤT DỮ LIỆU
            if (modeOut === 'json') {
                inputRight.value = JSON.stringify(parsedObj, null, 2);
            } else if (modeOut === 'yaml') {
                inputRight.value = jsyaml.dump(parsedObj, { indent: 2, lineWidth: -1 });
            } else if (modeOut === 'toml') {
                if (!tomlStringify) throw new Error("Thư viện TOML đang tải, vui lòng thử lại sau 1 giây...");
                inputRight.value = tomlStringify(parsedObj);
            }

            badgeLeft.innerText = "✅ Hợp lệ";
            badgeLeft.className = "tomlc-badge active";

        } catch (error) {
            badgeLeft.innerText = "❌ Lỗi cú pháp";
            badgeLeft.className = "tomlc-badge error";
            
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

    // Nút Swap (Giờ đã hoạt động mượt mà và tự đổi luôn cả H1)
    btnSwap.addEventListener('click', () => {
        const tempText = inputRight.value;
        const tempMode = selectLeft.value;
        
        selectLeft.value = selectRight.value;
        selectRight.value = tempMode;
        
        // Đổi Title H1 theo mode mới
        updateHeader(selectLeft.value, selectRight.value);
        
        inputLeft.value = tempText;
        convertData();
        
        // Đổi màu nút để báo hiệu
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

});