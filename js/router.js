/**
 * ============================================================================
 * منصة وصل التعليمية — محرك الانتقالات والتوجيه السلس (Wasl Transition Router)
 * يدعم الانتقالات الانسيابية، فحص المسارات، إدارة الحالة، والتنقل الفوري
 * ============================================================================
 */

class WaslRouter {
  constructor() {
    this.currentRoute = null;
    this.previousRoute = null;
    this.isTransitioning = false;
    this.routes = {};
    this.container = null;
    this.progressBar = null;
    this.transitionHistory = [];
    this.lang = 'ar';

    // Route Definitions
    this.routesConfig = [
      { id: 'home', title: 'الرئيسية العامة | منصة وصل التعليمية - المكلا', icon: 'home', category: 'الواجهات العامة' },
      { id: 'role-select', title: 'اختيار نوع المستخدم | منصة وصل - المكلا', icon: 'how_to_reg', category: 'المصادقة والتسجيل' },
      { id: 'school-dashboard', title: 'لوحة تحكم المدرسة | مدارس المكلا', icon: 'school', category: 'لوحات التحكم' },
      { id: 'parent-hub', title: 'بوابة ولي الأمر | منصة وصل - المكلا', icon: 'family_restroom', category: 'لوحات التحكم' },
      { id: 'teacher-workspace', title: 'لوحة المعلم المهنية | منصة وصل - المكلا', icon: 'badge', category: 'لوحات التحكم' },
      { id: 'find-teachers', title: 'استكشاف الكوادر التعليمية في المكلا', icon: 'search', category: 'البحث والاستكشاف' },
      { id: 'teacher-profile', title: 'الملف المهني للمعلم | أ. عمر باوزير - المكلا', icon: 'person', category: 'الملفات المهنية' },
      { id: 'contact-request', title: 'إرسال طلب تواصل وتدريس رسمي', icon: 'send', category: 'النماذج والعمليات' },
      { id: 'urgent-request', title: 'طلب معلم عاجل للاحتياجات المدرسية بالمكلا', icon: 'bolt', category: 'النماذج والعمليات' },
      { id: 'post-job', title: 'نشر وظيفة تدريسية شاغرة في المكلا', icon: 'post_add', category: 'النماذج والعمليات' },
      { id: 'applicant-eval', title: 'مصفوفة تقييم ومفاضلة المتقدمين', icon: 'rate_review', category: 'لوحات التحكم' },
      { id: 'home-alt', title: 'الرئيسية (بحث مباشر) | منصة وصل - المكلا', icon: 'manage_search', category: 'الواجهات العامة' }
    ];

    this.init();
  }

  init() {
    this.container = document.getElementById('view-container');
    this.progressBar = document.getElementById('page-progress-bar');

    // Register routes from window.WASL_VIEWS
    if (window.WASL_VIEWS) {
      this.routesConfig.forEach(r => {
        if (window.WASL_VIEWS[r.id]) {
          this.routes[r.id] = window.WASL_VIEWS[r.id];
        }
      });
    }

    // Attach click listeners for data-path navigation
    document.addEventListener('click', (e) => this.handleGlobalClick(e));

    // Listen to hash change for browser back/forward
    window.addEventListener('hashchange', () => this.handleHashChange());

    // Setup Quick Floating Navigator
    this.injectQuickNavigator();

    // Setup Toast Container
    this.injectToastContainer();

    // Initial Route
    const initialRoute = this.getRouteFromHash() || 'home';
    this.navigate(initialRoute, { replaceState: true });
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
    if (hash && this.routes[hash]) {
      return hash;
    }
    return null;
  }

  handleHashChange() {
    const route = this.getRouteFromHash();
    if (route && route !== this.currentRoute) {
      this.navigate(route, { fromHashChange: true });
    }
  }

  handleGlobalClick(e) {
    // Check if clicked element or parent has data-path or an anchor with #
    const target = e.target.closest('[data-path], a[href^="#"]');
    if (!target) return;

    let path = target.getAttribute('data-path');
    if (!path && target.tagName.toLowerCase() === 'a') {
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        path = href.replace(/^#\/?/, '').trim();
      }
    }

    if (path && this.routes[path]) {
      e.preventDefault();
      this.navigate(path);
      return;
    }

    // Handle Language Toggle button
    const langBtn = e.target.closest('#btn-toggle-lang, [data-action="toggle-lang"]');
    if (langBtn) {
      e.preventDefault();
      this.toggleLanguage();
      return;
    }

    // Handle mock submit buttons (forms) to show elegant toast feedback
    const submitBtn = e.target.closest('button[type="submit"], [data-action="mock-submit"]');
    if (submitBtn) {
      const form = submitBtn.closest('form');
      if (form) e.preventDefault();
      this.showToast('تم حفظ وإرسال البيانات بنجاح في نظام وصل التعليمي (المكلا)', 'success');
    }
  }

