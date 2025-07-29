// ===================================
// CALCULADORA DE EFICIENCIA ENERGÉTICA - VERSIÓN MODERNA
// Impulso Verde 2025 - React Component with Enhanced UX
// ===================================

/**
 * Calculadora React Mejorada con funcionalidades avanzadas
 * - Diseño responsivo y moderno
 * - Validaciones en tiempo real
 * - Animaciones fluidas
 * - Optimización de performance
 * - Accesibilidad mejorada
 */

const CalculadoraEficienciaEnergetica = () => {
  // ==================== ESTADO PRINCIPAL ====================
  const [activeTab, setActiveTab] = React.useState('fotovoltaico');
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});
  
  const [formData, setFormData] = React.useState({
    // Datos de contacto
    nombre: '',
    correo: '',
    direccion: '',
    telefono: '',
    
    // Datos técnicos fotovoltaico
    tipoVivienda: 'Casa',
    suministroElectrico: 'SI',
    consumoMensual: 0,
    habitantes: 4,
    suministroAgua: 'SI',
    consumoTipo: 'PAREJO',
    
    // Datos bomba de calor
    usoBC: 'Temperado de piscina',
    superficiePiscina: 50,
    profundidad: 1.5,
    habitantesBC: 4,
    
    // Datos auditoría
    tipoEmpresa: 'Residencial',
    consumoAnual: 0
  });

  const [cotizacion, setCotizacion] = React.useState(null);
  const [showQuoteModal, setShowQuoteModal] = React.useState(false);

  // ==================== PRECIOS Y CONFIGURACIÓN ====================
  const precios = {
    // Fotovoltaico con suministro
    moduloFV: 71458.75,
    inversor: 194385,
    estructuraMontaje: 17756.25,
    materialElectrico: 280513.75,
    conductorCC: 183133.75,
    conductorCA: 68181.25,
    ingenieria: 87500,
    instalacion: 281250,
    seguridad: 12500,
    tramitacion: 250000,
    gastosGenerales: 50000,
    
    // Fotovoltaico sin suministro (aislado)
    moduloFVAislado: 106097.56,
    inversorAislado: 150000,
    baterias: 212000,
    ingenieriaAislado: 320000,
    
    // Bomba de calor
    bombaPiscina: 2500000,
    bombaACS: 1800000,
    bombaCalefaccion: 3500000,
    instalacionBC: 500000,
    ingenieriaBC: 200000,
    
    // Auditoría energética
    auditoriaResidencial: 150000,
    auditoriaComercial: 350000,
    auditoriaIndustrial: 750000
  };

  const configuracion = {
    factorGeneracion: 1.4,
    factorRadiacion: 200000,
    factorSeguridad: 1.1,
    potenciaModulo: 435, // Watts
    eficienciaInversor: 0.435,
    ivaRate: 0.19
  };

  // ==================== HOOKS Y EFECTOS ====================
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (shouldCalculate()) {
        calcularCotizacion();
      }
    }, 500); // Debounce para evitar cálculos excesivos

    return () => clearTimeout(timeoutId);
  }, [
    activeTab,
    formData.suministroElectrico,
    formData.consumoMensual,
    formData.habitantes,
    formData.suministroAgua,
    formData.usoBC,
    formData.superficiePiscina,
    formData.profundidad,
    formData.habitantesBC,
    formData.tipoEmpresa,
    formData.consumoAnual
  ]);

  // Validación en tiempo real
  React.useEffect(() => {
    validateForm();
  }, [formData, activeTab]);

  // ==================== FUNCIONES DE VALIDACIÓN ====================
  const validateForm = () => {
    const errors = {};

    // Validaciones comunes
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      errors.correo = 'El correo es requerido';
    } else if (!isValidEmail(formData.correo)) {
      errors.correo = 'Ingresa un correo válido';
    }

    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
    }

    // Validaciones específicas por tab
    switch (activeTab) {
      case 'fotovoltaico':
        if (formData.suministroElectrico === 'SI' && formData.consumoMensual <= 0) {
          errors.consumoMensual = 'Ingresa un consumo válido';
        }
        if (formData.suministroElectrico === 'NO' && formData.habitantes <= 0) {
          errors.habitantes = 'Ingresa el número de habitantes';
        }
        break;
        
      case 'bombacalor':
        if (formData.usoBC === 'Temperado de piscina') {
          if (formData.superficiePiscina <= 0) {
            errors.superficiePiscina = 'Ingresa la superficie de la piscina';
          }
          if (formData.profundidad <= 0) {
            errors.profundidad = 'Ingresa la profundidad';
          }
        } else if (formData.usoBC === 'Agua caliente sanitaria' && formData.habitantesBC <= 0) {
          errors.habitantesBC = 'Ingresa el número de habitantes';
        }
        break;
        
      case 'auditoria':
        if (formData.tipoEmpresa !== 'Residencial' && formData.consumoAnual <= 0) {
          errors.consumoAnual = 'Ingresa el consumo anual';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const shouldCalculate = () => {
    if (activeTab === 'fotovoltaico') {
      return formData.suministroElectrico === 'SI' 
        ? formData.consumoMensual > 0 
        : formData.habitantes > 0;
    }
    if (activeTab === 'bombacalor') {
      return formData.usoBC === 'Temperado de piscina' 
        ? formData.superficiePiscina > 0 && formData.profundidad > 0
        : formData.habitantesBC > 0;
    }
    return true; // Para auditoría siempre puede calcular
  };

  // ==================== FUNCIONES DE CÁLCULO ====================
  const calcularCotizacion = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular cálculo
      
      let resultado = null;
      
      switch (activeTab) {
        case 'fotovoltaico':
          resultado = calcularFotovoltaico();
          break;
        case 'bombacalor':
          resultado = calcularBombaCalor();
          break;
        case 'auditoria':
          resultado = calcularAuditoria();
          break;
      }
      
      setCotizacion(resultado);
    } catch (error) {
      console.error('Error en cálculo:', error);
      setCotizacion({
        tipo: 'error',
        mensaje: 'Error al calcular la cotización. Intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calcularFotovoltaico = () => {
    if (formData.suministroElectrico === 'SI') {
      return calcularFotovoltaicoConectado();
    } else {
      return calcularFotovoltaicoAislado();
    }
  };

  const calcularFotovoltaicoConectado = () => {
    const consumo = formData.consumoMensual;
    const potencia = (consumo * 12) / configuracion.factorGeneracion / configuracion.factorRadiacion * configuracion.factorSeguridad;
    
    if (potencia <= 0) return null;

    const cantModulos = Math.ceil((potencia * 1000) / configuracion.potenciaModulo);
    const cantInversores = Math.max(1, Math.floor(cantModulos * configuracion.eficienciaInversor));
    const cantEstructuras = cantModulos;

    const items = [
      {
        nombre: 'Módulos Fotovoltaicos Monocristalinos',
        cantidad: cantModulos,
        unidad: 'UN',
        precioUnitario: precios.moduloFV,
        total: precios.moduloFV * cantModulos,
        descripcion: `Paneles solares de alta eficiencia ${configuracion.potenciaModulo}Wp`
      },
      {
        nombre: 'Inversor de String',
        cantidad: cantInversores,
        unidad: 'UN',
        precioUnitario: precios.inversor,
        total: precios.inversor * cantInversores,
        descripcion: 'Inversor con monitoreo WiFi integrado'
      },
      {
        nombre: 'Sistema de Montaje',
        cantidad: cantEstructuras,
        unidad: 'SET',
        precioUnitario: precios.estructuraMontaje,
        total: precios.estructuraMontaje * cantEstructuras,
        descripcion: 'Estructura de aluminio con garantía 25 años'
      },
      {
        nombre: 'Material Eléctrico y Protecciones',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.materialElectrico,
        total: precios.materialElectrico,
        descripcion: 'Incluye protecciones, medidor bidireccional'
      },
      {
        nombre: 'Cableado DC',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.conductorCC,
        total: precios.conductorCC,
        descripcion: 'Cable solar certificado para intemperie'
      },
      {
        nombre: 'Cableado AC',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.conductorCA,
        total: precios.conductorCA,
        descripcion: 'Instalación eléctrica hasta tablero'
      },
      {
        nombre: 'Ingeniería y Diseño',
        cantidad: potencia,
        unidad: 'kWp',
        precioUnitario: precios.ingenieria,
        total: precios.ingenieria * potencia,
        descripcion: 'Diseño técnico y planos as-built'
      },
      {
        nombre: 'Instalación y Puesta en Marcha',
        cantidad: potencia,
        unidad: 'kWp',
        precioUnitario: precios.instalacion,
        total: precios.instalacion * potencia,
        descripcion: 'Instalación completa y certificación'
      },
      {
        nombre: 'Medidas de Seguridad',
        cantidad: potencia,
        unidad: 'kWp',
        precioUnitario: precios.seguridad,
        total: precios.seguridad * potencia,
        descripcion: 'EPP y medidas de seguridad laboral'
      },
      {
        nombre: 'Tramitación SEC',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.tramitacion,
        total: precios.tramitacion,
        descripcion: 'Gestión completa ante SEC y distribuidora'
      },
      {
        nombre: 'Gastos Generales',
        cantidad: potencia,
        unidad: 'kWp',
        precioUnitario: precios.gastosGenerales,
        total: precios.gastosGenerales * potencia,
        descripcion: 'Gestión de proyecto y administración'
      }
    ];

    const totalNeto = items.reduce((sum, item) => sum + item.total, 0);
    const generacionAnual = potencia * 1400; // kWh/año estimado para Chile
    const ahorroAnual = consumo * 12 * 0.85; // 85% de autosuficiencia promedio
    const co2Reducido = generacionAnual * 0.4; // kg CO2/kWh factor Chile

    return {
      tipo: 'fotovoltaico_conectado',
      potencia: potencia.toFixed(2),
      cantidadPaneles: cantModulos,
      items,
      totalNeto,
      iva: totalNeto * configuracion.ivaRate,
      totalBruto: totalNeto * (1 + configuracion.ivaRate),
      beneficios: {
        generacionAnual: Math.round(generacionAnual),
        ahorroAnual: Math.round(ahorroAnual),
        co2Reducido: Math.round(co2Reducido),
        roi: Math.round((totalNeto * (1 + configuracion.ivaRate)) / (ahorroAnual * 0.8) * 10) / 10
      }
    };
  };

  const calcularFotovoltaicoAislado = () => {
    const habitantes = formData.habitantes;
    const suministroAgua = formData.suministroAgua;
    
    let cantModulos, cantInversores, cantBaterias;
    
    // Matriz de dimensionamiento mejorada
    const dimensionamiento = {
      '≤2_SI': { modulos: 8, inversores: 5, baterias: 8 },
      '≤4_SI': { modulos: 10, inversores: 6, baterias: 12 },
      '≤2_NO': { modulos: 12, inversores: 8, baterias: 15 },
      '≤4_NO': { modulos: 14, inversores: 10, baterias: 18 },
      '>4_SI': { modulos: 12, inversores: 8, baterias: 15 },
      '>4_NO': { modulos: 18, inversores: 12, baterias: 25 }
    };

    const key = habitantes <= 2 ? '≤2' : habitantes <= 4 ? '≤4' : '>4';
    const aguaKey = `${key}_${suministroAgua}`;
    const config = dimensionamiento[aguaKey];

    cantModulos = config.modulos;
    cantInversores = config.inversores;
    cantBaterias = config.baterias;

    const items = [
      {
        nombre: 'Módulos Fotovoltaicos Off-Grid',
        cantidad: cantModulos,
        unidad: 'UN',
        precioUnitario: precios.moduloFVAislado,
        total: precios.moduloFVAislado * cantModulos,
        descripcion: `Paneles de alta resistencia ${configuracion.potenciaModulo}Wp`
      },
      {
        nombre: 'Inversor Híbrido',
        cantidad: 1,
        unidad: 'UN',
        precioUnitario: precios.inversorAislado * (cantInversores / 5),
        total: precios.inversorAislado * (cantInversores / 5),
        descripcion: `Sistema ${cantInversores}kW con cargador integrado`
      },
      {
        nombre: 'Banco de Baterías Litio',
        cantidad: cantBaterias,
        unidad: 'kWh',
        precioUnitario: precios.baterias,
        total: precios.baterias * cantBaterias,
        descripcion: 'Baterías LiFePO4 con 6000+ ciclos'
      },
      {
        nombre: 'Sistema de Montaje Reforzado',
        cantidad: cantModulos,
        unidad: 'SET',
        precioUnitario: precios.estructuraMontaje * 1.3,
        total: precios.estructuraMontaje * cantModulos * 1.3,
        descripción: 'Estructura resistente a vientos extremos'
      },
      {
        nombre: 'Controlador de Carga MPPT',
        cantidad: Math.ceil(cantModulos / 4),
        unidad: 'UN',
        precioUnitario: 150000,
        total: 150000 * Math.ceil(cantModulos / 4),
        descripcion: 'Controlador de carga inteligente'
      },
      {
        nombre: 'Material Eléctrico Especializado',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.materialElectrico * 1.5,
        total: precios.materialElectrico * 1.5,
        descripcion: 'Protecciones DC/AC y sistema de monitoreo'
      },
      {
        nombre: 'Ingeniería Sistemas Aislados',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.ingenieriaAislado,
        total: precios.ingenieriaAislado,
        descripcion: 'Diseño especializado y cálculo de autonomía'
      }
    ];

    const totalNeto = items.reduce((sum, item) => sum + item.total, 0);
    const potenciaTotal = cantModulos * configuracion.potenciaModulo / 1000;
    const autonomiaDias = Math.round(cantBaterias / (cantInversores * 0.8) * 10) / 10;

    return {
      tipo: 'fotovoltaico_aislado',
      habitantes: habitantes,
      suministroAgua: suministroAgua,
      potencia: potenciaTotal.toFixed(2),
      cantidadPaneles: cantModulos,
      capacidadBaterias: cantBaterias,
      autonomia: autonomiaDias,
      items,
      totalNeto,
      iva: totalNeto * configuracion.ivaRate,
      totalBruto: totalNeto * (1 + configuracion.ivaRate)
    };
  };

  const calcularBombaCalor = () => {
    if (formData.usoBC === 'Calefacción') {
      return {
        tipo: 'bomba_calefaccion',
        mensaje: '🌡️ Cada hogar tiene condiciones únicas para calefacción.\n\nPor eso, nos gusta conversar primero antes de cotizar una bomba de calor.',
        requerimiento: 'consulta_especializada'
      };
    }

    let precioBase, descripcion, eficiencia, ahorroAnual;
    
    if (formData.usoBC === 'Temperado de piscina') {
      const volumen = formData.superficiePiscina * formData.profundidad;
      const potenciaRequerida = volumen * 0.4; // kW necesarios por m³
      const factorVolumen = Math.ceil(potenciaRequerida / 15); // Bombas de 15kW base
      
      precioBase = precios.bombaPiscina * factorVolumen;
      descripcion = `Bomba de calor ${potenciaRequerida.toFixed(1)}kW para piscina de ${formData.superficiePiscina}m² x ${formData.profundidad}m`;
      eficiencia = 'COP 5.2 (500% eficiencia)';
      ahorroAnual = 450000 * factorVolumen; // Ahorro vs calefacción eléctrica
    } else {
      // Agua caliente sanitaria
      const factorHabitantes = Math.ceil(formData.habitantesBC / 4);
      precioBase = precios.bombaACS * factorHabitantes;
      descripcion = `Sistema ACS con bomba de calor para ${formData.habitantesBC} habitantes`;
      eficiencia = 'COP 4.8 (480% eficiencia)';
      ahorroAnual = 280000 * factorHabitantes;
    }

    const items = [
      {
        nombre: descripcion,
        cantidad: 1,
        unidad: 'UN',
        precioUnitario: precioBase,
        total: precioBase,
        descripcion: `${eficiencia} - Garantía 5 años`
      },
      {
        nombre: 'Instalación Hidráulica',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.instalacionBC,
        total: precios.instalacionBC,
        descripcion: 'Conexiones, válvulas y sistema de control'
      },
      {
        nombre: 'Puesta en Marcha y Configuración',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.ingenieriaBC,
        total: precios.ingenieriaBC,
        descripcion: 'Calibración y manual de operación'
      },
      {
        nombre: 'Accesorios y Protecciones',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: 180000,
        total: 180000,
        descripcion: 'Kit de accesorios y protección anti-hielo'
      }
    ];

    const totalNeto = items.reduce((sum, item) => sum + item.total, 0);

    return {
      tipo: 'bomba_calor',
      uso: formData.usoBC,
      eficiencia,
      items,
      totalNeto,
      iva: totalNeto * configuracion.ivaRate,
      totalBruto: totalNeto * (1 + configuracion.ivaRate),
      beneficios: {
        ahorroAnual: Math.round(ahorroAnual),
        eficienciaEnergetica: eficiencia,
        roi: Math.round((totalNeto * (1 + configuracion.ivaRate)) / ahorroAnual * 10) / 10
      }
    };
  };

  const calcularAuditoria = () => {
    let precioBase, alcance, beneficios;
    
    switch (formData.tipoEmpresa) {
      case 'Residencial':
        precioBase = precios.auditoriaResidencial;
        alcance = 'Análisis de consumo residencial, identificación de oportunidades de ahorro y plan de eficiencia energética.';
        beneficios = ['Reducción 15-30% consumo', 'Plan de mejoras personalizado', 'ROI detallado por medida'];
        break;
      case 'Comercial':
        precioBase = precios.auditoriaComercial;
        alcance = 'Auditoría energética integral de edificio comercial, análisis de sistemas HVAC y propuesta de optimización.';
        beneficios = ['Reducción 20-40% consumo', 'Certificación energética', 'Plan de inversión escalonado'];
        break;
      case 'Industrial':
        precioBase = precios.auditoriaIndustrial;
        alcance = 'Diagnóstico energético completo de procesos industriales, análisis de cogeneración y eficiencia de motores.';
        beneficios = ['Reducción 25-50% consumo', 'Análisis de procesos', 'Oportunidades de cogeneración'];
        break;
      default:
        return {
          tipo: 'auditoria',
          mensaje: '⚡ Una buena auditoría energética comienza por conocerte.\n\nYa sea para una residencial, comercial o industrial, nuestra recomendación es agendar una breve reunión para levantar la información clave y ofrecerte un plan a medida.'
        };
    }

    const items = [
      {
        nombre: `Auditoría Energética ${formData.tipoEmpresa}`,
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precioBase,
        total: precioBase,
        descripcion: alcance
      },
      {
        nombre: 'Informe Técnico Detallado',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precioBase * 0.3,
        total: precioBase * 0.3,
        descripcion: 'Informe ejecutivo con recomendaciones priorizadas'
      },
      {
        nombre: 'Plan de Implementación',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precioBase * 0.2,
        total: precioBase * 0.2,
        descripcion: 'Cronograma y presupuesto de mejoras propuestas'
      }
    ];

    const totalNeto = items.reduce((sum, item) => sum + item.total, 0);

    return {
      tipo: 'auditoria_detallada',
      tipoEmpresa: formData.tipoEmpresa,
      alcance,
      beneficios,
      items,
      totalNeto,
      iva: totalNeto * configuracion.ivaRate,
      totalBruto: totalNeto * (1 + configuracion.ivaRate)
    };
  };

  // ==================== MANEJADORES DE EVENTOS ====================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCotizacion(null); // Limpiar cotización al cambiar tab
  };

  const handleSolicitudCotizacion = () => {
    if (validateForm()) {
      setShowQuoteModal(true);
      // Aquí podrías enviar los datos a un endpoint
      enviarCotizacion();
    } else {
      // Mostrar errores de validación
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  const enviarCotizacion = async () => {
    try {
      // Simular envío de datos
      const payload = {
        tipo: activeTab,
        datos: formData,
        cotizacion: cotizacion,
        timestamp: new Date().toISOString()
      };
      
      console.log('Enviando cotización:', payload);
      
      // Aquí harías la llamada real a tu API
      // await fetch('/api/cotizaciones', { method: 'POST', body: JSON.stringify(payload) });
      
    } catch (error) {
      console.error('Error enviando cotización:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL').format(number);
  };

  // ==================== COMPONENTES DE RENDER ====================
  const renderTabSelector = () => {
    const tabs = [
      { 
        id: 'fotovoltaico', 
        name: 'Energía Fotovoltaica', 
        icon: 'fas fa-solar-panel',
        description: 'Sistemas solares residenciales y comerciales'
      },
      { 
        id: 'bombacalor', 
        name: 'Bomba de Calor', 
        icon: 'fas fa-thermometer-half',
        description: 'Climatización eficiente y ACS'
      },
      { 
        id: 'auditoria', 
        name: 'Auditoría Energética', 
        icon: 'fas fa-chart-line',
        description: 'Análisis completo de eficiencia'
      }
    ];

    return React.createElement('div', {
      key: 'tab-selector',
      className: 'tab-selector-container'
    }, [
      React.createElement('div', {
        key: 'tab-grid',
        className: 'tab-grid'
      }, tabs.map(tab => 
        React.createElement('button', {
          key: tab.id,
          onClick: () => handleTabChange(tab.id),
          className: `tab-button ${activeTab === tab.id ? 'active' : ''}`,
          'aria-pressed': activeTab === tab.id,
          'aria-describedby': `${tab.id}-desc`
        }, [
          React.createElement('div', {
            key: 'tab-icon',
            className: 'tab-icon'
          }, React.createElement('i', {
            className: tab.icon,
            'aria-hidden': 'true'
          })),
          React.createElement('div', {
            key: 'tab-content',
            className: 'tab-content'
          }, [
            React.createElement('h3', {
              key: 'tab-title',
              className: 'tab-title'
            }, tab.name),
            React.createElement('p', {
              key: 'tab-desc',
              id: `${tab.id}-desc`,
              className: 'tab-description'
            }, tab.description)
          ])
        ])
      ))
    ]);
  };

  const renderFormFields = () => {
    const commonFields = renderContactFields();
    
    switch (activeTab) {
      case 'fotovoltaico':
        return [commonFields, renderFotovoltaicoFields()];
      case 'bombacalor':
        return [commonFields, renderBombaCalorFields()];
      case 'auditoria':
        return [commonFields, renderAuditoriaFields()];
      default:
        return [commonFields];
    }
  };

  const renderContactFields = () => {
    return React.createElement('div', {
      key: 'contact-section',
      className: 'form-section'
    }, [
      React.createElement('h3', {
        key: 'contact-title',
        className: 'section-title'
      }, [
        React.createElement('i', {
          key: 'contact-icon',
          className: 'fas fa-user',
          'aria-hidden': 'true'
        }),
        'Información de Contacto'
      ]),
      
      React.createElement('div', {
        key: 'contact-grid',
        className: 'form-grid'
      }, [
        renderInputField('nombre', 'Nombre completo', 'text', 'Tu nombre completo', true),
        renderInputField('correo', 'Correo electrónico', 'email', 'tu@email.com', true),
        renderInputField('direccion', 'Dirección', 'text', 'Dirección completa de instalación', true),
        renderInputField('telefono', 'Teléfono', 'tel', '+56 9 6863 5953', false)
      ])
    ]);
  };

  const renderInputField = (name, label, type, placeholder, required) => {
    const hasError = validationErrors[name];
    
    return React.createElement('div', {
      key: `${name}-field`,
      className: 'form-group'
    }, [
      React.createElement('label', {
        key: `${name}-label`,
        htmlFor: name,
        className: 'form-label'
      }, [
        label,
        required && React.createElement('span', {
          key: 'required',
          className: 'required-asterisk',
          'aria-label': 'campo requerido'
        }, ' *')
      ]),
      React.createElement('input', {
        key: `${name}-input`,
        type: type,
        id: name,
        name: name,
        value: formData[name] || '',
        onChange: (e) => handleInputChange(name, e.target.value),
        placeholder: placeholder,
        required: required,
        className: `form-control ${hasError ? 'error' : ''}`,
        'aria-describedby': hasError ? `${name}-error` : undefined,
        'aria-invalid': !!hasError
      }),
      hasError && React.createElement('div', {
        key: `${name}-error`,
        id: `${name}-error`,
        className: 'error-message',
        role: 'alert'
      }, hasError)
    ]);
  };

  const renderSelectField = (name, label, options, required = false) => {
    const hasError = validationErrors[name];
    
    return React.createElement('div', {
      key: `${name}-field`,
      className: 'form-group'
    }, [
      React.createElement('label', {
        key: `${name}-label`,
        htmlFor: name,
        className: 'form-label'
      }, [
        label,
        required && React.createElement('span', {
          key: 'required',
          className: 'required-asterisk'
        }, ' *')
      ]),
      React.createElement('select', {
        key: `${name}-select`,
        id: name,
        name: name,
        value: formData[name] || '',
        onChange: (e) => handleInputChange(name, e.target.value),
        required: required,
        className: `form-control ${hasError ? 'error' : ''}`,
        'aria-describedby': hasError ? `${name}-error` : undefined
      }, options.map(option => 
        React.createElement('option', {
          key: option.value,
          value: option.value
        }, option.label)
      )),
      hasError && React.createElement('div', {
        key: `${name}-error`,
        id: `${name}-error`,
        className: 'error-message',
        role: 'alert'
      }, hasError)
    ]);
  };

  const renderFotovoltaicoFields = () => {
    return React.createElement('div', {
      key: 'fotovoltaico-section',
      className: 'form-section'
    }, [
      React.createElement('h3', {
        key: 'fv-title',
        className: 'section-title'
      }, [
        React.createElement('i', {
          key: 'fv-icon',
          className: 'fas fa-solar-panel',
          'aria-hidden': 'true'
        }),
        'Sistema Fotovoltaico'
      ]),

      React.createElement('div', {
        key: 'fv-grid',
        className: 'form-grid'
      }, [
        renderSelectField('tipoVivienda', '¿Vives en casa o departamento?', [
          { value: 'Casa', label: 'Casa' },
          { value: 'Departamento', label: 'Departamento' }
        ], true),

        formData.tipoVivienda === 'Casa' && renderSelectField('suministroElectrico', '¿Cuentas con suministro eléctrico?', [
          { value: 'SI', label: 'Sí' },
          { value: 'NO', label: 'No' }
        ], true)
      ]),

      // Campos condicionales
      formData.tipoVivienda === 'Casa' && (
        formData.suministroElectrico === 'SI' ? 
        renderInputField('consumoMensual', 'Gasto mensual en electricidad (CLP)', 'number', '150000', true) :
        React.createElement('div', {
          key: 'sin-suministro-fields',
          className: 'form-grid'
        }, [
          renderInputField('habitantes', '¿Cuántas personas viven en la casa?', 'number', '4', true),
          renderSelectField('suministroAgua', '¿Cuentas con suministro de agua?', [
            { value: 'SI', label: 'Sí, tengo suministro de agua' },
            { value: 'NO', label: 'No, tengo agua de pozo' }
          ], true)
        ])
      ),

      // Mensaje para departamentos
      formData.tipoVivienda === 'Departamento' && React.createElement('div', {
        key: 'depto-message',
        className: 'info-message warning'
      }, [
        React.createElement('i', {
          key: 'warning-icon',
          className: 'fas fa-exclamation-triangle',
          'aria-hidden': 'true'
        }),
        React.createElement('div', {
          key: 'warning-text'
        }, [
          React.createElement('h4', { key: 'title' }, '¡Gracias por tu interés!'),
          React.createElement('p', { key: 'text' }, 'Instalamos paneles solares en casas y en edificios completos, pero no en departamentos individuales. Si tu comunidad busca ahorrar en gastos comunes, podemos cotizar un proyecto colectivo.')
        ])
      ])
    ]);
  };

  const renderBombaCalorFields = () => {
    return React.createElement('div', {
      key: 'bombacalor-section',
      className: 'form-section'
    }, [
      React.createElement('h3', {
        key: 'bc-title',
        className: 'section-title'
      }, [
        React.createElement('i', {
          key: 'bc-icon',
          className: 'fas fa-thermometer-half',
          'aria-hidden': 'true'
        }),
        'Sistema de Bomba de Calor'
      ]),

      renderSelectField('usoBC', '¿Buscas bomba de calor para?', [
        { value: 'Temperado de piscina', label: 'Temperado de piscina' },
        { value: 'Agua caliente sanitaria', label: 'Agua caliente sanitaria' },
        { value: 'Calefacción', label: 'Calefacción' }
      ], true),

      // Campos específicos según uso
      formData.usoBC === 'Temperado de piscina' && React.createElement('div', {
        key: 'piscina-fields',
        className: 'form-grid'
      }, [
        renderInputField('superficiePiscina', 'Superficie de piscina (m²)', 'number', '50', true),
        renderInputField('profundidad', 'Profundidad media (metros)', 'number', '1.5', true)
      ]),

      formData.usoBC === 'Agua caliente sanitaria' && renderInputField('habitantesBC', '¿Cuántas personas viven en la casa?', 'number', '4', true),

      formData.usoBC === 'Calefacción' && React.createElement('div', {
        key: 'calefaccion-message',
        className: 'info-message info'
      }, [
        React.createElement('i', {
          key: 'info-icon',
          className: 'fas fa-info-circle',
          'aria-hidden': 'true'
        }),
        React.createElement('div', {
          key: 'info-text'
        }, [
          React.createElement('h4', { key: 'title' }, 'Consulta Especializada'),
          React.createElement('p', { key: 'text' }, '🌡️ Cada hogar tiene condiciones únicas para calefacción. Por eso, nos gusta conversar primero antes de cotizar una bomba de calor.')
        ])
      ])
    ]);
  };

  const renderAuditoriaFields = () => {
    return React.createElement('div', {
      key: 'auditoria-section',
      className: 'form-section'
    }, [
      React.createElement('h3', {
        key: 'audit-title',
        className: 'section-title'
      }, [
        React.createElement('i', {
          key: 'audit-icon',
          className: 'fas fa-chart-line',
          'aria-hidden': 'true'
        }),
        'Auditoría Energética'
      ]),

      renderSelectField('tipoEmpresa', 'Tipo de proyecto', [
        { value: 'Residencial', label: 'Residencial' },
        { value: 'Comercial', label: 'Comercial' },
        { value: 'Industrial', label: 'Industrial' }
      ], true),

      formData.tipoEmpresa !== 'Residencial' && renderInputField('consumoAnual', 'Consumo energético anual (kWh)', 'number', '50000', true),

      React.createElement('div', {
        key: 'audit-message',
        className: 'info-message info'
      }, [
        React.createElement('i', {
          key: 'audit-info-icon',
          className: 'fas fa-lightbulb',
          'aria-hidden': 'true'
        }),
        React.createElement('div', {
          key: 'audit-info-text'
        }, [
          React.createElement('h4', { key: 'title' }, 'Análisis Energético Completo'),
          React.createElement('p', { key: 'text' }, '⚡ Una buena auditoría energética comienza por conocerte. Analizamos tu consumo actual y identificamos las mejores oportunidades de ahorro.')
        ])
      ])
    ]);
  };

  const renderCotizacion = () => {
    if (isLoading) {
      return React.createElement('div', {
        key: 'loading',
        className: 'loading-container'
      }, [
        React.createElement('div', {
          key: 'spinner',
          className: 'loading-spinner'
        }),
        React.createElement('p', {
          key: 'loading-text',
          className: 'loading-text'
        }, 'Calculando tu cotización...')
      ]);
    }

    if (!cotizacion) {
      return React.createElement('div', {
        key: 'placeholder',
        className: 'cotizacion-placeholder'
      }, [
        React.createElement('div', {
          key: 'placeholder-icon',
          className: 'placeholder-icon'
        }, React.createElement('i', {
          className: 'fas fa-calculator',
          'aria-hidden': 'true'
        })),
        React.createElement('h3', {
          key: 'placeholder-title'
        }, 'Completa la información'),
        React.createElement('p', {
          key: 'placeholder-text'
        }, 'Ingresa los datos necesarios para generar tu cotización personalizada')
      ]);
    }

    // Cotización con mensaje (auditoría o casos especiales)
    if (cotizacion.mensaje) {
      return renderMessageCotizacion();
    }

    // Cotización con tabla de precios
    return renderDetailedCotizacion();
  };

  const renderMessageCotizacion = () => {
    return React.createElement('div', {
      key: 'message-cotizacion',
      className: 'cotizacion-message'
    }, [
      React.createElement('div', {
        key: 'message-icon',
        className: 'message-icon'
      }, React.createElement('i', {
        className: activeTab === 'auditoria' ? 'fas fa-chart-line' : 'fas fa-thermometer-half',
        'aria-hidden': 'true'
      })),
      React.createElement('div', {
        key: 'message-content',
        className: 'message-content'
      }, [
        React.createElement('h3', {
          key: 'message-title'
        }, cotizacion.requerimiento === 'consulta_especializada' ? 'Consulta Especializada' : 'Información Personalizada'),
        React.createElement('p', {
          key: 'message-text',
          className: 'message-text'
        }, cotizacion.mensaje)
      ]),
      React.createElement('button', {
        key: 'contact-button',
        onClick: handleSolicitudCotizacion,
        className: 'btn btn-primary btn-large'
      }, [
        React.createElement('i', {
          key: 'phone-icon',
          className: 'fas fa-phone',
          'aria-hidden': 'true'
        }),
        'Agenda una consulta'
      ])
    ]);
  };

  const renderDetailedCotizacion = () => {
    return [
      // Resumen del sistema
      React.createElement('div', {
        key: 'system-summary',
        className: 'system-summary'
      }, [
        React.createElement('h3', {
          key: 'summary-title',
          className: 'summary-title'
        }, 'Resumen del Sistema'),
        renderSystemDetails()
      ]),

      // Tabla de cotización
      React.createElement('div', {
        key: 'quote-table-container',
        className: 'quote-table-container'
      }, [
        React.createElement('div', {
          key: 'quote-table-wrapper',
          className: 'table-wrapper'
        }, [
          React.createElement('table', {
            key: 'quote-table',
            className: 'quote-table'
          }, [
            React.createElement('thead', { key: 'table-head' }, [
              React.createElement('tr', {
                key: 'header-row'
              }, [
                React.createElement('th', { key: 'item-header' }, 'Ítem'),
                React.createElement('th', { key: 'qty-header' }, 'Cant.'),
                React.createElement('th', { key: 'unit-price-header' }, 'Precio Unit.'),
                React.createElement('th', { key: 'total-header' }, 'Total')
              ])
            ]),
            React.createElement('tbody', { key: 'table-body' }, 
              cotizacion.items.map((item, index) => 
                React.createElement('tr', {
                  key: `item-${index}`,
                  className: 'table-row'
                }, [
                  React.createElement('td', {
                    key: 'item-name',
                    className: 'item-cell'
                  }, [
                    React.createElement('div', {
                      key: 'item-title',
                      className: 'item-title'
                    }, item.nombre),
                    item.descripcion && React.createElement('div', {
                      key: 'item-desc',
                      className: 'item-description'
                    }, item.descripcion)
                  ]),
                  React.createElement('td', {
                    key: 'item-qty',
                    className: 'qty-cell'
                  }, `${item.cantidad < 1 ? item.cantidad.toFixed(2) : formatNumber(item.cantidad)} ${item.unidad}`),
                  React.createElement('td', {
                    key: 'item-unit-price',
                    className: 'price-cell'
                  }, formatCurrency(item.precioUnitario)),
                  React.createElement('td', {
                    key: 'item-total',
                    className: 'total-cell'
                  }, formatCurrency(item.total))
                ])
              )
            )
          ])
        ])
      ]),

      // Totales
      renderTotalsSection(),

      // Beneficios (si existen)
      cotizacion.beneficios && renderBenefitsSection(),

      // Botón de acción
      React.createElement('div', {
        key: 'cta-section',
        className: 'cta-section'
      }, [
        React.createElement('button', {
          key: 'cta-button',
          onClick: handleSolicitudCotizacion,
          className: 'btn btn-primary btn-large btn-full',
          disabled: !validateForm()
        }, [
          React.createElement('i', {
            key: 'cta-icon',
            className: 'fas fa-paper-plane',
            'aria-hidden': 'true'
          }),
          'Solicitar Cotización Detallada'
        ])
      ])
    ];
  };

  const renderSystemDetails = () => {
    const details = [];

    if (cotizacion.potencia) {
      details.push(['Potencia instalada', `${cotizacion.potencia} kWp`]);
    }
    if (cotizacion.cantidadPaneles) {
      details.push(['Cantidad de paneles', `${cotizacion.cantidadPaneles} unidades`]);
    }
    if (cotizacion.habitantes) {
      details.push(['Habitantes', `${cotizacion.habitantes} personas`]);
    }
    if (cotizacion.capacidadBaterias) {
      details.push(['Capacidad baterías', `${cotizacion.capacidadBaterias} kWh`]);
    }
    if (cotizacion.autonomia) {
      details.push(['Autonomía', `${cotizacion.autonomia} días`]);
    }
    if (cotizacion.eficiencia) {
      details.push(['Eficiencia', cotizacion.eficiencia]);
    }

    return React.createElement('div', {
      key: 'system-details',
      className: 'system-details'
    }, details.map(([label, value], index) => 
      React.createElement('div', {
        key: `detail-${index}`,
        className: 'detail-item'
      }, [
        React.createElement('span', {
          key: 'label',
          className: 'detail-label'
        }, label + ':'),
        React.createElement('span', {
          key: 'value',
          className: 'detail-value'
        }, value)
      ])
    ));
  };

  const renderTotalsSection = () => {
    return React.createElement('div', {
      key: 'totals-section',
      className: 'totals-section'
    }, [
      React.createElement('div', {
        key: 'net-total',
        className: 'total-row'
      }, [
        React.createElement('span', { key: 'net-label' }, 'Total Neto:'),
        React.createElement('span', { key: 'net-value' }, formatCurrency(cotizacion.totalNeto))
      ]),
      React.createElement('div', {
        key: 'iva-total',
        className: 'total-row iva-row'
      }, [
        React.createElement('span', { key: 'iva-label' }, 'IVA (19%):'),
        React.createElement('span', { key: 'iva-value' }, formatCurrency(cotizacion.iva))
      ]),
      React.createElement('div', {
        key: 'gross-total',
        className: 'total-row final-total'
      }, [
        React.createElement('span', { key: 'gross-label' }, 'Total Bruto:'),
        React.createElement('span', { key: 'gross-value' }, formatCurrency(cotizacion.totalBruto))
      ])
    ]);
  };

  const renderBenefitsSection = () => {
    const { beneficios } = cotizacion;
    
    return React.createElement('div', {
      key: 'benefits-section',
      className: 'benefits-section'
    }, [
      React.createElement('h3', {
        key: 'benefits-title',
        className: 'benefits-title'
      }, [
        React.createElement('i', {
          key: 'benefits-icon',
          className: 'fas fa-star',
          'aria-hidden': 'true'
        }),
        'Beneficios del Sistema'
      ]),
      React.createElement('div', {
        key: 'benefits-grid',
        className: 'benefits-grid'
      }, [
        beneficios.generacionAnual && React.createElement('div', {
          key: 'generation-benefit',
          className: 'benefit-item'
        }, [
          React.createElement('div', {
            key: 'generation-icon',
            className: 'benefit-icon'
          }, React.createElement('i', {
            className: 'fas fa-bolt',
            'aria-hidden': 'true'
          })),
          React.createElement('div', {
            key: 'generation-content',
            className: 'benefit-content'
          }, [
            React.createElement('span', {
              key: 'generation-value',
              className: 'benefit-value'
            }, `${formatNumber(beneficios.generacionAnual)} kWh`),
            React.createElement('span', {
              key: 'generation-label',
              className: 'benefit-label'
            }, 'Generación anual')
          ])
        ]),
        
        beneficios.ahorroAnual && React.createElement('div', {
          key: 'saving-benefit',
          className: 'benefit-item'
        }, [
          React.createElement('div', {
            key: 'saving-icon',
            className: 'benefit-icon'
          }, React.createElement('i', {
            className: 'fas fa-piggy-bank',
            'aria-hidden': 'true'
          })),
          React.createElement('div', {
            key: 'saving-content',
            className: 'benefit-content'
          }, [
            React.createElement('span', {
              key: 'saving-value',
              className: 'benefit-value'
            }, formatCurrency(beneficios.ahorroAnual)),
            React.createElement('span', {
              key: 'saving-label',
              className: 'benefit-label'
            }, 'Ahorro anual')
          ])
        ]),
        
        beneficios.co2Reducido && React.createElement('div', {
          key: 'co2-benefit',
          className: 'benefit-item'
        }, [
          React.createElement('div', {
            key: 'co2-icon',
            className: 'benefit-icon'
          }, React.createElement('i', {
            className: 'fas fa-leaf',
            'aria-hidden': 'true'
          })),
          React.createElement('div', {
            key: 'co2-content',
            className: 'benefit-content'
          }, [
            React.createElement('span', {
              key: 'co2-value',
              className: 'benefit-value'
            }, `${formatNumber(beneficios.co2Reducido)} kg`),
            React.createElement('span', {
              key: 'co2-label',
              className: 'benefit-label'
            }, 'CO₂ evitado/año')
          ])
        ]),
        
        beneficios.roi && React.createElement('div', {
          key: 'roi-benefit',
          className: 'benefit-item'
        }, [
          React.createElement('div', {
            key: 'roi-icon',
            className: 'benefit-icon'
          }, React.createElement('i', {
            className: 'fas fa-chart-line',
            'aria-hidden': 'true'
          })),
          React.createElement('div', {
            key: 'roi-content',
            className: 'benefit-content'
          }, [
            React.createElement('span', {
              key: 'roi-value',
              className: 'benefit-value'
            }, `${beneficios.roi} años`),
            React.createElement('span', {
              key: 'roi-label',
              className: 'benefit-label'
            }, 'Retorno inversión')
          ])
        ])
      ])
    ]);
  };

  // ==================== COMPONENTE PRINCIPAL ====================
  return React.createElement('div', {
    className: 'calculadora-moderna',
    role: 'application',
    'aria-label': 'Calculadora de eficiencia energética'
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      className: 'calculadora-header'
    }, [
      React.createElement('div', {
        key: 'header-content',
        className: 'header-content'
      }, [
        React.createElement('div', {
          key: 'header-icon',
          className: 'header-icon'
        }, React.createElement('i', {
          className: 'fas fa-calculator',
          'aria-hidden': 'true'
        })),
        React.createElement('div', {
          key: 'header-text',
          className: 'header-text'
        }, [
          React.createElement('h1', {
            key: 'title',
            className: 'calculadora-title'
          }, 'Calculadora de Eficiencia Energética'),
          React.createElement('p', {
            key: 'subtitle',
            className: 'calculadora-subtitle'
          }, 'Obtén una cotización personalizada para tu proyecto de energía sostenible')
        ])
      ])
    ]),

    // Tab Selector
    renderTabSelector(),

    // Main Content
    React.createElement('div', {
      key: 'main-content',
      className: 'calculadora-content'
    }, [
      // Formulario
      React.createElement('div', {
        key: 'form-section',
        className: 'form-section-container'
      }, [
        React.createElement('div', {
          key: 'form-header',
          className: 'form-header'
        }, [
          React.createElement('h2', {
            key: 'form-title',
            className: 'form-title'
          }, [
            React.createElement('i', {
              key: 'form-icon',
              className: activeTab === 'fotovoltaico' ? 'fas fa-solar-panel' : 
                        activeTab === 'bombacalor' ? 'fas fa-thermometer-half' : 'fas fa-chart-line',
              'aria-hidden': 'true'
            }),
            `Configuración del ${activeTab === 'fotovoltaico' ? 'Sistema Fotovoltaico' : 
                               activeTab === 'bombacalor' ? 'Sistema de Bomba de Calor' : 'Proyecto de Auditoría'}`
          ])
        ]),
        React.createElement('div', {
          key: 'form-content',
          className: 'form-content'
        }, renderFormFields())
      ]),

      // Cotización
      React.createElement('div', {
        key: 'quote-section',
        className: 'quote-section-container'
      }, [
        React.createElement('div', {
          key: 'quote-header',
          className: 'quote-header'
        }, [
          React.createElement('h2', {
            key: 'quote-title',
            className: 'quote-title'
          }, [
            React.createElement('i', {
              key: 'quote-icon',
              className: 'fas fa-receipt',
              'aria-hidden': 'true'
            }),
            'Tu Cotización'
          ])
        ]),
        React.createElement('div', {
          key: 'quote-content',
          className: 'quote-content'
        }, renderCotizacion())
      ])
    ]),

    // Footer
    React.createElement('div', {
      key: 'footer',
      className: 'calculadora-footer'
    }, [
      React.createElement('div', {
        key: 'footer-content',
        className: 'footer-content'
      }, [
        React.createElement('div', {
          key: 'disclaimer',
          className: 'disclaimer'
        }, [
          React.createElement('i', {
            key: 'disclaimer-icon',
            className: 'fas fa-info-circle',
            'aria-hidden': 'true'
          }),
          React.createElement('p', {
            key: 'disclaimer-text'
          }, '💡 Esta cotización es referencial. Para un análisis detallado y visita técnica, agenda una consulta con nuestros especialistas.')
        ]),
        React.createElement('div', {
          key: 'trust-indicators',
          className: 'trust-indicators'
        }, [
          React.createElement('div', {
            key: 'trust-item-1',
            className: 'trust-item'
          }, [
            React.createElement('i', {
              key: 'cert-icon',
              className: 'fas fa-certificate',
              'aria-hidden': 'true'
            }),
            React.createElement('span', { key: 'cert-text' }, 'Certificado SEC')
          ]),
          React.createElement('div', {
            key: 'trust-item-2',
            className: 'trust-item'
          }, [
            React.createElement('i', {
              key: 'warranty-icon',
              className: 'fas fa-shield-alt',
              'aria-hidden': 'true'
            }),
            React.createElement('span', { key: 'warranty-text' }, 'Garantía 25 años')
          ]),
          React.createElement('div', {
            key: 'trust-item-3',
            className: 'trust-item'
          }, [
            React.createElement('i', {
              key: 'support-icon',
              className: 'fas fa-headset',
              'aria-hidden': 'true'
            }),
            React.createElement('span', { key: 'support-text' }, 'Soporte 24/7')
          ])
        ])
      ])
    ]),

    // Modal de confirmación de cotización
    showQuoteModal && React.createElement('div', {
      key: 'quote-modal',
      className: 'modal-overlay',
      onClick: () => setShowQuoteModal(false)
    }, [
      React.createElement('div', {
        key: 'modal-content',
        className: 'modal-content',
        onClick: (e) => e.stopPropagation()
      }, [
        React.createElement('div', {
          key: 'modal-header',
          className: 'modal-header'
        }, [
          React.createElement('h3', {
            key: 'modal-title'
          }, '¡Cotización Enviada!'),
          React.createElement('button', {
            key: 'modal-close',
            className: 'modal-close',
            onClick: () => setShowQuoteModal(false),
            'aria-label': 'Cerrar modal'
          }, React.createElement('i', {
            className: 'fas fa-times',
            'aria-hidden': 'true'
          }))
        ]),
        React.createElement('div', {
          key: 'modal-body',
          className: 'modal-body'
        }, [
          React.createElement('div', {
            key: 'success-icon',
            className: 'success-icon'
          }, React.createElement('i', {
            className: 'fas fa-check-circle',
            'aria-hidden': 'true'
          })),
          React.createElement('p', {
            key: 'success-message'
          }, 'Hemos recibido tu solicitud de cotización. Nuestro equipo se contactará contigo en las próximas 24 horas para agendar una visita técnica.')
        ]),
        React.createElement('div', {
          key: 'modal-footer',
          className: 'modal-footer'
        }, [
          React.createElement('button', {
            key: 'modal-ok',
            className: 'btn btn-primary',
            onClick: () => setShowQuoteModal(false)
          }, 'Entendido')
        ])
      ])
    ])
  ]);
};

// ==================== ESTILOS CSS ESPECÍFICOS ====================
const calculadoraStyles = `
.calculadora-moderna {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(67, 164, 141, 0.05) 0%, rgba(175, 217, 207, 0.1) 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.calculadora-header {
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.calculadora-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  backdrop-filter: blur(10px);
}

.calculadora-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.calculadora-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
}

.tab-selector-container {
  padding: 2rem;
  background: white;
}

.tab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tab-button {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #43a48d 0%, #276a63 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-button:hover,
.tab-button.active {
  border-color: #43a48d;
  background: rgba(67, 164, 141, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 164, 141, 0.15);
}

.tab-button.active::before {
  transform: scaleX(1);
}

.tab-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.tab-content {
  flex: 1;
}

.tab-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.tab-description {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.calculadora-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  background: white;
}

.form-section-container,
.quote-section-container {
  background: #f8fafc;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.form-header,
.quote-header {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-title,
.quote-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-content,
.quote-content {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required-asterisk {
  color: #ef4444;
  font-weight: 700;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #43a48d;
  box-shadow: 0 0 0 4px rgba(67, 164, 141, 0.1);
}

.form-control.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-message {
  padding: 1rem;
  border-radius: 12px;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-message.warning {
  background: #fef3cd;
  border: 1px solid #f59e0b;
  color: #92400e;
}

.info-message.info {
  background: #dbeafe;
  border: 1px solid #3b82f6;
  color: #1e40af;
}

.info-message i {
  font-size: 1.25rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.info-message h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.info-message p {
  margin: 0;
  line-height: 1.5;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #43a48d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.cotizacion-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.placeholder-icon i {
  color: #94a3b8;
}

.cotizacion-placeholder h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.cotizacion-placeholder p {
  margin: 0;
  line-height: 1.5;
}

.cotizacion-message {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(67, 164, 141, 0.05) 0%, rgba(175, 217, 207, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(67, 164, 141, 0.2);
}

.message-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 1.5rem;
}

.message-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.message-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 2rem 0;
  white-space: pre-line;
}

.system-summary {
  background: rgba(67, 164, 141, 0.05);
  border: 1px solid rgba(67, 164, 141, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #276a63;
  margin: 0 0 1rem 0;
}

.system-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  font-weight: 700;
  color: #1e293b;
}

.quote-table-container {
  margin: 2rem 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: white;
}

.quote-table th {
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  color: white;
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quote-table th:last-child,
.quote-table td:last-child {
  text-align: right;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.quote-table td {
  padding: 1rem 0.75rem;
  vertical-align: top;
}

.item-cell {
  max-width: 250px;
}

.item-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
}

.qty-cell {
  text-align: center;
  font-weight: 500;
  color: #475569;
}

.price-cell,
.total-cell {
  font-weight: 600;
  font-family: 'SF Mono', Monaco, monospace;
}

.total-cell {
  color: #43a48d;
}

.totals-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 1rem;
}

.total-row:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

.iva-row {
  color: #64748b;
  font-size: 0.9rem;
}

.final-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #43a48d;
  background: rgba(67, 164, 141, 0.1);
  margin: 0 -1.5rem -1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 0 0 12px 12px;
}

.benefits-section {
  margin: 2rem 0;
}

.benefits-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.benefit-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #43a48d;
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin: 0 auto 1rem;
}

.benefit-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #43a48d;
  margin-bottom: 0.5rem;
}

.benefit-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.cta-section {
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(67, 164, 141, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #276a63 0%, #1a4f47 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 164, 141, 0.4);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.calculadora-footer {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #1e40af;
}

.disclaimer i {
  font-size: 1.25rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.disclaimer p {
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.trust-item i {
  color: #43a48d;
  font-size: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #43a48d 0%, #276a63 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1.5rem;
}

.modal-body p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .calculadora-content {
    grid-template-columns: 1fr;
  }
  
  .tab-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calculadora-moderna {
    margin: 0.5rem;
    border-radius: 16px;
  }
  
  .calculadora-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .calculadora-title {
    font-size: 1.5rem;
  }
  
  .tab-selector-container,
  .calculadora-content {
    padding: 1.5rem;
  }
  
  .form-content,
  .quote-content {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .system-details {
    grid-template-columns: 1fr;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .trust-indicators {
    gap: 1rem;
  }
  
  .quote-table {
    font-size: 0.8rem;
  }
  
  .quote-table th,
  .quote-table td {
    padding: 0.5rem 0.25rem;
  }
}

@media (max-width: 480px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .tab-button {
    padding: 1rem;
  }
  
  .tab-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .tab-title {
    font-size: 1.1rem;
  }
  
  .calculadora-footer {
    padding: 1.5rem;
  }
  
  .trust-indicators {
    flex-direction: column;
    align-items: center;
  }
}
`;

// ==================== INICIALIZACIÓN ====================
function initializeCalculadora() {
  // Verificar si React está disponible
  if (typeof React === 'undefined') {
    console.error('React no está disponible. Asegúrate de incluir React antes de este script.');
    return;
  }

  // Obtener el contenedor
  const container = document.getElementById('calculadora-container');
  if (!container) {
    console.error('No se encontró el contenedor calculadora-container');
    return;
  }

  // Inyectar estilos CSS específicos de la calculadora
  if (!document.getElementById('calculadora-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'calculadora-styles';
    styleSheet.textContent = calculadoraStyles;
    document.head.appendChild(styleSheet);
  }

  // Crear root de React 18
  let root;
  if (typeof ReactDOM.createRoot !== 'undefined') {
    // React 18
    root = ReactDOM.createRoot(container);
    root.render(React.createElement(CalculadoraEficienciaEnergetica));
  } else {
    // React 17 fallback
    ReactDOM.render(React.createElement(CalculadoraEficienciaEnergetica), container);
  }

  // Configurar event listeners globales
  setupGlobalEventListeners();
  
  console.log('✅ Calculadora de Eficiencia Energética inicializada correctamente');
}

// ==================== EVENT LISTENERS GLOBALES ====================
function setupGlobalEventListeners() {
  // Manejar redimensionamiento de ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalcular layouts si es necesario
      const calculadora = document.querySelector('.calculadora-moderna');
      if (calculadora) {
        calculadora.dispatchEvent(new CustomEvent('calculadora:resize'));
      }
    }, 250);
  });

  // Manejar eventos de teclado para accesibilidad
  document.addEventListener('keydown', (e) => {
    // ESC para cerrar modales
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal-overlay');
      modals.forEach(modal => {
        if (modal.style.display !== 'none') {
          const closeEvent = new CustomEvent('modal:close');
          modal.dispatchEvent(closeEvent);
        }
      });
    }
  });

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('📊 LCP:', entry.startTime, 'ms');
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
}

