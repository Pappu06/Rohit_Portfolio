/* ============================================
   ROHIT KUMAR — Portfolio JavaScript
   Cinematic Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ===================== CURSOR SPOTLIGHT =====================
    const spotlight = document.getElementById('cursorSpotlight');
    let mouseX = 0, mouseY = 0;
    let spotX = 0, spotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateSpotlight() {
        spotX += (mouseX - spotX) * 0.08;
        spotY += (mouseY - spotY) * 0.08;
        spotlight.style.left = spotX + 'px';
        spotlight.style.top = spotY + 'px';
        requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();

    // ===================== PARTICLES =====================
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacityDirection = Math.random() > 0.5 ? 1 : -1;
            this.golden = Math.random() > 0.6;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Twinkle effect
            this.opacity += this.opacityDirection * 0.003;
            if (this.opacity > 0.6) this.opacityDirection = -1;
            if (this.opacity < 0.05) this.opacityDirection = 1;

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.golden) {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.4})`;
            }
            ctx.fill();

            // Glow for golden particles
            if (this.golden && this.size > 1) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.1})`;
                ctx.fill();
            }
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===================== NAVBAR SCROLL =====================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Glass effect on scroll
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===================== MOBILE NAV =====================
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close nav on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ===================== HERO LETTER ANIMATION =====================
    const animateLetterElements = document.querySelectorAll('.animate-letters');

    animateLetterElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        const delay = parseInt(el.dataset.delay) || 0;

        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.classList.add('letter');
            if (char === ' ') {
                span.classList.add('space');
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            el.appendChild(span);

            setTimeout(() => {
                span.classList.add('visible');
            }, delay + i * 50);
        });
    });

    // Hero fade animations
    const animateFadeElements = document.querySelectorAll('.animate-fade');
    animateFadeElements.forEach(el => {
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, delay);
    });

    // ===================== SCROLL REVEAL =====================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===================== COUNTER ANIMATION =====================
    const counters = document.querySelectorAll('.counter, .about-stat-number');
    let countersAnimated = new Set();

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
                countersAnimated.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ===================== PORTFOLIO FILTER =====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // ===================== MAGNETIC BUTTONS =====================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===================== SMOOTH SCROLL =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================== PARALLAX EFFECT =====================
    const heroImage = document.querySelector('.hero-image');

    window.addEventListener('scroll', () => {
        if (heroImage && window.innerWidth > 768) {
            const scrolled = window.scrollY;
            heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });

    // ===================== CONTACT FORM =====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;

            // Simulate send
            setTimeout(() => {
                btn.innerHTML = '<span>✓ Message Sent!</span>';
                btn.style.background = 'linear-gradient(135deg, #28a745, #218838)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ===================== TILT EFFECT ON CARDS =====================
    const tiltCards = document.querySelectorAll('.service-card, .testimonial-card, .skill-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===================== DYNAMIC PAGE TITLE =====================
    const originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '🎬 Come back — Rohit Kumar';
        } else {
            document.title = originalTitle;
        }
    });

    // ===================== PRELOADER (optional touch) =====================
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
