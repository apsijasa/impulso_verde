// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeQuoteForm();
    initializeScrollAnimations();
    initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Quote form functionality
function initializeQuoteForm() {
    const serviceRadios = document.querySelectorAll('input[name="service"]');
    const serviceForms = document.querySelectorAll('.service-form');
    const quoteForm = document.getElementById('quoteForm');
    const usoBombaSelect = document.getElementById('uso_bomba');
    const piscinaDetails = document.getElementById('piscina-details');

    // Service selection handler
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handleServiceChange(this.value);
        });
    });

    // Initial service form display
    handleServiceChange('fotovoltaico');

    // Bomba de calor conditional fields
    if (usoBombaSelect && piscinaDetails) {
        usoBombaSelect.addEventListener('change', function() {
            const isPiscina = this.value === 'piscina' || this.value === 'combinado';
            piscinaDetails.style.display = isPiscina ? 'block' : 'none';
            
            // Update required fields
            const requiredFields = piscinaDetails.querySelectorAll('input[required]');
            requiredFields.forEach(field => {
                field.required = isPiscina;
            });
        });
    }

    // Form submission handler
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmission);
    }

    // Real-time validation
    setupFormValidation();
}

function handleServiceChange(serviceValue) {
    const serviceForms = document.querySelectorAll('.service-form');
    
    // Hide all service forms
    serviceForms.forEach(form => {
        form.classList.remove('active');
        // Remove required attributes from hidden forms
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.removeAttribute('data-was-required');
            if (input.hasAttribute('required')) {
                input.setAttribute('data-was-required', 'true');
                input.removeAttribute('required');
            }
        });
    });

    // Show selected service form
    const selectedForm = document.getElementById(`${serviceValue}-form`);
    if (selectedForm) {
        selectedForm.classList.add('active');
        // Restore required attributes for active form
        const inputs = selectedForm.querySelectorAll('input[data-was-required], select[data-was-required]');
        inputs.forEach(input => {
            input.setAttribute('required', 'true');
        });
    }

    // Update form title based on service
    updateFormTitle(serviceValue);
}

function updateFormTitle(serviceValue) {
    const titles = {
        'fotovoltaico': 'Sistema Fotovoltaico',
        'bomba_calor': 'Bomba de Calor',
        'auditoria': 'Auditoría Energética'
    };
    
    // You can add logic here to update any dynamic title if needed
    console.log(`Servicio seleccionado: ${titles[serviceValue] || serviceValue}`);
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Email validation
        if (input.type === 'email') {
            input.addEventListener('blur', validateEmail);
        }
        
        // Phone validation
        if (input.type === 'tel') {
            input.addEventListener('input', formatPhone);
        }
        
        // Number validation
        if (input.type === 'number') {
            input.addEventListener('input', validateNumber);
        }
        
        // File validation
        if (input.type === 'file') {
            input.addEventListener('change', validateFile);
        }
        
        // Required field validation
        if (input.hasAttribute('required')) {
            input.addEventListener('blur', validateRequired);
        }
    });
}

function validateEmail(event) {
    const email = event.target.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    
    toggleFieldValidation(event.target, isValid, 'Por favor ingresa un email válido');
}

function formatPhone(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Chilean phone format: +56 9 XXXX XXXX
    if (value.startsWith('569')) {
        value = value.replace(/^569/, '+56 9 ');
        value = value.replace(/(\+56 9 \d{4})(\d{4})/, '$1 $2');
    } else if (value.startsWith('56')) {
        value = value.replace(/^56/, '+56 ');
    } else if (value.startsWith('9') && value.length >= 9) {
        value = value.replace(/^9/, '+56 9 ');
        value = value.replace(/(\+56 9 \d{4})(\d{4})/, '$1 $2');
    }
    
    event.target.value = value;
}

function validateNumber(event) {
    const value = parseFloat(event.target.value);
    const min = parseFloat(event.target.min);
    const max = parseFloat(event.target.max);
    
    let isValid = true;
    let message = '';
    
    if (isNaN(value)) {
        isValid = false;
        message = 'Por favor ingresa un número válido';
    } else if (min !== undefined && value < min) {
        isValid = false;
        message = `El valor mínimo es ${min}`;
    } else if (max !== undefined && value > max) {
        isValid = false;
        message = `El valor máximo es ${max}`;
    }
    
    toggleFieldValidation(event.target, isValid, message);
}

