document.addEventListener('DOMContentLoaded', () => {
    const ptGrid = document.getElementById('periodicGrid');
    const ptLoader = document.getElementById('ptLoader');
    const ptDetailsArea = document.getElementById('elementDetailsArea');
    const tooltip = document.getElementById('elTooltip');
    const toastPt = document.getElementById('toastPt');

    let elementsDB = [];
    let substancesDB = null;
    let equationsDB = null;

    const colorMap = {
        "Phi kim": "#a6ff96", "Khí hiếm": "#c6e2ff", "Kim loại kiềm": "#ffb3ba",
        "Kim loại kiềm thổ": "#ffdfba", "Á kim": "#ffffba", "Kim loại yếu": "#baffc9",
        "Kim loại chuyển tiếp": "#f0c2e0", "Họ Lantan": "#e0bbe4", "Họ Actini": "#e0bbe4", "Chưa rõ": "#e0e0e0"
    };

    const groupLabels = ["IA", "IIA", "IIIB", "IVB", "VB", "VIB", "VIIB", "VIIIB", "VIIIB", "VIIIB", "IB", "IIB", "IIIA", "IVA", "VA", "VIA", "VIIA", "VIIIA"];
    const basePath = '/wp-content/themes/bricks-child/tai-nguyen/';

    // ==========================================
    // 1. GIAI ĐOẠN 1: TẢI BẢNG TUẦN HOÀN TỨC THÌ (CACHE)
    // ==========================================
    const loadElementsGrid = async () => {
        const cachedData = sessionStorage.getItem('cachedElementsDB');
        if (cachedData) {
            elementsDB = JSON.parse(cachedData);
            initGrid();
        } else {
            try {
                const res = await fetch(basePath + 'elements_db.json');
                elementsDB = await res.json();
                sessionStorage.setItem('cachedElementsDB', JSON.stringify(elementsDB));
                initGrid();
            } catch (err) {
                console.error("Lỗi tải Bảng tuần hoàn:", err);
                ptLoader.innerHTML = "<p style='color:red;'>❌ Lỗi tải dữ liệu. Vui lòng tải lại trang!</p>";
            }
        }
    };

    const initGrid = () => {
        renderPeriodicGrid();
        // Ép cứng CSS nội tuyến để tắt hoàn toàn vòng xoay Loading
        ptLoader.style.display = 'none'; 
        ptGrid.classList.remove('hidden');
    };

    // Khởi chạy lập tức
    loadElementsGrid();

    // ==========================================
    // 2. GIAI ĐOẠN 2: TẢI NGẦM DỮ LIỆU CHẤT & PT
    // ==========================================
    let extraDataPromise = Promise.all([
        fetch(basePath + 'substances_db.json').then(res => res.json()).catch(() => ({})),
        fetch(basePath + 'equations_db_cleaned.json').then(res => res.json()).catch(() => [])
    ]).then(([subData, eqData]) => {
        substancesDB = subData;
        equationsDB = eqData;
        console.log("✅ Đã tải ngầm xong Dữ liệu Chi tiết.");
    });

    // ==========================================
    // VẼ BẢNG TUẦN HOÀN & GẮN SỰ KIỆN HOVER
    // ==========================================
    const renderPeriodicGrid = () => {
        ptGrid.innerHTML = '';
        
        groupLabels.forEach((label, index) => {
            let headerCol = document.createElement('div');
            headerCol.className = 'pt-header-col';
            headerCol.style.gridRow = 1; headerCol.style.gridColumn = index + 2;
            headerCol.innerText = label; ptGrid.appendChild(headerCol);
        });

        for (let i = 1; i <= 7; i++) {
            let headerRow = document.createElement('div');
            headerRow.className = 'pt-header-row';
            headerRow.style.gridRow = i + 1; headerRow.style.gridColumn = 1;
            headerRow.innerText = i; ptGrid.appendChild(headerRow);
        }

        let hoverTimeout;

        elementsDB.forEach(el => {
            let cell = document.createElement('div');
            cell.className = 'pt-cell';
            cell.style.backgroundColor = colorMap[el.category] || "#eee";

            let col = el.group; let row = el.period;
            let gridCol = col ? col + 1 : null; let gridRow = row ? row + 1 : null;

            if (el.number >= 57 && el.number <= 71) { gridRow = 10; gridCol = (el.number - 57) + 4; } 
            else if (el.number >= 89 && el.number <= 103) { gridRow = 11; gridCol = (el.number - 89) + 4; }

            if (gridCol && gridRow) { cell.style.gridColumn = gridCol; cell.style.gridRow = gridRow; }

            cell.innerHTML = `
                <div class="pt-num">${el.number}</div>
                <div class="pt-sym">${el.symbol}</div>
                <div class="pt-mass">${el.atomic_mass ? parseFloat(el.atomic_mass).toFixed(2) : ''}</div>
            `;

            // --- SỰ KIỆN HOVER TOOLTIP ---
            cell.addEventListener('mouseenter', (e) => {
                hoverTimeout = setTimeout(() => showTooltip(el, e), 200);
            });
            cell.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = e.clientY + 'px';
            });
            cell.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                tooltip.classList.remove('visible');
            });

            // --- SỰ KIỆN CLICK CHI TIẾT ---
            cell.addEventListener('click', () => {
                document.querySelectorAll('.pt-cell').forEach(c => c.classList.remove('active'));
                cell.classList.add('active');
                tooltip.classList.remove('visible');
                renderElementDetails(el);
            });

            ptGrid.appendChild(cell);
        });
    };

    const showTooltip = (el, e) => {
        tooltip.innerHTML = `
            <h4>${el.name_en}</h4>
            <p>Khối lượng: <b>${el.atomic_mass}</b></p>
            <p>Trạng thái: <b>${el.phase}</b></p>
            <p>Độ âm điện: <b>${el.electronegativity}</b></p>
        `;
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = e.clientY + 'px';
        tooltip.classList.add('visible');
    };

    // ==========================================
    // RENDER CHI TIẾT KHI CLICK (ĐỒNG BỘ PROMISE)
    // ==========================================
    const renderElementDetails = (el) => {
        let html = `
            <div class="el-card" style="border-top-color: ${colorMap[el.category]}; border-top-width: 8px;">
                <div class="el-card-header">
                    <div class="el-card-sym">${el.symbol}</div>
                    <div class="el-card-title">
                        <h3>${el.name_en} (${el.category})</h3>
                        <p>Số hiệu nguyên tử (Z): ${el.number}</p>
                    </div>
                </div>
                <div class="el-info-grid">
                    <div class="el-info-item">⚖️ Khối lượng: <b>${el.atomic_mass}</b></div>
                    <div class="el-info-item">🧊 Trạng thái: <b>${el.phase}</b></div>
                    <div class="el-info-item">🎯 Độ âm điện: <b>${el.electronegativity}</b></div>
                    <div class="el-info-item">⚛️ Cấu hình e: <b>${el.electron_config}</b></div>
                </div>
                <p style="margin-top: 15px; font-style: italic; font-weight: 600; color: #555;">💡 ${el.summary}</p>
            </div>
            
            <div id="extraDataZone_${el.symbol}">
                <div class="link-section"><div class="link-loading">⏳ Đang tải dữ liệu Hợp chất & Phương trình...</div></div>
            </div>
        `;

        ptDetailsArea.innerHTML = html;
        ptDetailsArea.classList.remove('hidden');

        // Cuộn màn hình xuống vùng chi tiết
        ptDetailsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

        extraDataPromise.then(() => {
            renderRelatedLinks(el);
        });
    };

    const renderRelatedLinks = (el) => {
        const extraZone = document.getElementById(`extraDataZone_${el.symbol}`);
        if (!extraZone) return;

        let regex = new RegExp(el.symbol + "(?![a-z])", "g");
        let relatedSubs = [];
        let relatedEqs = [];

        for (let key in substancesDB) {
            let sub = substancesDB[key];
            if (sub.formula && regex.test(sub.formula.replace(/<\/?[^>]+(>|$)/g, ""))) {
                relatedSubs.push(sub);
                if (relatedSubs.length >= 10) break;
            }
        }

        for (let eq of equationsDB) {
            if (eq.equation_raw && regex.test(eq.equation_raw.replace(/\s+/g, ''))) {
                relatedEqs.push(eq.equation_raw);
                if (relatedEqs.length >= 10) break;
            }
        }

        const formatFormula = (f) => f.replace(/\d+/g, '<sub>$&</sub>');
        let extraHtml = '';

        if (relatedSubs.length > 0) {
            extraHtml += `<div class="link-section" style="background:#b5ead7;">
                        <h4>📦 Hợp chất tiêu biểu chứa ${el.symbol}</h4>
                        <ul class="link-list">`;
            relatedSubs.forEach(s => {
                let nameStr = s.name ? ` - ${s.name}` : '';
                extraHtml += `<li><span><span class="link-form">${s.formula}</span>${nameStr}</span> <button class="btn-copy-pt" data-copy="${s.formula.replace(/<\/?[^>]+(>|$)/g, "")}">Copy</button></li>`;
            });
            extraHtml += `</ul></div>`;
        }

        if (relatedEqs.length > 0) {
            extraHtml += `<div class="link-section" style="background:#ffdac1;">
                        <h4>🔄 Phương trình phản ứng chứa ${el.symbol}</h4>
                        <ul class="link-list">`;
            relatedEqs.forEach(eq => {
                let niceEq = formatFormula(eq).replace(/=|->/g, '<span style="color:#000;margin:0 10px;">➔</span>');
                extraHtml += `<li><span class="eq-format-text">${niceEq}</span> <button class="btn-copy-pt" data-copy="${eq}">Copy</button></li>`;
            });
            extraHtml += `</ul></div>`;
        }

        if(extraHtml === '') {
            extraHtml = `<div class="link-section" style="background:#f4f4f4;">
                            <p style="margin:0; font-weight:bold; color:#666; text-align:center;">Không tìm thấy hợp chất hoặc phản ứng phổ biến nào trong dữ liệu.</p>
                         </div>`;
        }

        extraZone.innerHTML = extraHtml;

        document.querySelectorAll('.btn-copy-pt').forEach(btn => {
            btn.addEventListener('click', (e) => copyText(e.target.getAttribute('data-copy')));
        });
    };

    const copyText = (text) => {
        if (!text) return;
        const copyHandler = (e) => { e.clipboardData.setData('text/plain', text); e.preventDefault(); };
        document.addEventListener('copy', copyHandler);
        try { document.execCommand('copy'); showToast(); } 
        catch (err) {
            const temp = document.createElement('textarea'); temp.value = text;
            document.body.appendChild(temp); temp.select(); document.execCommand('copy'); document.body.removeChild(temp);
            showToast();
        } finally { document.removeEventListener('copy', copyHandler); }
    };

    const showToast = () => { toastPt.classList.add("show"); setTimeout(() => toastPt.classList.remove("show"), 2000); };
});