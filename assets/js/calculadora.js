// ==========================================
// IMPULSO VERDE - CALCULADORA JAVASCRIPT
// Version: 1.0.0 - Sintaxis Corregida
// ==========================================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeCalculator();
});

// ==========================================
// NAVEGACIÓN Y UI GENERAL
// ==========================================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú móvil al hacer clic en enlaces
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Efecto de scroll en el header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
    });
}

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
    
    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.service-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// UTILIDADES GENERALES
// ==========================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type) {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    const phonePattern = /^\+56\s9\s\d{4}\s\d{4}$/;
    return phonePattern.test(phone);
}

// ==========================================
// INICIALIZACIÓN DE CALCULADORA
// ==========================================

function initializeCalculator() {
    // Verificar que React esté disponible
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.log('React no disponible, usando JavaScript vanilla');
        createVanillaCalculator();
        return;
    }

    console.log('Inicializando calculadora React...');
    
    try {
        createReactCalculator();
    } catch (error) {
        console.error('Error con React:', error);
        createVanillaCalculator();
    }
}

// ==========================================
// CALCULADORA REACT
// ==========================================

function createReactCalculator() {
    const { useState } = React;

    const Calculator = () => {
        // Estados
        const [activeTab, setActiveTab] = useState('fotovoltaico');
        const [formData, setFormData] = useState({
            nombre: '', correo: '', telefono: '', direccion: '',
            tipo_vivienda: '', habitantes: '', suministro_electrico: '', suministro_agua: '', consumo_promedio: '',
            uso_bomba: '', superficie_piscina: '', profundidad_piscina: '', metros_cuadrados: '',
            tipo_inmueble: '', antiguedad: '', sistemas_actuales: '', comentarios: ''
        });
        const [calculations, setCalculations] = useState(null);
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState({});

        // Manejar cambios
        const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: '' }));
            }
        };

        // Validar formulario
        const validateForm = () => {
            const newErrors = {};
            if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
            if (!formData.correo.trim()) newErrors.correo = 'El correo es obligatorio';
            else if (!validateEmail(formData.correo)) newErrors.correo = 'Ingresa un correo válido';
            if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';

            if (activeTab === 'fotovoltaico') {
                if (!formData.tipo_vivienda) newErrors.tipo_vivienda = 'Selecciona el tipo de vivienda';
                if (!formData.habitantes) newErrors.habitantes = 'Selecciona el número de habitantes';
                if (!formData.suministro_electrico) newErrors.suministro_electrico = 'Selecciona si tienes suministro eléctrico';
                if (!formData.suministro_agua) newErrors.suministro_agua = 'Selecciona tu tipo de suministro de agua';
            } else if (activeTab === 'bomba_calor') {
                if (!formData.uso_bomba) newErrors.uso_bomba = 'Selecciona el uso de la bomba de calor';
                if ((formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') && !formData.superficie_piscina) {
                    newErrors.superficie_piscina = 'La superficie de la piscina es obligatoria';
                }
                if ((formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') && !formData.profundidad_piscina) {
                    newErrors.profundidad_piscina = 'La profundidad de la piscina es obligatoria';
                }
            } else if (activeTab === 'auditoria') {
                if (!formData.tipo_inmueble) newErrors.tipo_inmueble = 'Selecciona el tipo de inmueble';
                if (!formData.antiguedad) newErrors.antiguedad = 'Selecciona la antigüedad del inmueble';
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        // Función de cálculo
        const calculateQuote = () => {
            if (!validateForm()) {
                showToast('Por favor completa todos los campos obligatorios', 'error');
                return;
            }

            setLoading(true);

            setTimeout(() => {
                try {
                    let result = {};
                    if (activeTab === 'fotovoltaico') {
                        result = calculatePhotovoltaic(formData);
                    } else if (activeTab === 'bomba_calor') {
                        result = calculateHeatPump(formData);
                    } else if (activeTab === 'auditoria') {
                        result = calculateAudit(formData);
                    }
                    setCalculations(result);
                    showToast('Cálculo realizado exitosamente', 'success');
                } catch (error) {
                    showToast('Error en el cálculo. Verifica los datos ingresados.', 'error');
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            }, 1500);
        };

        // Enviar cotización
        const submitQuote = () => {
            if (!calculations) {
                showToast('Primero debe realizar el cálculo', 'warning');
                return;
            }

            setLoading(true);
            setTimeout(() => {
                const quoteData = { formData, calculations, timestamp: new Date().toISOString(), service: activeTab };
                console.log('Quote submitted:', quoteData);
                showToast('Cotización enviada exitosamente. Te contactaremos en 24 horas.', 'success');
                setLoading(false);
            }, 1500);
        };

        // Renderizar calculadora
        return React.createElement('div', { className: 'calculator' },
            // Pestañas
            React.createElement('div', { className: 'calculator-tabs' },
                React.createElement('div', { 
                    style: { display: 'flex', borderBottom: '2px solid var(--color-gray-200)', marginBottom: '2rem' } 
                },
                    ['fotovoltaico', 'bomba_calor', 'auditoria'].map(tab =>
                        React.createElement('button', {
                            key: tab,
                            className: `tab-button ${activeTab === tab ? 'active' : ''}`,
                            onClick: () => setActiveTab(tab),
                            style: {
                                flex: 1, padding: '1rem', border: 'none',
                                background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                                color: activeTab === tab ? 'var(--color-white)' : 'var(--color-gray-600)',
                                fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease',
                                borderRadius: '0.5rem 0.5rem 0 0'
                            }
                        }, 
                        tab === 'fotovoltaico' ? '☀️ Sistema Fotovoltaico' :
                        tab === 'bomba_calor' ? '🔥 Bomba de Calor' : '📊 Auditoría Energética'
                        )
                    )
                )
            ),

            // Formulario de contacto
            React.createElement('div', { className: 'form-section', style: { marginBottom: '2rem' } },
                React.createElement('h3', { 
                    style: { color: 'var(--color-gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } 
                },
                    React.createElement('i', { className: 'fas fa-user' }),
                    'Datos de Contacto'
                ),
                React.createElement('div', { className: 'form-row' },
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Nombre Completo *'),
                        React.createElement('input', {
                            type: 'text', className: `form-control ${errors.nombre ? 'error' : ''}`,
                            value: formData.nombre, onChange: (e) => handleInputChange('nombre', e.target.value),
                            placeholder: 'Ej: Juan Pérez'
                        }),
                        errors.nombre && React.createElement('span', { className: 'error-message' }, errors.nombre)
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', { className: 'form-label' }, 'Correo Electrónico *'),
                        React.createElement('input', {
                            type: 'email', className: `form-control ${errors.correo ? 'error' : ''}`,
                            value: formData.correo, onChange: (e) => handleInputChange('correo', e.target.value),
                            placeholder: 'juan@ejemplo.com'
                        }),
                        errors.correo && React.createElement('span', { className: 'error-message' }, errors.correo)
                    )
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Dirección (Especifica PIN en Google Maps) *'),
                    React.createElement('input', {
                        type: 'text', className: `form-control ${errors.direccion ? 'error' : ''}`,
                        value: formData.direccion, onChange: (e) => handleInputChange('direccion', e.target.value),
                        placeholder: 'Av. Providencia 123, Providencia, RM - Pin: https://goo.gl/maps/...'
                    }),
                    errors.direccion && React.createElement('span', { className: 'error-message' }, errors.direccion)
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Teléfono de Contacto'),
                    React.createElement('input', {
                        type: 'tel', className: 'form-control', value: formData.telefono,
                        onChange: (e) => handleInputChange('telefono', e.target.value), placeholder: '+56 9 XXXX XXXX'
                    })
                )
            ),

            // Formularios específicos
            renderSpecificForm(activeTab, formData, errors, handleInputChange),

            // Comentarios
            React.createElement('div', { className: 'form-section' },
                React.createElement('h3', { 
                    style: { color: 'var(--color-gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } 
                },
                    React.createElement('i', { className: 'fas fa-comments' }),
                    'Información Adicional'
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Comentarios o consultas adicionales'),
                    React.createElement('textarea', {
                        className: 'form-control', value: formData.comentarios, rows: 4,
                        onChange: (e) => handleInputChange('comentarios', e.target.value),
                        placeholder: 'Cuéntanos sobre tus expectativas, dudas o cualquier información adicional...'
                    })
                )
            ),

            // Botones
            React.createElement('div', { style: { display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' } },
                React.createElement('button', {
                    className: 'btn-primary', onClick: calculateQuote, disabled: loading,
                    style: { flex: 1, minWidth: '200px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }
                },
                    loading ? 
                        React.createElement('span', { className: 'loading' },
                            React.createElement('span', { className: 'spinner' }), 'Calculando...'
                        ) :
                        React.createElement('span', {},
                            React.createElement('i', { className: 'fas fa-calculator' }), ' Calcular Cotización'
                        )
                ),
                calculations && React.createElement('button', {
                    className: 'btn-secondary', onClick: submitQuote, disabled: loading,
                    style: { flex: 1, minWidth: '200px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }
                },
                    loading ?
                        React.createElement('span', { className: 'loading' },
                            React.createElement('span', { className: 'spinner' }), 'Enviando...'
                        ) :
                        React.createElement('span', {},
                            React.createElement('i', { className: 'fas fa-paper-plane' }), ' Solicitar Contacto'
                        )
                )
            ),

            // Resultados
            calculations && renderResults(calculations)
        );
    };

    // Montar componente
    const calculatorRoot = document.getElementById('calculator-root');
    if (calculatorRoot) {
        ReactDOM.render(React.createElement(Calculator), calculatorRoot);
        console.log('Calculadora React montada exitosamente');
    }
}

// ==========================================
// FUNCIONES AUXILIARES REACT
// ==========================================

function renderSpecificForm(activeTab, formData, errors, handleInputChange) {
    if (activeTab === 'fotovoltaico') {
        return React.createElement('div', { className: 'form-section' },
            React.createElement('h3', { 
                style: { color: 'var(--color-gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } 
            },
                React.createElement('i', { className: 'fas fa-home' }), 'Información de la Vivienda'
            ),
            React.createElement('div', { className: 'form-row' },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, '¿Vives en casa o departamento? *'),
                    React.createElement('select', {
                        className: `form-control ${errors.tipo_vivienda ? 'error' : ''}`,
                        value: formData.tipo_vivienda, onChange: (e) => handleInputChange('tipo_vivienda', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona una opción'),
                        React.createElement('option', { value: 'casa' }, 'Casa'),
                        React.createElement('option', { value: 'departamento' }, 'Departamento')
                    ),
                    errors.tipo_vivienda && React.createElement('span', { className: 'error-message' }, errors.tipo_vivienda)
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, '¿Cuántas personas viven en la casa? *'),
                    React.createElement('select', {
                        className: `form-control ${errors.habitantes ? 'error' : ''}`,
                        value: formData.habitantes, onChange: (e) => handleInputChange('habitantes', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona'),
                        React.createElement('option', { value: '1' }, '1 persona'),
                        React.createElement('option', { value: '2' }, '2 personas'),
                        React.createElement('option', { value: '3' }, '3 personas'),
                        React.createElement('option', { value: '4' }, '4 personas'),
                        React.createElement('option', { value: '5' }, '5 personas'),
                        React.createElement('option', { value: '6' }, '6 o más personas')
                    ),
                    errors.habitantes && React.createElement('span', { className: 'error-message' }, errors.habitantes)
                )
            ),
            React.createElement('div', { className: 'form-row' },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, '¿Cuentas con suministro eléctrico? *'),
                    React.createElement('select', {
                        className: `form-control ${errors.suministro_electrico ? 'error' : ''}`,
                        value: formData.suministro_electrico, onChange: (e) => handleInputChange('suministro_electrico', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona una opción'),
                        React.createElement('option', { value: 'si' }, 'Sí, tengo suministro eléctrico'),
                        React.createElement('option', { value: 'no' }, 'No, necesito sistema aislado')
                    ),
                    errors.suministro_electrico && React.createElement('span', { className: 'error-message' }, errors.suministro_electrico)
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, '¿Cuentas con suministro de agua o tienes agua de pozo? *'),
                    React.createElement('select', {
                        className: `form-control ${errors.suministro_agua ? 'error' : ''}`,
                        value: formData.suministro_agua, onChange: (e) => handleInputChange('suministro_agua', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona una opción'),
                        React.createElement('option', { value: 'suministro' }, 'Suministro de agua'),
                        React.createElement('option', { value: 'pozo' }, 'Agua de pozo')
                    ),
                    errors.suministro_agua && React.createElement('span', { className: 'error-message' }, errors.suministro_agua)
                )
            ),
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { className: 'form-label' }, 'Consumo promedio mensual (kWh)'),
                React.createElement('input', {
                    type: 'number', className: 'form-control', value: formData.consumo_promedio,
                    onChange: (e) => handleInputChange('consumo_promedio', e.target.value),
                    placeholder: 'Ej: 300 (opcional - lo calculamos automáticamente)'
                }),
                React.createElement('small', { style: { color: 'var(--color-gray-600)' } }, 
                    'Lo puedes encontrar en tu cuenta de luz. Si no lo sabes, lo calculamos según el número de habitantes.'
                )
            )
        );
    } else if (activeTab === 'bomba_calor') {
        return React.createElement('div', { className: 'form-section' },
            React.createElement('h3', { 
                style: { color: 'var(--color-gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } 
            },
                React.createElement('i', { className: 'fas fa-temperature-high' }), 'Información del Sistema'
            ),
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { className: 'form-label' }, '¿Para qué buscas la bomba de calor? *'),
                React.createElement('select', {
                    className: `form-control ${errors.uso_bomba ? 'error' : ''}`,
                    value: formData.uso_bomba, onChange: (e) => handleInputChange('uso_bomba', e.target.value)
                },
                    React.createElement('option', { value: '' }, 'Selecciona una opción'),
                    React.createElement('option', { value: 'calefaccion' }, 'Calefacción'),
                    React.createElement('option', { value: 'agua_caliente' }, 'Agua caliente sanitaria'),
                    React.createElement('option', { value: 'piscina' }, 'Temperado de piscina'),
                    React.createElement('option', { value: 'combinado' }, 'Uso combinado')
                ),
                errors.uso_bomba && React.createElement('span', { className: 'error-message' }, errors.uso_bomba)
            ),
            (formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') && 
            React.createElement('div', { className: 'form-row' },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Superficie de la piscina (m²) *'),
                    React.createElement('input', {
                        type: 'number', className: `form-control ${errors.superficie_piscina ? 'error' : ''}`,
                        value: formData.superficie_piscina, onChange: (e) => handleInputChange('superficie_piscina', e.target.value),
                        placeholder: 'Ej: 50', step: '0.1'
                    }),
                    errors.superficie_piscina && React.createElement('span', { className: 'error-message' }, errors.superficie_piscina)
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Profundidad media (metros) *'),
                    React.createElement('input', {
                        type: 'number', className: `form-control ${errors.profundidad_piscina ? 'error' : ''}`,
                        value: formData.profundidad_piscina, onChange: (e) => handleInputChange('profundidad_piscina', e.target.value),
                        placeholder: 'Ej: 1.5', step: '0.1'
                    }),
                    errors.profundidad_piscina && React.createElement('span', { className: 'error-message' }, errors.profundidad_piscina)
                )
            ),
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { className: 'form-label' }, 'Metros cuadrados a climatizar'),
                React.createElement('input', {
                    type: 'number', className: 'form-control', value: formData.metros_cuadrados,
                    onChange: (e) => handleInputChange('metros_cuadrados', e.target.value), placeholder: 'Ej: 80'
                })
            )
        );
    } else if (activeTab === 'auditoria') {
        return React.createElement('div', { className: 'form-section' },
            React.createElement('h3', { 
                style: { color: 'var(--color-gray-800)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' } 
            },
                React.createElement('i', { className: 'fas fa-chart-line' }), 'Información para la Auditoría'
            ),
            React.createElement('div', { className: 'form-row' },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Tipo de inmueble *'),
                    React.createElement('select', {
                        className: `form-control ${errors.tipo_inmueble ? 'error' : ''}`,
                        value: formData.tipo_inmueble, onChange: (e) => handleInputChange('tipo_inmueble', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona una opción'),
                        React.createElement('option', { value: 'casa' }, 'Casa'),
                        React.createElement('option', { value: 'departamento' }, 'Departamento'),
                        React.createElement('option', { value: 'oficina' }, 'Oficina'),
                        React.createElement('option', { value: 'local_comercial' }, 'Local comercial')
                    ),
                    errors.tipo_inmueble && React.createElement('span', { className: 'error-message' }, errors.tipo_inmueble)
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Antigüedad del inmueble *'),
                    React.createElement('select', {
                        className: `form-control ${errors.antiguedad ? 'error' : ''}`,
                        value: formData.antiguedad, onChange: (e) => handleInputChange('antiguedad', e.target.value)
                    },
                        React.createElement('option', { value: '' }, 'Selecciona'),
                        React.createElement('option', { value: '0-5' }, '0-5 años'),
                        React.createElement('option', { value: '6-15' }, '6-15 años'),
                        React.createElement('option', { value: '16-30' }, '16-30 años'),
                        React.createElement('option', { value: '30+' }, 'Más de 30 años')
                    ),
                    errors.antiguedad && React.createElement('span', { className: 'error-message' }, errors.antiguedad)
                )
            ),
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { className: 'form-label' }, '¿Qué sistemas de calefacción/refrigeración tienes actualmente?'),
                React.createElement('textarea', {
                    className: 'form-control', value: formData.sistemas_actuales, rows: 3,
                    onChange: (e) => handleInputChange('sistemas_actuales', e.target.value),
                    placeholder: 'Describe los sistemas actuales de calefacción, agua caliente, etc.'
                })
            )
        );
    }
    return null;
}

function renderResults(calculations) {
    return React.createElement('div', { 
        style: { 
            marginTop: '3rem', padding: '2rem', background: 'var(--color-gray-100)', 
            borderRadius: 'var(--border-radius-lg)', border: '2px solid var(--color-primary-light)'
        } 
    },
        React.createElement('h3', { 
            style: { color: 'var(--color-primary)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem' } 
        }, '📊 Resultado de tu Cotización'),
        
        React.createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }
        },
            React.createElement('div', {
                style: { background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--border-radius)', textAlign: 'center', boxShadow: 'var(--shadow)' }
            },
                React.createElement('div', { style: { fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 'bold' } },
                    formatCurrency(calculations.totalCost)
                ),
                React.createElement('div', { style: { color: 'var(--color-gray-600)', marginTop: '0.5rem' } }, 'Inversión Total')
            ),
            calculations.annualSavings && React.createElement('div', {
                style: { background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--border-radius)', textAlign: 'center', boxShadow: 'var(--shadow)' }
            },
                React.createElement('div', { style: { fontSize: '2rem', color: 'var(--color-success)', fontWeight: 'bold' } },
                    formatCurrency(calculations.annualSavings)
                ),
                React.createElement('div', { style: { color: 'var(--color-gray-600)', marginTop: '0.5rem' } }, 'Ahorro Anual Estimado')
            ),
            calculations.roiYears && React.createElement('div', {
                style: { background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--border-radius)', textAlign: 'center', boxShadow: 'var(--shadow)' }
            },
                React.createElement('div', { style: { fontSize: '2rem', color: 'var(--color-info)', fontWeight: 'bold' } },
                    `${calculations.roiYears} años`
                ),
                React.createElement('div', { style: { color: 'var(--color-gray-600)', marginTop: '0.5rem' } }, 'Retorno de Inversión')
            )
        ),

        React.createElement('div', {
            style: { background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--border-radius)' }
        },
            React.createElement('h4', { style: { color: 'var(--color-gray-800)', marginBottom: '1rem' } }, '💰 Desglose de Costos'),
            React.createElement('div', { style: { overflowX: 'auto' } },
                React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' } },
                    React.createElement('thead', {},
                        React.createElement('tr', { style: { borderBottom: '2px solid var(--color-gray-200)' } },
                            React.createElement('th', { style: { padding: '0.75rem', textAlign: 'left' } }, 'Componente'),
                            React.createElement('th', { style: { padding: '0.75rem', textAlign: 'center' } }, 'Cantidad'),
                            React.createElement('th', { style: { padding: '0.75rem', textAlign: 'center' } }, 'Unidad'),
                            React.createElement('th', { style: { padding: '0.75rem', textAlign: 'right' } }, 'Costo Unit.'),
                            React.createElement('th', { style: { padding: '0.75rem', textAlign: 'right' } }, 'Total')
                        )
                    ),
                    React.createElement('tbody', {},
                        calculations.itemizedCosts.map((item, index) =>
                            React.createElement('tr', { 
                                key: index,
                                style: { 
                                    borderBottom: '1px solid var(--color-gray-200)',
                                    backgroundColor: index % 2 === 0 ? 'var(--color-gray-50)' : 'transparent'
                                }
                            },
                                React.createElement('td', { style: { padding: '0.75rem' } }, item.name),
                                React.createElement('td', { style: { padding: '0.75rem', textAlign: 'center' } }, item.quantity),
                                React.createElement('td', { style: { padding: '0.75rem', textAlign: 'center' } }, item.unit),
                                React.createElement('td', { style: { padding: '0.75rem', textAlign: 'right' } }, formatCurrency(item.unitCost)),
                                React.createElement('td', { style: { padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' } }, formatCurrency(item.totalCost))
                            )
                        ),
                        React.createElement('tr', { style: { borderTop: '2px solid var(--color-primary)', background: 'var(--color-accent)' } },
                            React.createElement('td', { colSpan: 4, style: { padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' } }, 'TOTAL NETO:'),
                            React.createElement('td', { style: { padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--color-primary)' } }, formatCurrency(calculations.totalCost))
                        )
                    )
                )
            )
        ),

        React.createElement('div', {
            style: { marginTop: '1.5rem', padding: '1rem', background: 'var(--color-warning)', color: 'var(--color-gray-800)', borderRadius: 'var(--border-radius)', fontSize: '0.875rem', textAlign: 'center' }
        },
            React.createElement('i', { className: 'fas fa-info-circle', style: { marginRight: '0.5rem' } }),
            '⚠️ Esta es una cotización preliminar. Los valores finales pueden variar según condiciones específicas del sitio y disponibilidad de productos.'
        )
    );
}

// ==========================================
// CALCULADORA VANILLA (FALLBACK)
// ==========================================

function createVanillaCalculator() {
    console.log('Creando calculadora con JavaScript vanilla...');
    
    const calculatorRoot = document.getElementById('calculator-root');
    if (!calculatorRoot) {
        console.error('Elemento calculator-root no encontrado');
        return;
    }

    // Estado de la aplicación
    let currentTab = 'fotovoltaico';
    let formData = {
        nombre: '', correo: '', telefono: '', direccion: '',
        tipo_vivienda: '', habitantes: '', suministro_electrico: '', suministro_agua: '', consumo_promedio: '',
        uso_bomba: '', superficie_piscina: '', profundidad_piscina: '', metros_cuadrados: '',
        tipo_inmueble: '', antiguedad: '', sistemas_actuales: '', comentarios: ''
    };
    let calculations = null;
    let errors = {};

    function renderCalculator() {
        calculatorRoot.innerHTML = `
            <div class="calculator">
                <div class="calculator-tabs">
                    <div style="display: flex; border-bottom: 2px solid var(--color-gray-200); margin-bottom: 2rem;">
                        <button class="tab-button ${currentTab === 'fotovoltaico' ? 'active' : ''}" data-tab="fotovoltaico">☀️ Sistema Fotovoltaico</button>
                        <button class="tab-button ${currentTab === 'bomba_calor' ? 'active' : ''}" data-tab="bomba_calor">🔥 Bomba de Calor</button>
                        <button class="tab-button ${currentTab === 'auditoria' ? 'active' : ''}" data-tab="auditoria">📊 Auditoría Energética</button>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-user"></i> Datos de Contacto</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nombre Completo *</label>
                            <input type="text" class="form-control ${errors.nombre ? 'error' : ''}" id="nombre" value="${formData.nombre}" placeholder="Ej: Juan Pérez">
                            ${errors.nombre ? `<span class="error-message">${errors.nombre}</span>` : ''}
                        </div>
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico *</label>
                            <input type="email" class="form-control ${errors.correo ? 'error' : ''}" id="correo" value="${formData.correo}" placeholder="juan@ejemplo.com">
                            ${errors.correo ? `<span class="error-message">${errors.correo}</span>` : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dirección (Especifica PIN en Google Maps) *</label>
                        <input type="text" class="form-control ${errors.direccion ? 'error' : ''}" id="direccion" value="${formData.direccion}" placeholder="Av. Providencia 123, Providencia, RM">
                        ${errors.direccion ? `<span class="error-message">${errors.direccion}</span>` : ''}
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono de Contacto</label>
                        <input type="tel" class="form-control" id="telefono" value="${formData.telefono}" placeholder="+56 9 XXXX XXXX">
                    </div>
                </div>

                ${renderVanillaSpecificForm()}

                <div class="form-section">
                    <h3><i class="fas fa-comments"></i> Información Adicional</h3>
                    <div class="form-group">
                        <label class="form-label">Comentarios o consultas adicionales</label>
                        <textarea class="form-control" id="comentarios" rows="4" placeholder="Cuéntanos sobre tus expectativas...">${formData.comentarios}</textarea>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
                    <button class="btn-primary" id="calculate-btn" style="flex: 1; min-width: 200px;">
                        <i class="fas fa-calculator"></i> Calcular Cotización
                    </button>
                    ${calculations ? `<button class="btn-secondary" id="submit-btn" style="flex: 1; min-width: 200px;"><i class="fas fa-paper-plane"></i> Solicitar Contacto</button>` : ''}
                </div>

                ${calculations ? renderVanillaResults() : ''}
            </div>
        `;

        addVanillaEventListeners();
    }

    function renderVanillaSpecificForm() {
        if (currentTab === 'fotovoltaico') {
            return `
                <div class="form-section">
                    <h3><i class="fas fa-home"></i> Información de la Vivienda</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">¿Vives en casa o departamento? *</label>
                            <select class="form-control ${errors.tipo_vivienda ? 'error' : ''}" id="tipo_vivienda">
                                <option value="">Selecciona una opción</option>
                                <option value="casa" ${formData.tipo_vivienda === 'casa' ? 'selected' : ''}>Casa</option>
                                <option value="departamento" ${formData.tipo_vivienda === 'departamento' ? 'selected' : ''}>Departamento</option>
                            </select>
                            ${errors.tipo_vivienda ? `<span class="error-message">${errors.tipo_vivienda}</span>` : ''}
                        </div>
                        <div class="form-group">
                            <label class="form-label">¿Cuántas personas viven en la casa? *</label>
                            <select class="form-control ${errors.habitantes ? 'error' : ''}" id="habitantes">
                                <option value="">Selecciona</option>
                                <option value="1" ${formData.habitantes === '1' ? 'selected' : ''}>1 persona</option>
                                <option value="2" ${formData.habitantes === '2' ? 'selected' : ''}>2 personas</option>
                                <option value="3" ${formData.habitantes === '3' ? 'selected' : ''}>3 personas</option>
                                <option value="4" ${formData.habitantes === '4' ? 'selected' : ''}>4 personas</option>
                                <option value="5" ${formData.habitantes === '5' ? 'selected' : ''}>5 personas</option>
                                <option value="6" ${formData.habitantes === '6' ? 'selected' : ''}>6 o más personas</option>
                            </select>
                            ${errors.habitantes ? `<span class="error-message">${errors.habitantes}</span>` : ''}
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">¿Cuentas con suministro eléctrico? *</label>
                            <select class="form-control ${errors.suministro_electrico ? 'error' : ''}" id="suministro_electrico">
                                <option value="">Selecciona una opción</option>
                                <option value="si" ${formData.suministro_electrico === 'si' ? 'selected' : ''}>Sí, tengo suministro eléctrico</option>
                                <option value="no" ${formData.suministro_electrico === 'no' ? 'selected' : ''}>No, necesito sistema aislado</option>
                            </select>
                            ${errors.suministro_electrico ? `<span class="error-message">${errors.suministro_electrico}</span>` : ''}
                        </div>
                        <div class="form-group">
                            <label class="form-label">¿Cuentas con suministro de agua o tienes agua de pozo? *</label>
                            <select class="form-control ${errors.suministro_agua ? 'error' : ''}" id="suministro_agua">
                                <option value="">Selecciona una opción</option>
                                <option value="suministro" ${formData.suministro_agua === 'suministro' ? 'selected' : ''}>Suministro de agua</option>
                                <option value="pozo" ${formData.suministro_agua === 'pozo' ? 'selected' : ''}>Agua de pozo</option>
                            </select>
                            ${errors.suministro_agua ? `<span class="error-message">${errors.suministro_agua}</span>` : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Consumo promedio mensual (kWh)</label>
                        <input type="number" class="form-control" id="consumo_promedio" value="${formData.consumo_promedio}" placeholder="Ej: 300">
                        <small style="color: var(--color-gray-600);">Lo calculamos automáticamente si no lo sabes.</small>
                    </div>
                </div>
            `;
        } else if (currentTab === 'bomba_calor') {
            return `
                <div class="form-section">
                    <h3><i class="fas fa-temperature-high"></i> Información del Sistema</h3>
                    <div class="form-group">
                        <label class="form-label">¿Para qué buscas la bomba de calor? *</label>
                        <select class="form-control ${errors.uso_bomba ? 'error' : ''}" id="uso_bomba">
                            <option value="">Selecciona una opción</option>
                            <option value="calefaccion" ${formData.uso_bomba === 'calefaccion' ? 'selected' : ''}>Calefacción</option>
                            <option value="agua_caliente" ${formData.uso_bomba === 'agua_caliente' ? 'selected' : ''}>Agua caliente sanitaria</option>
                            <option value="piscina" ${formData.uso_bomba === 'piscina' ? 'selected' : ''}>Temperado de piscina</option>
                            <option value="combinado" ${formData.uso_bomba === 'combinado' ? 'selected' : ''}>Uso combinado</option>
                        </select>
                        ${errors.uso_bomba ? `<span class="error-message">${errors.uso_bomba}</span>` : ''}
                    </div>
                    ${(formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') ? `
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Superficie de la piscina (m²) *</label>
                                <input type="number" class="form-control ${errors.superficie_piscina ? 'error' : ''}" id="superficie_piscina" value="${formData.superficie_piscina}" placeholder="Ej: 50" step="0.1">
                                ${errors.superficie_piscina ? `<span class="error-message">${errors.superficie_piscina}</span>` : ''}
                            </div>
                            <div class="form-group">
                                <label class="form-label">Profundidad media (metros) *</label>
                                <input type="number" class="form-control ${errors.profundidad_piscina ? 'error' : ''}" id="profundidad_piscina" value="${formData.profundidad_piscina}" placeholder="Ej: 1.5" step="0.1">
                                ${errors.profundidad_piscina ? `<span class="error-message">${errors.profundidad_piscina}</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label class="form-label">Metros cuadrados a climatizar</label>
                        <input type="number" class="form-control" id="metros_cuadrados" value="${formData.metros_cuadrados}" placeholder="Ej: 80">
                    </div>
                </div>
            `;
        } else if (currentTab === 'auditoria') {
            return `
                <div class="form-section">
                    <h3><i class="fas fa-chart-line"></i> Información para la Auditoría</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Tipo de inmueble *</label>
                            <select class="form-control ${errors.tipo_inmueble ? 'error' : ''}" id="tipo_inmueble">
                                <option value="">Selecciona una opción</option>
                                <option value="casa" ${formData.tipo_inmueble === 'casa' ? 'selected' : ''}>Casa</option>
                                <option value="departamento" ${formData.tipo_inmueble === 'departamento' ? 'selected' : ''}>Departamento</option>
                                <option value="oficina" ${formData.tipo_inmueble === 'oficina' ? 'selected' : ''}>Oficina</option>
                                <option value="local_comercial" ${formData.tipo_inmueble === 'local_comercial' ? 'selected' : ''}>Local comercial</option>
                            </select>
                            ${errors.tipo_inmueble ? `<span class="error-message">${errors.tipo_inmueble}</span>` : ''}
                        </div>
                        <div class="form-group">
                            <label class="form-label">Antigüedad del inmueble *</label>
                            <select class="form-control ${errors.antiguedad ? 'error' : ''}" id="antiguedad">
                                <option value="">Selecciona</option>
                                <option value="0-5" ${formData.antiguedad === '0-5' ? 'selected' : ''}>0-5 años</option>
                                <option value="6-15" ${formData.antiguedad === '6-15' ? 'selected' : ''}>6-15 años</option>
                                <option value="16-30" ${formData.antiguedad === '16-30' ? 'selected' : ''}>16-30 años</option>
                                <option value="30+" ${formData.antiguedad === '30+' ? 'selected' : ''}>Más de 30 años</option>
                            </select>
                            ${errors.antiguedad ? `<span class="error-message">${errors.antiguedad}</span>` : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Sistemas actuales de calefacción/refrigeración</label>
                        <textarea class="form-control" id="sistemas_actuales" rows="3" placeholder="Describe los sistemas actuales...">${formData.sistemas_actuales}</textarea>
                    </div>
                </div>
            `;
        }
        return '';
    }

    function renderVanillaResults() {
        return `
            <div style="margin-top: 3rem; padding: 2rem; background: var(--color-gray-100); border-radius: var(--border-radius-lg); border: 2px solid var(--color-primary-light);">
                <h3 style="color: var(--color-primary); margin-bottom: 2rem; text-align: center; font-size: 1.5rem;">📊 Resultado de tu Cotización</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--border-radius); text-align: center; box-shadow: var(--shadow);">
                        <div style="font-size: 2rem; color: var(--color-primary); font-weight: bold;">${formatCurrency(calculations.totalCost)}</div>
                        <div style="color: var(--color-gray-600); margin-top: 0.5rem;">Inversión Total</div>
                    </div>
                    ${calculations.annualSavings ? `
                        <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--border-radius); text-align: center; box-shadow: var(--shadow);">
                            <div style="font-size: 2rem; color: var(--color-success); font-weight: bold;">${formatCurrency(calculations.annualSavings)}</div>
                            <div style="color: var(--color-gray-600); margin-top: 0.5rem;">Ahorro Anual</div>
                        </div>
                    ` : ''}
                    ${calculations.roiYears ? `
                        <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--border-radius); text-align: center; box-shadow: var(--shadow);">
                            <div style="font-size: 2rem; color: var(--color-info); font-weight: bold;">${calculations.roiYears} años</div>
                            <div style="color: var(--color-gray-600); margin-top: 0.5rem;">Retorno de Inversión</div>
                        </div>
                    ` : ''}
                </div>

                <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--border-radius);">
                    <h4 style="color: var(--color-gray-800); margin-bottom: 1rem;">💰 Desglose de Costos</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--color-gray-200);">
                                <th style="padding: 0.75rem; text-align: left;">Componente</th>
                                <th style="padding: 0.75rem; text-align: center;">Cantidad</th>
                                <th style="padding: 0.75rem; text-align: center;">Unidad</th>
                                <th style="padding: 0.75rem; text-align: right;">Costo Unit.</th>
                                <th style="padding: 0.75rem; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${calculations.itemizedCosts.map((item, index) => `
                                <tr style="border-bottom: 1px solid var(--color-gray-200); background-color: ${index % 2 === 0 ? 'var(--color-gray-50)' : 'transparent'};">
                                    <td style="padding: 0.75rem;">${item.name}</td>
                                    <td style="padding: 0.75rem; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 0.75rem; text-align: center;">${item.unit}</td>
                                    <td style="padding: 0.75rem; text-align: right;">${formatCurrency(item.unitCost)}</td>
                                    <td style="padding: 0.75rem; text-align: right; font-weight: bold;">${formatCurrency(item.totalCost)}</td>
                                </tr>
                            `).join('')}
                            <tr style="border-top: 2px solid var(--color-primary); background: var(--color-accent);">
                                <td colspan="4" style="padding: 1rem; text-align: right; font-weight: bold; font-size: 1.1rem;">TOTAL NETO:</td>
                                <td style="padding: 1rem; text-align: right; font-weight: bold; font-size: 1.1rem; color: var(--color-primary);">${formatCurrency(calculations.totalCost)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 1.5rem; padding: 1rem; background: var(--color-warning); color: var(--color-gray-800); border-radius: var(--border-radius); font-size: 0.875rem; text-align: center;">
                    <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                    ⚠️ Esta es una cotización preliminar. Los valores finales pueden variar según condiciones específicas del sitio.
                </div>
            </div>
        `;
    }

    function addVanillaEventListeners() {
        // Pestañas
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                currentTab = e.target.dataset.tab;
                renderCalculator();
            });
        });

        // Inputs
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.id;
                formData[field] = e.target.value;
                if (errors[field]) {
                    delete errors[field];
                    renderCalculator();
                }
            });
        });

        // Botón calcular
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', handleVanillaCalculate);
        }

        // Botón enviar
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleVanillaSubmit);
        }
    }

    function handleVanillaCalculate() {
        if (!validateVanillaForm()) {
            showToast('Por favor completa todos los campos obligatorios', 'error');
            renderCalculator();
            return;
        }

        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.innerHTML = '<span class="loading"><span class="spinner"></span>Calculando...</span>';
        calculateBtn.disabled = true;

        setTimeout(() => {
            try {
                if (currentTab === 'fotovoltaico') {
                    calculations = calculatePhotovoltaic(formData);
                } else if (currentTab === 'bomba_calor') {
                    calculations = calculateHeatPump(formData);
                } else if (currentTab === 'auditoria') {
                    calculations = calculateAudit(formData);
                }
                showToast('Cálculo realizado exitosamente', 'success');
                renderCalculator();
            } catch (error) {
                showToast('Error en el cálculo. Verifica los datos ingresados.', 'error');
                console.error('Error:', error);
                calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calcular Cotización';
                calculateBtn.disabled = false;
            }
        }, 1500);
    }

    function handleVanillaSubmit() {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerHTML = '<span class="loading"><span class="spinner"></span>Enviando...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            const quoteData = { formData, calculations, timestamp: new Date().toISOString(), service: currentTab };
            console.log('Quote submitted:', quoteData);
            showToast('Cotización enviada exitosamente. Te contactaremos en 24 horas.', 'success');
            
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Solicitar Contacto';
            submitBtn.disabled = false;
        }, 1500);
    }

    function validateVanillaForm() {
        errors = {};
        if (!formData.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
        if (!formData.correo.trim()) errors.correo = 'El correo es obligatorio';
        else if (!validateEmail(formData.correo)) errors.correo = 'Ingresa un correo válido';
        if (!formData.direccion.trim()) errors.direccion = 'La dirección es obligatoria';

        if (currentTab === 'fotovoltaico') {
            if (!formData.tipo_vivienda) errors.tipo_vivienda = 'Selecciona el tipo de vivienda';
            if (!formData.habitantes) errors.habitantes = 'Selecciona el número de habitantes';
            if (!formData.suministro_electrico) errors.suministro_electrico = 'Selecciona si tienes suministro eléctrico';
            if (!formData.suministro_agua) errors.suministro_agua = 'Selecciona tu tipo de suministro de agua';
        } else if (currentTab === 'bomba_calor') {
            if (!formData.uso_bomba) errors.uso_bomba = 'Selecciona el uso de la bomba de calor';
            if ((formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') && !formData.superficie_piscina) {
                errors.superficie_piscina = 'La superficie de la piscina es obligatoria';
            }
            if ((formData.uso_bomba === 'piscina' || formData.uso_bomba === 'combinado') && !formData.profundidad_piscina) {
                errors.profundidad_piscina = 'La profundidad de la piscina es obligatoria';
            }
        } else if (currentTab === 'auditoria') {
            if (!formData.tipo_inmueble) errors.tipo_inmueble = 'Selecciona el tipo de inmueble';
            if (!formData.antiguedad) errors.antiguedad = 'Selecciona la antigüedad del inmueble';
        }

        return Object.keys(errors).length === 0;
    }

    renderCalculator();
}

// ==========================================
// FUNCIONES DE CÁLCULO
// ==========================================

function calculatePhotovoltaic(formData) {
    const config = window.CALCULATOR_CONFIG;
    const hasElectricSupply = formData.suministro_electrico === 'si';
    const inhabitants = parseInt(formData.habitantes) || 4;
    
    let sizingKey;
    if (inhabitants <= 2) sizingKey = '2_or_less';
    else if (inhabitants <= 4) sizingKey = '3_to_4';
    else sizingKey = 'more_than_4';
    
    const supplyKey = hasElectricSupply ? 'con_suministro' : 'sin_suministro';
    const sizing = config.sizingMatrix[supplyKey][sizingKey];
    const components = hasElectricSupply ? config.photovoltaicGrid : config.photovoltaicOffGrid;
    
    let totalCost = 0;
    const itemizedCosts = [];

    components.forEach(component => {
        let quantity = component.defaultQty || 0;
        
        if (component.name.includes('Módulo Fotovoltaico')) {
            quantity = sizing.modules;
        } else if (component.name.includes('Inversor')) {
            quantity = sizing.inverter;
        } else if (component.name.includes('Baterias') && !hasElectricSupply) {
            quantity = sizing.batteries;
        } else if (component.name.includes('Estructura Montaje') && !hasElectricSupply) {
            quantity = sizing.modules;
        } else if (component.name.includes('Instalación') && !hasElectricSupply) {
            quantity = sizing.modules;
        }

        const cost = quantity * component.unitCost;
        totalCost += cost;

        if (cost > 0) {
            itemizedCosts.push({
                name: component.name,
                quantity,
                unit: component.unit,
                unitCost: component.unitCost,
                totalCost: cost
            });
        }
    });

    const avgConsumption = parseInt(formData.consumo_promedio) || (inhabitants * 300);
    const monthlyGeneration = sizing.modules * 150;
    const annualGeneration = monthlyGeneration * 12;
    const energyCostPerKwh = 150;
    const annualSavings = Math.min(annualGeneration, avgConsumption * 12) * energyCostPerKwh;
    const roiYears = totalCost / annualSavings;

    return {
        type: 'fotovoltaico',
        systemType: hasElectricSupply ? 'Conectado a la red' : 'Sistema aislado',
        totalCost,
        itemizedCosts,
        systemSize: `${sizing.modules} módulos - ${sizing.modules * 0.55} kWp`,
        annualGeneration,
        annualSavings,
        roiYears: Math.round(roiYears * 10) / 10
    };
}

function calculateHeatPump(formData) {
    const config = window.CALCULATOR_CONFIG;
    const use = formData.uso_bomba;
    
    let selectedPump = null;
    if (use === 'agua_caliente' || use === 'calefaccion') {
        const inhabitants = parseInt(formData.habitantes) || 4;
        selectedPump = inhabitants > 4 ? 
            config.heatPumps.find(p => p.name.includes('300 LITROS')) :
            config.heatPumps.find(p => p.name.includes('200 LITROS'));
    } else if (use === 'piscina' || use === 'combinado') {
        selectedPump = config.heatPumps.find(p => p.name.includes('POOLTEMP NEO INVERTER 18'));
    }

    if (!selectedPump) {
        throw new Error('No se pudo seleccionar una bomba de calor adecuada');
    }

    let totalCost = selectedPump.cost;
    const installationCost = totalCost * 0.2;
    totalCost += installationCost;

    return {
        type: 'bomba_calor',
        selectedPump: selectedPump.name,
        totalCost,
        itemizedCosts: [
            { name: selectedPump.name, quantity: 1, unit: 'UN', unitCost: selectedPump.cost, totalCost: selectedPump.cost },
            { name: 'Instalación y Puesta en Marcha', quantity: 1, unit: 'GL', unitCost: installationCost, totalCost: installationCost }
        ],
        annualSavings: 1200000,
        roiYears: Math.round((totalCost / 1200000) * 10) / 10
    };
}

function calculateAudit(formData) {
    const baseAuditCost = 150000;
    const type = formData.tipo_inmueble;
    const age = formData.antiguedad;
    
    let multiplier = 1;
    if (type === 'oficina' || type === 'local_comercial') multiplier = 1.5;
    if (age === '30+') multiplier *= 1.2;
    
    const totalCost = baseAuditCost * multiplier;

    return {
        type: 'auditoria',
        totalCost,
        itemizedCosts: [
            { name: 'Auditoría Energética Completa', quantity: 1, unit: 'GL', unitCost: totalCost, totalCost: totalCost }
        ],
        potentialSavings: totalCost * 10,
        roiYears: 1
    };
}

// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================

window.ImpulsoVerde = {
    version: '1.0.0',
    config: window.CALCULATOR_CONFIG,
    utils: { formatCurrency, showToast, validateEmail, validatePhone },
    track: function(eventName, parameters) {
        console.log('Event tracked:', eventName, parameters);
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
    },
    onError: function(error, errorInfo) {
        console.error('Application error:', error, errorInfo);
        showToast('Ha ocurrido un error inesperado. Por favor recarga la página.', 'error');
    }
};

// Manejo global de errores
window.addEventListener('error', function(event) {
    window.ImpulsoVerde.onError(event.error, { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno 
    });
});

// Console de desarrollo
console.log('🌱 Impulso Verde - Calculator loaded');
console.log('Config:', window.CALCULATOR_CONFIG);

// Tracking de performance
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                window.ImpulsoVerde.track('page_load_time', {
                    load_time: Math.round(entry.loadEventEnd - entry.fetchStart)
                });
            }
        });
    });
    
    try {
        observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
        console.log('Performance observer not supported');
    }
}

// Preload de recursos críticos
function preloadCriticalResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';
    document.head.appendChild(link);
}

window.addEventListener('load', preloadCriticalResources);