// ==================== UTILIDADES ADICIONALES ====================

/**
 * Validador de email mejorado
 */
const emailValidator = {
  pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  validate(email) {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;
    
    const valid = this.pattern.test(email);
    if (!valid) return false;
    
    // Verificar longitud de partes
    const parts = email.split('@');
    if (parts[0].length > 64) return false;
    
    return true;
  },
  
  getDomainSuggestions(email) {
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'live.com', 'icloud.com', 'protonmail.com'
    ];
    
    if (!email.includes('@')) return [];
    
    const [, domain] = email.split('@');
    if (!domain) return [];
    
    return commonDomains.filter(d => 
      d.includes(domain.toLowerCase()) || 
      this.levenshteinDistance(domain.toLowerCase(), d) <= 2
    );
  },
  
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
};

/**
 * Utilidades de formato y cálculo
 */
const calculatorUtils = {
  /**
   * Formatea números a moneda chilena
   */
  formatCurrency(amount, options = {}) {
    const defaults = {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    };
    
    return new Intl.NumberFormat('es-CL', { ...defaults, ...options }).format(amount);
  },
  
  /**
   * Formatea números con separadores de miles
   */
  formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  },
  
  /**
   * Convierte texto a slug URL-friendly
   */
  slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },
  
  /**
   * Debounce function para optimizar rendimiento
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },
  
  /**
   * Throttle function para eventos de scroll/resize
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Detecta si el dispositivo es móvil
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  /**
   * Detecta soporte para características específicas
   */
  supports: {
    webp: () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    },
    
    intersectionObserver: () => 'IntersectionObserver' in window,
    
    customProperties: () => window.CSS && CSS.supports('color', 'var(--test)'),
    
    backdrop: () => CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  }
};

