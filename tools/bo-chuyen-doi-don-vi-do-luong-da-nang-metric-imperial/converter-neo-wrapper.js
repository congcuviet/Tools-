document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.getElementById('tabContainer');
    const inputValue = document.getElementById('inputValue');
    const sourceUnit = document.getElementById('sourceUnit');
    const resultsContainer = document.getElementById('resultsContainer');
    const toast = document.getElementById('toastConverter');

    const cardColors = ['#ffb7b2', '#b5ead7', '#ffdac1', '#cbaacb', '#fdfd96', '#8ac926', '#4cc9f0'];

    // DATA CẤU TRÚC ĐƠN VỊ TỪNG NGÁCH
    const unitCategories = {
        length: {
            name: '📏 Chiều Dài',
            base: 'm',
            units: {
                'm': { name: 'Mét (m)', factor: 1 },
                'km': { name: 'Kilômét (km)', factor: 1000 },
                'cm': { name: 'Centimét (cm)', factor: 0.01 },
                'mm': { name: 'Milimét (mm)', factor: 0.001 },
                'in': { name: 'Inch (in)', factor: 0.0254 },
                'ft': { name: 'Foot (ft)', factor: 0.3048 },
                'yd': { name: 'Yard (yd)', factor: 0.9144 },
                'mi': { name: 'Dặm (mile)', factor: 1609.344 }
            }
        },
        weight: {
            name: '⚖️ Cân Nặng',
            base: 'kg',
            units: {
                'kg': { name: 'Kilôgam (kg)', factor: 1 },
                'g': { name: 'Gram (g)', factor: 0.001 },
                'mg': { name: 'Miligram (mg)', factor: 0.000001 },
                'lb': { name: 'Pound (lbs)', factor: 0.45359237 },
                'oz': { name: 'Ounce (oz)', factor: 0.02834952 }
            }
        },
        temperature: {
            name: '🌡️ Nhiệt Độ',
            base: 'c', // Tính toán đặc biệt
            units: {
                'c': { name: 'Độ C (°C)' },
                'f': { name: 'Độ F (°F)' },
                'k': { name: 'Kelvin (K)' }
            }
        },
        medical: {
            name: '🩸 Đường Huyết',
            base: 'mmol',
            units: {
                'mmol': { name: 'mmol/L', factor: 1 },
                'mg': { name: 'mg/dL', factor: 1 / 18 } // Công thức chuẩn y tế
            }
        },
        data: {
            name: '💾 Dữ Liệu',
            base: 'b',
            units: {
                'b': { name: 'Byte (B)', factor: 1 },
                'kb': { name: 'Kilobyte (KB)', factor: 1024 },
                'mb': { name: 'Megabyte (MB)', factor: Math.pow(1024, 2) },
                'gb': { name: 'Gigabyte (GB)', factor: Math.pow(1024, 3) },
                'tb': { name: 'Terabyte (TB)', factor: Math.pow(1024, 4) }
            }
        }
    };

    let currentCategory = 'length';

    // RENDER TABS
    function initTabs() {
        tabContainer.innerHTML = '';
        for (let key in unitCategories) {
            const btn = document.createElement('div');
            btn.className = `tab-btn ${key === currentCategory ? 'active' : ''}`;
            btn.innerText = unitCategories[key].name;
            btn.onclick = () => {
                currentCategory = key;
                initTabs();
                initSelect();
                calculate();
            };
            tabContainer.appendChild(btn);
        }
    }

    // RENDER DROPDOWN
    function initSelect() {
        sourceUnit.innerHTML = '';
        const units = unitCategories[currentCategory].units;
        for (let key in units) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = units[key].name;
            sourceUnit.appendChild(opt);
        }
    }

    // PARSER XỬ LÝ PHÂN SỐ (VD: 1 1/2) KHÔNG DÙNG EVAL BẢO MẬT
    function parseInput(valStr) {
        valStr = valStr.trim().replace(/,/g, '.'); // Chấp nhận dấu phẩy VN
        if (!valStr) return 0;
        
        if (!isNaN(valStr)) return parseFloat(valStr);

        let parts = valStr.split(/\s+/);
        let total = 0;
        for (let part of parts) {
            if (part.includes('/')) {
                let [num, den] = part.split('/');
                if (!isNaN(num) && !isNaN(den) && parseFloat(den) !== 0) {
                    total += parseFloat(num) / parseFloat(den);
                }
            } else if (!isNaN(part)) {
                total += parseFloat(part);
            } else {
                return NaN;
            }
        }
        return total;
    }

    // FORMAT SỐ ĐẸP MẮT (Bỏ số 0 thừa, không dùng e notation nếu không cần thiết)
    function formatNumber(num) {
        if (isNaN(num)) return "Lỗi Input";
        // Nếu số nguyên thì trả về luôn
        if (Number.isInteger(num)) return num.toLocaleString('en-US');
        
        // Nếu số thập phân, làm tròn tối đa 6 số nhưng bỏ số 0 thừa
        let str = parseFloat(num.toFixed(6)).toString();
        // Lấy lại định dạng có dấu phẩy hàng nghìn nếu số lớn
        let parts = str.split('.');
        parts[0] = parseInt(parts[0]).toLocaleString('en-US');
        return parts.join('.');
    }

    // TÍNH TOÁN & RENDER GRID
    function calculate() {
        const val = parseInput(inputValue.value);
        const source = sourceUnit.value;
        const catData = unitCategories[currentCategory];
        
        resultsContainer.innerHTML = '';
        
        if (isNaN(val)) {
            resultsContainer.innerHTML = `<h3 style="color:red; text-align:center; width:100%;">❌ Vui lòng nhập số hoặc phân số hợp lệ (VD: 1.5 hoặc 1/2)</h3>`;
            return;
        }

        // 1. Chuyển về Base Unit
        let baseVal = 0;
        if (currentCategory === 'temperature') {
            if (source === 'c') baseVal = val;
            if (source === 'f') baseVal = (val - 32) * 5 / 9;
            if (source === 'k') baseVal = val - 273.15;
        } else {
            baseVal = val * catData.units[source].factor;
        }

        // 2. Chuyển từ Base Unit sang các đơn vị khác
        let colorIndex = 0;
        for (let key in catData.units) {
            if (key === source) continue; // Không in lại đơn vị gốc

            let targetVal = 0;
            if (currentCategory === 'temperature') {
                if (key === 'c') targetVal = baseVal;
                if (key === 'f') targetVal = baseVal * 9 / 5 + 32;
                if (key === 'k') targetVal = baseVal + 273.15;
            } else {
                targetVal = baseVal / catData.units[key].factor;
            }

            const formattedVal = formatNumber(targetVal);
            const bgColor = cardColors[colorIndex % cardColors.length];
            colorIndex++;

            // TẠO THẺ CARD
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.backgroundColor = bgColor;
            card.innerHTML = `
                <div>
                    <div class="card-unit-name">${catData.units[key].name}</div>
                    <div class="card-value">${formattedVal}</div>
                </div>
                <div class="card-actions">
                    <button class="btn-card copy-btn" data-val="${targetVal}">📋 Copy</button>
                    <button class="btn-card swap-btn" data-key="${key}" data-val="${targetVal}">🔄 Đảo Lên</button>
                </div>
            `;
            resultsContainer.appendChild(card);
        }

        // 3. Gắn sự kiện cho các nút trong Card
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.onclick = (e) => {
                const textToCopy = e.target.getAttribute('data-val');
                copyToClipboard(textToCopy);
            };
        });

        document.querySelectorAll('.swap-btn').forEach(btn => {
            btn.onclick = (e) => {
                const newSourceKey = e.target.getAttribute('data-key');
                // Format thành chuỗi số nguyên hoặc thập phân tối đa 6 số để đưa lên Input
                const newVal = parseFloat(parseFloat(e.target.getAttribute('data-val')).toFixed(6));
                
                sourceUnit.value = newSourceKey;
                inputValue.value = newVal;
                calculate(); // Tính lại với base mới
            };
        });
    }

    function copyToClipboard(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast();
    }

    function showToast() {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2000);
    }

    // Gắn sự kiện lắng nghe Input & Select thay đổi
    inputValue.addEventListener('input', calculate);
    sourceUnit.addEventListener('change', calculate);

    // Khởi động
    initTabs();
    initSelect();
    calculate();
});