document.addEventListener('DOMContentLoaded', function() {
    const bases = ['U', 'C', 'A', 'G'];
    
    // Từ điển Hóa Sinh: Chứa Tên, Ký hiệu và Phân loại (để tô màu)
    const aaDict = {
        'Phe': { name: 'Phenylalanine', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Leu': { name: 'Leucine', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Ile': { name: 'Isoleucine', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Met': { name: 'Methionine (Mã mở đầu)', type: 'type-start', typeName: 'Mã Mở Đầu / Không phân cực' },
        'Val': { name: 'Valine', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Ser': { name: 'Serine', type: 'type-polar', typeName: 'Phân cực' },
        'Pro': { name: 'Proline', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Thr': { name: 'Threonine', type: 'type-polar', typeName: 'Phân cực' },
        'Ala': { name: 'Alanine', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Tyr': { name: 'Tyrosine', type: 'type-polar', typeName: 'Phân cực' },
        'STOP': { name: 'Mã Kết Thúc (Stop Codon)', type: 'type-stop', typeName: 'Ngừng dịch mã' },
        'His': { name: 'Histidine', type: 'type-basic', typeName: 'Bazơ (+)' },
        'Gln': { name: 'Glutamine', type: 'type-polar', typeName: 'Phân cực' },
        'Asn': { name: 'Asparagine', type: 'type-polar', typeName: 'Phân cực' },
        'Lys': { name: 'Lysine', type: 'type-basic', typeName: 'Bazơ (+)' },
        'Asp': { name: 'Aspartic Acid', type: 'type-acidic', typeName: 'Axit (-)' },
        'Glu': { name: 'Glutamic Acid', type: 'type-acidic', typeName: 'Axit (-)' },
        'Cys': { name: 'Cysteine', type: 'type-polar', typeName: 'Phân cực' },
        'Trp': { name: 'Tryptophan', type: 'type-nonpolar', typeName: 'Không phân cực' },
        'Arg': { name: 'Arginine', type: 'type-basic', typeName: 'Bazơ (+)' },
        'Gly': { name: 'Glycine', type: 'type-nonpolar', typeName: 'Không phân cực' }
    };

    // Hàm xác định Axit Amin từ bộ ba
    function getAminoAcid(c1, c2, c3) {
        let codon = c1 + c2 + c3;
        if (codon === 'AUG') return 'Met';
        if (codon === 'UAA' || codon === 'UAG' || codon === 'UGA') return 'STOP';
        
        if (c1 === 'U') {
            if (c2 === 'U') return (c3 === 'U' || c3 === 'C') ? 'Phe' : 'Leu';
            if (c2 === 'C') return 'Ser';
            if (c2 === 'A') return (c3 === 'U' || c3 === 'C') ? 'Tyr' : 'STOP'; // Dù đã bắt STOP ở trên nhưng cứ để nguyên logic
            if (c2 === 'G') return (c3 === 'U' || c3 === 'C') ? 'Cys' : (c3 === 'A' ? 'STOP' : 'Trp');
        }
        if (c1 === 'C') {
            if (c2 === 'U') return 'Leu';
            if (c2 === 'C') return 'Pro';
            if (c2 === 'A') return (c3 === 'U' || c3 === 'C') ? 'His' : 'Gln';
            if (c2 === 'G') return 'Arg';
        }
        if (c1 === 'A') {
            if (c2 === 'U') return (c3 === 'G') ? 'Met' : 'Ile';
            if (c2 === 'C') return 'Thr';
            if (c2 === 'A') return (c3 === 'U' || c3 === 'C') ? 'Asn' : 'Lys';
            if (c2 === 'G') return (c3 === 'U' || c3 === 'C') ? 'Ser' : 'Arg';
        }
        if (c1 === 'G') {
            if (c2 === 'U') return 'Val';
            if (c2 === 'C') return 'Ala';
            if (c2 === 'A') return (c3 === 'U' || c3 === 'C') ? 'Asp' : 'Glu';
            if (c2 === 'G') return 'Gly';
        }
        return 'Unknown';
    }

    // 1. RENDER BẢNG 64 Ô TỰ ĐỘNG (DOM Manipulation)
    const tableEl = document.getElementById('main-codon-table');
    let tableHTML = `<tr><th>Nhất \\ Nhì</th>`;
    bases.forEach(b => tableHTML += `<th>${b}</th>`);
    tableHTML += `</tr>`;

    bases.forEach(b1 => {
        tableHTML += `<tr><th class="th-side">${b1}</th>`;
        bases.forEach(b2 => {
            tableHTML += `<td><div class="codon-block">`;
            bases.forEach(b3 => {
                let aaAbbr = getAminoAcid(b1, b2, b3);
                let aaClass = aaDict[aaAbbr].type;
                tableHTML += `
                    <div class="c-item ${aaClass}" data-codon="${b1}${b2}${b3}" data-aa="${aaAbbr}">
                        <span class="c-triplet">${b1}${b2}${b3}</span>
                        <span class="c-aa">${aaAbbr}</span>
                    </div>`;
            });
            tableHTML += `</div></td>`;
        });
        tableHTML += `</tr>`;
    });
    tableEl.innerHTML = tableHTML;

    // 2. SỰ KIỆN HOVER VÀO Ô TRONG BẢNG (Interactive Element)
    const hoverBox = document.getElementById('hover-detail-box');
    const cItems = document.querySelectorAll('.c-item');
    
    cItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            let triplet = this.getAttribute('data-codon');
            let aaAbbr = this.getAttribute('data-aa');
            let info = aaDict[aaAbbr];

            hoverBox.innerHTML = `
                <div class="hd-content">
                    <div class="hd-triplet ${info.type}">${triplet}</div>
                    <div class="hd-info">
                        <div class="hd-name">${info.name}</div>
                        <div class="hd-prop ${info.type}">${info.typeName}</div>
                    </div>
                </div>
            `;
        });
        
        // Mobile hỗ trợ Click thay vì Hover
        item.addEventListener('click', function() {
            let triplet = this.getAttribute('data-codon');
            let aaAbbr = this.getAttribute('data-aa');
            let info = aaDict[aaAbbr];

            hoverBox.innerHTML = `
                <div class="hd-content">
                    <div class="hd-triplet ${info.type}">${triplet}</div>
                    <div class="hd-info">
                        <div class="hd-name">${info.name}</div>
                        <div class="hd-prop ${info.type}">${info.typeName}</div>
                    </div>
                </div>
            `;
            // Cuộn xuống nhẹ trên mobile
            if (window.innerWidth <= 800) {
                hoverBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // 3. LOGIC TAB CHẾ ĐỘ
    const modeRadios = document.querySelectorAll('input[name="codon-mode"]');
    const secTable = document.getElementById('mode-table');
    const secLookup = document.getElementById('mode-lookup');

    modeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'table') {
                secTable.style.display = 'block';
                secLookup.style.display = 'none';
            } else {
                secTable.style.display = 'none';
                secLookup.style.display = 'block';
            }
        });
    });

    // 4. CHẾ ĐỘ TRA CỨU NHANH
    
    // Đổ dữ liệu 20 Axit Amin vào Select Tra ngược
    const selAA = document.getElementById('sel-aa');
    // Sắp xếp Select theo Alphabet
    let sortedAA = Object.keys(aaDict).sort();
    sortedAA.forEach(abbr => {
        let opt = document.createElement('option');
        opt.value = abbr;
        opt.text = `${aaDict[abbr].name} (${abbr})`;
        selAA.add(opt);
    });

    // Sự kiện Nút Tra Xuôi (Nu -> AA)
    document.getElementById('btn-forward').addEventListener('click', function() {
        let n1 = document.getElementById('sel-nu1').value;
        let n2 = document.getElementById('sel-nu2').value;
        let n3 = document.getElementById('sel-nu3').value;
        
        let abbr = getAminoAcid(n1, n2, n3);
        let info = aaDict[abbr];
        
        const resBox = document.getElementById('res-forward');
        resBox.innerHTML = `
            <div class="qr-title">Kết quả dịch mã của [${n1}${n2}${n3}]</div>
            <div class="qr-val" style="color: #111;">${info.name}</div>
            <div class="hd-prop ${info.type}" style="margin-top: 5px;">${info.typeName}</div>
        `;
        resBox.style.display = 'block';
    });

    // Sự kiện Nút Tra Ngược (AA -> Nu)
    document.getElementById('btn-reverse').addEventListener('click', function() {
        let targetAA = selAA.value;
        let matchingCodons = [];
        
        // Quét toàn bộ 64 bộ ba để gom các bộ ba mã hóa cho targetAA
        bases.forEach(b1 => {
            bases.forEach(b2 => {
                bases.forEach(b3 => {
                    if (getAminoAcid(b1, b2, b3) === targetAA) {
                        matchingCodons.push(b1 + b2 + b3);
                    }
                });
            });
        });

        const resBox = document.getElementById('res-reverse');
        let htmlTags = "";
        let info = aaDict[targetAA];

        matchingCodons.forEach(c => {
            htmlTags += `<span class="l-badge ${info.type}">${c}</span>`;
        });

        resBox.innerHTML = `
            <div class="qr-title">Có <strong>${matchingCodons.length}</strong> bộ ba mã hóa cho ${info.name}:</div>
            <div class="qr-tags">${htmlTags}</div>
        `;
        resBox.style.display = 'block';
    });
});