// assets/js/main.js

function handleMarketerTracking() {
    // ... (نفس الكود السابق لنظام الإحالة) ...
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref) {
            localStorage.setItem('optiline_marketer_ref', ref);
            const date = new Date();
            date.setTime(date.getTime() + (60 * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = "optiline_ref=" + encodeURIComponent(ref) + "; " + expires + "; path=/; samesite=lax";
            console.log('OPTILINE TRACKING: Ref saved.', ref);
        }
    } catch(e) { console.warn('OPTILINE TRACKING: Error.', e); }
}

function initCookieConsent() {
    // ... (نفس كود الكوكيز السابق) ...
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    const consentKey = 'optiline_cookie_consent';
    if (!banner || !acceptBtn || !rejectBtn) return;
    const hasConsent = localStorage.getItem(consentKey);
    if (hasConsent) {
        banner.style.display = 'none';
        return;
    }
    setTimeout(() => {
        if (!localStorage.getItem(consentKey)) {
            banner.style.display = 'flex';
        }
    }, 2000); 
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'accepted');
        banner.style.display = 'none';
    });
    rejectBtn.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'rejected');
        banner.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // هام: تسجيل ScrollToPlugin هنا ليعمل الكود الجديد
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- LENIS SMOOTH SCROLL SETUP ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // ربط Lenis مع GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    // ---------------------------------
    
    handleMarketerTracking();
    initCookieConsent();

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // GSAP Animations
    // Hero Content Fade In
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const tl = gsap.timeline();
        tl.to(".hero-content h1", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
          .to(".hero-content p", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
          .to(".hero-content .cta-button", { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5")
          .to(".icon-item", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.5");
    }

    // General Section Animations (Fade Up)
    gsap.utils.toArray('.anim-group').forEach(group => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: group,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Number Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        statNumbers.forEach(el => {
            gsap.to(el, {
                innerText: +el.dataset.target,
                duration: 2.5,
                roundProps: "innerText",
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        gsap.to(item, { display: "grid", opacity: 1, duration: 0.5, ease: "power2.out" });
                    } else {
                        gsap.to(item, { opacity: 0, duration: 0.3, onComplete: () => item.style.display = "none" });
                    }
                });
            });
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(q => {
            q.addEventListener('click', () => {
                const answer = q.nextElementSibling;
                const icon = q.querySelector('i');
                
                // Close others
                faqQuestions.forEach(otherQ => {
                    if (otherQ !== q) {
                        gsap.to(otherQ.nextElementSibling, { height: 0, duration: 0.3 });
                        otherQ.querySelector('i').style.transform = "rotate(0deg)";
                    }
                });

                // Toggle current
                if (answer.clientHeight === 0) {
                    gsap.to(answer, { height: "auto", duration: 0.3 });
                    icon.style.transform = "rotate(180deg)";
                } else {
                    gsap.to(answer, { height: 0, duration: 0.3 });
                    icon.style.transform = "rotate(0deg)";
                }
            });
        });
    }

    // Scroll to Top Button Logic
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.style.display = "flex"; // Show button
            } else {
                scrollTopBtn.style.display = "none"; // Hide button
            }
        };

        scrollTopBtn.addEventListener("click", function() {
            // Smooth scroll to top using Lenis if available, else native
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    }
    
    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover effect on links and buttons
        const hoverElements = document.querySelectorAll('a, button, .service-card, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = 'var(--accent-purple)';
                cursor.style.backgroundColor = 'rgba(138, 43, 226, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'var(--accent-light)';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }
});
