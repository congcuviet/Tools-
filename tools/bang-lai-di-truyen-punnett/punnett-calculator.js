document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('punnett-form');
    const inputP1 = document.getElementById('parent1');
    const inputP2 = document.getElementById('parent2');
    const errorBox = document.getElementById('punnett-error');
    const resultBox = document.getElementById('punnett-result');
    const gridTable = document.getElementById('punnett-grid');
    const listGeno = document.getElementById('res-genotypes');
    const listPheno = document.getElementById('res-phenotypes');

    // Logic điền nhanh (Quick Actions)
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            inputP1.value = this.getAttribute('data-p1');
            inputP2.value = this.getAttribute('data-p2');
            errorBox.style.display = 'none';
        });
    });

    // Ép kiểu chữ hoa/thường chuẩn sinh học ngay khi nhập
    function formatInput(val) {
        return val.replace(/[^a-zA-Z]/g, '');
    }
    inputP1.addEventListener('input', e => { e.target.value = formatInput(e.target.value); });
    inputP2.addEventListener('input', e => { e.target.value = formatInput(e.target.value); });

    // Hàm tạo giao tử (Gametes)
    function getGametes(genotype) {
        if (genotype.length === 2) {
            // Lai 1 cặp: Aa -> ['A', 'a']
            return [genotype[0], genotype[1]];
        } else if (genotype.length === 4) {
            // Lai 2 cặp: AaBb -> ['AB', 'Ab', 'aB', 'ab']
            return [
                genotype[0] + genotype[2],
                genotype[0] + genotype[3],
                genotype[1] + genotype[2],
                genotype[1] + genotype[3]
            ];
        }
        return [];
    }

    // Hàm sắp xếp alen ưu tiên Trội đứng trước Lặn (VD: aA -> Aa)
    function sortAllelePair(a, b) {
        let pair = [a, b];
        // Nếu cùng 1 chữ cái, chữ Hoa sẽ đứng trước theo bảng mã ASCII (VD: A trước a)
        pair.sort((x, y) => {
            if (x.toLowerCase() === y.toLowerCase()) {
                return x < y ? -1 : 1; 
            }
            return x.toLowerCase().localeCompare(y.toLowerCase());
        });
        return pair.join('');
    }

    // Kết hợp 2 giao tử tạo thành kiểu gen con
    function combineGametes(g1, g2, isDihybrid) {
        if (!isDihybrid) {
            return sortAllelePair(g1, g2);
        } else {
            // Tách từng gen để sort (VD: A và a, B và b)
            let gene1 = sortAllelePair(g1[0], g2[0]);
            let gene2 = sortAllelePair(g1[1], g2[1]);
            return gene1 + gene2;
        }
    }

    // Xác định kiểu hình (Trội hoàn toàn: AA và Aa -> A, aa -> a)
    function getPhenotype(genotype, isDihybrid) {
        if (!isDihybrid) {
            return genotype[0] === genotype[0].toUpperCase() ? genotype[0].toUpperCase() : genotype[0].toLowerCase();
        } else {
            let p1 = genotype[0] === genotype[0].toUpperCase() ? genotype[0].toUpperCase() : genotype[0].toLowerCase();
            let p2 = genotype[2] === genotype[2].toUpperCase() ? genotype[2].toUpperCase() : genotype[2].toLowerCase();
            return p1 + p2;
        }
    }

    // Rút gọn phân số toán học (VD: 4/16 -> 1/4)
    function getFraction(numerator, denominator) {
        let gcd = function(a, b) {
            if (!b) return a;
            return gcd(b, a % b);
        };
        let divisor = gcd(numerator, denominator);
        return `${numerator/divisor} / ${denominator/divisor}`;
    }

    // Xử lý Form Submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorBox.style.display = 'none';

        let p1 = inputP1.value;
        let p2 = inputP2.value;

        // Validate
        if (p1.length !== p2.length || (p1.length !== 2 && p1.length !== 4)) {
            errorBox.style.display = 'block';
            return;
        }

        const isDihybrid = p1.length === 4;
        const gametes1 = getGametes(p1);
        const gametes2 = getGametes(p2);
        
        let genotypesCount = {};
        let phenotypesCount = {};
        let totalCells = gametes1.length * gametes2.length;

        // VẼ BẢNG VÀ TÍNH TOÁN
        let tableHTML = `<tr><th>P</th>`;
        // Header ngang (Giao tử P2)
        gametes2.forEach(g2 => {
            tableHTML += `<th class="gamete-header">${g2}</th>`;
        });
        tableHTML += `</tr>`;

        // Từng hàng (Giao tử P1)
        gametes1.forEach(g1 => {
            tableHTML += `<tr><th class="gamete-header">${g1}</th>`;
            gametes2.forEach(g2 => {
                let offspring = combineGametes(g1, g2, isDihybrid);
                tableHTML += `<td>${offspring}</td>`;

                // Đếm kiểu gen
                genotypesCount[offspring] = (genotypesCount[offspring] || 0) + 1;
                
                // Đếm kiểu hình
                let pheno = getPhenotype(offspring, isDihybrid);
                phenotypesCount[pheno] = (phenotypesCount[pheno] || 0) + 1;
            });
            tableHTML += `</tr>`;
        });

        // RENDER UI
        gridTable.innerHTML = tableHTML;

        // Render List Kiểu Gen (Sort tỷ lệ giảm dần)
        let genoHTML = '';
        Object.entries(genotypesCount).sort((a,b) => b[1]-a[1]).forEach(([geno, count]) => {
            let fraction = isDihybrid ? `${count}/16` : getFraction(count, totalCells);
            genoHTML += `<li><span>${geno}</span> <span style="color: var(--clr-purple);">${fraction} (${((count/totalCells)*100).toFixed(0)}%)</span></li>`;
        });
        listGeno.innerHTML = genoHTML;

        // Render List Kiểu Hình
        let phenoHTML = '';
        Object.entries(phenotypesCount).sort((a,b) => b[1]-a[1]).forEach(([pheno, count]) => {
            let fraction = isDihybrid ? `${count}/16` : getFraction(count, totalCells);
            phenoHTML += `<li><span>[ ${pheno} ]</span> <span style="color: #ff006e;">${fraction} (${((count/totalCells)*100).toFixed(0)}%)</span></li>`;
        });
        listPheno.innerHTML = phenoHTML;

        // Hưởng ứng Animation
        resultBox.style.display = 'block';
        resultBox.classList.remove('active');
        void resultBox.offsetWidth; 
        resultBox.classList.add('active');
        setTimeout(() => { resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
    });
});