document.addEventListener('DOMContentLoaded', function() {
    // --- KHAI BÁO DỮ LIỆU ĐƠN VỊ ---
    // baseRate: Giá trị của đơn vị quy về đơn vị cơ sở (Base unit). 
    // Ví dụ: Length base là Mét. km = 1000m, cm = 0.01m.
    const unitData = {
        length: {
            base: "m",
            units: [
                { id: "mm", name: "Milimét", rate: 0.001 },
                { id: "cm", name: "Centimét", rate: 0.01 },
                { id: "dm", name: "Đềximét", rate: 0.1 },
                { id: "m", name: "Mét", rate: 1 },
                { id: "km", name: "Kilômét", rate: 1000 },
                { id: "in", name: "Inch", rate: 0.0254 },
                { id: "ft", name: "Foot", rate: 0.3048 },
                { id: "yd", name: "Yard", rate: 0.9144 },
                { id: "mi", name: "Dặm (Mile)", rate: 1609.344 }
            ],
            defaultFrom: "m", defaultTo: "cm"
        },
        area: {
            base: "m2",
            units: [
                { id: "mm2", name: "Milimét vuông", rate: 0.000001 },
                { id: "cm2", name: "Centimét vuông", rate: 0.0001 },
                { id: "m2", name: "Mét vuông", rate: 1 },
                { id: "ha", name: "Hecta", rate: 10000 },
                { id: "km2", name: "Kilômét vuông", rate: 1000000 },
                { id: "sq_in", name: "Inch vuông", rate: 0.00064516 },
                { id: "sq_ft", name: "Foot vuông", rate: 0.09290304 },
                { id: "acre", name: "Mẫu Anh (Acre)", rate: 4046.85642 }
            ],
            defaultFrom: "m2", defaultTo: "ha"
        },
        mass: {
            base: "kg",
            units: [
                { id: "mg", name: "Miligam", rate: 0.000001 },
                { id: "g", name: "Gam", rate: 0.001 },
                { id: "kg", name: "Kilôgam", rate: 1 },
                { id: "ton", name: "Tấn", rate: 1000 },
                { id: "oz", name: "Ounce", rate: 0.02834952 },
                { id: "lb", name: "Pound", rate: 0.45359237 }
            ],
            defaultFrom: "kg", defaultTo: "g"
        },
        volume: {
            base: "l",
            units: [
                { id: "ml", name: "Mililít", rate: 0.001 },
                { id: "l", name: "Lít", rate: 1 },
                { id: "m3", name: "Khối (m³)", rate: 1000 },
                { id: "tsp", name: "Thìa cafe", rate: 0.00492892 },
                { id: "tbsp", name: "Thìa canh", rate: 0.01478676 },
                { id: "cup", name: "Cốc (Cup)", rate: 0.236588 },
                { id: "gal", name: "Gallon (US)", rate: 3.78541178 }
            ],
            defaultFrom: "l", defaultTo: "ml"
        },
        speed: {
            base: "m_s",
            units: [
                { id: "m_s", name: "Mét/giây", rate: 1 },
                { id: "km_h", name: "Kilômét/giờ", rate: 0.277777778 },
                { id: "mph", name: "Dặm/giờ", rate: 0.44704 },
                { id: "knot", name: "Hải lý/giờ", rate: 0.514444444 }
            ],
            defaultFrom: "km_h", defaultTo: "m_s"
        }
    };

    // --- DOM ELEMENTS ---
    const tabs = document.querySelectorAll('.unitconv-tab');
    const input1 = document.getElementById('unitconvInput1');
    const input2 = document.getElementById('unitconvInput2');
    const select1 = document.getElementById('unitconvSelect1');
    const select2 = document.getElementById('unitconvSelect2');
    const swapBtn = document.getElementById('unitconvSwapBtn');
    const formulaTxt = document.getElementById('unitconvFormula');
    const copyBtn = document.getElementById('unitconvCopyBtn');
    const toast = document.getElementById('unitconvToast');

    let currentType = 'length';
    let lastEdited = 1; // Đánh dấu ô nào được gõ cuối cùng để đồng bộ 2 chiều

    // --- KHỞI TẠO ---
    function populateSelects(type) {
        select1.innerHTML = '';
        select2.innerHTML = '';
        const items = unitData[type].units;
        
        items.forEach(u => {
            const opt1 = document.createElement('option');
            opt1.value = u.id; opt1.textContent = u.name;
            select1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = u.id; opt2.textContent = u.name;
            select2.appendChild(opt2);
        });

        select1.value = unitData[type].defaultFrom;
        select2.value = unitData[type].defaultTo;
    }

    // Làm sạch chuỗi nhập vào (Chỉ cho phép số và 1 dấu chấm)
    function sanitizeInput(val) {
        val = val.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
        return val;
    }

    // Làm tròn thông minh (Bỏ số 0 thừa ở đuôi thập phân)
    function formatNumber(num) {
        return Number(parseFloat(num).toFixed(8)).toString();
    }

    // --- THUẬT TOÁN CHUYỂN ĐỔI ---
    function convert() {
        let val1 = input1.value;
        let val2 = input2.value;

        const u1 = unitData[currentType].units.find(u => u.id === select1.value);
        const u2 = unitData[currentType].units.find(u => u.id === select2.value);

        // Tính tỷ lệ công thức
        const ratio = u1.rate / u2.rate;
        formulaTxt.textContent = `Công thức: 1 ${u1.name} = ${formatNumber(ratio)} ${u2.name}`;

        if (lastEdited === 1) {
            if (val1 === '') { input2.value = ''; return; }
            let result = (parseFloat(val1) * u1.rate) / u2.rate;
            input2.value = formatNumber(result);
        } else {
            if (val2 === '') { input1.value = ''; return; }
            let result = (parseFloat(val2) * u2.rate) / u1.rate;
            input1.value = formatNumber(result);
        }
    }

    // --- LẮNG NGHE SỰ KIỆN ---
    
    // Đổi Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentType = this.getAttribute('data-type');
            populateSelects(currentType);
            
            // Tính lại ngay lập tức
            convert();
        });
    });

    // Gõ vào ô input
    input1.addEventListener('input', function(e) {
        this.value = sanitizeInput(this.value);
        lastEdited = 1;
        convert();
    });

    input2.addEventListener('input', function(e) {
        this.value = sanitizeInput(this.value);
        lastEdited = 2;
        convert();
    });

    // Đổi Select Box
    select1.addEventListener('change', convert);
    select2.addEventListener('change', convert);

    // Nút Hoán đổi (Swap)
    swapBtn.addEventListener('click', function() {
        // Đảo giá trị Select
        let tempSel = select1.value;
        select1.value = select2.value;
        select2.value = tempSel;

        // Đảo giá trị Input
        let tempVal = input1.value;
        input1.value = input2.value;
        input2.value = tempVal;

        // Đảo cờ lastEdited
        lastEdited = lastEdited === 1 ? 2 : 1;
        convert();
    });

    // Nút Copy
    copyBtn.addEventListener('click', function() {
        let text = `${input1.value} ${select1.options[select1.selectedIndex].text} = ${input2.value} ${select2.options[select2.selectedIndex].text}`;
        
        if (!input1.value || !input2.value) {
            text = "Vui lòng nhập số để chuyển đổi trước khi copy.";
        }

        const copyHandler = function(e) {
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        };
        document.addEventListener('copy', copyHandler);
        try {
            document.execCommand('copy');
            showToast("Đã copy: " + text);
        } catch (err) {
            alert("Lỗi copy tự động.");
        } finally {
            document.removeEventListener('copy', copyHandler);
        }
    });

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(function() { toast.classList.remove("show"); }, 2500);
    }

    // Khởi chạy mặc định lần đầu
    populateSelects(currentType);
    input1.value = "1";
    convert();
});