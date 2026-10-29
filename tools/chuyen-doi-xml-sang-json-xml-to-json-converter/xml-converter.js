document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const h1Title = document.getElementById('xmlc-h1-title');
    const h1Desc = document.getElementById('xmlc-h1-desc');
    
    const selectLeft = document.getElementById('xmlc-select-left');
    const selectRight = document.getElementById('xmlc-select-right');
    const inputLeft = document.getElementById('xmlc-input-left');
    const inputRight = document.getElementById('xmlc-input-right');
    
    const badgeLeft = document.getElementById('xmlc-badge-left');
    const errorBox = document.getElementById('xmlc-error-box');
    const errorMsg = document.getElementById('xmlc-error-msg');
    
    const btnSwap = document.getElementById('xmlc-btn-swap');
    const btnClear = document.getElementById('xmlc-btn-clear');
    const btnCopy = document.getElementById('xmlc-btn-copy');

    // Khởi tạo thư viện X2JS
    const x2js = new X2JS();

    // --- 1. TÁCH VỎ - GỘP LÕI (CHỈ ĐIỀU CHỈNH SELECT BOX) ---
    // Tiêu đề đã được Script trên HTML xử lý chống chớp rồi. Ở đây ta chỉ gạt cấu hình.
    const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
    
    if (currentUrl.includes('xml-to-json') || currentUrl.includes('xml-sang-json')) {
        selectLeft.value = 'xml'; selectRight.value = 'json';
    } 
    else if (currentUrl.includes('json-to-xml') || currentUrl.includes('json-sang-xml')) {
        selectLeft.value = 'json'; selectRight.value = 'xml';
    } 
    else {
        selectLeft.value = 'xml'; selectRight.value = 'json';
    }

    // Hàm phụ trợ: Làm đẹp mã XML (Prettify) vì X2JS xuất ra XML dính liền 1 dòng
    function formatXml(xml) {
        let formatted = '';
        let reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        
        xml.split('\r\n').forEach(function(node) {
            let indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad !== 0) pad -= 1;
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
            
            let padding = '';
            for (let i = 0; i < pad; i++) padding += '  ';
            formatted += padding + node + '\r\n';
            pad += indent;
        });
        return formatted.trim();
    }

    // --- 2. HÀM CHUYỂN ĐỔI CỐT LÕI (CORE ENGINE) ---
    function convertData() {
        const rawText = inputLeft.value.trim();
        const modeIn = selectLeft.value;

        errorBox.style.display = 'none';
        
        if (!rawText) {
            inputRight.value = "";
            badgeLeft.innerText = "Chờ nhập liệu...";
            badgeLeft.className = "xmlc-badge";
            return;
        }

        try {
            if (modeIn === 'json') {
                // JSON -> XML
                const parsedObj = JSON.parse(rawText);
                if (typeof parsedObj !== 'object' || parsedObj === null) {
                    throw new Error("Dữ liệu không phải là Object hợp lệ.");
                }
                
                // Dùng x2js để biến JSON thành XML chuỗi
                const xmlString = x2js.json2xml_str(parsedObj);
                if (!xmlString) throw new Error("Lỗi khi tạo cây XML.");
                
                inputRight.value = formatXml(xmlString);
                
            } else if (modeIn === 'xml') {
                // XML -> JSON
                if (!rawText.startsWith('<')) {
                    throw new Error("XML không hợp lệ. Phải bắt đầu bằng thẻ '<'.");
                }
                
                const jsonObj = x2js.xml_str2json(rawText);
                if (!jsonObj) throw new Error("Cấu trúc thẻ XML bị lỗi hoặc chưa đóng thẻ.");
                
                inputRight.value = JSON.stringify(jsonObj, null, 2);
            }

            badgeLeft.innerText = "✅ Hợp lệ";
            badgeLeft.className = "xmlc-badge active";

        } catch (error) {
            badgeLeft.innerText = "❌ Lỗi cú pháp";
            badgeLeft.className = "xmlc-badge error";
            
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
        if(selectLeft.value === 'xml') {
            h1Title.innerText = '🔄 Chuyển đổi XML sang JSON';
            h1Desc.innerText = 'Dịch dữ liệu từ định dạng thẻ XML sang cấu trúc JSON chuẩn xác, siêu tốc.';
        } else {
            h1Title.innerText = '🔄 Chuyển đổi JSON sang XML';
            h1Desc.innerText = 'Biến đổi cấu hình JSON thành các thẻ XML trực tuyến.';
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