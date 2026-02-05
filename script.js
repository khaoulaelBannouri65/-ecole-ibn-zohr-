// ===========================
// Navigation & Menu
// ===========================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navRight = document.querySelector('.nav-right');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navRight.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Animate menu toggle bars
    const spans = menuToggle.querySelectorAll('span');
    if (navRight.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navRight.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!navbar.contains(e.target) && navRight.classList.contains('active')) {
            navRight.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});


// ===========================
// Internationalization (i18n) System
// ===========================
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLanguage') || 'fr';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyTranslations();
        this.setupLanguageSwitcher();
        this.updateHTMLLang();
    }

    async loadTranslations() {
        try {
            const response = await fetch(`${this.currentLang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                // Check if translation contains HTML tags
                if (translation.includes('<') && translation.includes('>')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update language button text
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.getTranslation(`lang.${this.currentLang}`);
        }

        // Update document direction for Arabic
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.translations);
    }

    async changeLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        await this.loadTranslations();
        this.applyTranslations();
        this.updateHTMLLang();
    }

    updateHTMLLang() {
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }

    setupLanguageSwitcher() {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');

        if (!langBtn || !langDropdown) return;

        // Toggle dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });

        // Language selection
        const langOptions = langDropdown.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.changeLanguage(lang);
                langDropdown.classList.remove('active');
            });
        });
    }
}

// Initialize i18n
const i18n = new I18n();

// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// ===========================
// Video Loading Optimization
// ===========================
const videoCards = document.querySelectorAll('.video-card');

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe && !iframe.src) {
                iframe.src = iframe.dataset.src;
            }
        }
    });
}, {
    threshold: 0.1
});

videoCards.forEach(card => {
    const iframe = card.querySelector('iframe');
    if (iframe) {
        // Store original src and remove it for lazy loading
        iframe.dataset.src = iframe.src;
        // Uncomment the line below to enable lazy loading
        // iframe.src = '';
    }
    videoObserver.observe(card);
});

// ===========================
// Form Link Tracking (Optional Analytics)
// ===========================
const formLinks = document.querySelectorAll('.btn-form');
formLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const formType = link.textContent.includes('Ausbildung') ? 'Ausbildung' : 'General';
        console.log(`Form opened: ${formType}`);
        
        // You can add analytics tracking here
        // Example: gtag('event', 'form_open', { form_type: formType });
    });
});

// ===========================
// Utility Functions
// ===========================

// Add smooth reveal animation to cards
function revealCards() {
    const cards = document.querySelectorAll('.info-card, .form-card, .video-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Trigger any initial animations
    revealCards();
});

// ===========================
// Performance Monitoring
// ===========================
if ('PerformanceObserver' in window) {
    // Monitor page performance
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('Performance:', entry.name, entry.duration);
        }
    });
    
    // Uncomment to enable performance monitoring
    // perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

// ===========================
// Accessibility Enhancements
// ===========================

// Keyboard navigation for language selector
langBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        langDropdown.classList.toggle('active');
    }
});

// Focus management for mobile menu
menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
    }
});

// Escape key to close dropdowns
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        langDropdown.classList.remove('active');
        if (navMenu.classList.contains('active')) {
            menuToggle.click();
        }
    }
});

// ===========================
// Print Styles Helper
// ===========================
window.addEventListener('beforeprint', () => {
    // Expand all collapsed sections for printing
    console.log('Preparing for print...');
});

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🏥 École Ibn Zohr - Formation en Soins Infirmiers', 
    'color: #1a7a9e; font-size: 18px; font-weight: bold;');
console.log('%cExcellence en formation médicale, compassion dans les soins', 
    'color: #2d8b6f; font-size: 14px;');
// ===========================
// Who We Are Section - Simple Version
// Minimal JavaScript for animations
// ===========================

// Intersection Observer for scroll-triggered animations
const whoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Observe Who We Are section
const whoSection = document.querySelector('.who-we-are-section');
if (whoSection) {
    whoObserver.observe(whoSection);
}

// Smooth scroll for CTA button
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.btn-who-cta');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

console.log('Who We Are section loaded ✓');
// ===========================
// Activities Carousel
// ===========================

// ===========================
// Activities Carousel - IMAGES FIX
// ===========================

class ActivitiesCarousel {
    constructor() {
        this.currentIndex = 0;
        this.activities = [];
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isTransitioning = false;
        this.currentLang = 'fr';
        this.initialized = false;

        this.debug = true;
        this.log('Carousel constructor called');
    }

    log(...args) {
        if (this.debug) {
            console.log('[CAROUSEL]', ...args);
        }
    }

    async init() {
        try {
            this.log('Initializing carousel...');

            await this.waitForTranslationSystem();

            this.detectCurrentLanguage();
            this.log('Initial language:', this.currentLang);

            await this.loadActivities();
            this.log('Activities loaded:', this.activities.length);

            this.render();
            this.log('Carousel rendered');

            this.setupEventListeners();
            this.log('Event listeners set up');

            this.startAutoplay();
            this.log('Autoplay started');

            this.initialized = true;
            this.log('Carousel fully initialized');
        } catch (error) {
            console.error('[CAROUSEL ERROR] Initialization failed:', error);
        }
    }

    async waitForTranslationSystem() {
        let attempts = 0;
        while (attempts < 20) {
            if (window.TranslationSystem) {
                this.log('TranslationSystem found!');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        this.log('TranslationSystem not found, will use fallback methods');
    }

    detectCurrentLanguage() {
        let lang = 'fr';

        if (window.TranslationSystem && typeof window.TranslationSystem.getCurrentLanguage === 'function') {
            lang = window.TranslationSystem.getCurrentLanguage();
        } else if (document.documentElement.lang) {
            lang = document.documentElement.lang;
        } else if (document.documentElement.dir === 'rtl' || document.body.classList.contains('rtl')) {
            lang = 'ar';
        }

        this.currentLang = lang;
        return lang;
    }

    async loadActivities() {
        try {
            const response = await fetch('data/activities.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.activities = data.activities;
            this.log('✅ activities.json loaded via fetch —', this.activities.length, 'items');
        } catch (error) {
            this.log('⚠️ fetch failed (' + error.message + '), using fallback');
            this.activities = this.getFallbackActivities();
        }
    }

    getFallbackActivities() {
        return [
         {
      "id": 1,
      "image": "integration.jpg",
      "title": {
        "fr": "Accueil des nouveaux étudiants",
        "ar": "يوم الإدماج للطلبة الجدد",
        "en": "Welcoming New Students",
        "es": "Acogida de Nuevos Estudiantes",
        "de": "Willkommen für neue Studenten"
      },
      "description": {
        "fr": "Nos étudiants vivent une journée d'intégration favorisant l'échange, la découverte et l'esprit d'équipe.",
        "ar": "يمر طلابنا باليوم الإدماجي الذي يعزز التبادل، الاكتشاف، والروح الفريقية.",
        "en": "Our students experience an integration day promoting exchange, discovery and team spirit.",
        "es": "Nuestros estudiantes viven un día de integración que favorece el intercambio, el descubrimiento y el espíritu de equipo.",
        "de": "Unsere Studenten erleben einen Integrationstag, der Austausch, Entdeckung und Teamgeist fördert."
      }
    },
    {
      "id": 2,
      "image": "enfants.jpg",
      "title": {
        "fr": "Campagne de sensibilisation pour les enfants",
        "ar": "حملة توعية للأطفال",
        "en": "Awareness Campaign for Children",
        "es": "Campaña de Sensibilización para Niños",
        "de": "Aufklärungskampagne für Kinder"
      },
      "description": {
        "fr": "Nos étudiants sensibilisent les enfants aux bonnes pratiques de santé.",
        "ar": "يقوم طلابنا بتدريب الأطفال على الممارسات الصحية الجيدة.",
        "en": "Our students educate children on good health practices.",
        "es": "Nuestros estudiantes sensibilizan a los niños sobre buenas prácticas de salud.",
        "de": "Unsere Studenten sensibilisieren Kinder für gute Gesundheitspraktiken."
      }
    },
    {
      "id": 3,
      "image": "carnavas.jpg",
      "title": {
        "fr": "Caravanes éducatives",
        "ar": " قوافل طبية تحسيسية",
        "en": "Educational Caravan",
        "es": "Caravana Educativa",
        "de": "Bildungskarawane"
      },
      "description": {
        "fr": "Nos étudiants participent aux caravanes éducatives pour sensibiliser et accompagner les communautés locales.",
        "ar": "يشارك طلابنا في قوافل طبية لتوعية ومرافقة المجتمعات المحلية.",
        "en": "Our students participate in an educational caravan to raise awareness and support local communities.",
        "es": "Nuestros estudiantes participan en una caravana educativa para sensibilizar y acompañar a las comunidades locales.",
        "de": "Unsere Studenten nehmen an einer Bildungskarawane teil, um das Bewusstsein zu schärfen und lokale Gemeinschaften zu unterstützen."
      }
    },
    {
      "id": 4,
      "image": "atelier.jpg",
      "title": {
        "fr": "Simulation Médicale",
        "ar": "المحاكاة الطبية",
        "en": "Medical Simulation",
        "es": "Simulación Médica",
        "de": "Medizinische Simulation"
      },
      "description": {
        "fr": "Formation sur mannequins médicaux pour simuler des situations réelles.",
        "ar": "التدريب على الدمى الطبية لمحاكاة المواقف الحقيقية.",
        "en": "Training on medical mannequins to simulate real-life situations.",
        "es": "Formación con maniquíes médicos para simular situaciones reales.",
        "de": "Training an medizinischen Puppen zur Simulation realer Situationen."
      }
    },
    {
      "id": 5,
      "image": "stage.jpg",
      "title": {
        "fr": "Soins aux Patients",
        "ar": "رعاية المرضى",
        "en": "Patient Care",
        "es": "Atención al Paciente",
        "de": "Patientenversorgung"
      },
      "description": {
        "fr": "Pratique des soins infirmiers sous supervision professionnelle.",
        "ar": "ممارسة التمريض تحت إشراف مهني.",
        "en": "Nursing care practice under professional supervision.",
        "es": "Práctica de cuidados de enfermería bajo supervisión profesional.",
        "de": "Pflegepraxis unter professioneller Aufsicht."
      }
    },
    {
      "id": 6,
      "image": "congratuation.jpg",
      "title": {
        "fr": "Soutenance des projets étudiants",
        "ar": "مناقشة بحوث التخرج",
        "en": "Student Project Defense",
        "es": "Defensa de Proyectos Estudiantiles",
        "de": "Verteidigung von Studentenprojekten"
      },
      "description": {
        "fr": "Nos étudiants présentent leurs projets et défendent leurs travaux devant un jury, mettant en valeur leurs compétences et savoir-faire.",
        "ar": "يقوم الطلاب بعرض مشاريعهم ودفاعها أمام لجنة، مما يبرز مهاراتهم ومعرفتهم.",
        "en": "Our students present their projects and defend their work before a jury, showcasing their skills and expertise.",
        "es": "Nuestros estudiantes presentan sus proyectos y defienden sus trabajos ante un jurado, destacando sus competencias y habilidades.",
        "de": "Unsere Studenten präsentieren ihre Projekte und verteidigen ihre Arbeit vor einer Jury, wobei sie ihre Fähigkeiten und Kenntnisse unter Beweis stellen."
      }
    }
        ];
    }

    render() {
        const container = document.getElementById('activitiesCarousel');
        if (!container) return;

        container.innerHTML = `
            <div class="carousel-wrapper">
                <div class="carousel-track" id="carouselTrack">
                    ${this.activities.map((activity, index) => this.createSlide(activity, index)).join('')}
                </div>

                <button class="carousel-btn carousel-btn-prev" id="carouselPrev" aria-label="Previous slide">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <button class="carousel-btn carousel-btn-next" id="carouselNext" aria-label="Next slide">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <div class="carousel-indicators" id="carouselIndicators">
                    ${this.activities.map((_, index) => `
                        <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
                    `).join('')}
                </div>
            </div>
        `;

        this.updateSlidePosition();
        this.preloadImages();
        this.applyRTL();
    }

    // Force-load every image into the browser cache NOW,
    // regardless of whether the slide is visible or not.
    preloadImages() {
        this.activities.forEach((activity) => {
            const img = new Image();
            img.src = activity.image;
        });
        this.log('Preloaded', this.activities.length, 'images');
    }

    createSlide(activity, index) {
        const title = this.getTranslatedText(activity.title);
        const description = this.getTranslatedText(activity.description);

        // FIX: Charger toutes les images immédiatement (loading="eager")
        return `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="carousel-image-wrapper">
                    <img 
                        src="${activity.image}" 
                        alt="${title}" 
                        class="carousel-image"
                        loading="eager"
                        onerror="console.error('Failed to load image:', '${activity.image}')"
                    >
                    <div class="carousel-overlay"></div>
                </div>
                <div class="carousel-content">
                    <h3 class="carousel-title" data-activity-index="${index}">${title}</h3>
                    <p class="carousel-description" data-activity-index="${index}">${description}</p>
                </div>
            </div>
        `;
    }

    getTranslatedText(obj) {
        if (!obj) return '';
        if (obj[this.currentLang]) return obj[this.currentLang];
        if (obj.fr) return obj.fr;
        return Object.values(obj)[0] || '';
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const indicators = document.querySelectorAll('.carousel-indicator');

        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        indicators.forEach(ind => {
            ind.addEventListener('click', e => this.goToSlide(parseInt(e.target.dataset.index)));
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        const carousel = document.getElementById('activitiesCarousel');
        carousel?.addEventListener('mouseenter', () => this.pauseAutoplay());
        carousel?.addEventListener('mouseleave', () => this.startAutoplay());

        this.setupLanguageListeners();
    }

    setupLanguageListeners() {
        // Hook TranslationSystem
        if (window.TranslationSystem && window.TranslationSystem.setLanguage) {
            const original = window.TranslationSystem.setLanguage;
            const self = this;
            window.TranslationSystem.setLanguage = function(lang) {
                const result = original.call(window.TranslationSystem, lang);
                setTimeout(() => self.updateLanguage(lang), 150);
                return result;
            };
        }

        // Watch HTML lang
        const langObserver = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === 'attributes' && m.attributeName === 'lang') {
                    const newLang = document.documentElement.getAttribute('lang');
                    if (newLang && newLang !== this.currentLang) this.updateLanguage(newLang);
                }
            });
        });
        langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

        // Watch dir
        const dirObserver = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === 'attributes' && m.attributeName === 'dir') {
                    const dir = document.documentElement.getAttribute('dir');
                    if (dir === 'rtl' && this.currentLang !== 'ar') this.updateLanguage('ar');
                    else if (dir === 'ltr' && this.currentLang === 'ar') this.updateLanguage(document.documentElement.lang || 'fr');
                }
            });
        });
        dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    }

    updateLanguage(lang) {
    if (lang === this.currentLang) return;

    this.currentLang = lang;

    // 🔥 re-render
    this.render();

    // 🔥 re-bind buttons & events
    this.setupEventListeners();

    // رجوع لنفس slide
    setTimeout(() => {
        this.updateSlidePosition();
    }, 50);
}


    updateAllSlides() {
        this.log('🔄 Updating ALL slides to:', this.currentLang);
        
        const titles = document.querySelectorAll('.carousel-title');
        const descs = document.querySelectorAll('.carousel-description');
        const images = document.querySelectorAll('.carousel-image');

        this.log('Found:', titles.length, 'titles,', descs.length, 'descriptions,', images.length, 'images');

        // Mettre à jour les textes
        titles.forEach(el => {
            const idx = parseInt(el.dataset.activityIndex);
            const activity = this.activities[idx];
            if (activity) {
                el.textContent = this.getTranslatedText(activity.title);
                el.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
                this.log(`✅ Title ${idx} updated`);
            }
        });

        descs.forEach(el => {
            const idx = parseInt(el.dataset.activityIndex);
            const activity = this.activities[idx];
            if (activity) {
                el.textContent = this.getTranslatedText(activity.description);
                el.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
                this.log(`✅ Description ${idx} updated`);
            }
        });

        // Les images sont identiques pour toutes les langues :
        // on ne met à jour que les alt (accessibilité).
        images.forEach((img, idx) => {
            const activity = this.activities[idx];
            if (activity) {
                img.alt = this.getTranslatedText(activity.title);
            }
        });

        this.log('✅ All slides updated');
    }

    applyRTL() {
        const container = document.getElementById('activitiesCarousel');
        if (!container) return;
        
        const isRTL = this.currentLang === 'ar';
        container.classList.toggle('rtl', isRTL);
        
        this.log('RTL mode:', isRTL ? 'ON' : 'OFF');
    }

    next() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex + 1) % this.activities.length;
        this.updateSlide();
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex - 1 + this.activities.length) % this.activities.length;
        this.updateSlide();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateSlide();
    }

    updateSlide() {
        this.isTransitioning = true;
        this.updateSlidePosition();
        this.updateIndicators();
        setTimeout(() => this.isTransitioning = false, 600);
    }

    updateSlidePosition() {
        const track = document.getElementById('carouselTrack');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        if (index === this.currentIndex) slide.classList.add('active');
        else if (index === (this.currentIndex - 1 + this.activities.length) % this.activities.length)
            slide.classList.add('prev');
        else if (index === (this.currentIndex + 1) % this.activities.length)
            slide.classList.add('next');
    });

    const isRTL = this.currentLang === 'ar';

    // ✅ FIX RTL / LTR
    const translateValue = isRTL
        ? this.currentIndex * 100
        : -this.currentIndex * 100;

    track.style.transform = `translateX(${translateValue}%)`;
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((ind, idx) => ind.classList.toggle('active', idx === this.currentIndex));
    }

    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }
}

// Init
let activitiesCarousel;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

function initCarousel() {
    console.log('[CAROUSEL] Initializing...');
    activitiesCarousel = new ActivitiesCarousel();
    activitiesCarousel.init();
}

window.ActivitiesCarousel = ActivitiesCarousel;
window.activitiesCarousel = activitiesCarousel;

window.testCarouselLanguage = function(lang) {
    console.log('Testing carousel with language:', lang);
    activitiesCarousel?.updateLanguage(lang);
};
















