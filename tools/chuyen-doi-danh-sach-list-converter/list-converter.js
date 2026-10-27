document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const inputEl = document.getElementById('listc-input');
    const outputEl = document.getElementById('listc-output');
    const itemCountEl = document.getElementById('listc-item-count');
    
    // Config elements
    const splitByEl = document.getElementById('listc-split-by');
    const formatEl = document.getElementById('listc-format');
    
    // Modifiers
    const modTrim = document.getElementById('listc-mod-trim');
    const modEmpty = document.getElementById('listc-mod-empty');
    const modUnique = document.getElementById('listc-mod-unique');
    const modSort = document.getElementById('listc-mod-sort');
    
    // Custom Panel Elements
    const customPanel = document.getElementById('listc-custom-panel');
    const cPrefix = document.getElementById('listc-custom-prefix');
    const cSuffix = document.getElementById('listc-custom-suffix');
    const cJoin = document.getElementById('listc-custom-join');
    
    const btnCopy = document.getElementById('listc-btn-copy');

    // --- Core Logic ---
    function processList() {
        const rawText = inputEl.value;
        
        // 1. Phân tách (Split)
        let delimiter = '\n';
        switch (splitByEl.value) {
            case 'newline': delimiter = '\n'; break;
            case 'comma': delimiter = ','; break;
            case 'semicolon': delimiter = ';'; break;
            case 'space': delimiter = ' '; break;
        }
        
        let arr = rawText.split(delimiter);

        // 2. Bộ lọc (Modifiers)
        if (modTrim.checked) {
            arr = arr.map(item => item.trim());
        }
        
        if (modEmpty.checked) {
            arr = arr.filter(item => item !== '');
        }
        
        if (modUnique.checked) {
            arr = [...new Set(arr)];
        }
        
        if (modSort.checked) {
            arr.sort((a, b) => a.localeCompare(b));
        }

        // Cập nhật số lượng
        itemCountEl.innerText = `Tổng: ${arr.length} mục`;

        // Nếu mảng rỗng và text rỗng, xóa output
        if (arr.length === 0 || (arr.length === 1 && arr[0] === '')) {
            outputEl.value = '';
            itemCountEl.innerText = `Tổng: 0 mục`;
            return;
        }

        // 3. Định dạng đầu ra (Format Output)
        let result = '';
        const formatType = formatEl.value;

        switch (formatType) {
            case 'comma':
                result = arr.join(', ');
                break;
                
            case 'json':
                result = JSON.stringify(arr, null, 2);
                break;
                
            case 'sql':
                // Escape single quotes for SQL: ' becomes ''
                result = "(" + arr.map(item => "'" + item.replace(/'/g, "''") + "'").join(", ") + ")";
                break;
                
            case 'html':
                result = "<ul>\n" + arr.map(item => `  <li>${item}</li>`).join("\n") + "\n</ul>";
                break;
                
            case 'custom':
                const prefix = cPrefix.value || '';
                const suffix = cSuffix.value || '';
                // Hỗ trợ ký tự \n trong ô Join (gõ \n sẽ tự đổi thành xuống dòng)
                const joiner = (cJoin.value || '').replace(/\\n/g, '\n');
                
                result = arr.map(item => prefix + item + suffix).join(joiner);
                break;
        }

        outputEl.value = result;
    }

    // --- Events (Real-time update) ---
    // Gắn event input và change cho tất cả công cụ
    const triggerElements = [
        inputEl, splitByEl, formatEl, 
        modTrim, modEmpty, modUnique, modSort,
        cPrefix, cSuffix, cJoin
    ];

    triggerElements.forEach(el => {
        el.addEventListener('input', processList);
        el.addEventListener('change', processList);
    });

    // Toggle Custom Panel
    formatEl.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customPanel.style.display = 'block';
        } else {
            customPanel.style.display = 'none';
        }
    });

    // --- Nút Copy ---
    btnCopy.addEventListener('click', async () => {
        if (!outputEl.value) return;
        
        try {
            await navigator.clipboard.writeText(outputEl.value);
            const originalText = btnCopy.innerHTML;
            const originalBg = btnCopy.style.background;
            
            // Effect copy success
            btnCopy.innerHTML = '✅ Đã Copy';
            btnCopy.style.background = '#fff';
            btnCopy.style.color = '#111';
            
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
                btnCopy.style.background = originalBg;
                btnCopy.style.color = 'var(--clr-green)';
            }, 1200);
        } catch (err) {
            alert('Lỗi! Không thể sao chép kết quả.');
        }
    });

    // Init
    processList();
});