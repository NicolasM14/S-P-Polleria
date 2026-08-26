# Manual de uso — S&F Pollería

Sistema interno de gestión: **productos, stock, compras, ventas, caja, gastos y reportes**.  
No es una app de pedidos para clientes ni facturación AFIP.

---

## 1. Cómo entrar

1. Abrí la app (en local: http://localhost:3000/login).
2. Ingresá **email** y **contraseña** (usuario de Supabase Authentication).
3. Si olvidás la contraseña, el dueño la resetea en Supabase → **Authentication → Users**.

Al entrar ves el **panel interno** (menú a la izquierda).

---

## 2. Rutina del día (recomendado)

```
1. Abrir caja
2. (Si hace falta) Cargar mercadería / reponer stock
3. Registrar ventas durante el día
4. Registrar gastos si hubo
5. Cerrar caja al final
6. Mirar Inicio o Reportes
```

---

## 3. Inicio

Resumen rápido del día:

- Ventas de hoy
- Estado de la caja
- Productos con stock bajo
- Accesos rápidos (nueva venta, compra, etc.)

---

## 4. Productos

Catálogo de lo que se vende.

### Crear un producto simple (ej. Milanesa, Pollo)

1. **Productos → Nuevo producto**
2. Completá:
   - **Nombre**
   - **Tipo:** Simple
   - **Unidad:** `kg` o `unidad` (después no se cambia)
   - **Precio de venta**
   - **Stock mínimo** (alerta cuando baja)
   - **Stock inicial** (opcional: cantidad al crear)
   - **Categoría**
3. Guardá.

### Crear un combo

1. Tipo: **Combo**
2. Armá la **receta** (solo productos simples + cantidad de cada uno).
3. Los combos **no tienen stock propio**: al vender se descuenta de los componentes.

### Categorías

En el listado de **Productos** podés **agregar categorías nuevas** (además de las predeterminadas).

### Editar / desactivar

- **Editar:** cambia nombre, precio, mínimo, categoría, activo.
- **No** edita stock ni unidad.
- **Desactivar:** deja de usarse en ventas; no borra historial.

---

## 5. Stock

Consulta saldos y hace **ajustes manuales** (con motivo).

| Qué | Dónde |
|-----|--------|
| Ver cuánto hay | Tabla de saldos |
| Ver historial | Movimientos recientes |
| Subir / bajar a mano | Formulario de ajuste |

### Reponer cuando se agota (ej. milanesa)

**Opción A — Compra (recomendado si compraste mercadería)**  
→ Sección **Compras** (más abajo).

**Opción B — Ajuste**

1. **Stock**
2. Elegí el producto
3. **Cantidad positiva** (ej. `10` si son 10 kg)
4. **Motivo** (lista): Inventario inicial, Merma, Corrección, etc.
5. **Registrar ajuste**

- Cantidad **positiva** → suma stock  
- Cantidad **negativa** → resta (merma, descarte, etc.)

> El stock **no se edita** en la ficha del producto. Siempre va por Compra, Venta o Ajuste.

---

## 6. Compras

Ingreso de mercadería al local.

1. **Compras → Nueva compra**
2. Agregá ítems: producto simple, cantidad, costo unitario.
3. Completá **pagos** (efectivo, transferencia, tarjeta…).  
   **La suma de pagos debe ser igual al total.**
4. Guardá.

Efectos:

- ↑ Stock de cada producto
- Si pagaste en **efectivo** y hay caja abierta → ↓ caja

---

## 7. Ventas

1. **Ventas → Nueva venta**
2. Agregá productos (simple o combo), cantidad y precio.
3. Descuento (si aplica).
4. Pagos: la **suma debe igualar el total** (después del descuento).
5. Confirmar.

Efectos:

- ↓ Stock (en combos, baja de los componentes)
- Si hay **efectivo** y caja abierta → ↑ caja

### Anular una venta

En el listado de ventas, **Anular** (solo ventas completadas).  
Revierte stock y el efectivo en caja (si hay sesión abierta).

### Si sale “stock insuficiente”

El producto (o un componente del combo) no tiene saldo.  
**Reponé** con Compra o Ajuste y volvé a vender.

---

## 8. Caja

Caja **física** del día (solo efectivo).

### Abrir

1. **Caja**
2. Monto de apertura (billetes/monedas al empezar)
3. Abrir

Solo puede haber **una caja abierta** a la vez.

### Durante el día

Los movimientos se cargan solos cuando:

- Vendés en efectivo → entra plata  
- Comprás en efectivo → sale plata  
- Gasto marcado “desde caja” → sale plata  

Transferencia y tarjeta **no** mueven la caja física.

### Cerrar

1. Contá el efectivo real
2. Ingresá el **contado**
3. Cerrar  

El sistema muestra esperado vs contado y la diferencia.

---

## 9. Gastos

Gastos del local (servicios, limpieza, etc.) — **no** son compras de mercadería.

1. **Gastos → Nuevo gasto**
2. Categoría, monto, descripción, fecha
3. **Desde caja:** sí = resta de la caja abierta (efectivo)

---

## 10. Reportes

Consultas por rango de fechas (solo lectura):

- Totales de ventas (sin anuladas)
- Compras
- Gastos
- Stock bajo
- Estado de caja abierta

---

## 11. Unidades: kg vs unidad

Depende de cómo creaste el producto:

| Unidad | Ejemplo | Cómo cargar |
|--------|---------|-------------|
| **kg** | Pollo, milanesa | Decimales (hasta 3): `1,250` |
| **unidad** | Gaseosa, ensalada | Enteros: `12` |

---

## 12. Preguntas frecuentes

**¿Cómo repongo milanesa agotada?**  
Compra nueva, o ajuste positivo en Stock.

**¿Por qué no puedo poner stock al editar el producto?**  
Por diseño: el stock siempre deja rastro (compra / venta / ajuste). Al **crear** sí podés poner stock inicial.

**¿Los combos tienen stock?**  
No. Se descuenta de los ingredientes.

**¿Puedo vender sin caja abierta?**  
Sí, pero el efectivo de esa venta **no** se registra en caja hasta que haya sesión (mejor abrir caja al empezar el día).

**¿Quién puede usar el sistema?**  
Usuarios creados en Authentication (dueños). Email y contraseña no están en la tabla `profiles`.

---

## 13. Mapa rápido del menú

| Menú | Para qué |
|------|----------|
| Inicio | Resumen del día |
| Productos | Alta / edición / categorías |
| Stock | Saldos, ajustes, historial |
| Compras | Ingreso de mercadería |
| Ventas | Cobrar y anular |
| Caja | Abrir / cerrar / arqueo |
| Gastos | Gastos operativos |
| Reportes | Totales por período |

---

*S&F Pollería — panel interno. Si algo no coincide con la pantalla, avisá para actualizar este manual.*
