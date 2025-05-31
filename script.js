document.addEventListener('DOMContentLoaded', function() {
    // 创建离线状态指示器
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.textContent = '离线模式';
    document.body.appendChild(offlineIndicator);

    // 检测网络状态变化
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineIndicator.style.display = 'none';
        } else {
            offlineIndicator.style.display = 'flex';
        }
    }

    // 初始检查网络状态
    updateOnlineStatus();

    // 添加网络状态变化事件监听器
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // 初始化CodeMirror编辑器
    const editor = CodeMirror.fromTextArea(document.getElementById('svg-input'), {
        mode: 'xml',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        matchTags: {bothTags: true},
        indentUnit: 4,
        viewportMargin: Infinity
    });

    // 获取DOM元素
    const previewContainer = document.getElementById('preview-container');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // 创建全屏模态框元素（初始不添加到DOM）
    let fullscreenModal = null;

    // Bento Grid风格示例SVG代码
    const exampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <!-- 背景渐变和阴影定义 -->
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cardGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/>
            </filter>
        </defs>
        
        <!-- 背景 -->
        <rect width="400" height="400" fill="url(#bgGradient)" />
        
        <!-- 大卡片 (左上) Analytics -->
        <rect x="20" y="20" width="180" height="120" rx="16" fill="url(#cardGradient1)" filter="url(#shadow)" />
        <circle cx="80" cy="60" r="20" fill="rgba(255,255,255,0.3)" />
        <text x="120" y="70" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="600" fill="white">Analytics</text>
        <text x="120" y="90" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700" fill="white">2.4K</text>
        <text x="120" y="110" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)">+12% this week</text>
        
        <!-- 中等卡片 (右上) Revenue -->
        <rect x="220" y="20" width="160" height="80" rx="16" fill="url(#cardGradient2)" filter="url(#shadow)" />
        <rect x="240" y="40" width="24" height="24" rx="4" fill="rgba(255,255,255,0.3)" />
        <text x="275" y="52" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="white">Revenue</text>
        <text x="275" y="72" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" fill="white">$12,450</text>
        
        <!-- 小卡片 (右中) Tasks -->
        <rect x="220" y="120" width="160" height="60" rx="16" fill="url(#cardGradient3)" filter="url(#shadow)" />
        <circle cx="250" cy="150" r="12" fill="rgba(255,255,255,0.3)" />
        <text x="275" y="150" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" fill="white">Tasks</text>
        <text x="275" y="165" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="700" fill="white">24/30</text>
        
        <!-- 中等卡片 (左下) Messages -->
        <rect x="20" y="160" width="120" height="100" rx="16" fill="url(#cardGradient4)" filter="url(#shadow)" />
        <rect x="35" y="180" width="16" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
        <text x="35" y="210" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" fill="white">Messages</text>
        <text x="35" y="230" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700" fill="white">127</text>
        <text x="35" y="245" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="rgba(255,255,255,0.8)">5 unread</text>
        
        <!-- 小卡片 (中下) Profile -->
        <rect x="160" y="160" width="80" height="60" rx="16" fill="url(#cardGradient5)" filter="url(#shadow)" />
        <circle cx="185" cy="185" r="8" fill="rgba(255,255,255,0.3)" />
        <text x="200" y="205" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="600" fill="white" text-anchor="middle">Profile</text>
        <text x="200" y="215" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" fill="white" text-anchor="middle">95%</text>
        
        <!-- 小卡片 (右下左) Status -->
        <rect x="160" y="240" width="80" height="60" rx="16" fill="rgba(15, 23, 42, 0.8)" filter="url(#shadow)" />
        <rect x="175" y="255" width="12" height="12" rx="2" fill="#10b981" />
        <text x="200" y="275" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="600" fill="white" text-anchor="middle">Status</text>
        <text x="200" y="285" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="#10b981" text-anchor="middle">Online</text>
        
        <!-- 中等卡片 (右下) Storage -->
        <rect x="260" y="200" width="120" height="100" rx="16" fill="rgba(15, 23, 42, 0.9)" filter="url(#shadow)" />
        <rect x="275" y="220" width="20" height="20" rx="4" fill="#3b82f6" />
        <text x="305" y="228" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" fill="white">Storage</text>
        <text x="305" y="245" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" fill="white">2.1 GB</text>
        <text x="305" y="260" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="rgba(255,255,255,0.6)">of 5 GB used</text>
        <!-- 进度条 -->
        <rect x="275" y="270" width="90" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="275" y="270" width="37" height="4" rx="2" fill="#3b82f6" />
        
        <!-- 小卡片 (左最下) Notifications -->
        <rect x="20" y="280" width="120" height="60" rx="16" fill="rgba(15, 23, 42, 0.7)" filter="url(#shadow)" />
        <circle cx="45" cy="305" r="10" fill="#f59e0b" />
        <text x="65" y="305" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600" fill="white">Notifications</text>
        <text x="65" y="320" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="white">3 new</text>
        
        <!-- 装饰性元素 -->
        <circle cx="350" cy="50" r="3" fill="rgba(59, 130, 246, 0.3)" />
        <circle cx="365" cy="35" r="2" fill="rgba(16, 185, 129, 0.4)" />
        <circle cx="60" cy="350" r="2" fill="rgba(245, 158, 11, 0.4)" />
        <circle cx="350" cy="380" r="2.5" fill="rgba(139, 92, 246, 0.3)" />
    </svg>`;

    // 设置示例SVG代码
    editor.setValue(exampleSvg);

    // 复制图像
    copyBtn.addEventListener('click', function() {
        copyImage();
    });

    // 下载图像
    downloadBtn.addEventListener('click', function() {
        downloadImage();
    });

    // 初始预览和转换
    previewSvg();
    convertToPng();

    // 监听编辑器内容变化，自动预览和转换
    editor.on('change', function() {
        previewSvg();
        // 添加延迟以避免频繁转换
        clearTimeout(editor.conversionTimeout);
        editor.conversionTimeout = setTimeout(function() {
            convertToPng();
        }, 1000); // 1秒延迟
    });

    // 添加点击预览区域事件，实现SVG全屏显示
    previewContainer.addEventListener('click', function() {
        showFullscreenSvg();
    });

    // 显示SVG全屏函数
    function showFullscreenSvg() {
        const svgElement = previewContainer.querySelector('svg');
        if (!svgElement) return;

        // 创建模态框
        fullscreenModal = document.createElement('div');
        fullscreenModal.className = 'fullscreen-modal';

        // 创建SVG容器，用于滚动和缩放
        const svgContainer = document.createElement('div');
        svgContainer.className = 'svg-container';

        // 创建关闭按钮
        const closeButton = document.createElement('div');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            document.body.removeChild(fullscreenModal);
            fullscreenModal = null;
        });

        // 创建缩放控制按钮
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';

        const zoomInBtn = document.createElement('div');
        zoomInBtn.className = 'zoom-btn zoom-in';
        zoomInBtn.innerHTML = '+';

        const zoomOutBtn = document.createElement('div');
        zoomOutBtn.className = 'zoom-btn zoom-out';
        zoomOutBtn.innerHTML = '-';

        const zoomResetBtn = document.createElement('div');
        zoomResetBtn.className = 'zoom-btn zoom-reset';
        zoomResetBtn.innerHTML = '↺';

        zoomControls.appendChild(zoomInBtn);
        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(zoomResetBtn);

        // 复制SVG到容器
        const svgClone = svgElement.cloneNode(true);
        svgContainer.appendChild(svgClone);

        // 添加到模态框
        fullscreenModal.appendChild(svgContainer);
        fullscreenModal.appendChild(closeButton);
        fullscreenModal.appendChild(zoomControls);

        // 当前缩放级别
        let currentScale = 1;
        const scaleStep = 0.2;

        // 缩放函数
        function updateScale() {
            svgClone.style.transform = `scale(${currentScale})`;
            svgClone.style.transformOrigin = 'center center';
        }

        // 缩放按钮事件
        zoomInBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentScale += scaleStep;
            updateScale();
        });

        zoomOutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (currentScale > scaleStep) {
                currentScale -= scaleStep;
                updateScale();
            }
        });

        zoomResetBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentScale = 1;
            updateScale();
        });

        // 鼠标滚轮缩放
        svgContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY < 0) {
                // 向上滚动，放大
                currentScale += scaleStep;
            } else {
                // 向下滚动，缩小
                if (currentScale > scaleStep) {
                    currentScale -= scaleStep;
                }
            }
            updateScale();
        });

        // 点击模态框背景也可以关闭
        fullscreenModal.addEventListener('click', function() {
            document.body.removeChild(fullscreenModal);
            fullscreenModal = null;
        });

        // 阻止SVG容器点击事件冒泡到模态框
        svgContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 添加到body
        document.body.appendChild(fullscreenModal);
    }

    // 验证SVG代码函数
    function validateSvgCode(svgCode) {
        // 创建一个新的DOMParser
        const parser = new DOMParser();

        // 解析SVG代码
        const doc = parser.parseFromString(svgCode, 'image/svg+xml');

        // 检查是否有解析错误
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            // 提取错误信息
            let errorMsg = parserError.textContent;

            // 尝试提取更具体的错误位置和原因
            const errorDetails = [];

            // 常见SVG错误检查
            if (svgCode.indexOf('<svg') === -1) {
                errorDetails.push('缺少<svg>根元素');
            } else if (!svgCode.includes('xmlns="http://www.w3.org/2000/svg"')) {
                errorDetails.push('缺少必要的xmlns属性');
            }

            // 检查标签是否闭合
            const openTags = svgCode.match(/<[a-zA-Z][^>]*[^/]>/g) || [];
            const closeTags = svgCode.match(/<\/[a-zA-Z][^>]*>/g) || [];
            const selfClosingTags = svgCode.match(/<[a-zA-Z][^>]*\/>/g) || [];

            if (openTags.length > (closeTags.length + selfClosingTags.length)) {
                errorDetails.push('存在未闭合的标签');
            }

            // 检查属性格式
            const attrWithoutQuotes = svgCode.match(/\s[a-zA-Z-]+=\s*[^"'][^\s>]*/g);
            if (attrWithoutQuotes) {
                errorDetails.push('属性值应使用引号包裹');
            }

            // 返回错误信息和修复建议
            return {
                valid: false,
                error: errorMsg,
                details: errorDetails,
                suggestions: [
                    '确保SVG代码以svg标签开始并以/svg结束',
                    '添加必要的xmlns属性: xmlns="http://www.w3.org/2000/svg"',
                    '检查所有标签是否正确闭合',
                    '确保所有属性值都使用引号包裹',
                    '检查元素名称和属性名称的拼写是否正确'
                ]
            };
        }

        // 检查SVG根元素
        const svgRoot = doc.documentElement;
        if (svgRoot.nodeName.toLowerCase() !== 'svg') {
            return {
                valid: false,
                error: '文档根元素不是SVG',
                details: ['文档的根元素必须是<svg>'],
                suggestions: ['确保SVG代码以<svg>标签开始并以</svg>结束']
            };
        }

        // SVG代码有效
        return { valid: true };
    }

    // 预览SVG函数
    function previewSvg() {
        const svgCode = editor.getValue().trim();
        if (!svgCode) {
            previewContainer.innerHTML = '<p>请输入有效的SVG代码</p>';
            return;
        }

        // 验证SVG代码
        const validation = validateSvgCode(svgCode);

        if (!validation.valid) {
            // 创建错误提示容器
            let errorHtml = `<div class="svg-error">
                <h3>SVG语法错误</h3>
                <p>${validation.error}</p>`;

            // 添加详细错误信息
            if (validation.details && validation.details.length > 0) {
                errorHtml += '<ul class="error-details">';
                validation.details.forEach(detail => {
                    errorHtml += `<li>${detail}</li>`;
                });
                errorHtml += '</ul>';
            }

            // 添加修复建议
            if (validation.suggestions && validation.suggestions.length > 0) {
                errorHtml += '<h4>修复建议:</h4><ul class="error-suggestions">';
                validation.suggestions.forEach(suggestion => {
                    errorHtml += `<li>${suggestion}</li>`;
                });
                errorHtml += '</ul>';
            }

            errorHtml += '</div>';

            // 显示错误信息
            previewContainer.innerHTML = errorHtml;
            // 隐藏结果容器
            resultContainer.classList.add('hidden');
            return;
        }

        try {
            // 清空预览容器
            previewContainer.innerHTML = '';
            // 添加SVG到预览容器
            previewContainer.innerHTML = svgCode;
            // 隐藏结果容器
            resultContainer.classList.add('hidden');
        } catch (error) {
            previewContainer.innerHTML = `<p>SVG预览错误: ${error.message}</p>`;
        }
    }

    // 转换为PNG函数（彻底修复模糊问题）
    function convertToPng() {
        const svgCode = editor.getValue().trim();
        if (!svgCode) {
            alert('请输入有效的SVG代码');
            return;
        }

        try {
            // 解析SVG以获取尺寸信息
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            
            // 获取SVG的viewBox或width/height属性
            let svgWidth = 400; // 默认宽度
            let svgHeight = 400; // 默认高度
            
            if (svgElement.hasAttribute('viewBox')) {
                const viewBox = svgElement.getAttribute('viewBox').split(' ');
                svgWidth = parseFloat(viewBox[2]) || 400;
                svgHeight = parseFloat(viewBox[3]) || 400;
            } else {
                if (svgElement.hasAttribute('width')) {
                    const widthAttr = svgElement.getAttribute('width');
                    svgWidth = parseFloat(widthAttr.replace(/px|pt|em|rem|%|mm|cm|in/g, '')) || 400;
                }
                if (svgElement.hasAttribute('height')) {
                    const heightAttr = svgElement.getAttribute('height');
                    svgHeight = parseFloat(heightAttr.replace(/px|pt|em|rem|%|mm|cm|in/g, '')) || 400;
                }
            }
            
            // 确保SVG有正确的命名空间和viewBox
            let optimizedSvgCode = svgCode;
            if (!svgElement.hasAttribute('xmlns')) {
                optimizedSvgCode = svgCode.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if (!svgElement.hasAttribute('viewBox')) {
                optimizedSvgCode = optimizedSvgCode.replace('<svg', `<svg viewBox="0 0 ${svgWidth} ${svgHeight}"`);
            }
            
            // 使用更高的缩放倍数确保清晰度
            const scaleFactor = 4; // 固定4倍缩放
            
            // 创建一个隐藏的SVG元素用于渲染
            const tempSvg = document.createElement('div');
            tempSvg.innerHTML = optimizedSvgCode;
            tempSvg.style.position = 'absolute';
            tempSvg.style.left = '-9999px';
            tempSvg.style.top = '-9999px';
            document.body.appendChild(tempSvg);
            
            const svgEl = tempSvg.querySelector('svg');
            svgEl.setAttribute('width', svgWidth * scaleFactor);
            svgEl.setAttribute('height', svgHeight * scaleFactor);
            
            // 创建Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置Canvas尺寸
            canvas.width = svgWidth * scaleFactor;
            canvas.height = svgHeight * scaleFactor;
            
            // 设置高质量渲染选项
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // 将SVG转换为Data URL
            const svgData = new XMLSerializer().serializeToString(svgEl);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // 创建图像对象
            const img = new Image();
            img.onload = function() {
                // 清除画布并设置白色背景
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 绘制图像
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // 转换为PNG（最高质量）
                try {
                    const pngUrl = canvas.toDataURL('image/png', 1.0);
                    
                    // 设置图像源
                    resultImage.src = pngUrl;
                    
                    // 显示结果容器
                    resultContainer.classList.remove('hidden');
                    
                    // 清理资源
                    URL.revokeObjectURL(svgUrl);
                    document.body.removeChild(tempSvg);
                    
                    console.log(`转换完成: ${svgWidth}x${svgHeight} -> ${canvas.width}x${canvas.height}`);
                } catch (error) {
                    console.error(`转换错误: ${error.message}`);
                    resultContainer.classList.add('hidden');
                    document.body.removeChild(tempSvg);
                }
            };
            
            img.onerror = function() {
                console.error('无法加载SVG图像');
                resultContainer.classList.add('hidden');
                URL.revokeObjectURL(svgUrl);
                document.body.removeChild(tempSvg);
            };
            
            img.src = svgUrl;
            
        } catch (error) {
            console.error(`转换错误: ${error.message}`);
            resultContainer.classList.add('hidden');
        }
    }

    // 复制图像函数（保持高分辨率）
    function copyImage() {
        if (resultImage.src) {
            // 创建Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置Canvas尺寸为结果图像的自然尺寸（保持高分辨率）
            canvas.width = resultImage.naturalWidth;
            canvas.height = resultImage.naturalHeight;

            // 绘制图像到Canvas
            ctx.drawImage(resultImage, 0, 0);

            // 复制到剪贴板
            canvas.toBlob(function(blob) {
                try {
                    // 使用Clipboard API复制图像
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]).then(function() {
                        alert('图像已复制到剪贴板');
                    }, function(error) {
                        alert(`复制失败: ${error.message}`);
                    });
                } catch (error) {
                    alert('您的浏览器不支持图像复制功能');
                }
            }, 'image/png', 1.0);
        } else {
            alert('请先转换图像');
        }
    }

    // 下载图像函数
    function downloadImage() {
        if (resultImage.src) {
            // 获取用户自定义文件名或使用默认名称
            let fileName = prompt('请输入文件名', 'svg-converted');

            // 如果用户取消了输入，使用默认文件名
            if (fileName === null) {
                fileName = 'svg-converted';
            }

            // 确保文件名有.png后缀
            if (!fileName.toLowerCase().endsWith('.png')) {
                fileName += '.png';
            }

            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = resultImage.src;
            downloadLink.download = fileName;

            // 触发下载
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            alert('请先转换图像');
        }
    }
});
