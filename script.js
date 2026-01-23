document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll & Progress Effect
    const navbar = document.querySelector('.navbar');
    const scrollBar = document.getElementById('scroll-bar');

    window.addEventListener('scroll', () => {
        // Shadow/Padding effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + "%";
    });

    // Mobile Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // View Switcher System
    const navLinksList = document.querySelectorAll('.nav-links a:not(.btn-nav)');
    const views = document.querySelectorAll('.content-view');

    function switchView(viewId) {
        // Remove active class from all views and links
        views.forEach(v => v.classList.remove('active'));
        navLinksList.forEach(l => l.classList.remove('active'));

        // Activate target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Update nav active state
            const activeLink = document.querySelector(`.nav-links a[href="#${viewId}"]`);
            if (activeLink) activeLink.classList.add('active');

            // Update URL hash without jumping
            history.pushState(null, null, `#${viewId}`);
        }
    }

    // Handle Nav Clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Special case: Calculator (Modal)
            if (href === '#calculator') {
                e.preventDefault();
                const calcSection = document.getElementById('calculator');
                if (calcSection) {
                    calcSection.style.display = 'flex';
                    setTimeout(() => calcSection.classList.add('active'), 10);
                    document.body.style.overflow = 'hidden';
                }
                return;
            }

            // Normal Section Links
            if (document.getElementById(href.substring(1))) {
                e.preventDefault();
                switchView(href.substring(1));

                // Close mobile menu
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Initialize View on Load
    const initialHash = window.location.hash.substring(1);
    const validSections = ['home', 'products', 'science', 'recipes', 'contact'];
    if (initialHash && validSections.includes(initialHash)) {
        switchView(initialHash);
    } else {
        switchView('home');
    }

    // Close Calculator Modal
    const closeCalcBtn = document.querySelector('.close-calc');
    const calcSection = document.getElementById('calculator');

    if (closeCalcBtn && calcSection) {
        closeCalcBtn.addEventListener('click', () => {
            calcSection.classList.remove('active');
            setTimeout(() => calcSection.style.display = 'none', 400);
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        calcSection.addEventListener('click', (e) => {
            if (e.target === calcSection) closeCalcBtn.click();
        });
    }

    // Toggle Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Recipe Tabs logic
    const recipeTabs = document.querySelectorAll('.recipe-tab-btn');
    const recipePanels = document.querySelectorAll('.recipe-display-panel');

    recipeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-recipe');
            recipeTabs.forEach(t => t.classList.remove('active'));
            recipePanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // Flavor Selection (handled by dynamic selection summary below)

    // Buy Buttons auto-select flavor and switch to contact
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.dataset.product.toLowerCase();
            const val = product.includes('vainilla') ? 'vainilla' : 'sin-sabor';

            // Switch to contact view first
            switchView('contact');

            // Auto click the option in the form
            setTimeout(() => {
                const option = document.querySelector(`.flavor-option[data-value="${val}"]`);
                if (option) option.click();
            }, 100);
        });
    });

    // WhatsApp Form Redirection (handled by consolidated logic below)

    // FAQ Accordion
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    

    // Protein & IMC Calculator Logic
    // Wizard Logic
    const steps = document.querySelectorAll('.wizard-step');
    const totalSteps = steps.length;
    let currentStep = 1;

    // Next Buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const stepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);

            // Basic Validation
            if (currentStep === 1) {
                const name = document.getElementById('wiz-name').value;
                if (!name.trim()) { alert('Por favor ingresa tu nombre'); return; }
                document.getElementById('res-name').innerText = name;
            }
            if (currentStep === 2) {
                const gender = document.getElementById('wiz-gender').value;
                const age = document.getElementById('wiz-age').value;
                if (!gender || !age) { alert('Completa los campos requeridos'); return; }
            }

            if (currentStep < totalSteps) {
                stepEl.classList.remove('active');
                currentStep++;
                const nextEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
                nextEl.classList.add('active');
            }
        });
    });

    // Prev Buttons
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
                currentStep--;
                document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
            }
        });
    });

    // Card Selection
    document.querySelectorAll('.step-card-option').forEach(card => {
        card.addEventListener('click', () => {
            const group = card.dataset.group;
            // Deselect siblings
            document.querySelectorAll(`.step-card-option[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
            // Select this
            card.classList.add('selected');
            // Update hidden input
            if (group === 'gender') document.getElementById('wiz-gender').value = card.dataset.value;
            if (group === 'goal') document.getElementById('wiz-goal').value = card.dataset.value;
        });
    });

    // Final Calculate
    document.getElementById('wiz-calculate').addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('wiz-weight').value);
        const height = parseFloat(document.getElementById('wiz-height').value);
        const goal = document.getElementById('wiz-goal').value;

        if (!weight || !height || !goal) {
            alert('Por favor completa todos los datos'); return;
        }

        // Hide Step 4
        document.querySelector(`.wizard-step[data-step="4"]`).classList.remove('active');

        // Show Loading
        const loadingScreen = document.getElementById('calc-loading');
        loadingScreen.style.display = 'flex';

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            calculateWizardResults();
            document.getElementById('wiz-results').style.display = 'block';
        }, 3000); // 3 seconds spin
    });

    document.getElementById('wiz-reset').addEventListener('click', () => {
        document.getElementById('wiz-results').style.display = 'none';
        currentStep = 1;
        document.querySelector(`.wizard-step[data-step="1"]`).classList.add('active');

        // Reset Inputs
        document.getElementById('wiz-name').value = "";
        document.getElementById('wiz-weight').value = "";
        document.getElementById('wiz-height').value = "";
        document.getElementById('wiz-age').value = "";
        document.getElementById('wiz-steps').value = "";
        document.querySelectorAll('.step-card-option').forEach(c => c.classList.remove('selected'));
    });

    function calculateWizardResults() {
        // Collect Data
        const gender = document.getElementById('wiz-gender').value;
        const age = parseFloat(document.getElementById('wiz-age').value);
        const weight = parseFloat(document.getElementById('wiz-weight').value);
        const height = parseFloat(document.getElementById('wiz-height').value);
        const steps = parseFloat(document.getElementById('wiz-steps').value) || 0;
        const activityVal = parseFloat(document.getElementById('wiz-activity').value);
        const goal = document.getElementById('wiz-goal').value;

        // BMR (Mifflin-St Jeor)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr += (gender === 'male') ? 5 : -161;

        // Activity Multiplier Logic (incorporating steps)
        // If steps are high, we can boost the activity multiplier slightly or confirm it
        let realActivity = activityVal;
        let stepText = "Sedentario";

        if (steps > 12000) { realActivity = Math.max(realActivity, 1.725); stepText = "Muy Activo"; }
        else if (steps > 10000) { realActivity = Math.max(realActivity, 1.55); stepText = "Activo"; }
        else if (steps > 7000) { realActivity = Math.max(realActivity, 1.375); stepText = "Moderado"; }
        else if (steps > 4000) { stepText = "Ligero"; }

        // Protein Factor
        let proteinFactor = 1.6;
        if (goal === 'maintain') {
            proteinFactor = 1.4; if (realActivity > 1.4) proteinFactor = 1.6;
        } else if (goal === 'muscle') {
            proteinFactor = 2.0; if (realActivity > 1.6) proteinFactor = 2.2;
        } else if (goal === 'loss') {
            proteinFactor = 2.0; // High for retention
        }

        const recommendedProtein = Math.round(weight * proteinFactor);

        // Final Outputs
        document.getElementById('res-protein').innerText = recommendedProtein;
        document.getElementById('res-steps-analysis').innerText = stepText;
    }

    // Scroll Reveal Intersection Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Dynamic Selection Summary
    const flavorOptions = document.querySelectorAll('.flavor-option');
    const summaryBox = document.getElementById('selection-summary');
    const summaryIcon = document.getElementById('summary-icon').querySelector('img');
    const summaryText = document.getElementById('summary-text-val');
    const flavorInput = document.getElementById('flavor');

    flavorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const flavor = option.dataset.value;
            const imgSrc = option.querySelector('img').src;
            const labelText = option.querySelector('span').innerText;

            flavorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            flavorInput.value = flavor;

            // Update Summary
            summaryIcon.src = imgSrc;
            summaryText.innerText = labelText;
            summaryBox.classList.add('active');

            // Subtle bounce animation
            summaryBox.style.animation = 'none';
            summaryBox.offsetHeight; // trigger reflow
            summaryBox.style.animation = 'slideUpFade 0.4s ease';
        });
    });

    // Consolidated Buy Form Redirection
    const buyForm = document.getElementById('buy-form');
    if (buyForm) {
        buyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const flavor = flavorInput.value;
            const quantity = document.getElementById('quantity').value;

            if (!flavor) {
                alert('Por favor selecciona un sabor');
                return;
            }

            const phone = '593987706360';
            const message = `Hola Theory! Mi nombre es ${name}. Me gustaría pedir ${quantity} unidad(es) de Theory Gold Isolate sabor ${flavor}.`;
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Magnetic Buttons Interaction
    const magneticElements = document.querySelectorAll('.btn, .btn-nav, .social-link, .nav-links a, .whatsapp-float');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
});
