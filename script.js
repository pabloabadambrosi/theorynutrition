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

    // Calculator Mode Switching
    const modeBtns = document.querySelectorAll('.calc-mode-btn');
    const calcPanels = document.querySelectorAll('.calc-panel');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            calcPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(mode).classList.add('active');
        });
    });

    // Protein & IMC Calculator Logic
    const weightInput = document.getElementById('calc-weight');
    const unitSelect = document.getElementById('calc-unit');
    const heightInput = document.getElementById('calc-height');
    const heightUnitSelect = document.getElementById('calc-height-unit');
    const activitySelect = document.getElementById('calc-activity');
    const proteinResultDisplay = document.getElementById('protein-result');
    const imcResultDisplay = document.getElementById('imc-result');
    const imcCategoryDisplay = document.getElementById('imc-category');

    // Carbohydrate Calculator Inputs
    const carbSport = document.getElementById('carb-sport');
    const carbDuration = document.getElementById('carb-duration');
    const carbIntensity = document.getElementById('carb-intensity');
    const carbAge = document.getElementById('carb-age');
    const carbResultDisplay = document.getElementById('carb-result');
    const carbProtocolDisplay = document.getElementById('carb-protocol');

    function calculateCarbs() {
        const sport = carbSport.value;
        const duration = parseFloat(carbDuration.value);
        const intensity = carbIntensity.value;
        const age = carbAge.value;

        let gramsPerHour = 0;
        let protocol = "";

        if (duration < 1) {
            gramsPerHour = intensity === 'high' ? 15 : 0;
            protocol = duration < 0.75 ? "Enjuague bucal" : "Pequeñas dosis opcionales";
        } else if (duration >= 1 && duration <= 2.5) {
            gramsPerHour = intensity === 'low' ? 30 : (intensity === 'med' ? 45 : 60);
            protocol = "Fuente única (Glucosa)";
        } else {
            // > 2.5h
            if (sport === 'ultra' || intensity === 'high') {
                gramsPerHour = 90;
                protocol = "Mezcla Glucosa:Fructosa (2:1)";
            } else {
                gramsPerHour = 60;
                protocol = "Carga constante";
            }
        }

        // Adjust for Elite/Master age if specified (simple adjustment)
        if (age === 'youth' && duration > 2) gramsPerHour = Math.min(gramsPerHour, 60);

        carbResultDisplay.innerText = gramsPerHour;
        carbProtocolDisplay.innerText = protocol;
    }

    function calculateData() {
        // ... (Existing protein logic)
        let weight = parseFloat(weightInput.value);
        const weightUnit = unitSelect.value;
        let height = parseFloat(heightInput.value);
        const heightUnit = heightUnitSelect.value;
        const multiplier = parseFloat(activitySelect.value);

        if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
            proteinResultDisplay.innerText = '--';
            imcResultDisplay.innerText = '--';
            return;
        }

        let weightKg = weight;
        if (weightUnit === 'lb') weightKg = weight / 2.20462;
        let heightM = height;
        if (heightUnit === 'cm') heightM = height / 100;

        const dailyProtein = Math.round(weightKg * multiplier);
        proteinResultDisplay.innerText = dailyProtein;

        const imc = (weightKg / (heightM * heightM)).toFixed(1);
        imcResultDisplay.innerText = imc;

        let category = "Normal";
        if (imc < 18.5) category = "Bajo peso";
        else if (imc >= 25 && imc < 30) category = "Sobrepeso";
        else if (imc >= 30) category = "Obesidad";

        imcCategoryDisplay.innerText = `Cat: ${category}`;
    }

    // Listeners for Protein
    [weightInput, unitSelect, heightInput, heightUnitSelect, activitySelect].forEach(el => {
        if (el) el.addEventListener('input', calculateData);
    });

    // Listeners for Carbs
    [carbSport, carbDuration, carbIntensity, carbAge].forEach(el => {
        if (el) el.addEventListener('input', calculateCarbs);
    });

    // Run initial calculations
    calculateData();
    calculateCarbs();

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
