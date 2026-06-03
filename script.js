(function () {
    'use strict';

    // Header: sombra al hacer scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // Menú mobile
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

    // Sticky bar: ocultar al llegar al formulario de registro
    const stickyBar = document.getElementById('sticky-bar');
    const registroSection = document.getElementById('registro');
    if (stickyBar && registroSection) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                stickyBar.classList.toggle('hidden', entry.isIntersecting);
                stickyBar.setAttribute('aria-hidden', String(entry.isIntersecting));
            },
            { threshold: 0.1 }
        );
        observer.observe(registroSection);
    }

    // Formulario de registro
    const form = document.getElementById('registro-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

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

            // Simular envío exitoso
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

                    if (successMsg) {
                        successMsg.hidden = false;
                        form.querySelectorAll('input').forEach(el => el.disabled = true);
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
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

    // Animaciones de entrada con IntersectionObserver
    const animEls = document.querySelectorAll('.func-card, .proceso-step, .testimonio-card, .faq-item');
    if ('IntersectionObserver' in window && animEls.length) {
        const animObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-up');
                        animObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        animEls.forEach(el => animObserver.observe(el));
    }
})();