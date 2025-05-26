// calculadora-integration.js
// Script para integrar la calculadora React mejorada en el sitio web

// Componente de la Calculadora React Mejorada
const CalculadoraEficienciaEnergetica = () => {
  const [activeTab, setActiveTab] = React.useState('fotovoltaico');
  const [formData, setFormData] = React.useState({
    // Datos de contacto (comunes a todos)
    nombre: '',
    correo: '',
    direccion: '',
    
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
    habitantesBC: 4
  });

  const [cotizacion, setCotizacion] = React.useState(null);

  // Precios base (en CLP) basados en el Excel
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
    
    // Bomba de calor (estimados)
    bombaPiscina: 2500000,
    bombaACS: 1800000,
    bombaCalefaccion: 3500000,
    instalacionBC: 500000,
    ingenieriaBC: 200000
  };

  const calcularCotizacion = () => {
    if (activeTab === 'fotovoltaico') {
      return calcularFotovoltaico();
    } else if (activeTab === 'bombacalor') {
      return calcularBombaCalor();
    } else {
      // Auditoría energética
      setCotizacion({
        tipo: 'auditoria',
        mensaje: '⚡ Una buena auditoría energética comienza por conocerte.\nYa sea para una residencial, comercial o industrial, nuestra recomendación es agendar una breve reunión para levantar la información clave y ofrecerte un plan a medida.'
      });
    }
  };

  const calcularFotovoltaico = () => {
    const consumo = formData.suministroElectrico === 'SI' ? formData.consumoMensual : 0;
    
    if (formData.suministroElectrico === 'SI') {
      // Sistema conectado a la red
      const potencia = (consumo * 12) / 1.4 / 200000 * 1.1; // kWp según fórmula del Excel
      
      if (potencia <= 0) {
        setCotizacion(null);
        return;
      }

      const cantModulos = Math.ceil((potencia * 1000) / 435);
      const cantInversores = Math.floor(cantModulos * 0.435);
      const cantEstructuras = cantModulos;

      const items = [
        {
          nombre: 'Módulo Fotovoltaico',
          cantidad: cantModulos,
          unidad: 'UN',
          precioUnitario: precios.moduloFV,
          total: precios.moduloFV * cantModulos
        },
        {
          nombre: 'Inversor',
          cantidad: cantInversores,
          unidad: 'UN',
          precioUnitario: precios.inversor,
          total: precios.inversor * cantInversores
        },
        {
          nombre: 'Estructura Montaje',
          cantidad: cantEstructuras,
          unidad: 'GL',
          precioUnitario: precios.estructuraMontaje,
          total: precios.estructuraMontaje * cantEstructuras
        },
        {
          nombre: 'Material Eléctrico',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.materialElectrico,
          total: precios.materialElectrico
        },
        {
          nombre: 'Conductor CC',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.conductorCC,
          total: precios.conductorCC
        },
        {
          nombre: 'Conductor CA',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.conductorCA,
          total: precios.conductorCA
        },
        {
          nombre: 'Ingeniería',
          cantidad: potencia,
          unidad: 'GL',
          precioUnitario: precios.ingenieria,
          total: precios.ingenieria * potencia
        },
        {
          nombre: 'Instalación + Puesta en Marcha',
          cantidad: potencia,
          unidad: 'GL',
          precioUnitario: precios.instalacion,
          total: precios.instalacion * potencia
        },
        {
          nombre: 'Seguridad',
          cantidad: potencia,
          unidad: 'GL',
          precioUnitario: precios.seguridad,
          total: precios.seguridad * potencia
        },
        {
          nombre: 'Tramitación',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.tramitacion,
          total: precios.tramitacion
        },
        {
          nombre: 'Gastos Generales',
          cantidad: potencia,
          unidad: 'GL',
          precioUnitario: precios.gastosGenerales,
          total: precios.gastosGenerales * potencia
        }
      ];

      const totalNeto = items.reduce((sum, item) => sum + item.total, 0);

      setCotizacion({
        tipo: 'fotovoltaico_conectado',
        potencia: potencia.toFixed(2),
        items,
        totalNeto,
        iva: totalNeto * 0.19,
        totalBruto: totalNeto * 1.19
      });
    } else {
      // Sistema aislado (sin suministro eléctrico)
      const habitantes = formData.habitantes;
      const suministroAgua = formData.suministroAgua;
      
      // Determinar cantidades según tabla del Excel
      let cantModulos, cantInversores, cantBaterias;
      
      if (habitantes <= 2 && suministroAgua === 'SI') {
        cantModulos = 8; cantInversores = 5; cantBaterias = 5;
      } else if (habitantes <= 4 && suministroAgua === 'SI') {
        cantModulos = 8; cantInversores = 5; cantBaterias = 10;
      } else if (habitantes <= 2 && suministroAgua === 'NO') {
        cantModulos = 10; cantInversores = 8; cantBaterias = 10;
      } else if (habitantes <= 4 && suministroAgua === 'NO') {
        cantModulos = 12; cantInversores = 10; cantBaterias = 10;
      } else if (habitantes > 4 && suministroAgua === 'SI') {
        cantModulos = 10; cantInversores = 8; cantBaterias = 10;
      } else { // habitantes > 4 && suministroAgua === 'NO'
        cantModulos = 16; cantInversores = 10; cantBaterias = 15;
      }

      const items = [
        {
          nombre: 'Módulo Fotovoltaico',
          cantidad: cantModulos,
          unidad: 'UN',
          precioUnitario: precios.moduloFVAislado,
          total: precios.moduloFVAislado * cantModulos
        },
        {
          nombre: 'Inversor',
          cantidad: cantInversores,
          unidad: 'kW',
          precioUnitario: precios.inversorAislado,
          total: precios.inversorAislado * cantInversores
        },
        {
          nombre: 'Baterías',
          cantidad: cantBaterias,
          unidad: 'kWh',
          precioUnitario: precios.baterias,
          total: precios.baterias * cantBaterias
        },
        {
          nombre: 'Estructura Montaje',
          cantidad: cantModulos,
          unidad: 'GL',
          precioUnitario: precios.estructuraMontaje,
          total: precios.estructuraMontaje * cantModulos
        },
        {
          nombre: 'Material Eléctrico',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.materialElectrico,
          total: precios.materialElectrico
        },
        {
          nombre: 'Conductor CC',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.conductorCC,
          total: precios.conductorCC
        },
        {
          nombre: 'Conductor CA',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.conductorCA,
          total: precios.conductorCA
        },
        {
          nombre: 'Ingeniería',
          cantidad: 1,
          unidad: 'GL',
          precioUnitario: precios.ingenieriaAislado,
          total: precios.ingenieriaAislado
        }
      ];

      const totalNeto = items.reduce((sum, item) => sum + item.total, 0);

      setCotizacion({
        tipo: 'fotovoltaico_aislado',
        habitantes: habitantes,
        suministroAgua: suministroAgua,
        items,
        totalNeto,
        iva: totalNeto * 0.19,
        totalBruto: totalNeto * 1.19
      });
    }
  };

  const calcularBombaCalor = () => {
    if (formData.usoBC === 'Calefacción') {
      setCotizacion({
        tipo: 'bomba_calefaccion',
        mensaje: '🌡️ Cada hogar tiene condiciones únicas para calefacción.\nPor eso, nos gusta conversar primero antes de cotizar una bomba de calor.'
      });
      return;
    }

    let precioBase, descripcion;
    
    if (formData.usoBC === 'Temperado de piscina') {
      const volumen = formData.superficiePiscina * formData.profundidad;
      const factorVolumen = Math.ceil(volumen / 50); // Factor basado en volumen estándar
      
      precioBase = precios.bombaPiscina * factorVolumen;
      descripcion = `Bomba de calor para piscina de ${formData.superficiePiscina}m² x ${formData.profundidad}m (${volumen.toFixed(1)}m³)`;
    } else {
      // Agua caliente sanitaria
      const factorHabitantes = Math.ceil(formData.habitantesBC / 4);
      precioBase = precios.bombaACS * factorHabitantes;
      descripcion = `Bomba de calor para ACS - ${formData.habitantesBC} habitantes`;
    }

    const items = [
      {
        nombre: descripcion,
        cantidad: 1,
        unidad: 'UN',
        precioUnitario: precioBase,
        total: precioBase
      },
      {
        nombre: 'Instalación y Puesta en Marcha',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.instalacionBC,
        total: precios.instalacionBC
      },
      {
        nombre: 'Ingeniería',
        cantidad: 1,
        unidad: 'GL',
        precioUnitario: precios.ingenieriaBC,
        total: precios.ingenieriaBC
      }
    ];

    const totalNeto = items.reduce((sum, item) => sum + item.total, 0);

    setCotizacion({
      tipo: 'bomba_calor',
      uso: formData.usoBC,
      items,
      totalNeto,
      iva: totalNeto * 0.19,
      totalBruto: totalNeto * 1.19
    });
  };

  React.useEffect(() => {
    calcularCotizacion();
  }, [
    formData.suministroElectrico, 
    formData.consumoMensual, 
    formData.habitantes, 
    formData.suministroAgua,
    formData.usoBC,
    formData.superficiePiscina,
    formData.profundidad,
    formData.habitantesBC,
    activeTab
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSolicitudCotizacion = () => {
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
      quoteForm.style.display = 'block';
      window.scrollTo({
        top: quoteForm.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const renderTabSelector = () => {
    const tabs = [
      { id: 'fotovoltaico', name: 'Energía Fotovoltaica', icon: 'fas fa-solar-panel' },
      { id: 'bombacalor', name: 'Bomba de Calor', icon: 'fas fa-thermometer-half' },
      { id: 'auditoria', name: 'Auditoría Energética', icon: 'fas fa-chart-line' }
    ];

    return React.createElement('div', {
      key: 'tab-selector',
      style: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }
    }, tabs.map(tab => 
      React.createElement('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        style: {
          flex: '1',
          minWidth: '200px',
          padding: '15px 20px',
          border: activeTab === tab.id ? '2px solid #43a48d' : '2px solid #e1e5e9',
          borderRadius: '10px',
          backgroundColor: activeTab === tab.id ? 'rgba(67, 164, 141, 0.1)' : 'white',
          color: activeTab === tab.id ? '#276a63' : '#666',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontWeight: activeTab === tab.id ? '600' : 'normal'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: tab.icon,
          style: { fontSize: '18px' }
        }),
        React.createElement('span', { key: 'text' }, tab.name)
      ])
    ));
  };

  const renderFormFields = () => {
    const commonFields = [
      // Datos de contacto
      React.createElement('div', {
        key: 'contact-section',
        style: { marginBottom: '30px' }
      }, [
        React.createElement('h3', {
          key: 'contact-title',
          style: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px'
          }
        }, 'Datos de Contacto'),
        
        React.createElement('div', {
          key: 'contact-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '15px',
            marginBottom: '15px'
          }
        }, [
          React.createElement('div', { key: 'nombre-field' }, [
            React.createElement('label', {
              key: 'nombre-label',
              style: {
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }
            }, [
              React.createElement('i', {
                key: 'user-icon',
                className: 'fas fa-user',
                style: { marginRight: '5px', color: '#43a48d' }
              }),
              'Nombre'
            ]),
            React.createElement('input', {
              key: 'nombre-input',
              type: 'text',
              value: formData.nombre,
              onChange: (e) => handleInputChange('nombre', e.target.value),
              placeholder: 'Tu nombre completo',
              style: {
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }
            })
          ]),
          React.createElement('div', { key: 'correo-field' }, [
            React.createElement('label', {
              key: 'correo-label',
              style: {
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }
            }, [
              React.createElement('i', {
                key: 'mail-icon',
                className: 'fas fa-envelope',
                style: { marginRight: '5px', color: '#43a48d' }
              }),
              'Correo'
            ]),
            React.createElement('input', {
              key: 'correo-input',
              type: 'email',
              value: formData.correo,
              onChange: (e) => handleInputChange('correo', e.target.value),
              placeholder: 'tu@email.com',
              style: {
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease'
              }
            })
          ])
        ]),

        React.createElement('div', { key: 'direccion-field' }, [
          React.createElement('label', {
            key: 'direccion-label',
            style: {
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }
          }, [
            React.createElement('i', {
              key: 'map-icon',
              className: 'fas fa-map-marker-alt',
              style: { marginRight: '5px', color: '#43a48d' }
            }),
            'Dirección'
          ]),
          React.createElement('input', {
            key: 'direccion-input',
            type: 'text',
            value: formData.direccion,
            onChange: (e) => handleInputChange('direccion', e.target.value),
            placeholder: 'Especifica ubicación completa',
            style: {
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }
          })
        ])
      ])
    ];

    if (activeTab === 'fotovoltaico') {
      return [
        ...commonFields,
        React.createElement('div', {
          key: 'fotovoltaico-section',
          style: { marginBottom: '30px' }
        }, [
          React.createElement('h3', {
            key: 'fv-title',
            style: {
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }
          }, 'Información del Sistema Fotovoltaico'),

          React.createElement('div', {
            key: 'fv-grid',
            style: {
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
              gap: '15px',
              marginBottom: '20px'
            }
          }, [
            React.createElement('div', { key: 'tipo-vivienda-field' }, [
              React.createElement('label', {
                key: 'tipo-label',
                style: {
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }
              }, '¿Vives en casa o departamento?'),
              React.createElement('select', {
                key: 'tipo-select',
                value: formData.tipoVivienda,
                onChange: (e) => handleInputChange('tipoVivienda', e.target.value),
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }
              }, [
                React.createElement('option', { key: 'casa', value: 'Casa' }, 'Casa'),
                React.createElement('option', { key: 'depto', value: 'Departamento' }, 'Departamento')
              ])
            ]),

            formData.tipoVivienda === 'Casa' && React.createElement('div', { key: 'suministro-field' }, [
              React.createElement('label', {
                key: 'suministro-label',
                style: {
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }
              }, '¿Cuentas con suministro eléctrico?'),
              React.createElement('select', {
                key: 'suministro-select',
                value: formData.suministroElectrico,
                onChange: (e) => handleInputChange('suministroElectrico', e.target.value),
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }
              }, [
                React.createElement('option', { key: 'si', value: 'SI' }, 'Sí'),
                React.createElement('option', { key: 'no', value: 'NO' }, 'No')
              ])
            ])
          ]),

          // Campos condicionales para fotovoltaico
          formData.tipoVivienda === 'Casa' && (
            formData.suministroElectrico === 'SI' ? 
            React.createElement('div', {
              key: 'consumo-field',
              style: { marginBottom: '20px' }
            }, [
              React.createElement('label', {
                key: 'consumo-label',
                style: {
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }
              }, '¿Cuánto gastas al mes en electricidad? (CLP)'),
              React.createElement('input', {
                key: 'consumo-input',
                type: 'number',
                value: formData.consumoMensual,
                onChange: (e) => handleInputChange('consumoMensual', parseInt(e.target.value) || 0),
                placeholder: 'Ej: 150000',
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px'
                }
              })
            ]) :
            React.createElement('div', {
              key: 'sin-suministro-fields'
            }, [
              React.createElement('div', {
                key: 'habitantes-field',
                style: { marginBottom: '20px' }
              }, [
                React.createElement('label', {
                  key: 'habitantes-label',
                  style: {
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '8px'
                  }
                }, [
                  React.createElement('i', {
                    key: 'users-icon',
                    className: 'fas fa-users',
                    style: { marginRight: '5px', color: '#43a48d' }
                  }),
                  '¿Cuántas personas viven en la casa?'
                ]),
                React.createElement('input', {
                  key: 'habitantes-input',
                  type: 'number',
                  value: formData.habitantes,
                  onChange: (e) => handleInputChange('habitantes', parseInt(e.target.value) || 0),
                  min: 1,
                  style: {
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                })
              ]),
              React.createElement('div', {
                key: 'agua-field',
                style: { marginBottom: '20px' }
              }, [
                React.createElement('label', {
                  key: 'agua-label',
                  style: {
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '8px'
                  }
                }, '¿Cuentas con suministro de agua o tienes agua de pozo?'),
                React.createElement('select', {
                  key: 'agua-select',
                  value: formData.suministroAgua,
                  onChange: (e) => handleInputChange('suministroAgua', e.target.value),
                  style: {
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }
                }, [
                  React.createElement('option', { key: 'si-agua', value: 'SI' }, 'Sí, tengo suministro de agua'),
                  React.createElement('option', { key: 'no-agua', value: 'NO' }, 'No, tengo agua de pozo')
                ])
              ])
            ])
          ),

          // Mensaje para departamentos
          formData.tipoVivienda === 'Departamento' && React.createElement('div', {
            key: 'depto-message',
            style: {
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              color: '#856404'
            }
          }, '¡Gracias por tu interés! Instalamos paneles solares en casas y en edificios completos, pero no en departamentos individuales. Si tu comunidad busca ahorrar en gastos comunes o en el total de la factura, podemos cotizar un proyecto colectivo.')
        ])
      ];
    } else if (activeTab === 'bombacalor') {
      return [
        ...commonFields,
        React.createElement('div', {
          key: 'bombacalor-section',
          style: { marginBottom: '30px' }
        }, [
          React.createElement('h3', {
            key: 'bc-title',
            style: {
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }
          }, 'Información de la Bomba de Calor'),

          React.createElement('div', {
            key: 'uso-field',
            style: { marginBottom: '20px' }
          }, [
            React.createElement('label', {
              key: 'uso-label',
              style: {
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }
            }, '¿Buscas bomba de calor para?'),
            React.createElement('select', {
              key: 'uso-select',
              value: formData.usoBC,
              onChange: (e) => handleInputChange('usoBC', e.target.value),
              style: {
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }
            }, [
              React.createElement('option', { key: 'piscina', value: 'Temperado de piscina' }, 'Temperado de piscina'),
              React.createElement('option', { key: 'acs', value: 'Agua caliente sanitaria' }, 'Agua caliente sanitaria'),
              React.createElement('option', { key: 'calefaccion', value: 'Calefacción' }, 'Calefacción')
            ])
          ]),

          // Campos condicionales para bomba de calor
          formData.usoBC === 'Temperado de piscina' && React.createElement('div', {
            key: 'piscina-fields'
          }, [
            React.createElement('div', {
              key: 'superficie-field',
              style: { marginBottom: '20px' }
            }, [
              React.createElement('label', {
                key: 'superficie-label',
                style: {
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }
              }, 'Superficie de piscina (m²)'),
              React.createElement('input', {
                key: 'superficie-input',
                type: 'number',
                value: formData.superficiePiscina,
                onChange: (e) => handleInputChange('superficiePiscina', parseFloat(e.target.value) || 0),
                placeholder: 'Ej: 50',
                min: 1,
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px'
                }
              })
            ]),
            React.createElement('div', {
              key: 'profundidad-field',
              style: { marginBottom: '20px' }
            }, [
              React.createElement('label', {
                key: 'profundidad-label',
                style: {
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }
              }, 'Profundidad media (metros)'),
              React.createElement('input', {
                key: 'profundidad-input',
                type: 'number',
                value: formData.profundidad,
                onChange: (e) => handleInputChange('profundidad', parseFloat(e.target.value) || 0),
                placeholder: 'Ej: 1.5',
                min: 0.5,
                step: 0.1,
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px'
                }
              })
            ])
          ]),

          formData.usoBC === 'Agua caliente sanitaria' && React.createElement('div', {
            key: 'acs-field',
            style: { marginBottom: '20px' }
          }, [
            React.createElement('label', {
              key: 'habitantes-bc-label',
              style: {
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }
            }, [
              React.createElement('i', {
                key: 'users-icon-bc',
                className: 'fas fa-users',
                style: { marginRight: '5px', color: '#43a48d' }
              }),
              '¿Cuántas personas viven en la casa?'
            ]),
            React.createElement('input', {
              key: 'habitantes-bc-input',
              type: 'number',
              value: formData.habitantesBC,
              onChange: (e) => handleInputChange('habitantesBC', parseInt(e.target.value) || 0),
              min: 1,
              style: {
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px'
              }
            })
          ]),

          formData.usoBC === 'Calefacción' && React.createElement('div', {
            key: 'calefaccion-message',
            style: {
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '8px',
              padding: '15px',
              color: '#1565c0'
            }
          }, '🌡️ Cada hogar tiene condiciones únicas para calefacción. Por eso, nos gusta conversar primero antes de cotizar una bomba de calor.')
        ])
      ];
    } else {
      // Auditoría energética
      return [
        ...commonFields,
        React.createElement('div', {
          key: 'auditoria-section',
          style: { marginBottom: '30px' }
        }, [
          React.createElement('h3', {
            key: 'audit-title',
            style: {
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }
          }, 'Auditoría Energética'),

          React.createElement('div', {
            key: 'audit-message',
            style: {
              backgroundColor: '#f3e5f5',
              border: '1px solid #9c27b0',
              borderRadius: '8px',
              padding: '20px',
              color: '#4a148c'
            }
          }, [
            React.createElement('p', {
              key: 'audit-text',
              style: { margin: 0, lineHeight: '1.6' }
            }, '⚡ Una buena auditoría energética comienza por conocerte.'),
            React.createElement('br', { key: 'br1' }),
            React.createElement('p', {
              key: 'audit-text2',
              style: { margin: '10px 0 0 0', lineHeight: '1.6' }
            }, 'Ya sea para una residencial, comercial o industrial, nuestra recomendación es agendar una breve reunión para levantar la información clave y ofrecerte un plan a medida.')
          ])
        ])
      ];
    }
  };

  const renderCotizacion = () => {
    if (!cotizacion) {
      return React.createElement('div', {
        key: 'placeholder',
        style: {
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }
      }, [
        React.createElement('i', {
          key: 'placeholder-icon',
          className: 'fas fa-calculator',
          style: {
            fontSize: '64px',
            color: '#ccc',
            marginBottom: '20px',
            display: 'block'
          }
        }),
        React.createElement('p', {
          key: 'placeholder-text',
          style: { fontSize: '16px' }
        }, 'Completa la información para generar tu cotización')
      ]);
    }

    if (cotizacion.tipo === 'auditoria' || cotizacion.mensaje) {
      return React.createElement('div', {
        key: 'message-cotizacion',
        style: {
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'rgba(67, 164, 141, 0.05)',
          border: '1px solid rgba(67, 164, 141, 0.3)',
          borderRadius: '10px',
          color: '#276a63'
        }
      }, [
        React.createElement('i', {
          key: 'info-icon',
          className: activeTab === 'auditoria' ? 'fas fa-chart-line' : 'fas fa-thermometer-half',
          style: {
            fontSize: '48px',
            color: '#43a48d',
            marginBottom: '20px',
            display: 'block'
          }
        }),
        React.createElement('p', {
          key: 'message-text',
          style: { 
            fontSize: '16px', 
            lineHeight: '1.6',
            whiteSpace: 'pre-line'
          }
        }, cotizacion.mensaje),
        React.createElement('button', {
          key: 'contact-button',
          onClick: handleSolicitudCotizacion,
          style: {
            marginTop: '20px',
            backgroundColor: '#43a48d',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }
        }, '👉 Agenda una llamada con un especialista')
      ]);
    }

    // Cotización con tabla de precios
    return [
      // Resumen del sistema
      React.createElement('div', {
        key: 'system-summary',
        style: {
          backgroundColor: 'rgba(67, 164, 141, 0.05)',
          border: '1px solid rgba(67, 164, 141, 0.3)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }
      }, [
        React.createElement('h3', {
          key: 'summary-title',
          style: {
            fontWeight: '600',
            color: '#276a63',
            marginBottom: '10px'
          }
        }, 'Resumen del Sistema'),
        cotizacion.potencia && React.createElement('p', {
          key: 'power-info',
          style: { color: '#30705b', marginBottom: '5px' }
        }, [
          React.createElement('span', {
            key: 'power-label',
            style: { fontWeight: '500' }
          }, 'Potencia calculada: '),
          `${cotizacion.potencia} kWp`
        ]),
        cotizacion.habitantes && React.createElement('p', {
          key: 'habitantes-info',
          style: { color: '#30705b', marginBottom: '5px' }
        }, [
          React.createElement('span', {
            key: 'habitantes-label',
            style: { fontWeight: '500' }
          }, 'Habitantes: '),
          `${cotizacion.habitantes} personas`
        ]),
        cotizacion.suministroAgua && React.createElement('p', {
          key: 'agua-info',
          style: { color: '#30705b' }
        }, [
          React.createElement('span', {
            key: 'agua-label',
            style: { fontWeight: '500' }
          }, 'Suministro de agua: '),
          cotizacion.suministroAgua === 'SI' ? 'Sí' : 'Agua de pozo'
        ]),
        cotizacion.uso && React.createElement('p', {
          key: 'uso-info',
          style: { color: '#30705b' }
        }, [
          React.createElement('span', {
            key: 'uso-label',
            style: { fontWeight: '500' }
          }, 'Uso: '),
          cotizacion.uso
        ])
      ]),

      // Tabla de cotización
      React.createElement('div', {
        key: 'quote-table-container',
        style: {
          overflowX: 'auto',
          marginBottom: '30px'
        }
      }, [
        React.createElement('table', {
          key: 'quote-table',
          style: {
            width: '100%',
            fontSize: '14px',
            borderCollapse: 'collapse'
          }
        }, [
          React.createElement('thead', { key: 'table-head' }, [
            React.createElement('tr', {
              key: 'header-row',
              style: { borderBottom: '2px solid #e5e7eb' }
            }, [
              React.createElement('th', {
                key: 'item-header',
                style: {
                  textAlign: 'left',
                  padding: '10px 5px',
                  color: '#666',
                  fontWeight: '600'
                }
              }, 'Ítem'),
              React.createElement('th', {
                key: 'qty-header',
                style: {
                  textAlign: 'center',
                  padding: '10px 5px',
                  color: '#666',
                  fontWeight: '600'
                }
              }, 'Cant.'),
              React.createElement('th', {
                key: 'unit-price-header',
                style: {
                  textAlign: 'right',
                  padding: '10px 5px',
                  color: '#666',
                  fontWeight: '600'
                }
              }, 'Precio Unit.'),
              React.createElement('th', {
                key: 'total-header',
                style: {
                  textAlign: 'right',
                  padding: '10px 5px',
                  color: '#666',
                  fontWeight: '600'
                }
              }, 'Total')
            ])
          ]),
          React.createElement('tbody', { key: 'table-body' }, 
            cotizacion.items.map((item, index) => 
              React.createElement('tr', {
                key: `item-${index}`,
                style: { borderBottom: '1px solid #f3f4f6' }
              }, [
                React.createElement('td', {
                  key: 'item-name',
                  style: {
                    padding: '10px 5px',
                    color: '#333'
                  }
                }, item.nombre),
                React.createElement('td', {
                  key: 'item-qty',
                  style: {
                    textAlign: 'center',
                    padding: '10px 5px',
                    color: '#666'
                  }
                }, `${item.cantidad < 1 ? item.cantidad.toFixed(2) : item.cantidad.toFixed(0)} ${item.unidad}`),
                React.createElement('td', {
                  key: 'item-unit-price',
                  style: {
                    textAlign: 'right',
                    padding: '10px 5px',
                    color: '#666'
                  }
                }, formatCurrency(item.precioUnitario)),
                React.createElement('td', {
                  key: 'item-total',
                  style: {
                    textAlign: 'right',
                    padding: '10px 5px',
                    fontWeight: '500',
                    color: '#333'
                  }
                }, formatCurrency(item.total))
              ])
            )
          )
        ])
      ]),

      // Totales
      React.createElement('div', {
        key: 'totals-section',
        style: { marginBottom: '30px' }
      }, [
        React.createElement('div', {
          key: 'net-total',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '10px'
          }
        }, [
          React.createElement('span', { key: 'net-label' }, 'Total Neto:'),
          React.createElement('span', { key: 'net-value' }, formatCurrency(cotizacion.totalNeto))
        ]),
        React.createElement('div', {
          key: 'iva-total',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            color: '#666',
            marginBottom: '10px'
          }
        }, [
          React.createElement('span', { key: 'iva-label' }, 'IVA (19%):'),
          React.createElement('span', { key: 'iva-value' }, formatCurrency(cotizacion.iva))
        ]),
        React.createElement('div', {
          key: 'gross-total',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#43a48d',
            paddingTop: '15px',
            borderTop: '2px solid #e5e7eb'
          }
        }, [
          React.createElement('span', { key: 'gross-label' }, 'Total Bruto:'),
          React.createElement('span', { key: 'gross-value' }, formatCurrency(cotizacion.totalBruto))
        ])
      ]),

      // Botón de solicitud
      React.createElement('div', {
        key: 'cta-section',
        style: { marginTop: '30px' }
      }, [
        React.createElement('button', {
          key: 'cta-button',
          onClick: handleSolicitudCotizacion,
          style: {
            width: '100%',
            backgroundColor: '#43a48d',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          },
          onMouseOver: (e) => {
            e.target.style.backgroundColor = '#276a63';
            e.target.style.transform = 'translateY(-2px)';
          },
          onMouseOut: (e) => {
            e.target.style.backgroundColor = '#43a48d';
            e.target.style.transform = 'translateY(0)';
          }
        }, 'Solicitar Cotización Detallada')
      ])
    ];
  };

  return React.createElement('div', {
    className: 'calculadora-react',
    style: {
      minHeight: '600px',
      background: 'linear-gradient(135deg, rgba(67, 164, 141, 0.05) 0%, rgba(48, 112, 91, 0.05) 100%)',
      padding: '40px 20px'
    }
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      style: {
        textAlign: 'center',
        marginBottom: '40px'
      }
    }, [
      React.createElement('div', {
        key: 'icon-title',
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: 'fas fa-calculator',
          style: {
            fontSize: '48px',
            color: '#43a48d',
            marginRight: '15px'
          }
        }),
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }
        }, 'Calculadora de Eficiencia Energética')
      ]),
      React.createElement('p', {
        key: 'subtitle',
        style: {
          fontSize: '18px',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
        }
      }, 'Obtén una cotización personalizada para tu proyecto de energía sostenible')
    ]),

    // Tab Selector
    renderTabSelector(),

    // Main Content Grid
    React.createElement('div', {
      key: 'main-grid',
      style: {
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 992 ? '1fr 1fr' : '1fr',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }
    }, [
      // Formulario
      React.createElement('div', {
        key: 'form-section',
        style: {
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '30px'
        }
      }, [
        React.createElement('h2', {
          key: 'form-title',
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          React.createElement('i', {
            key: 'form-icon',
            className: activeTab === 'fotovoltaico' ? 'fas fa-solar-panel' : 
                      activeTab === 'bombacalor' ? 'fas fa-thermometer-half' : 'fas fa-chart-line',
            style: {
              fontSize: '20px',
              color: '#43a48d',
              marginRight: '10px'
            }
          }),
          `Información del ${activeTab === 'fotovoltaico' ? 'Sistema Fotovoltaico' : 
                            activeTab === 'bombacalor' ? 'Sistema de Bomba de Calor' : 'Proyecto de Auditoría'}`
        ]),

        ...renderFormFields()
      ]),

      // Cotización
      React.createElement('div', {
        key: 'quote-section',
        style: {
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '30px'
        }
      }, [
        React.createElement('h2', {
          key: 'quote-title',
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center'
          }
        }, [
          React.createElement('i', {
            key: 'quote-icon',
            className: 'fas fa-calculator',
            style: {
              fontSize: '20px',
              color: '#43a48d',
              marginRight: '10px'
            }
          }),
          'Cotización'
        ]),

        ...renderCotizacion()
      ])
    ]),

    // Footer
    React.createElement('div', {
      key: 'footer',
      style: {
        textAlign: 'center',
        marginTop: '40px',
        color: '#666',
        fontSize: '14px'
      }
    }, '💡 Esta cotización es referencial. Para un análisis detallado, agenda una consulta con nuestros especialistas.')
  ]);
};

// Función para inicializar la calculadora
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

  // Renderizar el componente
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(CalculadoraEficienciaEnergetica));
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCalculadora);
} else {
  initializeCalculadora();
}