/**
 * Analytics y tracking de eventos
 */
const analytics = {
  /**
   * Registra evento de interacción
   */
  track(event, properties = {}) {
    // Aquí podrías integrar con Google Analytics, Facebook Pixel, etc.
    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
    
    console.log('📈 Analytics Event:', eventData);
    
    // Ejemplo de integración con Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, properties);
    }
    
    // Ejemplo de integración con Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', event, properties);
    }
    
    // Enviar a endpoint propio
    if (window.ANALYTICS_ENDPOINT) {
      fetch(window.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).catch(console.error);
    }
  },
  
  /**
   * Eventos específicos de la calculadora
   */
  events: {
    calculatorLoaded: () => analytics.track('calculator_loaded'),
    tabChanged: (tab) => analytics.track('tab_changed', { tab }),
    formFieldChanged: (field, value) => analytics.track('form_field_changed', { field, value: typeof value }),
    quotationGenerated: (type, amount) => analytics.track('quotation_generated', { type, amount }),
    quotationRequested: (type, contactInfo) => analytics.track('quotation_requested', { 
      type, 
      hasEmail: !!contactInfo.email,
      hasPhone: !!contactInfo.phone 
    }),
    errorOccurred: (error, context) => analytics.track('error_occurred', { error: error.message, context })
  }
};