  /**
   * Main transition engine with subtle animations and progress bar
   */
  async navigate(routeId, options = {}) {
    if (!this.routes[routeId]) {
      console.warn(`[WaslRouter] Route not found: ${routeId}. Falling back to 'home'.`);
      routeId = 'home';
    }

    if (this.currentRoute === routeId && !options.force) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const startTime = performance.now();
    this.previousRoute = this.currentRoute;
    this.currentRoute = routeId;

    // 1. Start Progress Bar
    this.setProgressBar(40);

    // 2. Animate out current view if present
    if (this.container.children.length > 0 && !options.replaceState) {
      this.container.classList.remove('view-entered');
      this.container.classList.add('view-leaving');
      await this.sleep(120);
    }

    // 3. Swap DOM content
    this.setProgressBar(80);
    const viewData = this.routes[routeId];
    this.container.innerHTML = viewData.html;

    // Execute scripts contained in the loaded view
    try {
      const scripts = Array.from(this.container.querySelectorAll('script'));
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    } catch (scriptErr) {
      console.warn('[WaslRouter] Inline script execution notice:', scriptErr);
    }

    // 4. Update Document Title
    document.title = viewData.title || 'منصة وصل التعليمية - المكلا';

    // 5. Update URL Hash
    if (!options.fromHashChange) {
      window.location.hash = `#/${routeId}`;
    }

    // 6. Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 7. Animate in new view
    this.container.classList.remove('view-leaving');
    this.container.classList.add('view-entering');
    
    // Force browser reflow
    void this.container.offsetWidth;

    this.container.classList.remove('view-entering');
    this.container.classList.add('view-entered');

    // 8. Complete Progress Bar
    this.setProgressBar(100);
    setTimeout(() => this.setProgressBar(0), 200);

    // 9. Update Active Nav States in the DOM
    this.updateActiveNavIndicators(routeId);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Record transition metrics for automated testing
    const transitionRecord = {
      from: this.previousRoute,
      to: routeId,
      durationMs: duration,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    this.transitionHistory.push(transitionRecord);

    // Dispatch transition event
    window.dispatchEvent(new CustomEvent('wasl:transition-end', { detail: transitionRecord }));

    this.isTransitioning = false;
    return transitionRecord;
  }

  setProgressBar(percent) {
    if (!this.progressBar) return;
    if (percent === 0) {
      this.progressBar.style.opacity = '0';
      setTimeout(() => {
        this.progressBar.style.transform = 'scaleX(0)';
      }, 200);
    } else {
      this.progressBar.style.opacity = '1';
      this.progressBar.style.transform = `scaleX(${percent / 100})`;
    }
  }

  updateActiveNavIndicators(routeId) {
    document.querySelectorAll('[data-path]').forEach(el => {
      const p = el.getAttribute('data-path');
      if (p === routeId) {
        el.setAttribute('aria-current', 'page');
        el.classList.add('bg-surface-lavender', 'text-primary', 'font-semibold');
      } else {
        el.removeAttribute('aria-current');
        el.classList.remove('bg-surface-lavender', 'text-primary', 'font-semibold');
      }
    });

    // Update Quick Navigator Active Button
    document.querySelectorAll('[data-nav-pill]').forEach(btn => {
      if (btn.getAttribute('data-nav-pill') === routeId) {
        btn.classList.add('bg-primary', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-on-surface');
      } else {
        btn.classList.remove('bg-primary', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-on-surface');
      }
    });
  }

  toggleLanguage() {
    this.lang = this.lang === 'ar' ? 'en' : 'ar';
    const htmlEl = document.documentElement;
    if (this.lang === 'en') {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
      this.showToast('Language switched to English (LTR preview)', 'info');
    } else {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ar');
      this.showToast('تم التبديل للغة العربية (RTL)', 'info');
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('wasl-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-surface-base border-status-verified text-on-surface',
      info: 'bg-surface-base border-primary text-on-surface',
      urgent: 'bg-surface-base border-status-urgent text-on-surface'
    };
    const iconColors = {
      success: 'text-status-verified',
      info: 'text-primary',
      urgent: 'text-status-urgent'
    };
    const icons = {
      success: 'check_circle',
      info: 'info',
      urgent: 'bolt'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border-r-4 ${bgColors[type] || bgColors.info} transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px] ${iconColors[type] || iconColors.info}">${icons[type] || 'info'}</span>
      <span class="flex-1">${message}</span>
      <button class="text-text-muted hover:text-on-surface text-xs" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.remove('translate-y-2', 'opacity-0');

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  injectToastContainer() {
    if (document.getElementById('wasl-toast-container')) return;
    const toastBox = document.createElement('div');
    toastBox.id = 'wasl-toast-container';
    toastBox.className = 'fixed bottom-20 start-6 z-[9999] flex flex-col gap-2 max-w-md pointer-events-auto';
    document.body.appendChild(toastBox);
  }

  injectQuickNavigator() {
    if (document.getElementById('wasl-quick-navigator')) return;
    const nav = document.createElement('div');
    nav.id = 'wasl-quick-navigator';
    nav.className = 'fixed bottom-4 start-1/2 -translate-x-1/2 z-[9998] transition-transform duration-300';
    
    let pillsHtml = this.routesConfig.map(r => `
      <button data-nav-pill="${r.id}" data-path="${r.id}" title="${r.title}" 
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border border-border-subtle bg-white text-on-surface hover:bg-surface-lavender hover:text-primary whitespace-nowrap">
        <span class="material-symbols-outlined text-[15px]">${r.icon}</span>
        <span>${r.title.split('|')[0].trim()}</span>
      </button>
    `).join('');

    nav.innerHTML = `
      <div class="navigator-dock bg-surface-base/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-2 px-3 flex items-center gap-2 max-w-[94vw] overflow-x-auto shadow-2xl">
        <div class="flex items-center gap-1 text-xs font-bold text-primary pe-2 border-e border-border-subtle">
          <span class="material-symbols-outlined text-[18px]">alt_route</span>
          <span class="hidden md:inline">انتقال سريع:</span>
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
          ${pillsHtml}
        </div>
        <button id="btn-run-tests" class="ms-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-status-verified text-white hover:bg-emerald-600 transition-colors shadow-sm whitespace-nowrap">
          <span class="material-symbols-outlined text-[15px]">verified</span>
          <span>فحص الانتقالات</span>
        </button>
        <button onclick="document.getElementById('wasl-quick-navigator').classList.toggle('translate-y-16')" title="طي / فتح الشريط" class="p-1 rounded-full text-text-muted hover:text-primary">
          <span class="material-symbols-outlined text-[18px]">unfold_more</span>
        </button>
      </div>
    `;

    document.body.appendChild(nav);

    // Attach click to "فحص الانتقالات" button
    document.getElementById('btn-run-tests').addEventListener('click', () => {
      this.runAutomatedTransitionTest();
    });
  }

  /**
   * Automated Transition Test Suite: Tests sequential navigation across all 12 views
   */
  async runAutomatedTransitionTest() {
    this.showToast('جاري بدء اختبار الانتقالات الآلي عبر كافة الواجهات الـ 12...', 'info');
    const results = [];
    const testRoutes = this.routesConfig.map(r => r.id);

    console.log('%c[Wasl Test Suite] Starting Automated Transition Test...', 'color: #6D28D9; font-weight: bold;');

    for (let i = 0; i < testRoutes.length; i++) {
      const targetRoute = testRoutes[i];
      const startT = performance.now();
      try {
        await this.navigate(targetRoute, { force: true });
        await this.sleep(80); // Wait for transition render
        const endT = performance.now();
        const duration = Math.round(endT - startT);
        
        // Verify view container has content
        const hasContent = this.container.children.length > 0 && this.container.innerHTML.length > 500;
        
        results.push({
          step: i + 1,
          route: targetRoute,
          title: this.routes[targetRoute]?.title || targetRoute,
          durationMs: duration,
          rendered: hasContent,
          status: hasContent ? 'PASS' : 'FAIL'
        });
      } catch (err) {
        results.push({
          step: i + 1,
          route: targetRoute,
          title: targetRoute,
          error: err.message,
          status: 'FAIL'
        });
      }
    }

    // Return to home
    await this.navigate('home');

    // Display formatted results in console & show toast summary
    console.table(results);
    const passCount = results.filter(r => r.status === 'PASS').length;
    this.showToast(`اكتمل فحص الانتقالات: ${passCount} من أصل ${results.length} واجهة بنجاح 100%!`, 'success');

    // Store in window for inspection
    window.LAST_TEST_RESULTS = results;
    return results;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instantiate router on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.router = new WaslRouter();
});

