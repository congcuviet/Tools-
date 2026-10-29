document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const inputVal = document.getElementById('tempc-input-val');
    const inputUnit = document.getElementById('tempc-input-unit');
    
    const boxes = {
        'C': document.getElementById('tempc-box-C'),
        'F': document.getElementById('tempc-box-F'),
        'K': document.getElementById('tempc-box-K'),
        'R': document.getElementById('tempc-box-R')
    };
    
    const outputs = {
        'C': document.getElementById('tempc-out-C'),
        'F': document.getElementById('tempc-out-F'),
        'K': document.getElementById('tempc-out-K'),
        'R': document.getElementById('tempc-out-R')
    };
    
    const formulaText = document.getElementById('tempc-formula-text');
    const btnCopies = document.querySelectorAll('.tempc-btn-copy');
    const presetBtns = document.querySelectorAll('.tempc-btn-preset');

    // Làm tròn số thông minh (Tối đa 4 chữ số thập phân, loại bỏ số 0 vô nghĩa)
    const formatNum = (num) => parseFloat(num.toFixed(4));

    // --- Hàm Tính Toán Chuyển Đổi Trung Tâm ---
    function convertTemperatures() {
        const val = parseFloat(inputVal.value);
        const sourceUnit = inputUnit.value;
        
        // 1. Ẩn Box của đơn vị đang chọn, hiện các Box còn lại
        for (let unit in boxes) {
            if (unit === sourceUnit) {
                boxes[unit].style.display = 'none';
            } else {
                boxes[unit].style.display = 'flex';
            }
        }

        // Nếu nhập lỗi / bỏ trống
        if (isNaN(val)) {
            for (let unit in outputs) {
                outputs[unit].innerText = "--";
            }
            formulaText.innerText = "Chờ nhập liệu...";
            return;
        }

        let tempC = 0; // Ta lấy độ C làm điểm trung chuyển (Hub)

        // 2. Chuyển đổi từ Đơn vị gốc -> Độ C
        switch (sourceUnit) {
            case 'C':
                tempC = val;
                formulaText.innerText = `Các công thức được tính từ mốc ${val}°C`;
                break;
            case 'F':
                tempC = (val - 32) * 5/9;
                formulaText.innerText = `°C = (${val} - 32) × 5/9 = ${formatNum(tempC)}`;
                break;
            case 'K':
                tempC = val - 273.15;
                formulaText.innerText = `°C = ${val} - 273.15 = ${formatNum(tempC)}`;
                break;
            case 'R':
                tempC = (val - 491.67) * 5/9;
                formulaText.innerText = `°C = (${val} - 491.67) × 5/9 = ${formatNum(tempC)}`;
                break;
        }

        // 3. Tính từ Độ C -> Các đơn vị còn lại và xuất ra HTML
        if (sourceUnit !== 'C') outputs['C'].innerText = formatNum(tempC);
        if (sourceUnit !== 'F') outputs['F'].innerText = formatNum((tempC * 9/5) + 32);
        if (sourceUnit !== 'K') outputs['K'].innerText = formatNum(tempC + 273.15);
        if (sourceUnit !== 'R') outputs['R'].innerText = formatNum((tempC + 273.15) * 9/5);
    }

    // --- Lắng nghe sự kiện ---

    // Gõ text hoặc đổi đơn vị -> Tính toán lại ngay
    inputVal.addEventListener('input', convertTemperatures);
    inputUnit.addEventListener('change', convertTemperatures);

    // Chức năng nút Preset (Tạo nhanh)
    presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.target.getAttribute('data-val');
            const unit = e.target.getAttribute('data-unit');
            
            inputVal.value = val;
            inputUnit.value = unit;
            
            convertTemperatures();
            
            // Hiệu ứng nhấp nháy cho input
            inputVal.style.backgroundColor = 'var(--clr-cyan)';
            setTimeout(() => inputVal.style.backgroundColor = '#fff', 300);
        });
    });

    // Chức năng Copy riêng từng kết quả
    btnCopies.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const targetId = btn.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            
            if (!textToCopy || textToCopy === '--') return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalIcon = btn.innerText;
                
                btn.innerText = '✅';
                btn.style.background = 'var(--clr-green)';
                
                setTimeout(() => {
                    btn.innerText = originalIcon;
                    btn.style.background = '#fff';
                }, 1500);
            } catch (err) {
                alert('Lỗi! Không thể copy.');
            }
        });
    });

    // Khởi tạo tính toán lần đầu khi load trang
    convertTemperatures();
});