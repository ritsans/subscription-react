// 静的ページ用JavaScript

/**
 * DOM読み込み完了時の初期化処理
 */
document.addEventListener('DOMContentLoaded', function() {
  // モバイルメニューの制御
  initMobileMenu();
  
  // スムーススクロールの設定
  initSmoothScroll();
  
  // フェードインアニメーションの設定
  initFadeInAnimation();
  
  // フォーム送信時のローディング状態制御
  initFormLoading();
  
  // アクセシビリティ向上のための設定
  initAccessibility();
});

/**
 * モバイルメニューの開閉制御
 */
function initMobileMenu() {
  const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('mobile-menu-visible');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.remove('mobile-menu-visible');
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * ページ内リンクのスムーススクロール
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 要素が画面に入った時のフェードインアニメーション
 */
function initFadeInAnimation() {
  // Intersection Observer が対応していない場合はスキップ
  if (!('IntersectionObserver' in window)) {
    return;
  }
  
  const fadeElements = document.querySelectorAll('[data-fade-in]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * フォーム送信時のローディング状態制御
 */
function initFormLoading() {
  const forms = document.querySelectorAll('form[data-loading]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const submitButton = form.querySelector('button[type="submit"]');
      
      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <span class="loading-spinner mr-2"></span>
          送信中...
        `;
        
        // エラーが発生した場合に元に戻す（実際の送信処理で制御）
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 5000);
      }
    });
  });
}

/**
 * アクセシビリティ向上のための設定
 */
function initAccessibility() {
  // Escキーでモーダルやメニューを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // モバイルメニューを閉じる
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const menuButton = document.querySelector('[data-mobile-menu-toggle]');
        if (menuButton) {
          menuButton.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
  
  // フォーカストラップ（必要に応じて後から実装）
  // タブキーでのナビゲーション改善
  
  // 外部リンクに target="_blank" がある場合のセキュリティ対策
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(link => {
    if (!link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// エラーハンドリング
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  // 本番環境では適切なエラー送信処理を実装
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  // 本番環境では適切なエラー送信処理を実装
});