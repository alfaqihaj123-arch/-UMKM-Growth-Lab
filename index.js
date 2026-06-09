document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 0. SUPABASE CLIENT INITIALIZATION
  // ==========================================
  const SUPABASE_URL = 'https://mihoiyiuqbdzcjcggkpi.supabase.co'; // Replace with actual URL
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paG9peWl1cWJkemNqY2dna3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTIxOTUsImV4cCI6MjA5NjU4ODE5NX0.qH9yz3o_tchx_uya9XLcdycrflOX7T6I5wQLNYh6-Hk'; // Replace with actual Anon Key
  let supabaseClient = null;

  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.error('Supabase initialization error:', err);
    }
  }

  // ==========================================
  // 1. STICKY HEADER & MOBILE NAV
  // ==========================================
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Mobile hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  });


  // ==========================================
  // 2. DARK MODE SYSTEM
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check local storage or system preference
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  // ==========================================
  // 3. SCROLL REVEAL ANIMATION
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));


  // ==========================================
  // 4. TRUST INDICATORS: ANIMATED COUNTERS
  // ==========================================
  const trustSection = document.querySelector('.trust');
  const counterNumbers = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const animateCounters = () => {
    counterNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 100; // lower is faster
      const increment = target / speed;

      let current = 0;
      const updateNumber = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          setTimeout(updateNumber, 10);
        } else {
          counter.innerText = target;
        }
      };
      updateNumber();
    });
  };

  if (trustSection) {
    const trustObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
        trustObserver.unobserve(trustSection);
      }
    }, { threshold: 0.5 });

    trustObserver.observe(trustSection);
  }


  // ==========================================
  // 5. TESTIMONIALS CAROUSEL
  // ==========================================
  const slider = document.querySelector('.testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlideIndex = 0;
  let autoplayTimer;

  if (slider && slides.length > 0) {
    // Generate dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateDots = () => {
      dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const goToSlide = (index) => {
      currentSlideIndex = index;
      slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      updateDots();
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      goToSlide(currentSlideIndex);
    };

    const prevSlide = () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      goToSlide(currentSlideIndex);
    };

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay
    const startAutoplay = () => {
      autoplayTimer = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    startAutoplay();

    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.testimonials-slider-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
      carouselContainer.addEventListener('mouseleave', startAutoplay);
    }
  }


  // ==========================================
  // 6. BUSINESS TOOLS INTERFACE
  // ==========================================
  const toolTabs = document.querySelectorAll('.tool-tab');
  const toolContents = document.querySelectorAll('.tool-content');

  toolTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tool');
      
      toolTabs.forEach(t => t.classList.remove('active'));
      toolContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tool-${target}`).classList.add('active');
    });
  });


  // ==========================================
  // Helper: Format Rupiah (IDR)
  // ==========================================
  const formatIDR = (number) => {
    if (isNaN(number) || !isFinite(number)) return 'Rp 0';
    return 'Rp ' + Math.round(number).toLocaleString('id-ID');
  };

  const cleanInputNumber = (val) => {
    return parseFloat(val.replace(/[^0-9]/g, '')) || 0;
  };

  // Add auto-formatting for Rupiah inputs on typing
  const rupiahInputs = document.querySelectorAll('.input-rupiah');
  rupiahInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value) {
        e.target.value = parseInt(value, 10).toLocaleString('id-ID');
      } else {
        e.target.value = '';
      }
    });
  });


  // ==========================================
  // A. Break-Even Point (BEP) Calculator
  // ==========================================
  const bepFixedCost = document.getElementById('bep-fixed-cost');
  const bepSellingPrice = document.getElementById('bep-selling-price');
  const bepVarCost = document.getElementById('bep-variable-cost');

  const calcBEP = () => {
    const fc = cleanInputNumber(bepFixedCost.value);
    const sp = cleanInputNumber(bepSellingPrice.value);
    const vc = cleanInputNumber(bepVarCost.value);

    const unitResult = document.getElementById('bep-result-units');
    const moneyResult = document.getElementById('bep-result-idr');

    if (fc > 0 && sp > vc) {
      const marginContribution = sp - vc;
      const bepUnits = fc / marginContribution;
      const bepIDR = bepUnits * sp;

      unitResult.innerText = `${Math.ceil(bepUnits).toLocaleString('id-ID')} Unit`;
      moneyResult.innerText = formatIDR(bepIDR);
    } else {
      unitResult.innerText = '0 Unit';
      moneyResult.innerText = 'Rp 0';
    }
  };

  [bepFixedCost, bepSellingPrice, bepVarCost].forEach(input => {
    if (input) input.addEventListener('input', calcBEP);
  });


  // ==========================================
  // B. Food Cost Calculator
  // ==========================================
  const fcIngredient = document.getElementById('fc-ingredient-cost');
  const fcSellingPrice = document.getElementById('fc-selling-price');

  const calcFoodCost = () => {
    const cost = cleanInputNumber(fcIngredient.value);
    const price = cleanInputNumber(fcSellingPrice.value);

    const pctResult = document.getElementById('fc-result-percent');
    const marginResult = document.getElementById('fc-result-margin');

    if (cost > 0 && price > 0) {
      const foodCostPct = (cost / price) * 100;
      const marginPct = 100 - foodCostPct;

      pctResult.innerText = `${foodCostPct.toFixed(1)}%`;
      marginResult.innerText = `${marginPct.toFixed(1)}%`;

      // Visual indicator color
      if (foodCostPct > 35) {
        pctResult.style.color = '#ef4444'; // Red (Too high)
      } else if (foodCostPct >= 28 && foodCostPct <= 35) {
        pctResult.style.color = '#f59e0b'; // Amber (Moderate)
      } else {
        pctResult.style.color = '#10b981'; // Emerald Green (Healthy)
      }
    } else {
      pctResult.innerText = '0%';
      marginResult.innerText = '0%';
      pctResult.style.color = '';
    }
  };

  [fcIngredient, fcSellingPrice].forEach(input => {
    if (input) input.addEventListener('input', calcFoodCost);
  });


  // ==========================================
  // C. Profit Margin Calculator
  // ==========================================
  const pmCOGS = document.getElementById('pm-cogs');
  const pmSellingPrice = document.getElementById('pm-selling-price');

  const calcProfitMargin = () => {
    const cogs = cleanInputNumber(pmCOGS.value);
    const price = cleanInputNumber(pmSellingPrice.value);

    const gpResult = document.getElementById('pm-result-gp');
    const gpmResult = document.getElementById('pm-result-gpm');
    const markupResult = document.getElementById('pm-result-markup');

    if (price > 0 && price >= cogs) {
      const grossProfit = price - cogs;
      const gpm = (grossProfit / price) * 100;
      const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;

      gpResult.innerText = formatIDR(grossProfit);
      gpmResult.innerText = `${gpm.toFixed(1)}%`;
      markupResult.innerText = cogs > 0 ? `${markup.toFixed(1)}%` : 'N/A';
    } else {
      gpResult.innerText = 'Rp 0';
      gpmResult.innerText = '0%';
      markupResult.innerText = '0%';
    }
  };

  [pmCOGS, pmSellingPrice].forEach(input => {
    if (input) input.addEventListener('input', calcProfitMargin);
  });


  // ==========================================
  // D. Business Health Check Quiz
  // ==========================================
  const quizSteps = document.querySelectorAll('.quiz-step');
  const nextQuizBtn = document.getElementById('quiz-next-btn');
  const prevQuizBtn = document.getElementById('quiz-prev-btn');
  const progressBar = document.querySelector('.quiz-progress-bar');
  const quizOptions = document.querySelectorAll('.quiz-option');
  
  let currentQuizStep = 0;
  // Answers tracking: store score for each of 5 questions (0 or 20)
  const quizAnswers = [null, null, null, null, null];
  
  // Custom recommendations text for each question if answered "Tidak" (Option 2)
  const quizRecommendations = [
    "Mulai mencatat keuangan secara disiplin. Pisahkan rekening pribadi dengan rekening bisnis, dan catat arus kas harian menggunakan aplikasi pembukuan digital.",
    "Dokumentasikan Standard Operating Procedure (SOP) untuk aktivitas kritikal bisnis, seperti pembuatan menu (F&B) atau alur layanan pelanggan, guna menjaga konsistensi kualitas.",
    "Buat strategi pemasaran digital terstruktur. Atur jadwal posting rutin di media sosial, buat profil Google Maps / Google My Business, dan manfaatkan ads berbudget rendah.",
    "Lakukan kalkulasi rinci untuk Food Cost atau Harga Pokok Penjualan (HPP) setiap produk. Review harga bahan baku bulanan dan sesuaikan harga jual jika margin menipis.",
    "Alokasikan minimal 10% dari laba bulanan untuk disimpan sebagai Dana Darurat Bisnis sampai terkumpul dana operasional aman minimal 3-6 bulan."
  ];

  const updateQuizUI = () => {
    // Show active step
    quizSteps.forEach((step, idx) => {
      if (idx === currentQuizStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update Progress Bar
    const progressPercent = ((currentQuizStep + 1) / quizSteps.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Toggle Back button
    if (currentQuizStep === 0) {
      prevQuizBtn.style.visibility = 'hidden';
    } else {
      prevQuizBtn.style.visibility = 'visible';
    }

    // Toggle Next / Submit button text
    if (currentQuizStep === quizSteps.length - 1) {
      nextQuizBtn.innerHTML = 'Lihat Hasil <i class="fas fa-check-circle"></i>';
    } else {
      nextQuizBtn.innerHTML = 'Selanjutnya <i class="fas fa-arrow-right"></i>';
    }

    // Enable next button only if option is selected
    if (quizAnswers[currentQuizStep] !== null) {
      nextQuizBtn.removeAttribute('disabled');
    } else {
      nextQuizBtn.setAttribute('disabled', 'true');
    }
  };

  // Option selection click handler
  quizOptions.forEach(option => {
    option.addEventListener('click', () => {
      const stepEl = option.closest('.quiz-step');
      const stepIndex = parseInt(stepEl.getAttribute('data-step'), 10);
      const optionVal = parseInt(option.getAttribute('data-value'), 10); // 20 for Yes, 0 for No

      // Highlight selected card
      const stepOptions = stepEl.querySelectorAll('.quiz-option');
      stepOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Save answer
      quizAnswers[stepIndex] = optionVal;

      // Enable next button
      nextQuizBtn.removeAttribute('disabled');
    });
  });

  if (nextQuizBtn) {
    nextQuizBtn.addEventListener('click', () => {
      if (currentQuizStep < quizSteps.length - 1) {
        currentQuizStep++;
        updateQuizUI();
      } else {
        // Show results
        showQuizResults();
      }
    });
  }

  if (prevQuizBtn) {
    prevQuizBtn.addEventListener('click', () => {
      if (currentQuizStep > 0) {
        currentQuizStep--;
        updateQuizUI();
      }
    });
  }

  const showQuizResults = () => {
    const totalScore = quizAnswers.reduce((sum, current) => sum + current, 0);
    const quizArea = document.getElementById('quiz-active-area');
    const resultsArea = document.getElementById('quiz-results-area');
    
    // Hide active question area
    quizArea.style.display = 'none';
    resultsArea.classList.add('active');

    // Update gauge fill visual
    const fillCircle = document.querySelector('.quiz-gauge-fill');
    const scoreVal = document.getElementById('quiz-score-val');
    scoreVal.innerText = totalScore;
    
    // Calculate SVG stroke-dashoffset (Radius = 70, Circumference = 439.6)
    const offset = 439.6 - (439.6 * totalScore) / 100;
    fillCircle.style.strokeDashoffset = offset;

    // Determine state
    const resultTitle = document.getElementById('quiz-result-title');
    const resultDesc = document.getElementById('quiz-result-desc');
    const recsContainer = document.getElementById('quiz-recs-list');
    
    recsContainer.innerHTML = ''; // Clear previous

    if (totalScore >= 80) {
      resultTitle.className = 'quiz-result-title healthy';
      resultTitle.innerHTML = 'Kondisi Bisnis Anda: <span>SEHAT (Healthy)</span>';
      resultDesc.innerText = 'Selamat! Sistem operasional, keuangan, dan pemasaran bisnis Anda sudah berjalan di jalur yang benar. Pertahankan konsistensi dan mulailah merancang strategi skala besar (scaling up).';
      fillCircle.style.stroke = '#10b981'; // Emerald
    } else if (totalScore >= 50 && totalScore <= 70) {
      resultTitle.className = 'quiz-result-title average';
      resultTitle.innerHTML = 'Kondisi Bisnis Anda: <span>PERLU PERBAIKAN (Average)</span>';
      resultDesc.innerText = 'Bisnis Anda beroperasi dengan cukup baik, namun memiliki beberapa celah kritis yang dapat menghambat pertumbuhan jangka panjang atau membuat bisnis rentan terhadap guncangan pasar.';
      fillCircle.style.stroke = '#f59e0b'; // Amber
    } else {
      resultTitle.className = 'quiz-result-title critical';
      resultTitle.innerHTML = 'Kondisi Bisnis Anda: <span>KRITIS (Critical)</span>';
      resultDesc.innerText = 'Peringatan! Bisnis Anda berjalan tanpa landasan sistem keuangan dan operasional yang aman. Anda sangat direkomendasikan untuk segera melakukan restrukturisasi fundamental agar terhindar dari kerugian besar.';
      fillCircle.style.stroke = '#ef4444'; // Red
    }

    // Populate recommendations based on "Tidak" answers (score 0)
    let recommendationsCount = 0;
    quizAnswers.forEach((score, idx) => {
      if (score === 0) {
        recommendationsCount++;
        const recItem = document.createElement('div');
        recItem.classList.add('quiz-rec-item');
        recItem.innerHTML = `
          <i class="fas fa-exclamation-triangle"></i>
          <span class="quiz-rec-text">${quizRecommendations[idx]}</span>
        `;
        recsContainer.appendChild(recItem);
      }
    });

    // If score is 100, add a growth recommendation
    if (recommendationsCount === 0) {
      const recItem = document.createElement('div');
      recItem.classList.add('quiz-rec-item');
      recItem.innerHTML = `
        <i class="fas fa-rocket"></i>
        <span class="quiz-rec-text">Semua indikator dasar terpenuhi! Rekomendasi Anda berikutnya: hubungi tim kami untuk konsultasi integrasi sistem CRM, otomatisasi operasional tingkat lanjut, atau pendanaan ekspansi outlet baru.</span>
      `;
      recsContainer.appendChild(recItem);
    }
  };

  // Reset Quiz
  const resetQuizBtn = document.getElementById('quiz-reset-btn');
  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      currentQuizStep = 0;
      quizAnswers.fill(null);
      
      // Clear selected options in DOM
      const options = document.querySelectorAll('.quiz-option');
      options.forEach(opt => opt.classList.remove('selected'));

      // Show quiz area
      document.getElementById('quiz-active-area').style.display = 'block';
      document.getElementById('quiz-results-area').classList.remove('active');

      updateQuizUI();
    });
  }

  // Initialize Quiz UI
  updateQuizUI();


  // ==========================================
  // 7. FAQ ACCORDION LOGIC
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 8. CONTACT FORM VALIDATION & WHATSAPP REDIRECT
  // ==========================================
  const contactForm = document.getElementById('consultation-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const btnSubmitForm = document.getElementById('btn-submit-form');
  const btnSubmitWA = document.getElementById('btn-submit-wa');

  const validateForm = () => {
    let isValid = true;
    const name = document.getElementById('contact-name');
    const bizName = document.getElementById('contact-biz-name');
    const phone = document.getElementById('contact-phone');
    const email = document.getElementById('contact-email');
    const challenge = document.getElementById('contact-challenge');

    // Simple reset borders
    [name, bizName, phone, email, challenge].forEach(input => {
      if (input) input.style.borderColor = '';
    });

    if (name && !name.value.trim()) { name.style.borderColor = '#ef4444'; isValid = false; }
    if (bizName && !bizName.value.trim()) { bizName.style.borderColor = '#ef4444'; isValid = false; }
    if (phone && !phone.value.trim()) { phone.style.borderColor = '#ef4444'; isValid = false; }
    if (email && !email.value.trim()) { email.style.borderColor = '#ef4444'; isValid = false; }
    if (challenge && !challenge.value.trim()) { challenge.style.borderColor = '#ef4444'; isValid = false; }

    return isValid;
  };

  // Generate WhatsApp Message text template
  const getWhatsAppMessage = () => {
    const name = document.getElementById('contact-name').value.trim();
    const bizName = document.getElementById('contact-biz-name').value.trim();
    const industry = document.getElementById('contact-industry').value;
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const challenge = document.getElementById('contact-challenge').value.trim();

    return encodeURIComponent(
      `Halo UMKM Growth Lab,\n\nSaya ingin berkonsultasi mengenai pertumbuhan bisnis saya.\n\n` +
      `*Detail Informasi Klien:*\n` +
      `- Nama Lengkap: ${name}\n` +
      `- Nama Bisnis: ${bizName}\n` +
      `- Bidang Industri: ${industry}\n` +
      `- No. Telepon/WA: ${phone}\n` +
      `- Alamat Email: ${email}\n\n` +
      `*Tantangan Bisnis Saat Ini:*\n` +
      `"${challenge}"\n\n` +
      `Mohon diatur jadwal untuk sesi konsultasi gratis kami. Terima kasih!`
    );
  };

  // Standard Button Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateForm()) {
        const name = document.getElementById('contact-name').value.trim();
        const bizName = document.getElementById('contact-biz-name').value.trim();
        const industry = document.getElementById('contact-industry').value;
        const phone = document.getElementById('contact-phone').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const challenge = document.getElementById('contact-challenge').value.trim();

        // Change submit button state to loading
        const originalBtnText = btnSubmitForm ? btnSubmitForm.innerHTML : 'Kirim Formulir';
        if (btnSubmitForm) {
          btnSubmitForm.setAttribute('disabled', 'true');
          btnSubmitForm.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-spin"></i>';
        }

        if (supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('leads')
              .insert([
                { 
                  name, 
                  business_name: bizName, 
                  industry, 
                  phone, 
                  email, 
                  challenge 
                }
              ]);
            
            if (error) console.error('Supabase save error:', error);
          } catch (err) {
            console.error('Supabase insertion catch error:', err);
          }
        }

        if (btnSubmitForm) {
          btnSubmitForm.removeAttribute('disabled');
          btnSubmitForm.innerHTML = originalBtnText;
        }

        // Show success modal
        if (successModal) {
          successModal.classList.add('active');
        }
        contactForm.reset();
      }
    });
  }

  // Submit via WhatsApp redirect
  if (btnSubmitWA) {
    btnSubmitWA.addEventListener('click', async (e) => {
      e.preventDefault();
      if (validateForm()) {
        const name = document.getElementById('contact-name').value.trim();
        const bizName = document.getElementById('contact-biz-name').value.trim();
        const industry = document.getElementById('contact-industry').value;
        const phone = document.getElementById('contact-phone').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const challenge = document.getElementById('contact-challenge').value.trim();

        // Also save to Supabase silently in the background if configured
        if (supabaseClient) {
          try {
            await supabaseClient.from('leads').insert([
              { name, business_name: bizName, industry, phone, email, challenge }
            ]);
          } catch (err) {
            console.error('Supabase background log error:', err);
          }
        }

        const msg = getWhatsAppMessage();
        const waNumber = '6285871121712'; // Mock consulting WhatsApp number
        const waLink = `https://wa.me/${waNumber}?text=${msg}`;
        window.open(waLink, '_blank');
        contactForm.reset();
      }
    });
  }

  // Close Success Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
    
    // Close on click outside modal card
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }


  // ==========================================
  // 9. NEWSLETTER FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        alert('Terima kasih! Email Anda telah terdaftar untuk menerima update tips bisnis kami.');
        newsletterForm.reset();
      }
    });
  }
});
