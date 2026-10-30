document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('jsonFileInput');
    const statusMsg = document.getElementById('statusMessage');
    const previewGroup = document.getElementById('previewGroup');
    const previewBox = document.getElementById('previewBox');
    const btnDownloadActual = document.getElementById('btnDownloadActual');
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Biến lưu trữ dữ liệu trên RAM
    let currentDownloadContent = '';
    let currentDownloadFileName = '';
    let currentDownloadMimeType = '';

    function showStatus(msg, isError = false) {
        statusMsg.textContent = msg;
        statusMsg.className = 'status-message ' + (isError ? 'text-error' : 'text-success');
    }

    // Đọc file từ Client
    function readJSONFile(callback) {
        const file = fileInput.files[0];
        if (!file) {
            showStatus("Vui lòng chọn một file JSON trước!", true);
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            showStatus(`File quá lớn! Kích thước tối đa là ${MAX_FILE_SIZE / (1024*1024)}MB.`, true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonObj = JSON.parse(e.target.result);
                callback(jsonObj);
            } catch (err) {
                showStatus("Lỗi: File không đúng định dạng JSON hợp lệ!", true);
            }
        };
        reader.readAsText(file);
    }

    // Xử lý hiển thị Preview
    function renderPreview(content, fileName, mimeType) {
        currentDownloadContent = content;
        currentDownloadFileName = fileName;
        currentDownloadMimeType = mimeType;

        const lines = content.split('\n');
        const previewLines = lines.slice(0, 10);
        if (lines.length > 10) {
            previewLines.push('\n... (Còn tiếp ' + (lines.length - 10) + ' dòng nữa, hãy tải xuống để xem toàn bộ)');
        }

        previewBox.value = previewLines.join('\n');
        previewGroup.style.display = 'block';
        showStatus("Xem trước dữ liệu thành công!");
    }

    // Nút Xem trước CSV
    document.getElementById('btnPreviewCSV').addEventListener('click', () => {
        readJSONFile((data) => {
            let arrData = Array.isArray(data) ? data : [data];
            if (arrData.length === 0) {
                showStatus("JSON rỗng!", true); return;
            }

            const headers = Object.keys(arrData[0]);
            let csvLines = [headers.join(',')];

            arrData.forEach(row => {
                let values = headers.map(header => {
                    let val = row[header] === null || row[header] === undefined ? '' : row[header];
                    val = val.toString().replace(/"/g, '""');
                    return `"${val}"`;
                });
                csvLines.push(values.join(','));
            });

            // Gắn mã BOM (\uFEFF) ở đầu file để đảm bảo Excel đọc đúng ký tự tiếng Việt (UTF-8)
            const csvContent = "\uFEFF" + csvLines.join('\n');
            renderPreview(csvContent, 'data-exported.csv', 'text/csv;charset=utf-8;');
        });
    });

    // Nút Xem trước XML
    document.getElementById('btnPreviewXML').addEventListener('click', () => {
        readJSONFile((data) => {
            function jsonToXml(obj) {
                let xml = '';
                for (let prop in obj) {
                    xml += obj[prop] instanceof Array ? '' : `<${prop}>`;
                    if (obj[prop] instanceof Array) {
                        for (let array in obj[prop]) {
                            xml += `<${prop}>`;
                            xml += jsonToXml(new Object(obj[prop][array]));
                            xml += `</${prop}>`;
                        }
                    } else if (typeof obj[prop] == "object") {
                        xml += jsonToXml(new Object(obj[prop]));
                    } else {
                        xml += obj[prop];
                    }
                    xml += obj[prop] instanceof Array ? '' : `</${prop}>`;
                }
                return xml.replace(/<\/?[0-9]{1,}>/g, '');
            }

            let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + jsonToXml(data) + '\n</root>';
            renderPreview(xmlContent, 'data-exported.xml', 'application/xml;charset=utf-8;');
        });
    });

    // Tải xuống file thực tế sau khi xem trước
    btnDownloadActual.addEventListener('click', () => {
        if (!currentDownloadContent) return;
        
        const blob = new Blob([currentDownloadContent], { type: currentDownloadMimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentDownloadFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus(`Đã tải xuống thành công: ${currentDownloadFileName}`);
    });

    // Nút dọn dẹp
    document.getElementById('btnClearData').addEventListener('click', () => {
        fileInput.value = '';
        statusMsg.textContent = '';
        previewBox.value = '';
        previewGroup.style.display = 'none';
        
        currentDownloadContent = '';
        currentDownloadFileName = '';
        currentDownloadMimeType = '';
    });
});