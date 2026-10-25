document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DATABASE LỆNH GIT (DỄ DÀNG THÊM BỚT SAU NÀY) ---
    const gitDatabase = [
        {
            category: "🚀 Khởi tạo & Cấu hình",
            items: [
                { cmd: "git config --global user.name '[name]'", desc: "Cài đặt tên người dùng gắn với các commit.", search: "config name ten nguoi dung" },
                { cmd: "git config --global user.email '[email]'", desc: "Cài đặt email gắn với các commit.", search: "config email" },
                { cmd: "git init", desc: "Khởi tạo một repository Git mới trong thư mục hiện tại.", search: "init khoi tao tao moi" },
                { cmd: "git clone [url]", desc: "Tải toàn bộ một repository từ server (GitHub/GitLab) về máy.", search: "clone tai ve copy" }
            ]
        },
        {
            category: "📸 Trạng thái & Theo dõi",
            items: [
                { cmd: "git status", desc: "Kiểm tra trạng thái các file (đã sửa, đã add, untracked...).", search: "status trang thai kiem tra" },
                { cmd: "git add [file]", desc: "Đưa một file cụ thể vào Staging Area để chuẩn bị commit.", search: "add them file" },
                { cmd: "git add .", desc: "Đưa TẤT CẢ các file thay đổi vào Staging Area.", search: "add all them tat ca" },
                { cmd: "git commit -m '[message]'", desc: "Lưu lại thay đổi (Commit) kèm theo lời nhắn.", search: "commit luu thay doi message" },
                { cmd: "git commit -am '[message]'", desc: "Gộp chung lệnh add tất cả và commit thành 1 bước.", search: "commit add all nhanh" }
            ]
        },
        {
            category: "🌿 Nhánh (Branches)",
            items: [
                { cmd: "git branch", desc: "Liệt kê tất cả các nhánh hiện có ở local.", search: "branch liet ke nhanh" },
                { cmd: "git branch [branch-name]", desc: "Tạo một nhánh mới.", search: "branch tao nhanh moi" },
                { cmd: "git checkout [branch-name]", desc: "Chuyển sang làm việc ở một nhánh khác (Lệnh cũ).", search: "checkout chuyen nhanh" },
                { cmd: "git switch [branch-name]", desc: "Chuyển sang nhánh khác (Lệnh mới, khuyên dùng).", search: "switch chuyen nhanh" },
                { cmd: "git checkout -b [branch-name]", desc: "Tạo nhánh mới và tự động chuyển sang nhánh đó luôn.", search: "checkout tao va chuyen nhanh" },
                { cmd: "git branch -d [branch-name]", desc: "Xóa một nhánh (phải đảm bảo đã merge).", search: "branch xoa nhanh delete" }
            ]
        },
        {
            category: "🔀 Gộp & So sánh (Merge & Diff)",
            items: [
                { cmd: "git merge [branch-name]", desc: "Gộp lịch sử của nhánh được chỉ định vào nhánh hiện tại.", search: "merge gop nhanh" },
                { cmd: "git diff", desc: "Xem chi tiết những dòng code đã sửa nhưng chưa được add.", search: "diff so sanh code" },
                { cmd: "git diff --staged", desc: "Xem chi tiết những dòng code đã add chờ commit.", search: "diff staged" }
            ]
        },
        {
            category: "☁️ Đồng bộ (Push & Pull)",
            items: [
                { cmd: "git fetch", desc: "Tải lịch sử và nhánh mới từ server về, NHƯNG KHÔNG gộp vào code hiện tại.", search: "fetch tai ve" },
                { cmd: "git pull", desc: "Tải code mới từ server và gộp (merge) thẳng vào nhánh hiện tại.", search: "pull dong bo cap nhat" },
                { cmd: "git push origin [branch]", desc: "Đẩy các commit ở local lên server.", search: "push day code upload" },
                { cmd: "git push -u origin [branch]", desc: "Đẩy nhánh mới lên server và thiết lập theo dõi (upstream).", search: "push upstream tao nhanh server" }
            ]
        },
        {
            category: "⏪ Hoàn tác (Undo & Reset)",
            items: [
                { cmd: "git reset [file]", desc: "Bỏ file ra khỏi Staging Area (Undo lệnh git add).", search: "reset unstage bo add" },
                { cmd: "git reset --hard", desc: "Xóa SẠCH toàn bộ thay đổi chưa commit, quay về trạng thái commit gần nhất.", search: "reset hard xoa sach nguy hiem" },
                { cmd: "git revert [commit-hash]", desc: "Tạo 1 commit mới để đảo ngược lại những gì một commit cũ đã làm (An toàn).", search: "revert hoan tac dao nguoc" },
                { cmd: "git clean -fd", desc: "Xóa toàn bộ các file rác (untracked files) khỏi thư mục.", search: "clean xoa rac untracked" }
            ]
        },
        {
            category: "📦 Lưu tạm (Stashing)",
            items: [
                { cmd: "git stash", desc: "Cất tạm toàn bộ thay đổi đang làm dở đi để chuyển nhánh.", search: "stash cat tam luu tam" },
                { cmd: "git stash pop", desc: "Lấy những thay đổi đã cất tạm ra và áp dụng lại.", search: "stash pop lay ra" },
                { cmd: "git stash list", desc: "Xem danh sách những lần đã cất tạm.", search: "stash list danh sach" }
            ]
        },
        {
            category: "📜 Lịch sử (Log)",
            items: [
                { cmd: "git log", desc: "Xem lịch sử commit của nhánh hiện tại.", search: "log lich su xem" },
                { cmd: "git log --oneline", desc: "Xem lịch sử commit thu gọn (Mỗi commit 1 dòng).", search: "log oneline thu gon nhanh" },
                { cmd: "git log --graph", desc: "Xem lịch sử có vẽ sơ đồ nhánh trực quan.", search: "log graph so do" }
            ]
        }
    ];

    // --- KHAI BÁO DOM ---
    const container = document.getElementById('gitc-container');
    const searchInput = document.getElementById('gitc-search-input');
    const btnClear = document.getElementById('gitc-btn-clear');
    const noResultBox = document.getElementById('gitc-no-result');

    // --- 2. HÀM RENDER DỮ LIỆU RA HTML ---
    function renderCheatsheet(filterText = "") {
        container.innerHTML = ""; // Xóa dữ liệu cũ
        let hasVisibleItem = false;
        const lowerFilter = filterText.toLowerCase();

        gitDatabase.forEach(cat => {
            // Lọc các items phù hợp với từ khóa
            const filteredItems = cat.items.filter(item => {
                return item.cmd.toLowerCase().includes(lowerFilter) || 
                       item.desc.toLowerCase().includes(lowerFilter) || 
                       item.search.toLowerCase().includes(lowerFilter);
            });

            // Nếu danh mục này có ít nhất 1 lệnh phù hợp thì mới render danh mục đó
            if (filteredItems.length > 0) {
                hasVisibleItem = true;

                // Tạo Card danh mục
                const card = document.createElement('div');
                card.className = 'gitc-category-card';

                // Tiêu đề danh mục
                const title = document.createElement('h3');
                title.className = 'gitc-category-title';
                title.innerText = cat.category;
                card.appendChild(title);

                // Danh sách lệnh
                const list = document.createElement('div');
                list.className = 'gitc-cmd-list';

                filteredItems.forEach(item => {
                    const cmdBox = document.createElement('div');
                    cmdBox.className = 'gitc-cmd-item';
                    
                    cmdBox.innerHTML = `
                        <div class="gitc-cmd-header">
                            <span class="gitc-cmd-code">${item.cmd}</span>
                            <button class="gitc-btn-copy-cmd" data-cmd="${item.cmd}">📋 COPY</button>
                        </div>
                        <p class="gitc-cmd-desc">${item.desc}</p>
                    `;
                    list.appendChild(cmdBox);
                });

                card.appendChild(list);
                container.appendChild(card);
            }
        });

        // Bật/tắt thông báo không có kết quả
        if (!hasVisibleItem) {
            noResultBox.style.display = 'block';
        } else {
            noResultBox.style.display = 'none';
        }

        // Gắn lại sự kiện cho các nút Copy mới được tạo ra
        attachCopyEvents();
    }

    // --- 3. HÀM XỬ LÝ NÚT COPY ---
    function attachCopyEvents() {
        const copyBtns = document.querySelectorAll('.gitc-btn-copy-cmd');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                const cmdText = this.getAttribute('data-cmd');
                try {
                    await navigator.clipboard.writeText(cmdText);
                    
                    // Hiệu ứng UX
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