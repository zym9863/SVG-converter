// 注册服务工作线程
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// 添加安装提示
let deferredPrompt;
const installButton = document.createElement('button');
installButton.style.display = 'none';
installButton.textContent = '安装应用';
installButton.classList.add('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止Chrome 67及更早版本自动显示安装提示
  e.preventDefault();
  // 存储事件以便稍后触发
  deferredPrompt = e;
  // 显示安装按钮
  installButton.style.display = 'block';
  
  // 添加按钮到页面
  const container = document.querySelector('.container');
  if (container && !document.querySelector('.install-button')) {
    container.insertBefore(installButton, container.firstChild);
  }
});

// 处理安装按钮点击
installButton.addEventListener('click', (e) => {
  // 隐藏安装按钮
  installButton.style.display = 'none';
  // 显示安装提示
  deferredPrompt.prompt();
  // 等待用户响应
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('用户接受安装');
    } else {
      console.log('用户拒绝安装');
    }
    deferredPrompt = null;
  });
});