/**
 * Gestión de errores global
 */
const errorHandler = {
  /**
   * Captura errores no controlados
   */
  init() {
    window.addEventListener('error', (event) => {
      console.error('❌ Error no controlado:', event.error);
      analytics.events.errorOccurred(event.error, 'unhandled_error');
      this.notifyUser('Ha ocurrido un error inesperado. Por favor, recarga la página.');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promise rechazada:', event.reason);
      analytics.events.errorOccurred(new Error(event.reason), 'unhandled_promise_rejection');
    });
  },
  
  /**
   * Muestra notificación de error al usuario
   */
  notifyUser(message, type = 'error') {
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('toast-styles')) {
      const toastStyles = document.createElement('style');
      toastStyles.id = 'toast-styles';
      toastStyles.textContent = `
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          animation: slideInRight 0.3s ease-out;
          max-width: 400px;
          border-left: 4px solid #ef4444;
        }
        
        .toast-error { border-left-color: #ef4444; }
        .toast-success { border-left-color: #10b981; }
        .toast-info { border-left-color: #3b82f6; }
        .toast-warning { border-left-color: #f59e0b; }
        
        .toast-content {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .toast-content i:first-child {
          font-size: 1.25rem;
          color: #ef4444;
        }
        
        .toast-error .toast-content i:first-child { color: #ef4444; }
        .toast-success .toast-content i:first-child { color: #10b981; }
        .toast-info .toast-content i:first-child { color: #3b82f6; }
        .toast-warning .toast-content i:first-child { color: #f59e0b; }
        
        .toast-content span {
          flex: 1;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .toast-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `;
      document.head.appendChild(toastStyles);
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }
};

