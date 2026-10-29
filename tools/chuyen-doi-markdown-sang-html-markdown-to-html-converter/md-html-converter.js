document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const h1Title = document.getElementById('mdhc-h1-title');
    const h1Desc = document.getElementById('mdhc-h1-desc');
    
    const selectLeft = document.getElementById('mdhc-select-left');
    const selectRight = document.getElementById('mdhc-select-right');
    const inputLeft = document.getElementById('mdhc-input-left');
    
    const inputRight = document.getElementById('mdhc-input-right'); // Khung Code
    const previewBox = document.getElementById('mdhc-preview-box'); // Khung Xem trước
    
    const badgeLeft = document.getElementById('mdhc-badge-left');
    
    const btnSwap = document.getElementById('mdhc-btn-swap');
    const btnClear = document.getElementById('mdhc-btn-clear');
    const btnCopy = document.getElementById('mdhc-btn-copy');
    
    const tabCode = document.getElementById('mdhc-tab-code');
    const tabPreview = document.getElementById('mdhc-tab-preview');

    // Khởi tạo Turndown Service (Chỉnh cấu hình cho chuẩn Github Markdown)
    const turndownService = new TurndownService({
        headingStyle: 'atx', // Dùng dấu ### thay vì gạch dưới
        codeBlockStyle: 'fenced', // Dùng ``` thay vì lùi tab
        emDelimiter: '*' 
    });

    // --- 1. TÁCH VỎ - GỘP LÕI ---
    const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
    
    if (currentUrl.includes('html-to-markdown') || currentUrl.includes('html-sang-markdown')) {
        selectLeft.value = 'html'; 
        selectRight.value = 'markdown';
        tabPreview.style.display = 'none'; // Đang xuất ra Markdown thì không cần Live Preview của HTML
    } else {
        // Mặc định: Markdown sang HTML
        selectLeft.value = 'markdown'; 
        selectRight.value = 'html';
        tabPreview.style.display = 'inline-block'; // Bật nút xem trước
    }

    // --- 2. HÀM CHUYỂN ĐỔI CỐT LÕI (CORE ENGINE) ---
    function convertData() {
        const rawText = inputLeft.value.trim();
        const modeIn = selectLeft.value;

        if (!rawText) {
            inputRight.value = "";
            previewBox.innerHTML = "";
            badgeLeft.innerText = "Chờ nhập liệu...";
            badgeLeft.className = "mdhc-badge";
            return;
        }

        try {
            if (modeIn === 'markdown') {
                // Markdown -> HTML
                // Dùng marked.parse() để biến MD thành cấu trúc thẻ HTML
                const htmlString = marked.parse(rawText);
                
                inputRight.value = htmlString;
                previewBox.innerHTML = htmlString; // Nhúng vào khung Preview
                
            } else if (modeIn === 'html') {
                // HTML -> Markdown
                const mdString = turndownService.turndown(rawText);
                inputRight.value = mdString;
                previewBox.innerHTML = ""; // Xóa trắng rác
            }

            badgeLeft.innerText = "✅ Hợp lệ";
            badgeLeft.className = "mdhc-badge active";

        } catch (error) {
            badgeLeft.innerText = "❌ Có lỗi xảy ra";
            badgeLeft.className = "mdhc-badge error";
        }
    }

    // --- 3. LOGIC CHUYỂN TAB (MÃ NGUỒN / PREVIEW) ---
    function switchTab(target) {
        if (target === 'code') {
            tabCode.classList.add('active');
            tabPreview.classList.remove('active');
            inputRight.style.display = 'block';
            previewBox.style.display = 'none';
        } else {
            tabPreview.classList.add('active');
            tabCode.classList.remove('active');
            previewBox.style.display = 'block';
            inputRight.style.display = 'none';
        }
    }

    tabCode.addEventListener('click', () => switchTab('code'));
    tabPreview.addEventListener('click', () => switchTab('preview'));


    // --- 4. LẮNG NGHE SỰ KIỆN CHÍNH ---
    inputLeft.addEventListener('input', convertData);

    btnClear.addEventListener('click', () => {
        inputLeft.value = "";
        convertData();
        inputLeft.focus();
    });

    // Nút Swap (Thông minh: Tự ẩn/hiện nút Live Preview tùy theo đầu ra)
    btnSwap.addEventListener('click', () => {
        const tempText = inputRight.value;
        const tempMode = selectLeft.value;
        
        selectLeft.value = selectRight.value;
        selectRight.value = tempMode;
        
        // Đổi Title thủ công
        if(selectLeft.value === 'html') {
            h1Title.innerText = '🔄 Chuyển đổi HTML sang Markdown';
            h1Desc.innerText = 'Dịch ngược mã HTML thành cú pháp Markdown chuẩn chỉ, dễ đọc.';
            tabPreview.style.display = 'none'; 
            switchTab('code'); // Ép về tab code
        } else {
            h1Title.innerText = '🔄 Chuyển đổi Markdown sang HTML';
            h1Desc.innerText = 'Trình biên dịch cú pháp Markdown sang mã HTML trực tuyến, hỗ trợ xem trước (Live Preview).';
            tabPreview.style.display = 'inline-block';
        }
        
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
        // Luôn copy từ textarea chứa Code (dù đang ở tab preview)
        if (!inputRight.value) return;

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