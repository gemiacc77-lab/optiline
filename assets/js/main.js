/* =========================================
   1. Marketer Tracking & Cookies
   ========================================= */
function handleMarketerTracking() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');

        if (ref) {
            // Save to LocalStorage
            localStorage.setItem('optiline_marketer_ref', ref);

            // Save to Cookies (Expires in 60 days)
            const date = new Date();
            date.setTime(date.getTime() + (60 * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = "optiline_ref=" + encodeURIComponent(ref) + "; " + expires + "; path=/; samesite=lax";
        }
    } catch (e) {
        console.warn('OPTILINE TRACKING: Error.', e);
    }
}

/* =========================================
   2. Cookie Consent Banner
   ========================================= */
function initCookieConsent() {
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

    // Show banner after 2 seconds if no consent
    setTimeout(() => {
        if (!localStorage.getItem(consentKey)) {
            banner.style.display = 'flex';
        }
    }, 2000);

    // Accept Action
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'accepted');
        banner.style.display = 'none';
    });

    // Reject Action
    rejectBtn.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'rejected');
        banner.style.display = 'none';
    });
}

/* =========================================
   3. Main Execution (DOM Ready)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initialize Helpers
    handleMarketerTracking();
    initCookieConsent();

    /* -------------------------------------
       A. Header & Navigation Logic (Modified for Mobile Scroll)
       ------------------------------------- */
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 1. Standard Sticky Effect (Background blur)
            header.classList.toggle('scrolled', scrollTop > 50);

            // 2. Mobile Logic: Hide on Scroll Down / Show on Scroll Up
            // Check if screen width is mobile (768px or less)
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling Down -> Hide Header
                    header.classList.add('header-hidden');
                    // Optionally close menu if open
                    if (hamburger && hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                } else {
                    // Scrolling Up -> Show Header
                    header.classList.remove('header-hidden');
                }
            } else {
                // Always show on Desktop
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }

    // Mobile Menu Toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    /* -------------------------------------
       B. General Animations (Fade Up)
       ------------------------------------- */
    gsap.utils.toArray('.anim-group').forEach(group => {
        // Select all animate-able elements inside the group
        const anims = group.querySelectorAll(
            'h1, h2, h3, h4, p, .cta-button, .logo-grid i, .service-card, .stat-card, .testimonial-card, .team-member, .faq-item, .process-step, .feature-card, .work-item, .blog-post-card, .view-all-work-btn, .service-image, .service-content > *, .service-features li, .industry-card, .filter-buttons, .filter-btn, .portfolio-item, .pricing-card, .icon-item, .contact-wrapper > *, .step-item, .job-card, .no-openings, .payment-icons-wrapper, .payment-icons i, .hero-icons, .comparison-table-wrapper'
        );

        if (anims.length > 0) {
            gsap.from(anims, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: group,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
    });

    /* -------------------------------------
       C. Statistics Counter Animation
       ------------------------------------- */
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

    /* -------------------------------------
       D. Portfolio Filter Logic
       ------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');

                // Update Active Button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter Items
                portfolioItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    const shouldShow = (filterValue === 'all' || itemCategory === filterValue);

                    gsap.killTweensOf(item);
                    gsap.to(item, {
                        duration: 0.5,
                        opacity: shouldShow ? 1 : 0,
                        scale: shouldShow ? 1 : 0.95,
                        display: shouldShow ? 'block' : 'none',
                        ease: "power2.out",
                        delay: 0.1
                    });
                });
            });
        });
    }

    /* -------------------------------------
       E. Pricing Cards & Icons
       ------------------------------------- */
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        pricingCards.forEach(card => {
            card.addEventListener('click', () => {
                pricingCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        // Hero Icons Animation on Pricing Page
        const iconItems = document.querySelectorAll('.icon-item');
        iconItems.forEach(item => {
            const delay = parseFloat(item.getAttribute('data-delay')) || 0;
            gsap.fromTo(item, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.6, delay: 0.5 + delay, ease: "back.out(1.7)" }
            );
        });
    }

    /* -------------------------------------
       F. FAQ Accordion Logic
       ------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other open items
                faqItems.forEach(i => {
                    if (i !== item && i.classList.contains('active')) {
                        i.classList.remove('active');
                        gsap.to(i.querySelector('.faq-answer'), {
                            maxHeight: 0,
                            opacity: 0,
                            duration: 0.2,
                            ease: 'power1.inOut'
                        });
                    }
                });

                // Toggle current item
                item.classList.toggle('active');

                if (item.classList.contains('active')) {
                    gsap.to(answer, {
                        maxHeight: answer.scrollHeight + 'px',
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(answer, {
                        maxHeight: 0,
                        opacity: 0,
                        duration: 0.2,
                        ease: 'power1.inOut'
                    });
                }
            });
        });
    }

    /* -------------------------------------
       G. Scroll To Top Button
       ------------------------------------- */
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = "flex";
                gsap.to(scrollTopBtn, { opacity: 0.7, scale: 1, duration: 0.3 });
            } else {
                gsap.to(scrollTopBtn, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    onComplete: () => { scrollTopBtn.style.display = "none"; }
                });
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.out", autoKill: true });
        });
    }

});
document.addEventListener("DOMContentLoaded", function() {
    const footerParagraph = document.querySelector('.footer-about p');
    
    if (footerParagraph) {
        footerParagraph.textContent = "Elevated growth assets tailored for clarity and strength";
    }
});
});
/* =========================================
   Unified Copyright Text
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    // استهداف الفقرة الموجودة داخل عنصر الحقوق
    const copyrightParagraph = document.querySelector('.copyright p');
    
    // التأكد من وجود العنصر قبل محاولة تغيير النص
    if (copyrightParagraph) {
        copyrightParagraph.textContent = "© 2025 OPTILINE. All Rights Reserved.";
    }
});
