document.addEventListener('DOMContentLoaded', function() {
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
    const previewBtn = document.getElementById('preview-btn');
    const convertBtn = document.getElementById('convert-btn');
    const previewContainer = document.getElementById('preview-container');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // 创建全屏模态框元素（初始不添加到DOM）
    let fullscreenModal = null;

    // 示例SVG代码
    const exampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#3498db" />
        <text x="100" y="115" font-family="Arial" font-size="24" text-anchor="middle" fill="white">SVG示例</text>
    </svg>`;

    // 设置示例SVG代码
    editor.setValue(exampleSvg);

    // 预览SVG
    previewBtn.addEventListener('click', function() {
        previewSvg();
    });

    // 转换为PNG
    convertBtn.addEventListener('click', function() {
        convertToPng();
    });

    // 复制图像
    copyBtn.addEventListener('click', function() {
        copyImage();
    });

    // 下载图像
    downloadBtn.addEventListener('click', function() {
        downloadImage();
    });

    // 初始预览
    previewSvg();
    
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

    // 预览SVG函数
    function previewSvg() {
        const svgCode = editor.getValue().trim();
        if (!svgCode) {
            previewContainer.innerHTML = '<p>请输入有效的SVG代码</p>';
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

    // 转换为PNG函数
    function convertToPng() {
        const svgCode = editor.getValue().trim();
        if (!svgCode) {
            alert('请输入有效的SVG代码');
            return;
        }

        try {
            // 创建SVG Blob
            const svgBlob = new Blob([svgCode], {type: 'image/svg+xml;charset=utf-8'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // 创建图像对象
            const img = new Image();
            img.onload = function() {
                // 创建Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置Canvas尺寸
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 绘制图像到Canvas
                ctx.drawImage(img, 0, 0);
                
                // 转换为PNG
                try {
                    const pngUrl = canvas.toDataURL('image/png');
                    
                    // 设置图像源但不显示图像本身
                    resultImage.src = pngUrl;
                    
                    // 显示结果容器中的按钮，但隐藏图像
                    resultContainer.classList.remove('hidden');
                    document.querySelector('.result-image-container').style.display = 'none';
                    
                    // 提示用户转换已完成，可以进行复制或下载操作
                    alert('SVG已成功转换为PNG，现在您可以使用"复制图像"或"下载图像"按钮');
                    
                    // 释放SVG URL
                    URL.revokeObjectURL(svgUrl);
                } catch (error) {
                    alert(`转换错误: ${error.message}`);
                }
            };
            
            img.onerror = function() {
                alert('无法加载SVG图像');
                URL.revokeObjectURL(svgUrl);
            };
            
            img.src = svgUrl;
        } catch (error) {
            alert(`转换错误: ${error.message}`);
        }
    }

    // 复制图像函数
    function copyImage() {
        if (resultImage.src) {
            // 创建Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置Canvas尺寸
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
            });
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