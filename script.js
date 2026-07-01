(function () {
    'use strict';

    /* ===== HEADER — Sombra al hacer scroll ===== */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    /* ===== MENÚ MOBILE ===== */
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            toggle.classList.toggle('open', !expanded);
            mobileNav.hidden = expanded;
        });

        mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.classList.remove('open');
                mobileNav.hidden = true;
            });
        });
    }

    /* ===== STICKY BAR — Ocultar al llegar al registro ===== */
    const stickyBar = document.getElementById('sticky-bar');
    const registroSection = document.getElementById('registro');

    if (stickyBar && registroSection) {
        const stickyObserver = new IntersectionObserver(
            ([entry]) => {
                stickyBar.classList.toggle('hidden', entry.isIntersecting);
                stickyBar.setAttribute('aria-hidden', String(entry.isIntersecting));
            },
            { threshold: 0.1 }
        );
        stickyObserver.observe(registroSection);
    }

    /* ===== FORMULARIO DE REGISTRO ===== */
    const form = document.getElementById('registro-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) validateField(field);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            form.querySelectorAll('[required]').forEach(field => {
                if (!validateField(field)) isValid = false;
            });

            if (!isValid) {
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            if (submitBtn) {
                const textEl = submitBtn.querySelector('.btn__text');
                const loadingEl = submitBtn.querySelector('.btn__loading');
                submitBtn.disabled = true;
                if (textEl) textEl.hidden = true;
                if (loadingEl) loadingEl.hidden = false;
                submitBtn.style.opacity = '0.7';

                setTimeout(() => {
                    if (loadingEl) loadingEl.hidden = true;
                    if (textEl) textEl.hidden = false;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    /* El mensaje de confirmación se muestra dentro de la app tras el registro real */
                }, 1500);
            }
        });
    }

    function validateField(field) {
        const errorEl = field.parentElement.querySelector('.field-error');
        let msg = '';

        if (!field.value.trim()) {
            msg = 'Este campo es obligatorio.';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
            msg = 'Ingresá un email válido.';
        }

        field.classList.toggle('invalid', !!msg);
        if (errorEl) errorEl.textContent = msg;
        return !msg;
    }

    /* ===== SCROLL REVEAL ===== */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        revealEls.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.08}s`;
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }
})();
