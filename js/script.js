document.addEventListener("DOMContentLoaded", () => {
    
    // 1. EFECTO NAVBAR AL HACER SCROLL
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. MENÚ MÓVIL HAMBURGUESA
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. ANIMACIONES FADE-IN AL BAJAR LA PÁGINA
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((element) => {
        observer.observe(element);
    });

    // 4. CARRUSEL DE GALERÍA CON FLECHAS Y PUNTOS DINÁMICOS
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dotsNav = document.getElementById('carouselDots');

        if (dotsNav && dotsNav.children.length === 0) {
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (idx === 0) dot.classList.add('current-dot');
                dot.setAttribute('data-index', idx);
                dotsNav.appendChild(dot);
            });
        }

        const dots = dotsNav ? Array.from(dotsNav.children) : [];
        let currentIndex = 0;

        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            if (dots.length > 0) {
                dots.forEach(dot => dot.classList.remove('current-dot'));
                if (dots[index]) {
                    dots[index].classList.add('current-dot');
                }
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(currentIndex);
            });
        }

        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button.carousel-dot');
                if (!targetDot) return;
                const index = dots.indexOf(targetDot);
                if (index > -1) {
                    currentIndex = index;
                    updateCarousel(currentIndex);
                }
            });
        }
    }

    // 5. INICIALIZAR EFECTO DE TEXTO TYPEWRITER
    const elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) { 
            new TxtType(elements[i], JSON.parse(toRotate), period); 
        }
    }
});

// FUNCIÓN EXTERNA DEL TYPEWRITER
const TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap" style="border-right: 0.08em solid var(--primary-color); padding-right: 5px;">'+this.txt+'</span>';

    let that = this;
    let delta = 90 - Math.random() * 40; 

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() { that.tick(); }, delta);
};