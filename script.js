document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll & Progress Effect
    const navbar = document.querySelector('.navbar');
    const scrollBar = document.getElementById('scroll-bar');

    window.addEventListener('scroll', () => {
        // Shadow/Padding effect
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 0';
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

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

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

    // Flavor Selection
    const flavorOptions = document.querySelectorAll('.flavor-option');
    const flavorInput = document.getElementById('flavor');

    flavorOptions.forEach(option => {
        option.addEventListener('click', () => {
            flavorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            flavorInput.value = option.dataset.value;
        });
    });

    // Buy Buttons auto-select flavor
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.dataset.product.toLowerCase();
            const val = product.includes('vainilla') ? 'vainilla' : 'sin-sabor';
            const option = document.querySelector(`.flavor-option[data-value="${val}"]`);
            if (option) option.click();
        });
    });

    // WhatsApp Form Redirection
    const form = document.getElementById('preorder-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const flavor = document.getElementById('flavor').value;
        const name = document.getElementById('name').value;
        const qty = document.getElementById('quantity').value;
        const msg = document.getElementById('message').value;

        if (!flavor) {
            alert('Selecciona un sabor por favor.');
            return;
        }

        const phone = '593987706360';
        const text = `Hola Theory Nutrition! 🥛%0AQuiero ordenar:%0A*Sabor:* ${flavor}%0A*Cantidad:* ${qty}%0A*Nombre:* ${name}%0A*Nota:* ${msg}`;

        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });

    // FAQ Accordion
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Protein Calculator Logic
    const weightInput = document.getElementById('calc-weight');
    const unitSelect = document.getElementById('calc-unit');
    const activitySelect = document.getElementById('calc-activity');
    const resultDisplay = document.getElementById('protein-result');

    function calculateProtein() {
        let weight = parseFloat(weightInput.value);
        const unit = unitSelect.value;
        const multiplier = parseFloat(activitySelect.value);

        if (isNaN(weight) || weight <= 0) {
            resultDisplay.innerText = '--';
            return;
        }

        // Convert to kg if in lbs
        if (unit === 'lb') {
            weight = weight / 2.20462;
        }

        const dailyProtein = Math.round(weight * multiplier);
        resultDisplay.innerText = dailyProtein;
    }

    [weightInput, unitSelect, activitySelect].forEach(el => {
        el.addEventListener('input', calculateProtein);
    });

    // Initial calculation
    calculateProtein();


    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.fade-in');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

});
