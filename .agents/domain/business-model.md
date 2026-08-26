# Modelo de negocio

## Objetivo

Describir **qué es** el sistema para S&F Pollería y **qué NO administrará**.

## El negocio

S&F Pollería es una pollería local. El sistema apoya la operación diaria: comprar mercadería, controlar stock, vender en mostrador, registrar caja y gastos, y obtener reportes para decisiones.

## Qué SÍ hace el sistema

| Área | Función |
|------|---------|
| Productos | Catálogo simples y combos |
| Stock | Saldos e historial por movimientos |
| Compras | Ingreso mercadería + pagos |
| Ventas | Mostrador + pagos múltiples |
| Caja | Efectivo físico diario |
| Gastos | Egresos operativos |
| Reportes | Lectura agregada |
| Usuarios | Dueños (y empleados a futuro) |

## Qué NO administra (v1 y hasta nuevo aviso)

- Pedidos por WhatsApp
- Repartidores y logística de entrega
- Ubicaciones / mapas
- **Clientes** (no CRM, no cuenta corriente por cliente)
- Facturación electrónica ARCA/AFIP
- Múltiples sucursales
- E-commerce público

## Usuarios

| Rol | Cantidad actual | Permisos |
|-----|-----------------|----------|
| **owner** | 2 dueños | Acceso completo |
| **employee** | 0 (futuro) | Ventas/caja limitado; configurable |

Ambos dueños tienen la misma capacidad en v1.

## Principios operativos

1. **Single source of truth:** stock y caja se derivan de movimientos registrados.
2. **Trazabilidad:** operaciones importantes quedan en historial.
3. **Simplicidad:** flujos de mostrador rápidos; pocos clics.
4. **Efectivo real:** la caja refleja solo dinero físico.

## Checklist

- [ ] ¿La funcionalidad pedida está en "Qué SÍ hace"?
- [ ] ¿Evité scope de la lista "NO administra"?

## Ejemplos

**Dentro de alcance:** Registrar venta de 2,500 kg de papas fritas pagadas mitad efectivo mitad transferencia.

**Fuera de alcance:** Asignar venta a cliente Juan Pérez con cuenta corriente.

## Notas

- Expansión futura (empleados, facturación) requiere ADR + actualización de este documento.
