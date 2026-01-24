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

    // Enhanced Mobile Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
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

    

    // Enhanced Calculator State Management
    class CalculatorController {
        constructor() {
            this.state = {
                user: {
                    name: '',
                    gender: '',
                    age: 0,
                    weight: 0,
                    height: 0,
                    steps: 0,
                    activity: 0,
                    goal: ''
                },
                ui: {
                    currentStep: 1,
                    isCalculating: false,
                    showPreview: true,
                    animations: true
                },
                results: {
                    protein: 0,
                    bmr: 0,
                    activityLevel: '',
                    recommendations: []
                }
            };
            this.initializeEventListeners();
            this.updateProgress(1);
            this.updatePreview();
        }

        updateProgress(step) {
            this.state.ui.currentStep = step;
            
            // Update progress bar
            const progressFill = document.querySelector('.progress-fill');
            const progressSteps = document.querySelectorAll('.progress-step');
            const progressPercentage = (step / 4) * 100;
            
            if (progressFill) {
                progressFill.style.width = `${progressPercentage}%`;
            }
            
            // Update step indicators
            progressSteps.forEach((stepEl, index) => {
                const stepNum = index + 1;
                stepEl.classList.remove('active', 'completed');
                
                if (stepNum < step) {
                    stepEl.classList.add('completed');
                } else if (stepNum === step) {
                    stepEl.classList.add('active');
                }
            });

            // Update preview
            this.updatePreview();
        }

        updatePreview() {
            const previewName = document.getElementById('preview-name');
            const previewProgress = document.getElementById('preview-progress');
            const previewWeight = document.getElementById('preview-weight');
            const previewGoal = document.getElementById('preview-goal');
            const proteinValue = document.querySelector('.protein-value');

            // Update name
            if (previewName && this.state.user.name) {
                previewName.textContent = this.state.user.name;
            }

            // Update progress
            if (previewProgress) {
                const progressPercentage = (this.state.ui.currentStep / 4) * 100;
                previewProgress.textContent = `${Math.round(progressPercentage)}%`;
            }

            // Update weight
            if (previewWeight && this.state.user.weight > 0) {
                previewWeight.textContent = `${this.state.user.weight} kg`;
            }

            // Update goal
            if (previewGoal && this.state.user.goal) {
                const goalLabels = {
                    'loss': 'Perder Peso',
                    'maintain': 'Mantener',
                    'muscle': 'Ganar Músculo'
                };
                previewGoal.textContent = goalLabels[this.state.user.goal] || '--';
            }

            // Update estimated protein
            if (proteinValue && this.state.user.weight > 0 && this.state.user.goal) {
                const estimatedProtein = this.calculateEstimatedProtein(
                    this.state.user.weight, 
                    this.state.user.goal
                );
                proteinValue.textContent = estimatedProtein;
            }
        }

        calculateEstimatedProtein(weight, goal) {
            const factors = {
                'loss': 2.0,
                'maintain': 1.6,
                'muscle': 2.2
            };
            return Math.round(weight * (factors[goal] || 1.6));
        }

        initializeEventListeners() {
            // Real-time input listeners
            const nameInput = document.getElementById('wiz-name');
            if (nameInput) {
                nameInput.addEventListener('input', (e) => {
                    this.state.user.name = e.target.value;
                    this.updatePreview();
                });
            }

            const ageInput = document.getElementById('wiz-age');
            if (ageInput) {
                ageInput.addEventListener('input', (e) => {
                    this.state.user.age = parseInt(e.target.value) || 0;
                    this.updatePreview();
                });
            }

            const weightInput = document.getElementById('wiz-weight');
            if (weightInput) {
                weightInput.addEventListener('input', (e) => {
                    this.state.user.weight = parseFloat(e.target.value) || 0;
                    this.updatePreview();
                });
            }

            const heightInput = document.getElementById('wiz-height');
            if (heightInput) {
                heightInput.addEventListener('input', (e) => {
                    this.state.user.height = parseFloat(e.target.value) || 0;
                    this.updatePreview();
                });
            }

            const stepsInput = document.getElementById('wiz-steps');
            if (stepsInput) {
                stepsInput.addEventListener('input', (e) => {
                    this.state.user.steps = parseInt(e.target.value) || 0;
                    this.updatePreview();
                });
            }

            const activityInput = document.getElementById('wiz-activity');
            if (activityInput) {
                activityInput.addEventListener('change', (e) => {
                    this.state.user.activity = parseFloat(e.target.value) || 1.2;
                    this.updatePreview();
                });
            }
        }

        updateUserData(field, value) {
            this.state.user[field] = value;
            this.updatePreview();
        }
    }

    // Initialize calculator controller
    const calculator = new CalculatorController();

    // Protein & IMC Calculator Logic
    // Wizard Logic
    const steps = document.querySelectorAll('.wizard-step');
    const totalSteps = steps.length;
    let currentStep = 1;

    // Next Buttons - Enhanced with Progress System
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const stepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);

            // Enhanced Validation
            if (currentStep === 1) {
                const name = document.getElementById('wiz-name').value;
                if (!name.trim()) { 
                    showValidationError('Por favor ingresa tu nombre'); 
                    return; 
                }
                document.getElementById('res-name').innerText = name;
                calculator.updateUserData('name', name);
            }
            if (currentStep === 2) {
                const gender = document.getElementById('wiz-gender').value;
                const age = document.getElementById('wiz-age').value;
                if (!gender || !age) { 
                    showValidationError('Completa los campos requeridos'); 
                    return; 
                }
                calculator.updateUserData('gender', gender);
                calculator.updateUserData('age', parseInt(age));
            }
            if (currentStep === 3) {
                const steps = document.getElementById('wiz-steps').value;
                const activity = document.getElementById('wiz-activity').value;
                if (!steps || !activity) { 
                    showValidationError('Completa tu nivel de actividad'); 
                    return; 
                }
                calculator.updateUserData('steps', parseInt(steps));
                calculator.updateUserData('activity', parseFloat(activity));
            }

            if (currentStep < totalSteps) {
                // Add exit animation to current step
                stepEl.classList.add('step-exit');
                
                setTimeout(() => {
                    stepEl.classList.remove('active', 'step-exit');
                    currentStep++;
                    const nextEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
                    nextEl.classList.add('active');
                    
                    // Update progress using calculator controller
                    calculator.updateProgress(currentStep);
                }, 400); // Wait for exit animation to complete
            }
        });
    });

    // Prev Buttons - Enhanced with Progress System
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
        if (currentStep > 1) {
            const currentStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
            
            // Add exit animation to current step
            currentStepEl.classList.add('step-exit');
            
            setTimeout(() => {
                currentStepEl.classList.remove('active', 'step-exit');
                currentStep--;
                const prevEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
                prevEl.classList.add('active');
                
                // Update progress using calculator controller
                calculator.updateProgress(currentStep);
            }, 400); // Wait for exit animation to complete
        }
        });
    });

    // Enhanced Validation Error
    function showValidationError(message) {
        // Create a more user-friendly error message instead of alert
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-protein-warning);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // Add CSS for validation animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Enhanced Card Selection with State Management
    document.querySelectorAll('.step-card-option').forEach(card => {
        card.addEventListener('click', () => {
            const group = card.dataset.group;
            const value = card.dataset.value;
            
            // Enhanced visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Deselect siblings with animation
            document.querySelectorAll(`.step-card-option[data-group="${group}"]`).forEach(c => {
                if (c !== card) {
                    c.classList.remove('selected');
                }
            });
            
            // Select this card with animation
            card.classList.add('selected');
            
            // Update hidden input and calculator state
            if (group === 'gender') {
                document.getElementById('wiz-gender').value = value;
                calculator.updateUserData('gender', value);
            }
            if (group === 'goal') {
                document.getElementById('wiz-goal').value = value;
                calculator.updateUserData('goal', value);
            }
        });
    });

    // Enhanced Final Calculate
    document.getElementById('wiz-calculate').addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('wiz-weight').value);
        const height = parseFloat(document.getElementById('wiz-height').value);
        const goal = document.getElementById('wiz-goal').value;

        if (!weight || !height || !goal) {
            showValidationError('Por favor completa todos los datos'); 
            return;
        }

        // Update calculator state
        calculator.updateUserData('weight', weight);
        calculator.updateUserData('height', height);

        // Show enhanced loading state
        document.querySelector(`.wizard-step[data-step="4"]`).classList.remove('active');
        calculator.updateProgress(5); // Complete state

        const loadingScreen = document.getElementById('calc-loading');
        loadingScreen.style.display = 'flex';

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            calculateWizardResults();
            const resultsEl = document.getElementById('wiz-results');
            resultsEl.style.display = 'block';
            setTimeout(() => {
                resultsEl.classList.add('active');
            }, 50); // Small delay to trigger animation
        }, 2000); // Reduced to 2 seconds for better UX
    });

    document.getElementById('wiz-reset').addEventListener('click', () => {
        document.getElementById('wiz-results').style.display = 'none';
        currentStep = 1;
        document.querySelector(`.wizard-step[data-step="1"]`).classList.add('active');

        // Reset calculator state
        calculator.state.user = {
            name: '',
            gender: '',
            age: 0,
            weight: 0,
            height: 0,
            steps: 0,
            activity: 0,
            goal: ''
        };

        // Reset UI state
        calculator.updateProgress(1);

        // Reset Inputs with animation
        const inputs = ['wiz-name', 'wiz-weight', 'wiz-height', 'wiz-age', 'wiz-steps'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = "";
                input.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    input.style.animation = '';
                }, 300);
            }
        });

        // Reset card selections
        document.querySelectorAll('.step-card-option').forEach(c => {
            c.classList.remove('selected');
            c.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                c.style.animation = '';
            }, 300);
        });

        // Reset preview
        document.getElementById('preview-name').textContent = '--';
        document.getElementById('preview-progress').textContent = '25%';
        document.getElementById('preview-weight').textContent = '--';
        document.getElementById('preview-goal').textContent = '--';
        document.querySelector('.protein-value').textContent = '--';
    });

    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(fadeOutStyle);

    function calculateWizardResults() {
        // Use calculator state for consistency
        const { user } = calculator.state;

        // BMR (Mifflin-St Jeor) with enhanced precision
        let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
        bmr += (user.gender === 'male') ? 5 : -161;

        // Enhanced Activity Multiplier Logic
        let realActivity = user.activity;
        let stepText = "Sedentario";
        let activityLevel = 1;

        if (user.steps > 12000) { 
            realActivity = Math.max(realActivity, 1.725); 
            stepText = "Muy Activo"; 
            activityLevel = 5;
        } else if (user.steps > 10000) { 
            realActivity = Math.max(realActivity, 1.55); 
            stepText = "Activo"; 
            activityLevel = 4;
        } else if (user.steps > 7000) { 
            realActivity = Math.max(realActivity, 1.375); 
            stepText = "Moderado"; 
            activityLevel = 3;
        } else if (user.steps > 4000) { 
            stepText = "Ligero"; 
            activityLevel = 2;
        }

        // Enhanced Protein Factor with scientific backing
        let proteinFactor = 1.6;
        if (user.goal === 'maintain') {
            proteinFactor = 1.4; 
            if (realActivity > 1.4) proteinFactor = 1.6;
        } else if (user.goal === 'muscle') {
            proteinFactor = 2.0; 
            if (realActivity > 1.6) proteinFactor = 2.2;
        } else if (user.goal === 'loss') {
            proteinFactor = 2.0; // High for retention
        }

        const recommendedProtein = Math.round(user.weight * proteinFactor);
        const dailyCalories = Math.round(bmr * realActivity);

        // Update calculator state with results
        calculator.state.results = {
            protein: recommendedProtein,
            bmr: Math.round(bmr),
            dailyCalories: dailyCalories,
            activityLevel: stepText,
            recommendations: generateRecommendations(user.goal, activityLevel)
        };

        // Enhanced Final Outputs with animations
        animateValue('res-protein', 0, recommendedProtein, 1000);
        document.getElementById('res-steps-analysis').innerText = stepText;

        // Update preview panel with final results
        updatePreviewWithResults();
    }

    function generateRecommendations(goal, activityLevel) {
        const recommendations = {
            'loss': [
                'Consume proteína en cada comida para preservar músculo',
                'Prioriza proteínas de alta calidad como Theory Isolate',
                'Combina con entrenamiento de fuerza'
            ],
            'maintain': [
                'Mantén un consumo constante de proteína',
                'Distribuye tu proteína en 3-4 comidas al día',
                'Ajusta según tu nivel de actividad'
            ],
            'muscle': [
                'Consume proteína dentro de 30 min post-entrenamiento',
                'Considera 1.6-2.2g por kg de peso corporal',
                'Asegura sueño adecuado para la recuperación'
            ]
        };
        
        return recommendations[goal] || recommendations['maintain'];
    }

    function animateValue(id, start, end, duration) {
        const element = document.getElementById(id);
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    function updatePreviewWithResults() {
        const { results } = calculator.state;
        const proteinValue = document.querySelector('.protein-value');
        
        if (proteinValue && results.protein) {
            animateValue('preview-protein', parseInt(proteinValue.textContent) || 0, results.protein, 800);
        }
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

    // Enhanced Error Handling and Recovery System
    class ErrorHandler {
        static show(message, type = 'error', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => notification.classList.add('active'), 10);
            
            // Auto remove
            setTimeout(() => this.remove(notification), duration);
            
            // Manual close
            notification.querySelector('.notification-close').addEventListener('click', () => {
                this.remove(notification);
            });
        }
        
        static remove(notification) {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }
        
        static async handleAsync(promise, errorMessage = 'Ocurrió un error inesperado') {
            try {
                return await promise;
            } catch (error) {
                console.error('Async error:', error);
                this.show(errorMessage, 'error');
                throw error;
            }
        }
    }

    // Consolidated Buy Form Redirection with Enhanced Error Handling
    const buyForm = document.getElementById('buy-form');
    if (buyForm) {
        buyForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.classList.add('form-loading');
            submitBtn.disabled = true;
            
            try {
                const name = document.getElementById('name').value;
                const flavor = flavorInput.value;
                const quantity = document.getElementById('quantity').value;

                // Enhanced validation
                if (!name.trim()) {
                    throw new Error('Por favor ingresa tu nombre');
                }
                
                if (!flavor) {
                    throw new Error('Por favor selecciona un sabor');
                }
                
                if (!quantity || quantity < 1) {
                    throw new Error('Por favor ingresa una cantidad válida');
                }

                const phone = '593987706360';
                const message = `Hola Theory! Mi nombre es ${name}. Me gustaría pedir ${quantity} unidad(es) de Theory Gold Isolate sabor ${flavor}.`;
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                
                // Simulate async operation
                await new Promise(resolve => setTimeout(resolve, 500));
                
                window.open(whatsappUrl, '_blank');
                
                // Show success message
                ErrorHandler.show('¡Pedido redirigido a WhatsApp correctamente!', 'success', 3000);
                
            } catch (error) {
                ErrorHandler.show(error.message || 'Ocurrió un error al procesar tu pedido', 'error');
            } finally {
                // Remove loading state
                submitBtn.classList.remove('form-loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Enhanced Lazy Loading System
    class LazyImageLoader {
        constructor() {
            this.images = document.querySelectorAll('img.lazy-image');
            this.imageObserver = null;
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });

                this.images.forEach(img => this.imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                this.images.forEach(img => this.loadImage(img));
            }
        }

        loadImage(img) {
            // Add loading effect immediately
            img.style.opacity = '0';
            
            // Create new image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
                img.onload = () => {
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                };
                img.src = tempImg.src;
            };
            
            tempImg.onerror = () => {
                img.style.opacity = '1';
                img.classList.add('error');
            };
            
            tempImg.src = img.src;
        }
    }

    // Initialize lazy loading
    const lazyLoader = new LazyImageLoader();

    // Enhanced Magnetic Buttons Interaction
    const magneticElements = document.querySelectorAll('.btn, .btn-nav, .social-link, .nav-links a:not(.btn-nav), .whatsapp-float');

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

    // Add keyboard navigation enhancement
    document.addEventListener('keydown', (e) => {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});
