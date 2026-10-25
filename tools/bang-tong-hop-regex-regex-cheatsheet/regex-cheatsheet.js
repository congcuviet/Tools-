document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DATABASE REGEX (ĐÃ BỔ SUNG CÁC TÍNH NĂNG NÂNG CAO) ---
    const regexDatabase = [
        {
            category: "🔤 Ký tự cơ bản",
            items: [
                { cmd: ".", desc: "Khớp với BẤT KỲ ký tự nào, ngoại trừ ký tự xuống dòng (Newline).", search: "bat ky ki tu any dot cham" },
                { cmd: "\\d", desc: "Khớp với 1 chữ số (Tương đương [0-9]).", search: "chu so digit number" },
                { cmd: "\\D", desc: "Khớp với ký tự KHÔNG PHẢI là số (Tương đương [^0-9]).", search: "khong phai so non-digit" },
                { cmd: "\\w", desc: "Khớp với chữ cái, số, hoặc dấu gạch dưới (Tương đương [A-Za-z0-9_]).", search: "chu cai word alphabet" },
                { cmd: "\\W", desc: "Khớp với ký tự KHÔNG PHẢI chữ/số/gạch dưới (Ký tự đặc biệt).", search: "khong phai chu cai ky tu dac biet" },
                { cmd: "\\s", desc: "Khớp với 1 khoảng trắng (Space, Tab, Newline).", search: "khoang trang space whitespace tab" },
                { cmd: "\\S", desc: "Khớp với ký tự KHÔNG PHẢI khoảng trắng.", search: "khong phai khoang trang non-whitespace" }
            ]
        },
        {
            category: "📦 Tập hợp (Character Set)",
            items: [
                { cmd: "[xyz]", desc: "Khớp với 1 ký tự bất kỳ nằm trong ngoặc (x, y, hoặc z).", search: "tap hop ky tu set trong ngoac" },
                { cmd: "[^xyz]", desc: "Phủ định: Khớp với ký tự KHÔNG nằm trong ngoặc.", search: "phu dinh ngoai tru not in" },
                { cmd: "[a-z]", desc: "Khớp với 1 chữ cái in thường từ a đến z.", search: "chu thuong lowercase" },
                { cmd: "[A-Z]", desc: "Khớp với 1 chữ cái IN HOA từ A đến Z.", search: "chu hoa uppercase" },
                { cmd: "[0-9]", desc: "Khớp với 1 chữ số từ 0 đến 9.", search: "chu so tu 0 den 9" }
            ]
        },
        {
            category: "🔢 Định lượng (Quantifiers)",
            items: [
                { cmd: "*", desc: "Xuất hiện 0 hoặc NHIỀU lần (Tham lam).", search: "0 hoac nhieu lan asterisk sao" },
                { cmd: "+", desc: "Xuất hiện 1 hoặc NHIỀU lần (Tham lam).", search: "1 hoac nhieu lan plus cong" },
                { cmd: "?", desc: "Xuất hiện 0 hoặc 1 lần (Có thể có hoặc không).", search: "0 hoac 1 lan hoi cham optional" },
                { cmd: "{n}", desc: "Xuất hiện CHÍNH XÁC n lần.", search: "chinh xac n lan exact" },
                { cmd: "{n,}", desc: "Xuất hiện ÍT NHẤT n lần.", search: "it nhat n lan at least" },
                { cmd: "{n,m}", desc: "Xuất hiện từ n đến m lần.", search: "tu n den m lan range" },
                { cmd: "*?", desc: "(Nâng cao) Giống dấu *, nhưng khớp ÍT NHẤT CÓ THỂ (Lười biếng / Lazy).", search: "luoi bieng it nhat lazy non-greedy" },
                { cmd: "+?", desc: "(Nâng cao) Giống dấu +, nhưng khớp ÍT NHẤT CÓ THỂ (Lười biếng / Lazy).", search: "luoi bieng it nhat lazy non-greedy" }
            ]
        },
        {
            category: "🚧 Ranh giới (Boundaries)",
            items: [
                { cmd: "^", desc: "Khớp với BẮT ĐẦU của một chuỗi hoặc một dòng.", search: "bat dau chuoi start of string" },
                { cmd: "$", desc: "Khớp với KẾT THÚC của một chuỗi hoặc một dòng.", search: "ket thuc chuoi end of string" },
                { cmd: "\\b", desc: "Ranh giới từ (Giữa 1 ký tự chữ \\w và 1 ký tự không phải chữ \\W).", search: "ranh gioi tu word boundary" },
                { cmd: "\\B", desc: "(Bổ sung) KHÔNG PHẢI ranh giới từ.", search: "khong phai ranh gioi tu non-word boundary" }
            ]
        },
        {
            category: "👁️ Lookaround (Điều kiện)",
            items: [
                { cmd: "x|y", desc: "Toán tử HOẶC (Khớp x hoặc y).", search: "toan tu hoac or" },
                { cmd: "x(?=y)", desc: "Positive Lookahead: Khớp 'x' CHỈ KHI có 'y' theo sau.", search: "lookahead positive theo sau" },
                { cmd: "x(?!y)", desc: "Negative Lookahead: Khớp 'x' CHỈ KHI KHÔNG CÓ 'y' theo sau.", search: "lookahead negative khong theo sau" },
                { cmd: "(?<=y)x", desc: "Positive Lookbehind: Khớp 'x' CHỈ KHI có 'y' đi đằng trước.", search: "lookbehind positive phia truoc" },
                { cmd: "(?<!y)x", desc: "Negative Lookbehind: Khớp 'x' CHỈ KHI KHÔNG CÓ 'y' đi đằng trước.", search: "lookbehind negative khong phia truoc" }
            ]
        },
        {
            category: "📦 Nhóm (Grouping & Capturing)",
            items: [
                { cmd: "(x)", desc: "Capturing Group: Gom nhóm và LƯU LẠI kết quả khớp (Truy xuất bằng \\1, \\2...).", search: "nhom luu lai group capturing" },
                { cmd: "(?:x)", desc: "Non-capturing Group: Gom nhóm nhưng KHÔNG lưu lại kết quả (Tối ưu hiệu suất).", search: "nhom khong luu non-capturing" },
                { cmd: "\\1", desc: "Backreference: Gọi lại kết quả đã khớp của Capturing Group số 1.", search: "goi lai backreference" },
                { cmd: "(?<name>x)", desc: "(Bổ sung ES2018) Named Group: Gom nhóm và đặt tên biến cho kết quả.", search: "nhom co ten named group ES2018" }
            ]
        },
        {
            category: "🚩 Các cờ (Flags / Modifiers)",
            items: [
                { cmd: "g", desc: "Global: Tìm kiếm toàn bộ chuỗi (Không dừng lại ở kết quả đầu tiên).", search: "toan cuc tat ca global flag" },
                { cmd: "i", desc: "Ignore Case: Không phân biệt chữ hoa / chữ thường.", search: "khong phan biet hoa thuong ignore case flag" },
                { cmd: "m", desc: "Multiline: Các ký tự ^ và $ sẽ hoạt động trên TỪNG DÒNG.", search: "nhieu dong multiline flag" },
                { cmd: "s", desc: "DotAll: Cho phép ký tự dấu chấm (.) khớp luôn cả dấu xuống dòng \\n.", search: "dotall cham xuong dong flag" }
            ]
        }
    ];

    // --- KHAI BÁO DOM ---
    const container = document.getElementById('rgxc-container');
    const searchInput = document.getElementById('rgxc-search-input');
    const btnClear = document.getElementById('rgxc-btn-clear');
    const noResultBox = document.getElementById('rgxc-no-result');

    // --- 2. HÀM RENDER DỮ LIỆU RA HTML ---
    function renderCheatsheet(filterText = "") {
        container.innerHTML = ""; // Xóa dữ liệu cũ
        let hasVisibleItem = false;
        const lowerFilter = filterText.toLowerCase();

        regexDatabase.forEach(cat => {
            // Lọc các items phù hợp với từ khóa
            const filteredItems = cat.items.filter(item => {
                return item.cmd.toLowerCase().includes(lowerFilter) || 
                       item.desc.toLowerCase().includes(lowerFilter) || 
                       item.search.toLowerCase().includes(lowerFilter);
            });

            // Nếu danh mục này có kết quả thì render
            if (filteredItems.length > 0) {
                hasVisibleItem = true;

                // Tạo Card danh mục
                const card = document.createElement('div');
                card.className = 'rgxc-category-card';

                // Tiêu đề danh mục
                const title = document.createElement('h3');
                title.className = 'rgxc-category-title';
                title.innerText = cat.category;
                card.appendChild(title);

                // Danh sách lệnh
                const list = document.createElement('div');
                list.className = 'rgxc-cmd-list';

                filteredItems.forEach(item => {
                    const cmdBox = document.createElement('div');
                    cmdBox.className = 'rgxc-cmd-item';
                    
                    cmdBox.innerHTML = `
                        <div class="rgxc-cmd-header">
                            <span class="rgxc-cmd-code">${item.cmd}</span>
                            <button class="rgxc-btn-copy-cmd" data-cmd="${item.cmd}">📋 COPY</button>
                        </div>
                        <p class="rgxc-cmd-desc">${item.desc}</p>
                    `;
                    list.appendChild(cmdBox);
                });

                card.appendChild(list);
                container.appendChild(card);
            }
        });

        // Bật/tắt thông báo
        if (!hasVisibleItem) {
            noResultBox.style.display = 'block';
        } else {
            noResultBox.style.display = 'none';
        }

        attachCopyEvents();
    }

    // --- 3. HÀM XỬ LÝ NÚT COPY ---
    function attachCopyEvents() {
        const copyBtns = document.querySelectorAll('.rgxc-btn-copy-cmd');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                const cmdText = this.getAttribute('data-cmd');
                try {
                    await navigator.clipboard.writeText(cmdText);
                    
                    const originalText = this.innerText;
                    const originalBg = this.style.background;
                    const originalColor = this.style.color;
                    
                    this.innerText = '✅ ĐÃ COPY';
                    this.style.background = 'var(--clr-green)';
                    this.style.color = '#111';
                    
                    setTimeout(() => {
                        this.innerText = originalText;
                        this.style.background = originalBg;
                        this.style.color = originalColor;
                    }, 1200);
                } catch (err) {
                    alert("Trình duyệt không hỗ trợ copy tự động!");
                }
            });
        });
    }

    // --- 4. LẮNG NGHE TÌM KIẾM ---
    searchInput.addEventListener('input', function() {
        renderCheatsheet(this.value);
    });

    btnClear.addEventListener('click', () => {
        searchInput.value = "";
        renderCheatsheet();
        searchInput.focus();
    });

    // --- 5. KHỞI CHẠY LẦN ĐẦU ---
    renderCheatsheet();
});