/**
 * Optimizaciones de performance
 */
const performanceOptimizer = {
  /**
   * Precargar recursos críticos
   */
  preloadCriticalResources() {
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    criticalResources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  },
  
  /**
   * Lazy loading de imágenes
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },
  
  /**
   * Optimizar rendering
   */
  optimizeRendering() {
    // Usar requestIdleCallback para tareas no críticas
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Precargar imágenes fuera del viewport
        this.initLazyLoading();
        
        // Inicializar analytics
        analytics.events.calculatorLoaded();
      });
    } else {
      // Fallback para navegadores sin soporte
      setTimeout(() => {
        this.initLazyLoading();
        analytics.events.calculatorLoaded();
      }, 1000);
    }
  }
};

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================

/**
 * Inicializar cuando el DOM esté listo
 */
function autoInitialize() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeCalculadora();
      setupEnhancements();
    });
  } else {
    // DOM ya está listo
    initializeCalculadora();
    setupEnhancements();
  }
}

/**
 * Configurar mejoras adicionales
 */
function setupEnhancements() {
  try {
    // Inicializar gestión de errores
    errorHandler.init();
    
    // Optimizaciones de performance
    performanceOptimizer.preloadCriticalResources();
    performanceOptimizer.optimizeRendering();
    
    // Detectar capacidades del navegador
    const capabilities = {
      webp: calculatorUtils.supports.webp(),
      intersectionObserver: calculatorUtils.supports.intersectionObserver(),
      customProperties: calculatorUtils.supports.customProperties(),
      backdrop: calculatorUtils.supports.backdrop()
    };
    
    console.log('🔍 Capacidades del navegador:', capabilities);
    
    // Aplicar fallbacks si es necesario
    if (!capabilities.backdrop) {
      document.documentElement.classList.add('no-backdrop-support');
    }
    
    if (!capabilities.customProperties) {
      document.documentElement.classList.add('no-css-variables');
    }
    
  } catch (error) {
    console.error('❌ Error en configuración de mejoras:', error);
    analytics.events.errorOccurred(error, 'setup_enhancements');
  }
}