function validateFile(event) {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file) {
        let isValid = true;
        let message = '';
        
        if (file.size > maxSize) {
            isValid = false;
            message = 'El archivo no puede ser mayor a 5MB';
        } else if (!allowedTypes.includes(file.type)) {
            isValid = false;
            message = 'Solo se permiten archivos PDF, JPG y PNG';
        }
        
        toggleFieldValidation(event.target, isValid, message);
        
        if (!isValid) {
            event.target.value = '';
        }
    }
}

function validateRequired(event) {
    const value = event.target.value.trim();
    const isValid = value.length > 0;
    
    toggleFieldValidation(event.target, isValid, 'Este campo es obligatorio');
}

function toggleFieldValidation(field, isValid, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    // Remove existing error styling
    field.classList.remove('error', 'success');
    
    // Remove existing error message
    if (errorElement) {
        errorElement.remove();
    }
    
    if (!isValid && message) {
        // Add error styling and message
        field.classList.add('error');
        errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    } else if (isValid && field.value.trim()) {
        // Add success styling
        field.classList.add('success');
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form before submission
    if (!validateForm(form)) {
        showMessage('Por favor corrige los errores en el formulario', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        console.log('Datos del formulario:', data);
        
        // Process the form data
        processQuoteData(data);
        
        // Show success message
        showMessage('¡Cotización enviada exitosamente! Te contactaremos en las próximas 24 horas.', 'success');
        
        // Reset form
        form.reset();
        handleServiceChange('fotovoltaico');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top of form
        document.getElementById('cotizacion').scrollIntoView({ behavior: 'smooth' });
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            toggleFieldValidation(field, false, 'Este campo es obligatorio');
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            toggleFieldValidation(emailField, false, 'Por favor ingresa un email válido');
            isValid = false;
        }
    }
    
    return isValid;
}

function processQuoteData(data) {
    // Add service type to data
    const selectedService = document.querySelector('input[name="service"]:checked')?.value;
    data.servicio = selectedService;
    
    // Calculate estimated values based on service type
    if (selectedService === 'fotovoltaico') {
        data.estimatedPower = calculateSolarPower(data);
        data.estimatedSavings = calculateSolarSavings(data);
    } else if (selectedService === 'bomba_calor') {
        data.estimatedEfficiency = calculateHeatPumpEfficiency(data);
    }
    
    // Send data to server (implement actual API call here)
    console.log('Processed quote data:', data);
    
    // Here you would typically send the data to your server:
    // fetch('/api/quotes', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
}

function calculateSolarPower(data) {
    // Basic solar power calculation based on inhabitants
    const habitants = parseInt(data.habitantes) || 4;
    const basePower = habitants * 1.5; // 1.5 kWp per person
    return Math.round(basePower * 100) / 100;
}

function calculateSolarSavings(data) {
    // Basic savings calculation
    const consumption = parseInt(data.consumo_promedio) || 300;
    const avgPrice = 150; // CLP per kWh
    const monthlySavings = consumption * avgPrice * 0.8; // 80% savings
    return Math.round(monthlySavings);
}

function calculateHeatPumpEfficiency(data) {
    // Basic efficiency calculation for heat pumps
    const area = parseInt(data.metros_cuadrados) || 80;
    const efficiency = area * 0.05; // Basic efficiency factor
    return Math.round(efficiency * 100) / 100;
}

function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type} show`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${text}
    `;
    
    // Insert message at top of form
    const form = document.getElementById('quoteForm');
    form.parentNode.insertBefore(message, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .contact-item, .form-section');
    animateElements.forEach(el => observer.observe(el));
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});

// Add error/success styles to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }
    
    .error-message {
        color: #dc3545 !important;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .message.show {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Export functions for potential external use
window.ImpulsoVerde = {
    showMessage,
    validateForm,
    processQuoteData
};