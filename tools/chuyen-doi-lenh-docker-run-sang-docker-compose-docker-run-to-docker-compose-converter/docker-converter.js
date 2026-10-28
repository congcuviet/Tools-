document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const inputCmd = document.getElementById('dock-input-cmd');
    const chipButtons = document.querySelectorAll('.dock-btn-chip');
    
    const btnConvert = document.getElementById('dock-btn-convert');
    const btnClear = document.getElementById('dock-btn-clear');
    const btnCopy = document.getElementById('dock-btn-copy');
    
    const outputYaml = document.getElementById('dock-output-yaml');
    const badgeStatus = document.getElementById('dock-status-badge');
    
    const errorBox = document.getElementById('dock-error-box');
    const errorMsg = document.getElementById('dock-error-msg');

    // --- 1. LẮNG NGHE NÚT ĐIỀN NHANH ---
    chipButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            inputCmd.value = this.getAttribute('data-cmd');
            convertCommand();
        });
    });

    // --- 2. THUẬT TOÁN PARSER DOCKER RUN ---
    function parseDockerRun(command) {
        // Làm sạch lệnh: Xóa ký hiệu xuống dòng `\` và khoảng trắng thừa
        command = command.replace(/\\\n/g, ' ').replace(/\\\s*\n/g, ' ').replace(/\s+/g, ' ').trim();
        
        if (!command.startsWith('docker run')) {
            throw new Error("Lệnh không hợp lệ. Phải bắt đầu bằng 'docker run'.");
        }

        // Bóc tách chuỗi thành các token, bảo tồn các khoảng trắng bên trong dấu ngoặc kép (" ")
        const tokens = [];
        const regex = /(".*?"|'.*?'|[^\s]+)/g;
        let match;
        while ((match = regex.exec(command)) !== null) {
            // Loại bỏ dấu nháy bọc ngoài
            let token = match[1].replace(/(^['"]|['"]$)/g, '');
            tokens.push(token);
        }

        // Cắt bỏ 'docker' và 'run'
        tokens.splice(0, 2);

        // Khởi tạo Object chứa cấu trúc Compose
        let config = {
            image: '',
            container_name: '',
            ports: [],
            volumes: [],
            environment: [],
            networks: [],
            restart: '',
            command: [],
            privileged: false
        };

        // Danh sách các cờ mà chúng ta sẽ bỏ qua (Vì compose mặc định hoặc không cần)
        const ignoreFlags = ['-d', '--detach', '-it', '-i', '-t', '--rm'];
        
        // Danh sách các cờ mang 1 tham số nhưng ít dùng, cần bỏ qua luôn giá trị của nó để không bị nhận nhầm thành Tên Image
        const skipValueFlags = ['-u', '--user', '-w', '--workdir', '-h', '--hostname', '--mac-address', '--ip'];

        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i];
            
            // Nếu là cờ (Flag)
            if (t.startsWith('-')) {
                if (t === '-p' || t === '--publish') { config.ports.push(tokens[++i]); }
                else if (t === '-v' || t === '--volume') { config.volumes.push(tokens[++i]); }
                else if (t === '-e' || t === '--env') { config.environment.push(tokens[++i]); }
                else if (t === '--name') { config.container_name = tokens[++i]; }
                else if (t === '--restart') { config.restart = tokens[++i]; }
                else if (t === '--network' || t === '--net') { config.networks.push(tokens[++i]); }
                else if (t === '--privileged') { config.privileged = true; }
                else if (ignoreFlags.includes(t)) { /* Bỏ qua */ }
                else if (skipValueFlags.includes(t)) { i++; /* Bỏ qua flag và value của nó */ }
                else {
                    // Cờ lạ (Chưa được hỗ trợ) -> Tạm bỏ qua để tránh Crash
                }
            } 
            // Nếu không phải cờ (Có thể là Tên Image hoặc Lệnh thực thi)
            else {
                if (!config.image) {
                    // Token đầu tiên không phải cờ chính là Image
                    config.image = t;
                } else {
                    // Những thứ còn sót lại đằng sau Image chính là Command override
                    config.command.push(t);
                }
            }
        }

        if (!config.image) {
            throw new Error("Không tìm thấy Tên Image (Ví dụ: nginx:latest). Vui lòng kiểm tra lại lệnh.");
        }

        return config;
    }

    // --- 3. HÀM CHUYỂN OBECT SANG YAML ---
    function generateYAML(config) {
        // Tên service (Nếu không có name thì mặc định là 'app')
        let serviceName = config.container_name || 'app';
        // Xóa các ký tự không hợp lệ cho service_name (Compose không thích dấu chấm hoặc ký tự lạ)
        serviceName = serviceName.replace(/[^a-zA-Z0-9_-]/g, '');

        let yaml = `version: '3.8'\n`;
        yaml += `services:\n`;
        yaml += `  ${serviceName}:\n`;
        yaml += `    image: ${config.image}\n`;

        if (config.container_name) yaml += `    container_name: ${config.container_name}\n`;
        if (config.restart) yaml += `    restart: ${config.restart}\n`;
        if (config.privileged) yaml += `    privileged: true\n`;

        if (config.ports.length > 0) {
            yaml += `    ports:\n`;
            config.ports.forEach(p => yaml += `      - "${p}"\n`);
        }

        if (config.volumes.length > 0) {
            yaml += `    volumes:\n`;
            config.volumes.forEach(v => yaml += `      - ${v}\n`);
        }

        if (config.environment.length > 0) {
            yaml += `    environment:\n`;
            config.environment.forEach(e => yaml += `      - ${e}\n`);
        }

        if (config.networks.length > 0) {
            yaml += `    networks:\n`;
            config.networks.forEach(n => yaml += `      - ${n}\n`);
        }

        if (config.command.length > 0) {
            // Nối chuỗi array thành command
            yaml += `    command: ${config.command.join(' ')}\n`;
        }

        // Định nghĩa mạng rời (External Networks) ở dưới cùng nếu có
        if (config.networks.length > 0) {
            let hasExternal = false;
            let netYaml = `\nnetworks:\n`;
            
            config.networks.forEach(n => {
                // Bridge và Host là mạng mặc định, không cần khai báo external
                if (n !== 'host' && n !== 'bridge') {
                    netYaml += `  ${n}:\n    external: true\n`;
                    hasExternal = true;
                }
            });

            if (hasExternal) yaml += netYaml;
        }

        return yaml;
    }

    // --- 4. HÀM ĐIỀU PHỐI CHÍNH ---
    function convertCommand() {
        let rawCmd = inputCmd.value.trim();
        errorBox.style.display = 'none';

        if (!rawCmd) {
            outputYaml.value = "";
            badgeStatus.innerText = "Chờ nhập liệu";
            badgeStatus.className = "dock-badge";
            return;
        }

        try {
            const configObj = parseDockerRun(rawCmd);
            const yamlStr = generateYAML(configObj);

            outputYaml.value = yamlStr;
            
            badgeStatus.innerText = "✅ Chuyển đổi thành công";
            badgeStatus.className = "dock-badge active";

        } catch (error) {
            outputYaml.value = "";
            badgeStatus.innerText = "❌ Lỗi lệnh Docker";
            badgeStatus.className = "dock-badge error";
            
            errorMsg.innerText = error.message;
            errorBox.style.display = 'block';
        }
    }

    // --- 5. LẮNG NGHE SỰ KIỆN GIAO DIỆN ---
    // Cho phép dịch Realtime khi gõ
    inputCmd.addEventListener('input', convertCommand);
    
    btnConvert.addEventListener('click', convertCommand);

    btnClear.addEventListener('click', () => {
        inputCmd.value = "";
        convertCommand();
        inputCmd.focus();
    });

    btnCopy.addEventListener('click', async () => {
        if (!outputYaml.value || errorBox.style.display === 'block') return;

        try {
            await navigator.clipboard.writeText(outputYaml.value);
            const originalText = btnCopy.innerText;
            const originalBg = btnCopy.style.background;
            
            btnCopy.innerText = '✅ ĐÃ COPY YAML';
            btnCopy.style.background = 'var(--clr-green)';
            btnCopy.style.color = '#111';
            
            setTimeout(() => {
                btnCopy.innerText = originalText;
                btnCopy.style.background = originalBg;
                btnCopy.style.color = 'var(--clr-cyan)';
            }, 1500);
        } catch (err) {
            alert("Trình duyệt không hỗ trợ copy tự động!");
        }
    });

    // Mồi chạy thử nếu người dùng dán vào từ trước
    if (inputCmd.value) convertCommand();
});