/**
 * 被嵌入父页时，把 #app 内容高度通过 postMessage 上报。
 * 只量 #app，绝不使用 document/body 的 scrollHeight，避免 iframe 变高后再次量高形成死循环。
 */
(function () {
    if (window.parent === window) {
        return;
    }

    const EMBED_PADDING = 36;
    /** 动态量高后再多留一点，避免贴边 */
    const EXTRA_GAP = 30;

    const style = document.createElement('style');
    style.id = 'spatial-embed-style';
    style.textContent = `
    html, body {
      height: auto !important;
      min-height: 0 !important;
      align-items: flex-start !important;
      justify-content: flex-start !important;
      overflow: hidden !important;
      padding: 12px 0 24px !important;
    }
    #app {
      margin: 0 auto !important;
    }
  `;
    document.documentElement.appendChild(style);

    let lastReported = 0;
    let raf = 0;

    function measureApp() {
        const app = document.getElementById('app');
        if (!app) {
            return 0;
        }

        // 仅基于内容根节点，切断「iframe 增高 → 文档增高 → 再上报」反馈环
        return Math.ceil(Math.max(app.scrollHeight, app.offsetHeight));
    }

    function post() {
        const contentHeight = measureApp();
        if (contentHeight < 100) {
            return;
        }

        const height = contentHeight + EMBED_PADDING + EXTRA_GAP;
        if (Math.abs(height - lastReported) < 2) {
            return;
        }

        lastReported = height;
        window.parent.postMessage(
            {
                source: 'spatial-embed',
                type: 'spatial-embed-height',
                height,
            },
            '*',
        );
    }

    function schedulePost() {
        if (raf) {
            cancelAnimationFrame(raf);
        }
        raf = requestAnimationFrame(() => {
            raf = 0;
            post();
        });
    }

    function start() {
        const app = document.getElementById('app');
        if (!app) {
            setTimeout(start, 50);
            return;
        }

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => schedulePost()).observe(app);
        }

        new MutationObserver(() => schedulePost()).observe(app, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        document.addEventListener('click', () => setTimeout(schedulePost, 50), true);
        document.addEventListener('input', () => setTimeout(schedulePost, 50), true);

        schedulePost();
        setTimeout(schedulePost, 100);
        setTimeout(schedulePost, 400);
        setTimeout(schedulePost, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    }
    else {
        start();
    }
})();