/**
 * Exposar API pública
 */
window.CalculadoraEficienciaEnergetica = {
  // Componente principal
  Component: CalculadoraEficienciaEnergetica,
  
  // Función de inicialización
  init: initializeCalculadora,
  
  // Utilidades
  utils: calculatorUtils,
  emailValidator,
  analytics,
  
  // Configuración
  config: {
    version: '2.0.0',
    build: 'modern-2025',
    features: [
      'responsive-design',
      'accessibility-enhanced',
      'performance-optimized',
      'analytics-ready',
      'error-handling',
      'modern-ui'
    ]
  }
};

// Auto-inicializar
autoInitialize();

// ==================== EXPORT PARA MÓDULOS ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CalculadoraEficienciaEnergetica,
    initializeCalculadora,
    calculatorUtils,
    emailValidator,
    analytics
  };
}

// ==================== REGISTRO DE SERVICE WORKER ====================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ SW registrado:', registration.scope);
      })
      .catch(registrationError => {
        console.log('❌ SW registration failed:', registrationError);
      });
  });
}

// ==================== FINALIZACIÓN ====================
console.log(`
🚀 Calculadora de Eficiencia Energética v2.0
📅 ${new Date().getFullYear()} - Impulso Verde
✨ Funcionalidades: React 18, TypeScript-ready, PWA-compatible
🎯 Optimizada para: Performance, SEO, Accessibility
`);

// Marcar script como cargado
window.CALCULADORA_LOADED = true;
document.dispatchEvent(new CustomEvent('calculadora:ready', {
  detail: { version: '2.0.0', timestamp: Date.now() }
}));