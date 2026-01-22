/**
 * APOGÉE PARIS - Script Principal
 * Gestion du thème, menu mobile et interactions
 */

(function () {
    'use strict';

    // ==========================================================================
    // ÉLÉMENTS DU DOM
    // ==========================================================================

    const DOM = {
        body: document.body,
        themeToggleBtn: document.getElementById('theme-toggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        mobileMenuClose: document.getElementById('mobileMenuClose'),
        mobileMenuLinks: document.querySelectorAll('.mobile-menu-overlay a'),
        header: document.querySelector('header')
    };

    // ==========================================================================
    // GESTION DU THÈME (CLAIR / SOMBRE)
    // ==========================================================================

    const ThemeManager = {
        STORAGE_KEY: 'apogee-theme',
        DARK_CLASS: 'dark-mode',

        init() {
            // Vérifier la préférence système
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

            // Récupérer le thème sauvegardé ou utiliser la préférence système
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);

            if (savedTheme) {
                this.setTheme(savedTheme);
            } else {
                // Par défaut: thème clair
                this.setTheme('light');
            }

            // Écouter le changement de préférence système
            prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });

            // Écouter le clic sur le bouton de thème
            if (DOM.themeToggleBtn) {
                DOM.themeToggleBtn.addEventListener('click', () => this.toggle());
            }
        },

        setTheme(theme) {
            if (theme === 'dark') {
                DOM.body.classList.add(this.DARK_CLASS);
            } else {
                DOM.body.classList.remove(this.DARK_CLASS);
            }
            localStorage.setItem(this.STORAGE_KEY, theme);
        },

        toggle() {
            const isDark = DOM.body.classList.contains(this.DARK_CLASS);
            this.setTheme(isDark ? 'light' : 'dark');
        },

        getCurrentTheme() {
            return DOM.body.classList.contains(this.DARK_CLASS) ? 'dark' : 'light';
        }
    };

    // ==========================================================================
    // GESTION DU MENU MOBILE
    // ==========================================================================

    const MobileMenu = {
        ACTIVE_CLASS: 'active',

        init() {
            // Bouton d'ouverture du menu
            if (DOM.mobileMenuBtn) {
                DOM.mobileMenuBtn.addEventListener('click', () => this.toggle());
            }

            // Bouton de fermeture du menu
            if (DOM.mobileMenuClose) {
                DOM.mobileMenuClose.addEventListener('click', () => this.close());
            }

            // Fermer le menu au clic sur un lien
            DOM.mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Fermer le menu avec la touche Échap
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });
        },

        toggle() {
            if (DOM.mobileMenu) {
                DOM.mobileMenu.classList.toggle(this.ACTIVE_CLASS);
                this.updateBodyScroll();
                this.updateButtonLabel();
            }
        },

        open() {
            if (DOM.mobileMenu) {
                DOM.mobileMenu.classList.add(this.ACTIVE_CLASS);
                this.updateBodyScroll();
                this.updateButtonLabel();
            }
        },

        close() {
            if (DOM.mobileMenu) {
                DOM.mobileMenu.classList.remove(this.ACTIVE_CLASS);
                this.updateBodyScroll();
                this.updateButtonLabel();
            }
        },

        isOpen() {
            return DOM.mobileMenu && DOM.mobileMenu.classList.contains(this.ACTIVE_CLASS);
        },

        updateBodyScroll() {
            // Empêcher le scroll du body quand le menu est ouvert
            DOM.body.style.overflow = this.isOpen() ? 'hidden' : '';
        },

        updateButtonLabel() {
            if (DOM.mobileMenuBtn) {
                DOM.mobileMenuBtn.textContent = this.isOpen() ? 'FERMER' : 'MENU';
                DOM.mobileMenuBtn.setAttribute('aria-expanded', this.isOpen());
            }
        }
    };

    // ==========================================================================
    // HEADER SCROLL (optionnel - effet de transparence au scroll)
    // ==========================================================================

    const HeaderScroll = {
        SCROLL_THRESHOLD: 50,
        SCROLLED_CLASS: 'header-scrolled',

        init() {
            if (!DOM.header) return;

            let lastScrollY = window.scrollY;
            let ticking = false;

            window.addEventListener('scroll', () => {
                lastScrollY = window.scrollY;

                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.update(lastScrollY);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },

        update(scrollY) {
            if (scrollY > this.SCROLL_THRESHOLD) {
                DOM.header.classList.add(this.SCROLLED_CLASS);
            } else {
                DOM.header.classList.remove(this.SCROLLED_CLASS);
            }
        }
    };

    // ==========================================================================
    // SMOOTH SCROLL POUR LES ANCRES
    // ==========================================================================

    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');

                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        e.preventDefault();

                        const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ==========================================================================
    // GESTION DU FORMULAIRE DE CONTACT
    // ==========================================================================

    const ContactForm = {
        init() {
            const form = document.querySelector('.contact-form-container form');

            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        },

        handleSubmit(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validation basique
            if (!data.name || !data.email || !data.message) {
                this.showMessage('Veuillez remplir tous les champs.', 'error');
                return;
            }

            if (!this.isValidEmail(data.email)) {
                this.showMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Simulation d'envoi (à remplacer par un vrai envoi)
            console.log('Données du formulaire:', data);
            this.showMessage('Message envoyé avec succès !', 'success');
            form.reset();
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        showMessage(message, type) {
            // Créer ou récupérer l'élément de message
            let messageEl = document.querySelector('.form-message');

            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.className = 'form-message';
                const form = document.querySelector('.contact-form-container form');
                form.appendChild(messageEl);
            }

            messageEl.textContent = message;
            messageEl.className = `form-message form-message--${type}`;
            messageEl.style.cssText = `
                padding: 10px;
                margin-top: 15px;
                text-align: center;
                font-size: 0.9rem;
                background: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
                border: 1px solid ${type === 'success' ? '#00ff00' : '#ff0000'};
            `;

            // Supprimer le message après 5 secondes
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    };

    // ==========================================================================
    // INITIALISATION
    // ==========================================================================

    function init() {
        ThemeManager.init();
        MobileMenu.init();
        HeaderScroll.init();
        SmoothScroll.init();
        ContactForm.init();

        console.log('APOGÉE PARIS - Site initialisé');
    }

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposer certaines fonctions globalement si nécessaire
    window.ApogeeApp = {
        toggleMenu: () => MobileMenu.toggle(),
        toggleTheme: () => ThemeManager.toggle(),
        closeMenu: () => MobileMenu.close()
    };

})();
