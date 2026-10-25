document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('solubilityTable');
    const iupacToggle = document.getElementById('iupacToggle');
    const floatingBox = document.getElementById('solFloatingBox');
    const sfFormula = document.getElementById('sfFormula');
    const sfName = document.getElementById('sfName');
    const sfStatus = document.getElementById('sfStatus');

    let isIUPAC = false;

    // ==========================================
    // 1. CƠ SỞ DỮ LIỆU CATION & ANION
    // ==========================================
    // val: Hóa trị | poly: Gốc đa nguyên tử (để đóng ngoặc nếu hóa trị chéo > 1)
    const cations = [
        { id: "H", sym: "H<sup>+</sup>", base: "H", val: 1, poly: false, vi: "Hiđro", en: "Hydrogen" },
        { id: "K", sym: "K<sup>+</sup>", base: "K", val: 1, poly: false, vi: "Kali", en: "Potassium" },
        { id: "Na", sym: "Na<sup>+</sup>", base: "Na", val: 1, poly: false, vi: "Natri", en: "Sodium" },
        { id: "Ag", sym: "Ag<sup>+</sup>", base: "Ag", val: 1, poly: false, vi: "Bạc", en: "Silver" },
        { id: "NH4", sym: "NH<sub>4</sub><sup>+</sup>", base: "NH4", val: 1, poly: true, vi: "Amoni", en: "Ammonium" },
        { id: "Mg", sym: "Mg<sup>2+</sup>", base: "Mg", val: 2, poly: false, vi: "Magie", en: "Magnesium" },
        { id: "Ca", sym: "Ca<sup>2+</sup>", base: "Ca", val: 2, poly: false, vi: "Canxi", en: "Calcium" },
        { id: "Ba", sym: "Ba<sup>2+</sup>", base: "Ba", val: 2, poly: false, vi: "Bari", en: "Barium" },
        { id: "Zn", sym: "Zn<sup>2+</sup>", base: "Zn", val: 2, poly: false, vi: "Kẽm", en: "Zinc" },
        { id: "Fe2", sym: "Fe<sup>2+</sup>", base: "Fe", val: 2, poly: false, vi: "Sắt (II)", en: "Iron (II)" },
        { id: "Pb", sym: "Pb<sup>2+</sup>", base: "Pb", val: 2, poly: false, vi: "Chì", en: "Lead" },
        { id: "Cu", sym: "Cu<sup>2+</sup>", base: "Cu", val: 2, poly: false, vi: "Đồng", en: "Copper" },
        { id: "Fe3", sym: "Fe<sup>3+</sup>", base: "Fe", val: 3, poly: false, vi: "Sắt (III)", en: "Iron (III)" },
        { id: "Al", sym: "Al<sup>3+</sup>", base: "Al", val: 3, poly: false, vi: "Nhôm", en: "Aluminium" }
    ];

    const anions = [
        { id: "OH", sym: "OH<sup>-</sup>", base: "OH", val: 1, poly: true, vi: "Hiđroxit", en: "Hydroxide" },
        { id: "Cl", sym: "Cl<sup>-</sup>", base: "Cl", val: 1, poly: false, vi: "Clorua", en: "Chloride" },
        { id: "Br", sym: "Br<sup>-</sup>", base: "Br", val: 1, poly: false, vi: "Bromua", en: "Bromide" },
        { id: "NO3", sym: "NO<sub>3</sub><sup>-</sup>", base: "NO3", val: 1, poly: true, vi: "Nitrat", en: "Nitrate" },
        { id: "CH3COO", sym: "CH<sub>3</sub>COO<sup>-</sup>", base: "CH3COO", val: 1, poly: true, vi: "Axetat", en: "Acetate", isOrganic: true },
        { id: "S", sym: "S<sup>2-</sup>", base: "S", val: 2, poly: false, vi: "Sunfua", en: "Sulfide" },
        { id: "SO3", sym: "SO<sub>3</sub><sup>2-</sup>", base: "SO3", val: 2, poly: true, vi: "Sunfit", en: "Sulfite" },
        { id: "SO4", sym: "SO<sub>4</sub><sup>2-</sup>", base: "SO4", val: 2, poly: true, vi: "Sunfat", en: "Sulfate" },
        { id: "CO3", sym: "CO<sub>3</sub><sup>2-</sup>", base: "CO3", val: 2, poly: true, vi: "Cacbonat", en: "Carbonate" },
        { id: "SiO3", sym: "SiO<sub>3</sub><sup>2-</sup>", base: "SiO3", val: 2, poly: true, vi: "Silicat", en: "Silicate" },
        { id: "PO4", sym: "PO<sub>4</sub><sup>3-</sup>", base: "PO4", val: 3, poly: true, vi: "Photphat", en: "Phosphate" }
    ];

    // Ma trận dữ liệu: T (Tan), K (Không tan), I (Ít tan), X (Không tồn tại/Bị phân hủy)
    const matrix = {
        "OH": ["X", "T", "T", "X", "T", "X", "I", "K", "K", "K", "K", "K", "K", "K"],
        "Cl": ["T", "T", "T", "K", "T", "T", "T", "T", "T", "T", "I", "T", "T", "T"],
        "Br": ["T", "T", "T", "I", "T", "T", "T", "T", "T", "T", "I", "T", "T", "T"],
        "NO3":["T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T"],
        "CH3COO":["T","T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "X", "X"],
        "S":  ["T", "T", "T", "K", "T", "T", "X", "X", "K", "K", "K", "K", "X", "X"],
        "SO3":["T", "T", "T", "K", "T", "K", "K", "K", "K", "K", "K", "X", "X", "X"],
        "SO4":["T", "T", "T", "I", "T", "K", "I", "T", "T", "T", "K", "T", "T", "T"],
        "CO3":["T", "T", "T", "K", "T", "K", "K", "K", "K", "K", "K", "X", "X", "X"],
        "SiO3":["K","T", "T", "K", "X", "K", "K", "K", "K", "K", "K", "X", "X", "X"],
        "PO4":["T", "T", "T", "K", "T", "K", "K", "K", "K", "K", "K", "K", "K", "K"]
    };

    // Chi tiết trạng thái (Để đưa lên Tooltip)
    const statusDesc = {
        "T": { t: "Dung dịch hòa tan", c: "#a6ff96", b: "badge-t" },
        "K": { t: "Kết tủa (Không tan)", c: "#ffb7b2", b: "badge-k" },
        "I": { t: "Ít tan (Kết tủa một phần)", c: "#fdfd96", b: "badge-i" },
        "X": { t: "Không tồn tại hoặc phân hủy", c: "#e0e0e0", b: "badge-x" }
    };

    // ==========================================
    // 2. THUẬT TOÁN GHÉP CÔNG THỨC HÓA HỌC
    // ==========================================
    const combineFormula = (cat, ani) => {
        // Ưu tiên Axetat: Phần Anion đứng trước (Ví dụ: CH3COONa)
        let isOrg = ani.isOrganic;
        let cVal = cat.val, aVal = ani.val;

        // Rút gọn hóa trị (Tối giản phân số)
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        let d = gcd(cVal, aVal);
        cVal /= d; aVal /= d;

        // Xử lý index (Chỉ số dưới chân)
        let catIndex = aVal > 1 ? (cat.poly ? `(${cat.base})<sub>${aVal}</sub>` : `${cat.base}<sub>${aVal}</sub>`) : cat.base;
        let aniIndex = cVal > 1 ? (ani.poly ? `(${ani.base})<sub>${cVal}</sub>` : `${ani.base}<sub>${cVal}</sub>`) : ani.base;

        // Đặc cách cho nước: H + OH = H2O
        if (cat.id === "H" && ani.id === "OH") return "H<sub>2</sub>O";

        if (isOrg) return aniIndex + catIndex;
        return catIndex + aniIndex;
    };

    // ==========================================
    // 3. RENDER BẢNG (GRID)
    // ==========================================
    const renderTable = () => {
        tableBody.innerHTML = '';
        
        // --- HÀNG TIÊU ĐỀ CATION (CỘT NGANG) ---
        let thead = document.createElement('thead');
        let headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th style="background:#ffdac1;">Ion</th>`;
        cations.forEach((cat, colIdx) => {
            let th = document.createElement('th');
            th.innerHTML = `${cat.sym}<br><span style="font-size:0.8rem; font-weight:600; color:#555" class="iupac-text">${isIUPAC ? cat.en : cat.vi}</span>`;
            th.dataset.col = colIdx;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        tableBody.appendChild(thead);

        // --- CÁC HÀNG ANION (BODY) ---
        let tbody = document.createElement('tbody');
        anions.forEach((ani, rowIdx) => {
            let tr = document.createElement('tr');
            
            // Cột cố định trái (Anion)
            let thAni = document.createElement('th');
            thAni.innerHTML = `${ani.sym}<br><span style="font-size:0.8rem; font-weight:600; color:#555" class="iupac-text">${isIUPAC ? ani.en : ani.vi}</span>`;
            tr.appendChild(thAni);

            // Các ô trạng thái
            let rowData = matrix[ani.id];
            cations.forEach((cat, colIdx) => {
                let status = rowData[colIdx];
                let td = document.createElement('td');
                td.innerText = status;
                td.className = statusDesc[status].b;
                td.dataset.row = rowIdx;
                td.dataset.col = colIdx;

                // Gắn sự kiện Hover (Crosshair & Tooltip)
                td.addEventListener('mouseenter', (e) => handleHover(e, cat, ani, status, rowIdx, colIdx));
                td.addEventListener('mouseleave', clearHover);
                
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        tableBody.appendChild(tbody);
    };

    // ==========================================
    // 4. HIỆU ỨNG CROSSHAIR & TOOLTIP
    // ==========================================
    const handleHover = (e, cat, ani, status, rIdx, cIdx) => {
        // Highlight Hàng và Cột
        const table = document.getElementById('solubilityTable');
        const rows = table.getElementsByTagName('tr');
        
        for (let i = 1; i < rows.length; i++) { // Bỏ qua thead
            let cells = rows[i].getElementsByTagName('td');
            if(i - 1 === rIdx) { // Cùng hàng
                for(let c of cells) c.classList.add('crosshair-hl');
            }
            if(cells[cIdx]) cells[cIdx].classList.add('crosshair-hl'); // Cùng cột
        }
        e.target.classList.add('cell-hl');

        // Render Tooltip nổi
        let formulaHtml = combineFormula(cat, ani);
        let nameHtml = isIUPAC ? 
            `${cat.en} ${ani.en.toLowerCase()}` : 
            `${cat.vi} ${ani.vi.toLowerCase()}`;
        
        // Fix tên nước và amoniac khi H+ kết hợp
        if(cat.id === "H" && ani.id === "OH") nameHtml = isIUPAC ? "Water" : "Nước";

        sfFormula.innerHTML = formulaHtml;
        sfName.innerHTML = nameHtml;
        sfStatus.innerHTML = statusDesc[status].t;
        sfStatus.style.backgroundColor = statusDesc[status].c;

        floatingBox.classList.remove('hidden');
    };

    const clearHover = () => {
        document.querySelectorAll('.crosshair-hl').forEach(el => el.classList.remove('crosshair-hl'));
        document.querySelectorAll('.cell-hl').forEach(el => el.classList.remove('cell-hl'));
        floatingBox.classList.add('hidden');
    };

    // Tooltip di chuyển theo chuột
    document.addEventListener('mousemove', (e) => {
        if (!floatingBox.classList.contains('hidden')) {
            floatingBox.style.left = (e.clientX + 15) + 'px';
            floatingBox.style.top = (e.clientY + 15) + 'px';
        }
    });

    // ==========================================
    // 5. SỰ KIỆN TOGGLE IUPAC
    // ==========================================
    iupacToggle.addEventListener('change', (e) => {
        isIUPAC = e.target.checked;
        const labels = document.querySelectorAll('.toggle-label');
        if (isIUPAC) {
            labels[0].classList.remove('active');
            labels[1].classList.add('active');
        } else {
            labels[0].classList.add('active');
            labels[1].classList.remove('active');
        }
        
        // Re-render bảng để cập nhật Text
        renderTable();
    });

    // Khởi chạy
    document.querySelectorAll('.toggle-label')[0].classList.add('active');
    renderTable();
});