document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const h1Title = document.getElementById('csvc-h1-title');
    const h1Desc = document.getElementById('csvc-h1-desc');
    
    const selectLeft = document.getElementById('csvc-select-left');
    const selectRight = document.getElementById('csvc-select-right');
    const inputLeft = document.getElementById('csvc-input-left');
    const inputRight = document.getElementById('csvc-input-right');
    
    const badgeLeft = document.getElementById('csvc-badge-left');
    const errorBox = document.getElementById('csvc-error-box');
    const errorMsg = document.getElementById('csvc-error-msg');
    
    const btnSwap = document.getElementById('csvc-btn-swap');
    const btnClear = document.getElementById('csvc-btn-clear');
    const btnCopy = document.getElementById('csvc-btn-copy');

    // --- 1. TÁCH VỎ - GỘP LÕI (CHỈ ĐIỀU CHỈNH SELECT BOX) ---
    // Tiêu đề đã được HMTL chặn hiển thị xử lý rồi, ở đây ta gạt cấu hình thôi
    const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
    
    if (currentUrl.includes('csv-to-json') || currentUrl.includes('csv-sang-json')) {
        selectLeft.value = 'csv'; selectRight.value = 'json';
    } else {
        // Mặc định là JSON to CSV
        selectLeft.value = 'json'; selectRight.value = 'csv';
    }

    // --- 2. HÀM CHUYỂN ĐỔI CỐT LÕI (CORE ENGINE BẰNG PAPAPARSE) ---
    function convertData() {
        const rawText = inputLeft.value.trim();
        const modeIn = selectLeft.value;

        errorBox.style.display = 'none';
        
        if (!rawText) {
            inputRight.value = "";
            badgeLeft.innerText = "Chờ nhập liệu...";
            badgeLeft.className = "csvc-badge";
            return;
        }

        try {
            if (modeIn === 'json') {
                // Hướng 1: JSON -> CSV
                const parsedObj = JSON.parse(rawText);
                
                // CSV chỉ nhận Mảng đối tượng (Array of Objects). 
                // Nếu người dùng nhập 1 Object đơn thì ta bọc nó vào mảng.
                const dataToConvert = Array.isArray(parsedObj) ? parsedObj : [parsedObj];
                
                // Dùng PapaParse ép mảng JSON ra CSV (Tự trích xuất Header)
                const csvString = Papa.unparse(dataToConvert);
                inputRight.value = csvString;
                
            } else if (modeIn === 'csv') {
                // Hướng 2: CSV -> JSON
                const results = Papa.parse(rawText, {
                    header: true,          // Hàng đầu tiên tự động thành Key
                    skipEmptyLines: true,  // Bỏ qua dòng trống
                    dynamicTyping: true    // Auto biến chữ '123' thành số 123
                });

                if (results.errors && results.errors.length > 0) {
                    // Nếu lỗi cấu trúc CSV (ví dụ sai dấu phẩy)
                    const errTxt = results.errors.map(e => `Dòng ${e.row}: ${e.message}`).join('\n');
                    throw new Error("Lỗi đọc CSV:\n" + errTxt);
                }
                
                inputRight.value = JSON.stringify(results.data, null, 2);
            }

            badgeLeft.innerText = "✅ Hợp lệ";
            badgeLeft.className = "csvc-badge active";

        } catch (error) {
            badgeLeft.innerText = "❌ Lỗi dữ liệu";
            badgeLeft.className = "csvc-badge error";
            
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

    // Nút Swap (Giữ nguyên trải nghiệm mượt mà)
    btnSwap.addEventListener('click', () => {
        const tempText = inputRight.value;
        const tempMode = selectLeft.value;
        
        selectLeft.value = selectRight.value;
        selectRight.value = tempMode;
        
        // Hoán đổi title thủ công khi user tự bấm nút
        if(selectLeft.value === 'csv') {
            h1Title.innerText = '🔄 Chuyển đổi CSV sang JSON';
            h1Desc.innerText = 'Dịch dữ liệu bảng tính CSV thành mảng đối tượng JSON chuẩn xác, tự động nhận diện tiêu đề.';
        } else {
            h1Title.innerText = '🔄 Chuyển đổi JSON sang CSV';
            h1Desc.innerText = 'Biến đổi mảng dữ liệu JSON thành bảng tính CSV để mở bằng Excel.';
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