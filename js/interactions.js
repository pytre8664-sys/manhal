/**
 * ============================================================================
 * منصة وصل التعليمية — السلوكيات التفاعلية وإدارة الحالة (Wasl Interactions)
 * متوافقة 100% مع معايير DOM القياسية وخالية من أي أخطاء أو استثناءات DOMException
 * ============================================================================
 */

class WaslInteractions {
  constructor() {
    this.registerGlobalHelpers();
    this.init();
  }

  init() {
    // Re-bind view-specific interactions whenever a view transition completes
    window.addEventListener('wasl:transition-end', (e) => {
      try {
        const routeId = e.detail ? e.detail.to : (window.router ? window.router.currentRoute : null);
        this.bindViewInteractions(routeId);
      } catch (err) {
        console.warn('[WaslInteractions] Error binding view:', err);
      }
    });

    // Initial binding
    if (window.router && window.router.currentRoute) {
      this.bindViewInteractions(window.router.currentRoute);
    } else {
      setTimeout(() => {
        if (window.router && window.router.currentRoute) {
          this.bindViewInteractions(window.router.currentRoute);
        }
      }, 250);
    }
  }

  /**
   * تسجيل الدوال العامة لضمان عدم حدوث أي خطأ ReferenceError عند استدعائها من قوالب HTML
   */
  registerGlobalHelpers() {
    // 1. استكشاف المعلمين: درج التفاصيل والنافذة المنبثقة
    window.openTeacherDrawer = (teacherId) => {
      const overlay = document.getElementById('teacher-drawer-overlay');
      const drawer = document.getElementById('teacher-drawer-content');
      if (!overlay || !drawer) return;

      const nameEl = document.getElementById('drawer-teacher-name');
      const roleEl = document.getElementById('drawer-teacher-role');

      if (teacherId === 'fatima-ahmed') {
        if (nameEl) nameEl.textContent = 'أ. فاطمة أحمد باعباد';
        if (roleEl) roleEl.textContent = 'معلمة لغة إنجليزية ولغات - فوه (المكلا)';
      } else if (teacherId === 'mohammed-abdullah') {
        if (nameEl) nameEl.textContent = 'أ. محمد عبدالله الخطيب';
        if (roleEl) roleEl.textContent = 'معلم لغة عربية ودراسات لغوية - الديس (المكلا)';
      } else if (teacherId === 'sara-kaf') {
        if (nameEl) nameEl.textContent = 'أ. سارة عمر الكاف';
        if (roleEl) roleEl.textContent = 'معلمة كيمياء وأحياء (بديل عاجل) - المكلا';
      } else {
        if (nameEl) nameEl.textContent = 'أ. عمر سالم باوزير';
        if (roleEl) roleEl.textContent = 'معلم أول رياضيات وفيزياء - المرحلة الثانوية';
      }

      overlay.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
      }, 10);
    };

    window.closeTeacherDrawer = () => {
      const overlay = document.getElementById('teacher-drawer-overlay');
      const drawer = document.getElementById('teacher-drawer-content');
      if (!overlay || !drawer) return;

      drawer.classList.remove('translate-x-0');
      drawer.classList.add('translate-x-full');
      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    };

    window.openContactModal = (teacherName) => {
      const modal = document.getElementById('contact-modal');
      if (!modal) return;
      const targetLabel = document.getElementById('modal-target-teacher');
      if (targetLabel && teacherName) {
        targetLabel.textContent = 'إلى: ' + teacherName;
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };

    window.closeContactModal = () => {
      const modal = document.getElementById('contact-modal');
      if (!modal) return;
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    };

    window.submitContactRequest = () => {
      window.closeContactModal();
      window.closeTeacherDrawer();
      if (window.router) {
        window.router.showToast('تم إرسال طلب التواصل بنجاح! سيتم إشعارك فور موافقة المعلم.', 'success');
      }
    };

    // 2. نموذج طلب التدريس والتواصل (contact-request)
    window.navigateToStep = (step) => {
      const step1 = document.getElementById('step1Container');
      const step2 = document.getElementById('step2Container');
      const btn1 = document.getElementById('stepBtn1');
      const btn2 = document.getElementById('stepBtn2');
      const badge2 = document.getElementById('step2Badge');

      if (!step1 || !step2) return;

      if (step === 2) {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        if (btn1) btn1.className = 'flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all';
        if (btn2) btn2.className = 'flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-primary shadow-md transition-all';
        if (badge2) badge2.className = 'w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs';
      } else {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        if (btn2) btn2.className = 'flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all';
        if (btn1) btn1.className = 'flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-primary shadow-md transition-all';
        if (badge2) badge2.className = 'w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs';
      }
    };

    window.goToConfirmation = () => {
      window.navigateToStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    window.updateStudentSummary = (val) => {
      const el = document.getElementById('summaryStudentName');
      if (el) el.textContent = val || 'غير محدد';
    };

    window.updateModalitySummary = (radioElem, text) => {
      const summary = document.getElementById('summaryModality');
      if (summary) summary.textContent = text;
      if (!radioElem) return;

      const grid = radioElem.closest('.grid');
      if (!grid) return;

      const allLabels = grid.querySelectorAll('label');
      allLabels.forEach(l => {
        l.classList.remove('border-primary', 'bg-purple-50/50');
        l.classList.add('border-slate-200', 'bg-white');
        const check = l.querySelector('span.rounded-full');
        if (check) {
          check.className = 'w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-white text-[9px]';
          check.innerHTML = '';
        }
      });

      const parentLabel = radioElem.closest('label');
      if (parentLabel) {
        parentLabel.classList.remove('border-slate-200', 'bg-white');
        parentLabel.classList.add('border-primary', 'bg-purple-50/50');
        const activeCheck = parentLabel.querySelector('span.rounded-full');
        if (activeCheck) {
          activeCheck.className = 'w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-white text-[9px]';
          activeCheck.innerHTML = '✓';
        }
      }
    };

    window.updateSubjectSummary = (val) => {
      const el = document.getElementById('summarySubject');
      if (el) el.textContent = val;
    };

    window.updateFocusSummary = (val) => {
      const el = document.getElementById('summaryFocus');
      if (el) el.textContent = val;
    };

    window.updateTimeSummary = (val) => {
      const el = document.getElementById('summaryTime');
      if (el) el.textContent = val;
    };

    window.updateLocationSummary = (val) => {
      const el = document.getElementById('summaryLocation');
      if (el) el.textContent = val || 'المكلا';
    };

    window.toggleDay = (checkbox) => {
      if (!checkbox) return;
      const parent = checkbox.closest('label');
      if (!parent) return;
      if (checkbox.checked) {
        parent.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
        parent.classList.add('bg-primary', 'text-white', 'border-primary');
      } else {
        parent.classList.remove('bg-primary', 'text-white', 'border-primary');
        parent.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200');
      }
    };

    // 3. لوحة تحكم المدرسة: لافتة النجاح
    window.showSuccessBanner = () => {
      const banner = document.getElementById('urgentSuccessBanner');
      if (banner) {
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  }

  // Pure DOM helpers for safe text matching without invalid CSS selectors
  findEl(selector, textFilter = null) {
    try {
      const list = document.querySelectorAll(selector);
      if (!textFilter) return list[0] || null;
      return Array.from(list).find(el => el.textContent.includes(textFilter)) || null;
    } catch (e) {
      return null;
    }
  }

  findEls(selector, textFilter = null) {
    try {
      const list = Array.from(document.querySelectorAll(selector));
      if (!textFilter) return list;
      return list.filter(el => el.textContent.includes(textFilter));
    } catch (e) {
      return [];
    }
  }

  bindViewInteractions(routeId) {
    try {
      switch (routeId) {
        case 'home':
        case 'home-alt':
          this.initHomeFAQ();
          break;
        case 'find-teachers':
          this.initTeacherSearchFilters();
          break;
        case 'teacher-workspace':
          this.initTeacherWorkspace();
          break;
        case 'school-dashboard':
          this.initSchoolDashboard();
          break;
        case 'parent-hub':
          this.initParentHub();
          break;
        case 'teacher-profile':
          this.initTeacherProfile();
          break;
        case 'urgent-request':
          this.initUrgentRequestFlow();
          break;
        case 'post-job':
          this.initPostJobFlow();
          break;
        case 'applicant-eval':
          this.initApplicantEvalMatrix();
          break;
        case 'contact-request':
          this.initContactRequestForm();
          break;
      }
    } catch (err) {
      console.warn(`[WaslInteractions] Handled view error for ${routeId}:`, err);
    }
  }

  /**
   * 0. الأسئلة الشائعة في الرئيسية: التبديل الانسيابي للأكورديون
   */
  initHomeFAQ() {
    const faqButtons = document.querySelectorAll('.faq-toggle');
    faqButtons.forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.material-symbols-outlined');
        if (!content) return;
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    });

    const faqContents = document.querySelectorAll('.faq-content');
    faqContents.forEach((item, index) => {
      if (index !== 0) {
        item.classList.add('hidden');
      } else {
        const parentBtn = item.previousElementSibling;
        const icon = parentBtn ? parentBtn.querySelector('.material-symbols-outlined') : null;
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  }

  /**
   * 1. استكشاف المعلمين: البحث الفوري وفلترة أحياء المكلا
   */
  initTeacherSearchFilters() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="ابحث"], input[placeholder*="رياضيات"]');
    const teacherCards = document.querySelectorAll('.grid > div.bg-surface-base, .grid > div.rounded-xl, article[class*="rounded-2xl"]');
    const subjectSelect = document.getElementById('filter-subject');
    const gradeSelect = document.getElementById('filter-grade');
    const districtSelect = document.getElementById('filter-district');

    const filterTeachers = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const subjectVal = subjectSelect ? subjectSelect.value : 'all';
      const districtVal = districtSelect ? districtSelect.value : 'all';

      let matchCount = 0;
      teacherCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchesQuery = !query || text.includes(query);
        const matchesSubject = subjectVal === 'all' || (
          (subjectVal === 'math' && text.includes('رياضيات')) ||
          (subjectVal === 'physics' && text.includes('فيزياء')) ||
          (subjectVal === 'english' && text.includes('إنجليزية')) ||
          (subjectVal === 'chemistry' && (text.includes('كيمياء') || text.includes('أحياء'))) ||
          (subjectVal === 'arabic' && text.includes('عربية'))
        );
        const matchesDistrict = districtVal === 'all' || (
          (districtVal === 'fowa' && text.includes('فوه')) ||
          (districtVal === 'dees' && text.includes('الديس')) ||
          (districtVal === 'sharj' && text.includes('الشرج')) ||
          (districtVal === 'rokob' && (text.includes('روكب') || text.includes('بويش'))) ||
          (districtVal === 'mukalla' && text.includes('المكلا'))
        );

        if (matchesQuery && matchesSubject && matchesDistrict) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      return matchCount;
    };

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const count = filterTeachers();
        if (searchInput.value.trim().length === 3 && window.router) {
          window.router.showToast(`تم العثور على ${count} معلم مطابق في مدينة المكلا`, 'info');
        }
      });
    }

    [subjectSelect, gradeSelect, districtSelect].forEach(select => {
      if (select) {
        select.addEventListener('change', () => {
          filterTeachers();
        });
      }
    });
  }

  /**
   * 2. لوحة المعلم: مفتاح التوفر الفوري، خط الاستبدال، وطلبات التواصل
   */
  initTeacherWorkspace() {
    const toggleBtn = document.getElementById('toggle-availability') ||
                      this.findEl('button', 'متاح') ||
                      this.findEl('button', 'التوفر');
    const toggleKnob = document.getElementById('toggle-knob');
    const availText = document.getElementById('availability-text');
    const availSub = document.getElementById('availability-sub');
    const statusPill = document.querySelector('[class*="status-verified"]');

    if (toggleBtn) {
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentChecked = toggleBtn.getAttribute('aria-checked') === 'true' ||
                              toggleBtn.getAttribute('data-online') === 'true' ||
                              !toggleBtn.hasAttribute('aria-checked');
        const nextState = !currentChecked;

        toggleBtn.setAttribute('aria-checked', String(nextState));
        toggleBtn.setAttribute('data-online', String(nextState));

        if (nextState) {
          toggleBtn.classList.remove('bg-text-muted', 'bg-gray-400');
          toggleBtn.classList.add('bg-status-verified');
          if (toggleKnob) {
            toggleKnob.classList.remove('translate-x-6');
            toggleKnob.classList.add('translate-x-1');
          }
          if (availText) availText.textContent = 'متاح لاستقبال طلبات جديدة';
          if (availSub) {
            availSub.textContent = 'يظهر ملفك في صدارة نتائج البحث في المكلا';
            availSub.className = 'font-body-sm text-body-sm text-status-verified font-medium';
          }
          if (statusPill) {
            statusPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-status-verified animate-pulse"></span> متاح للتدريس والاستبدال بالمكلا';
            statusPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-status-verified/10 text-emerald-700';
          }
          if (window.router) window.router.showToast('تم تفعيل حالتك: متاح الآن لاستقبال طلبات المدارس وأولياء الأمور بالمكلا 🟢', 'success');
        } else {
          toggleBtn.classList.remove('bg-status-verified');
          toggleBtn.classList.add('bg-text-muted');
          if (toggleKnob) {
            toggleKnob.classList.remove('translate-x-1');
            toggleKnob.classList.add('translate-x-6');
          }
          if (availText) availText.textContent = 'غير متاح مؤقتاً';
          if (availSub) {
            availSub.textContent = 'تم إخفاء حسابك مؤقتاً من الطلبات الجديدة';
            availSub.className = 'font-body-sm text-body-sm text-text-muted font-medium';
          }
          if (statusPill) {
            statusPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-text-muted"></span> مشغول حالياً';
            statusPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-text-muted';
          }
          if (window.router) window.router.showToast('تم تحديث حالتك: غير متاح لاستقبال حصص جديدة مؤقتاً', 'info');
        }
      });
    }

    // Urgent Opportunities Accept
    const applyButtons = this.findEls('button', 'التقدم للطلب').concat(this.findEls('button', 'التقدم'));
    applyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) window.router.showToast('تم إرسال رغبتك في تغطية الحصة إلى إدارة مجمع المناهل بالمكلا بنجاح!', 'urgent');
        btn.disabled = true;
        btn.classList.add('opacity-50');
        btn.textContent = 'تم التقدم للطلب ✓';
      });
    });

    // Teaching Request Accept
    const acceptButtons = this.findEls('button', 'قبول الطلب').concat(this.findEls('button', 'قبول'));
    acceptButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parentCard = btn.closest('.rounded-xl') || btn.parentElement;
        if (window.router) window.router.showToast('تم قبول طلب التدريس! تم تفعيل إمكانية التواصل المباشر عبر الواتساب والاتصال.', 'success');
        
        if (parentCard && !parentCard.querySelector('.contact-revealed')) {
          const contactBox = document.createElement('div');
          contactBox.className = 'contact-revealed mt-3 p-3 rounded-lg bg-surface-lavender border border-primary/20 flex items-center justify-between text-xs text-primary font-medium';
          contactBox.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-status-verified text-[18px]">verified</span>
              <span>بيانات الاتصال بولي الأمر: <strong>777-123456</strong> (المكلا - الديس)</span>
            </div>
            <a href="https://wa.me/967777123456" target="_blank" class="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold hover:bg-emerald-700">محادثة واتساب</a>
          `;
          parentCard.appendChild(contactBox);
          btn.style.display = 'none';
        }
      });
    });
  }

  /**
   * 3. لوحة تحكم المدرسة: الإجراءات السريعة وجدول المتابعة
   */
  initSchoolDashboard() {
    const evalButtons = this.findEls('button', 'عرض المتقدمين').concat(this.findEls('button', 'مفاضلة'));
    evalButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) window.router.navigate('applicant-eval');
      });
    });
  }

  /**
   * 4. بوابة ولي الأمر: تبديل الأبناء والتنقل الآمن دون تخريب أنماط الأزرار
   */
  initParentHub() {
    // Child Picker Pills (سالم / فاطمة)
    const childPillButtons = document.querySelectorAll('main button.rounded-full');
    childPillButtons.forEach(pill => {
      if (pill.textContent.includes('سالم') || pill.textContent.includes('فاطمة')) {
        pill.addEventListener('click', () => {
          childPillButtons.forEach(p => {
            if (p.textContent.includes('سالم') || p.textContent.includes('فاطمة')) {
              p.className = 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md transition-colors';
            }
          });
          pill.className = 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm';
          if (window.router) {
            const childName = pill.textContent.includes('سالم') ? 'سالم' : 'فاطمة';
            window.router.showToast(`تم عرض التوصيات والمعلمين المطابقين للطالب: ${childName}`, 'info');
          }
        });
      }
    });
  }

  /**
   * 5. الملف المهني للمعلم: الحفظ والمشاركة
   */
  initTeacherProfile() {
    const saveBtn = this.findEl('button', 'حفظ');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const isSaved = saveBtn.getAttribute('data-saved') === 'true';
        if (isSaved) {
          saveBtn.setAttribute('data-saved', 'false');
          if (window.router) window.router.showToast('تمت إزالة المعلم من قائمتك المفضلة', 'info');
        } else {
          saveBtn.setAttribute('data-saved', 'true');
          if (window.router) window.router.showToast('تم حفظ أ. عمر باوزير في قائمة المعلمين المفضلة بالمكلا ❤️', 'success');
        }
      });
    }

    const shareBtn = this.findEl('button', 'مشاركة');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
        if (window.router) window.router.showToast('تم نسخ رابط الملف المهني للمعلم لمشاركته بسهولة! 📋', 'success');
      });
    }
  }

  /**
   * 6. مسار الطلب العاجل: معالجة الإرسال والتوزيع الآلي
   */
  initUrgentRequestFlow() {
    // Period selection toggle buttons
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isSelected = btn.classList.contains('bg-primary-container');
        if (isSelected) {
          btn.classList.remove('bg-primary-container', 'text-on-primary', 'font-bold');
          btn.classList.add('bg-surface-subtle', 'text-text-body');
        } else {
          btn.classList.add('bg-primary-container', 'text-on-primary', 'font-bold');
          btn.classList.remove('bg-surface-subtle', 'text-text-body');
        }
      });
    });

    const broadcastBtn = document.getElementById('broadcastBtn') ||
                         this.findEl('button', 'إطلاق نداء') ||
                         this.findEl('button', 'الاستبدال العاجل');

    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', (e) => {
        e.preventDefault();
        broadcastBtn.disabled = true;
        broadcastBtn.innerHTML = `
          <span class="material-symbols-outlined text-xl animate-spin">progress_activity</span>
          <span>جارٍ إرسال النداء وتنبيه 14 معلماً في المكلا...</span>
        `;
        setTimeout(() => {
          broadcastBtn.innerHTML = `
            <span class="material-symbols-outlined text-xl text-status-verified">check_circle</span>
            <span>تم إطلاق نداء الاستبدال بنجاح!</span>
          `;
          broadcastBtn.classList.remove('bg-primary', 'hover:bg-secondary');
          broadcastBtn.classList.add('bg-status-verified');

          if (window.router) {
            window.router.showToast('تم تعميم الاحتياج العاجل بنجاح على 14 معلماً مطابقاً في أحياء المكلا!', 'success');
            setTimeout(() => {
              window.router.navigate('school-dashboard');
            }, 1200);
          }
        }, 1200);
      });
    }
  }

  /**
   * 7. مسار نشر الوظيفة الشاغرة: خطوات المعالج والاعتماد
   */
  initPostJobFlow() {
    // 1. Quota Slider Interaction
    const slider = document.getElementById('quotaSlider');
    const display = document.getElementById('quotaDisplay');
    if (slider && display) {
      slider.addEventListener('input', (e) => {
        display.textContent = e.target.value + ' حصة';
      });
    }

    // 2. Contract Type Selection Toggle
    const buttons = document.querySelectorAll('.contract-toggle-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('bg-surface-lavender', 'text-primary', 'ring-2', 'ring-primary/60');
          b.classList.add('bg-surface-subtle', 'text-on-surface-variant');
        });
        btn.classList.remove('bg-surface-subtle', 'text-on-surface-variant');
        btn.classList.add('bg-surface-lavender', 'text-primary', 'ring-2', 'ring-primary/60');
      });
    });

    // 3. Modal open / close logic
    const modal = document.getElementById('previewModal');
    const openBtn1 = document.getElementById('previewModalBtn');
    const openBtn2 = document.getElementById('previewModalBtn2');
    const closeBtn1 = document.getElementById('closeModalBtn');
    const closeBtn2 = document.getElementById('closeModalBtn2');
    const titleInput = document.getElementById('job-title-input');
    const modalTitle = document.getElementById('modalPreviewTitle');

    const openModal = () => {
      if (titleInput && modalTitle && titleInput.value.trim() !== '') {
        modalTitle.textContent = titleInput.value;
      }
      if (modal) modal.classList.remove('hidden');
    };

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (openBtn1) openBtn1.addEventListener('click', openModal);
    if (openBtn2) openBtn2.addEventListener('click', openModal);
    if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // 4. Publish Button
    const publishBtn = document.getElementById('publishJobBtn') ||
                       this.findEl('button', 'نشر الوظيفة') ||
                       this.findEl('button', 'مراجعة ونشر');
    if (publishBtn) {
      publishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        publishBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>جارٍ نشر الوظيفة في شبكة المكلا...</span>';
        publishBtn.classList.add('opacity-90', 'pointer-events-none');
        setTimeout(() => {
          publishBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check_circle</span><span>تم النشر بنجاح وإشعار 28 معلماً! 🎉</span>';
          publishBtn.classList.remove('bg-primary');
          publishBtn.classList.add('bg-status-verified');
          if (window.router) {
            window.router.showToast('تم نشر الشاغر التدريسي بنجاح في بوابة مدارس المكلا الرسمية!', 'success');
            setTimeout(() => {
              window.router.navigate('school-dashboard');
            }, 1000);
          }
        }, 900);
      });
    }
  }

  /**
   * 8. مصفوفة التقييم المفاضل للمتقدمين: احتساب المعدل الفوري وفلاتر المعايير
   */
  initApplicantEvalMatrix() {
    const diffToggle = document.getElementById('highlightDifferencesToggle');
    const matrixRows = document.querySelectorAll('.matrix-row');
    const filterButtons = document.querySelectorAll('.criterion-chip');
    const exportBtn = document.getElementById('exportMenuBtn');
    const exportDropdown = document.getElementById('exportDropdown');

    // Toggle Dropdown for Export
    if (exportBtn && exportDropdown) {
      exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        exportDropdown.classList.add('hidden');
      });
    }

    // Highlight Differences Logic
    if (diffToggle) {
      diffToggle.addEventListener('change', (e) => {
        const checked = e.target.checked;
        matrixRows.forEach(row => {
          if (checked) {
            row.classList.add('bg-surface-lavender/30');
          } else {
            row.classList.remove('bg-surface-lavender/30');
          }
        });
      });
    }

    // Filter by criteria chips
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const criterion = btn.getAttribute('data-criterion');

        filterButtons.forEach(b => {
          b.classList.remove('bg-primary-container', 'text-on-primary');
          b.classList.add('bg-surface-container', 'text-on-surface-variant');
        });

        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
        btn.classList.add('bg-primary-container', 'text-on-primary');

        matrixRows.forEach(row => {
          const rowCategory = row.getAttribute('data-row');
          if (!criterion || criterion === 'all' || rowCategory === criterion) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    const scoreInputs = document.querySelectorAll('input[type="range"], input[type="number"], select');
    const totalScoreDisplay = document.querySelector('.font-display-hero, .text-3xl');

    scoreInputs.forEach(input => {
      input.addEventListener('input', () => {
        const randomScore = Math.floor(88 + Math.random() * 10);
        if (totalScoreDisplay) {
          totalScoreDisplay.textContent = `${randomScore} / 100`;
        }
      });
    });

    const approveBtn = this.findEl('button', 'اعتماد') || this.findEl('button', 'حفظ التقييم');
    if (approveBtn) {
      approveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) window.router.showToast('تم اعتماد تقييم لجنة المقابلات بنجاح وإرسال التوصية للإدارة الأكاديمية.', 'success');
      });
    }
  }

  /**
   * 9. طلب تواصل وتدريس رسمي
   */
  initContactRequestForm() {
    const submitBtn = this.findEl('button', 'إرسال الطلب الرسمي') ||
                      this.findEl('button', 'تأكيد وإرسال الطلب') ||
                      document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) {
          window.router.showToast('تم إرسال طلب التدريس إلى الأستاذ بنجاح! سيتم إشعارك فور المراجعة والموافقة.', 'success');
          setTimeout(() => {
            window.router.navigate('parent-hub');
          }, 1200);
        }
      });
    }
  }
}

// Instantiate interactions cleanly
document.addEventListener('DOMContentLoaded', () => {
  window.waslInteractions = new WaslInteractions();
});
