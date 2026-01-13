document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 0';
        }
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

});
