# Manual de Usuario

# S&F Pollería

---

| | |
|:--|:--|
| **Sistema** | S&F Pollería — Gestión interna de stock, ventas y caja |
| **Versión** | 0.1.0 |
| **Fecha** | 26 de agosto de 2026 |
| **Destinatarios** | Dueños y personal autorizado del local |
| **Logo** | Insertar aquí el logo de S&F Pollería (`logo-sf-polleria`) |

---

> **Espacio para logo**
>
> `[CAPTURA 00 — LOGO DE LA MARCA]`
>
> **Qué necesito fotografiar / insertar:** el logo oficial de S&F Pollería (el mismo que aparece en el sistema).
>
> **Qué debe verse:** marca completa, fondo limpio, sin recortes circulares forzados.

---

# Índice

1. [Introducción](#1-introducción)
2. [Acceso al sistema](#2-acceso-al-sistema)
3. [Inicio (Dashboard)](#3-inicio-dashboard)
4. [Navegación](#4-navegación)
5. [Productos](#5-productos)
6. [Stock](#6-stock)
7. [Compras](#7-compras)
8. [Ventas](#8-ventas)
9. [Caja](#9-caja)
10. [Gastos](#10-gastos)
11. [Historiales e informes del día a día](#11-historiales-e-informes-del-día-a-día)
12. [Reportes](#12-reportes)
13. [Funcionalidades especiales](#13-funcionalidades-especiales)
14. [Errores y recomendaciones](#14-errores-y-recomendaciones)
15. [Buenas prácticas de uso](#15-buenas-prácticas-de-uso)
16. [Listado de capturas necesarias](#16-listado-de-capturas-necesarias)

---

# 1. Introducción

## ¿Para qué sirve el sistema?

**S&F Pollería** es el panel interno del local. Sirve para registrar lo que se compra, lo que se vende, cuánto stock hay, el efectivo de la caja y los gastos del día.

## ¿Qué problemas ayuda a resolver?

- Saber **cuántos gramos** quedan de cada producto (como en la balanza).
- Registrar ventas y compras sin papeles sueltos.
- Controlar el **efectivo** de la caja (apertura, movimientos y cierre).
- Ver un resumen del día y del período en **Reportes**.

## ¿Qué áreas gestiona?

| Área | Qué hace |
|------|----------|
| Productos | Catálogo, precios y stock mínimo |
| Stock | Saldos, ajustes y movimientos |
| Compras | Ingreso de mercadería y pagos |
| Ventas | Ventas del mostrador y anulación |
| Caja | Apertura, saldo esperado y cierre |
| Gastos | Gastos operativos |
| Reportes | Totales por fechas |

## ¿Para quién está pensado?

Para las personas que atienden el local (dueños u operadores con usuario). No es una tienda online ni un sistema de facturación electrónica.

### Importante (unidades y pagos)

- Las **cantidades** se cargan en **gramos** (ejemplo: `1200` = 1,2 kg), como muestra la balanza.
- El **precio** y el **costo** se cargan **por kilogramo**.
- Los medios de pago disponibles son solo **Efectivo** y **Transferencia**.

---

# 2. Acceso al sistema

## ¿Para qué sirve?

Permite ingresar de forma segura al panel con el usuario del local.

## ¿Cómo utilizarla?

**Paso 1:** Abrí el sistema en el navegador con la dirección que te indique quien administre el acceso (por ejemplo, la dirección del local o del servidor).

**Paso 2:** En la pantalla **Iniciar sesión**, completá:
- **Email**
- **Contraseña**

**Paso 3:** Presioná **Ingresar**.

### Resultado

- Si los datos son correctos, verás el mensaje **Bienvenido** y entrarás a **Inicio**.
- Si son incorrectos, verás: **No se pudo iniciar sesión. Verificá email y contraseña.**

### Salir

En la barra superior derecha, presioná **Salir**. Volvés a la pantalla de inicio de sesión.

### Importante

- No compartas la contraseña.
- Si olvidaste la contraseña, pedí ayuda a quien administra los usuarios (eso se gestiona fuera de esta pantalla: el sistema **no** tiene botón de “recuperar contraseña” ni de “crear usuario” dentro del panel).

### Captura

> **[CAPTURA 01 — PANTALLA DE LOGIN]**
>
> **Insertar aquí la captura de la pantalla de inicio de sesión.**
>
> **Qué necesito fotografiar:** pantalla completa de login con logo, título **Iniciar sesión**, campos **Email** y **Contraseña**, y botón **Ingresar**.
>
> **Qué debe verse:** marca S&F Pollería, formulario centrado, sin estar logueado.
>
> **Ejemplo de datos:** no hace falta completar la contraseña real; podés dejar el email de ejemplo visible.

---

# 3. Inicio (Dashboard)

## ¿Para qué sirve?

Es la primera pantalla después de ingresar. Resume el día: ventas, caja y alertas de stock.

## ¿Qué información aparece?

| Bloque | Significado |
|--------|-------------|
| **Ventas de hoy** | Suma de ventas **completadas** del día (no incluye anuladas) y cantidad de ventas |
| **Caja** | **Saldo esperado** de la caja abierta, o el mensaje **Sin caja abierta** |
| **Stock bajo** | Cantidad de productos activos cuyo stock está en el mínimo o por debajo |

También hay **Accesos rápidos** a:
- **Nueva venta**
- **Nueva compra**
- **Caja**
- **Productos**

## ¿Cómo interpretarlo?

- Si **Caja** dice **Sin caja abierta**, conviene abrir la caja antes de vender o comprar en efectivo.
- Si **Stock bajo** es mayor a 0, entrí a **Stock** (botón **Ver stock**) y revisá qué productos hay que reponer.

### Captura

> **[CAPTURA 02 — INICIO / DASHBOARD]**
>
> **Insertar aquí la captura de Inicio.**
>
> **Qué necesito fotografiar:** pantalla **Inicio** con las tres tarjetas (Ventas de hoy, Caja, Stock bajo) y la sección **Accesos rápidos**.
>
> **Qué debe verse:** menú lateral izquierdo, título **Inicio**, métricas con números.
>
> **Datos sugeridos:** caja abierta; al menos una venta del día; idealmente algún producto en stock bajo.

---

# 4. Navegación

## Menú principal

El menú está a la izquierda (en pantallas de escritorio). Los nombres son exactamente estos:

| Pestaña | Para qué sirve |
|---------|----------------|
| **Inicio** | Resumen del día |
| **Productos** | Catálogo, precios, categorías, activar/desactivar |
| **Stock** | Saldos en gramos, ajustes y movimientos |
| **Compras** | Ver compras e ingresar mercadería |
| **Ventas** | Ver ventas, anular, cargar nueva venta |
| **Caja** | Abrir, ver movimientos y cerrar caja |
| **Gastos** | Ver y registrar gastos |
| **Reportes** | Totales por rango de fechas |

En la parte inferior del menú aparece el nombre del sistema. Arriba a la derecha está el botón **Salir**.

### Importante (pantallas chicas)

En celular o pantallas muy angostas el menú lateral **no se muestra**. Conviene usar el sistema en una computadora o tablet ancha.

### Captura

> **[CAPTURA 03 — MENÚ LATERAL]**
>
> **Insertar aquí la captura del menú.**
>
> **Qué necesito fotografiar:** barra izquierda completa con las 8 opciones y el logo.
>
> **Qué debe verse:** una opción marcada como activa (por ejemplo **Inicio**).

---

# 5. Productos

## ¿Para qué sirve?

Administrar el catálogo: nombre, precio por kg, stock mínimo, categoría y si el producto está activo para vender/comprar.

## 5.1 Consultar y filtrar productos

### ¿Cómo utilizarla?

**Paso 1:** Entrá a **Productos**.

**Paso 2:** Usá los filtros si hace falta:
- **Buscar:** nombre del producto
- **Estado:** Activos / Inactivos / Todos

**Paso 3:** Presioná **Filtrar**. Para volver al listado sin filtros, **Limpiar**.

### Resultado

La tabla muestra: **Nombre**, **Precio / kg**, **Stock (g)**, **Estado**, **Acciones**.

Si el stock está bajo, puede verse la marca **· bajo**.

### Captura

> **[CAPTURA 04 — LISTADO DE PRODUCTOS]**
>
> **Qué necesito fotografiar:** listado con filtros y tabla.
>
> **Qué debe verse:** al menos 2–3 productos, columnas de precio/kg y stock en g.
>
> **Datos sugeridos:** productos tipo *Pechuga*, *Milanesa*; stock en gramos visibles.

---

## 5.2 Crear una categoría

### ¿Para qué sirve?

Agrupar productos (ej. Carnes, Elaborados).

### ¿Cómo utilizarla?

**Paso 1:** En **Productos**, en la sección **Categorías**, escribí el nombre en **Nueva categoría**.

**Paso 2:** Presioná **Agregar**.

### Resultado

Mensaje **Categoría creada**. La categoría queda disponible al crear o editar productos.

---

## 5.3 Crear un producto

### ¿Cómo utilizarla?

**Paso 1:** En **Productos**, presioná **Nuevo producto**.

**Paso 2:** Completá:
- **Nombre** (ej. Milanesa / Pollo)
- **Unidad:** fija en **Gramos (g)** (no se elige otra)
- **Precio por kg**
- **Stock mínimo (g)** — alerta cuando el stock baje a ese valor o menos
- **Categoría** (opcional)
- **Producto activo** (marcado = se puede usar en ventas/compras)

**Paso 3:** Presioná **Crear producto**.

### Resultado

- Mensaje: **Producto creado. Cargá el stock en Stock o Compras.**
- El stock inicia en **0 g**.
- El sistema te lleva a **Stock** para que cargues el inventario o registres una compra.

### Importante

El stock **no** se carga al crear el producto. Se carga después con:
- **Stock** → ajuste (motivo **Inventario inicial**), o
- **Compras** → nueva compra.

### Captura

> **[CAPTURA 05 — CREAR PRODUCTO]**
>
> **Qué necesito fotografiar:** formulario **Nuevo producto** completo, con el aviso de stock 0 g y el botón **Crear producto**.
>
> **Datos sugeridos:** Nombre *Pechuga de pollo*; Precio por kg *8500*; Stock mínimo *2000* g; categoría a elección.

---

## 5.4 Editar un producto

### ¿Cómo utilizarla?

**Paso 1:** En el listado, en **Acciones**, presioná **Editar**.

**Paso 2:** Modificá nombre, precio, mínimo, categoría o activo.

**Paso 3:** Presioná **Guardar cambios**.

### Resultado

Mensaje **Producto actualizado**. Volvés al listado.

### Importante

- El **stock actual** se ve, pero **no se edita** desde aquí.
- Para cambiar stock usá **Stock** o **Compras**.

### Captura

> **[CAPTURA 06 — EDITAR PRODUCTO]**
>
> **Qué necesito fotografiar:** pantalla **Editar producto** mostrando stock actual en g (solo lectura) y botón **Guardar cambios**.

---

## 5.5 Activar o desactivar un producto

### ¿Cómo utilizarla?

En el listado, en **Acciones**:
- **Desactivar** — deja de usarse en operaciones nuevas.
- **Activar** — vuelve a estar disponible.

### Resultado

La columna **Estado** pasa a **Activo** o **Inactivo**.

---

# 6. Stock

## ¿Para qué sirve?

Ver cuánto hay de cada producto (en **gramos**), corregir saldos con ajustes y consultar el historial de movimientos.

## 6.1 Consultar saldos

### ¿Cómo utilizarla?

**Paso 1:** Entrá a **Stock**.

**Paso 2:** Revisá **Saldos actuales**.

### Resultado

Columnas: **Producto**, **Stock (g)**, **Mínimo (g)**, **Estado**.

- Si el stock está en el mínimo o por debajo, se destaca (incluye la marca **· bajo**).
- Todo se muestra en **gramos**, no en kilos con decimales.

### Ejemplo

| Situación | Qué ves |
|-----------|---------|
| Hay 20,5 kg | En pantalla: **20.500 g** |
| Stock mínimo 2 kg | En pantalla: **2.000 g** |
| Vendés 1,2 kg | Cargás **1200** g en la venta → quedan **19.300 g** |

### Captura

> **[CAPTURA 07 — LISTADO DE STOCK (SALDOS)]**
>
> **Qué necesito fotografiar:** sección **Saldos actuales** con varios productos y columnas en g.
>
> **Datos sugeridos:** un producto con stock normal y otro marcado bajo.

---

## 6.2 Ajuste de stock

### ¿Para qué sirve?

Corregir el saldo cuando no viene de una compra o venta (inventario inicial, merma, conteo, etc.).

### ¿Cómo utilizarla?

**Paso 1:** En **Stock**, en **Ajuste de stock**, elegí el **Producto**.

**Paso 2:** En **Cantidad en g (+ / −)** ingresá:
- número **positivo** para sumar (ej. `5000` = sumar 5 kg),
- número **negativo** para restar (ej. `-500` = restar 500 g).

**Paso 3:** Elegí el **Motivo**:
- Inventario inicial
- Corrección de conteo
- Merma / vencido
- Rotura / descarte
- Diferencia de inventario
- Devolución / reingreso
- Otro (especificar) → completa **Detalle**

**Paso 4:** Presioná **Registrar ajuste**.

### Resultado

Mensaje **Ajuste de stock registrado**. Se actualiza el saldo y aparece un movimiento.

### Importante

- La cantidad **no puede ser 0**.
- Usá siempre **gramos enteros**, como en la balanza.
- Nunca “inventes” el stock desde Productos: siempre por ajuste o compra.

### Captura

> **[CAPTURA 08 — AJUSTE DE STOCK]**
>
> **Qué necesito fotografiar:** formulario de ajuste con producto elegido, cantidad en g y motivo visible.
>
> **Datos sugeridos:** motivo **Inventario inicial**, cantidad `10000` (10 kg).

---

## 6.3 Movimientos recientes

### ¿Para qué sirve?

Ver qué cambió el stock (compras, ventas, anulaciones, ajustes).

### ¿Cómo utilizarla?

En **Stock**, bajá a **Movimientos recientes** (se muestran los **últimos 50**).

Columnas: **Fecha**, **Producto**, **Tipo**, **Cantidad (g)**, **Stock resultante (g)**, **Notas**.

Tipos que podés ver: **Compra**, **Venta**, **Anulación**, **Ajuste**.

### Captura

> **[CAPTURA 09 — MOVIMIENTOS DE STOCK]**
>
> **Qué necesito fotografiar:** tabla de movimientos con al menos una compra, una venta y un ajuste.
>
> **Qué debe verse:** cantidades con signo (+ / −) en gramos.

---

# 7. Compras

## ¿Para qué sirve?

Registrar el ingreso de mercadería: suma stock y registra cómo se pagó (efectivo y/o transferencia).

## 7.1 Ver compras

### ¿Cómo utilizarla?

Entrá a **Compras**. Verás fecha, total, notas y el botón **Nueva compra**.

Se listan las **últimas 100** compras. No hay pantalla de detalle ni edición de una compra ya guardada.

### Captura

> **[CAPTURA 10 — LISTADO DE COMPRAS]**
>
> **Qué necesito fotografiar:** listado de compras con al menos un registro y botón **Nueva compra**.

---

## 7.2 Nueva compra

### ¿Cómo utilizarla?

**Paso 1:** En **Compras**, presioná **Nueva compra**.

**Paso 2 — Ítems (izquierda):**
- Elegí **Producto**
- **Cantidad (g)** — ej. `10000` (= 10 kg)
- **Costo / kg** — lo que te cobró el proveedor por kilo
- Podés **Agregar ítem** o **Quitar**

**Paso 3 — Pagos (derecha):**
- **Método:** Efectivo o Transferencia
- **Monto**
- Podés **Agregar pago** (pago dividido)
- Si hay un solo pago, **Completar con total** carga el monto automáticamente
- Debe quedar **Pagos = total** (si no, verás la diferencia)

**Paso 4:** Completá **Notas** si querés (proveedor, remito, etc.).

**Paso 5:** Presioná **Registrar compra**.

### Resultado

- Mensaje **Compra registrada**
- El **stock sube** en gramos
- Si pagaste en **Efectivo** y hay **caja abierta**, baja el efectivo de la caja
- La **transferencia** no mueve la caja física

### Ejemplo

Comprás 10 kg de pechuga a $6.000 / kg:
- Cantidad: **10000** g
- Costo / kg: **6000**
- Total: **$60.000**
- Pagos: deben sumar **$60.000**

### Importante

- **Costo / kg** es el costo de **compra**, no el precio de venta.
- Los pagos deben igualar el total.

### Capturas

> **[CAPTURA 11 — NUEVA COMPRA (ÍTEMS Y PAGOS)]**
>
> **Qué necesito fotografiar:** pantalla **Nueva compra** en dos columnas (Ítems | Pagos), con un ítem cargado y pagos = total.
>
> **Datos sugeridos:** 10000 g, costo/kg 6000, pago efectivo o mixto.
>
> **[CAPTURA 12 — COMPRA EN LISTADO]**
>
> **Qué necesito fotografiar:** después de guardar, el listado de **Compras** mostrando la compra recién registrada.

---

# 8. Ventas

## ¿Para qué sirve?

Registrar ventas del mostrador: descuenta stock, calcula el total (gramos × precio/kg) y registra pagos.

## 8.1 Ver ventas

### ¿Cómo utilizarla?

Entrá a **Ventas**. Columnas: **Fecha**, **Total**, **Estado** (**Completada** / **Anulada**), **Notas**, **Acciones**.

Se listan las **últimas 100**. No hay pantalla de detalle de cada venta.

### Captura

> **[CAPTURA 13 — LISTADO DE VENTAS]**
>
> **Qué necesito fotografiar:** listado con al menos una venta **Completada** y el botón **Nueva venta**.

---

## 8.2 Nueva venta

### ¿Cómo utilizarla?

**Paso 1:** Entrá a **Ventas** → **Nueva venta** (o desde **Inicio** → **Nueva venta**).

**Paso 2 — Ítems:**
- Elegí **Producto** (se muestra stock en g y precio/kg; el precio se completa solo)
- **Cantidad (g)** — lo que marca la balanza, ej. **1200**
- Revisá **Precio / kg** si hace falta
- El sistema muestra **Stock disponible** y cuánto **quedan aprox.** después de la venta
- Podés **Agregar ítem** o **Quitar**
- **Descuento** (opcional, en pesos)
- Revisá **Subtotal** y **Total**

**Paso 3 — Pagos:**
- **Efectivo** y/o **Transferencia**
- Montos que sumen el **Total**
- **Completar con total** si hay un solo pago

**Paso 4:** **Notas** (opcional).

**Paso 5:** **Registrar venta**.

### Resultado

- Mensaje **Venta registrada**
- El **stock baja**
- La parte en **Efectivo** suma a la caja **si hay sesión abierta**
- La **transferencia** no mueve la caja física

### Ejemplo de cálculo

Producto: Pechuga — Precio **$8.000 / kg** — Vendés **1200 g** (1,2 kg):

> Total línea = 1,2 × 8.000 = **$9.600**

Si hay descuento de $100 → Total = **$9.500**. Los pagos deben sumar $9.500.

### Promos del flyer (descuento manual)

No hay productos de “oferta” separados: vendés el producto normal y ponés el **descuento en pesos**.

**Ejemplo — 2 kg milanesa a $17.000** (precio lista $9.000/kg):

1. Producto **Milanesa**, cantidad **2000** g → subtotal **$18.000**
2. Descuento **$1.000** → total **$17.000**
3. Pagos que sumen **$17.000**

**Ejemplo — 2 kg menudo a $4.000** ($2.500/kg): subtotal $5.000, descuento **$1.000**, total **$4.000**.

### Importante

- Cantidades en **gramos enteros** (no uses 1,2; usá 1200).
- Si no hay stock suficiente, el sistema avisa y no registra la venta.
- Conviene tener la **caja abierta** si vas a cobrar en efectivo.

### Capturas

> **[CAPTURA 14 — NUEVA VENTA]**
>
> **Qué necesito fotografiar:** pantalla completa en dos columnas (Ítems | Pagos) con un producto, cantidad en g, stock disponible visible y pagos = total.
>
> **Datos sugeridos:** producto *Pechuga*; cantidad **1200**; precio real del catálogo; un pago efectivo o mixto.
>
> **[CAPTURA 15 — VENTA CONFIRMADA EN LISTADO]**
>
> **Qué necesito fotografiar:** listado de ventas mostrando la venta **Completada** recién cargada.

---

## 8.3 Anular una venta

### ¿Para qué sirve?

Deshacer una venta completada: devuelve stock y revierte el efectivo en caja (si corresponde).

### ¿Cómo utilizarla?

**Paso 1:** En **Ventas**, en una fila **Completada**, presioná **Anular**.

**Paso 2:** Confirmá el mensaje:  
**¿Anular esta venta? Se revertirá stock y el efectivo en caja (si hay sesión abierta).**

### Resultado

- Mensaje **Venta anulada**
- Estado **Anulada**
- Stock vuelve a subir
- Efectivo de esa venta se revierte en la caja abierta (si había)

### Importante

- Solo ventas completadas se pueden anular.
- No se puede “des-anular”.
- Las anuladas no cuentan en **Ventas de hoy** ni en totales de reportes.

### Captura

> **[CAPTURA 16 — ANULAR VENTA]**
>
> **Qué necesito fotografiar:** listado con botón **Anular** visible en una venta completada (podés capturar antes de confirmar, o mostrar después el estado **Anulada**).

---

# 9. Caja

## ¿Para qué sirve?

Controlar el **efectivo físico** del turno: apertura, movimientos automáticos y cierre con arqueo.

## 9.1 Abrir caja

### ¿Cómo utilizarla?

**Paso 1:** Entrá a **Caja**. Si no hay sesión, verás **Abrir caja**.

**Paso 2:** Ingresá **Monto de apertura** (efectivo que hay en el cajón al empezar; puede ser **0**).

**Paso 3:** Presioná **Abrir caja**.

### Resultado

Mensaje **Caja abierta**. Solo puede haber **una** caja abierta a la vez.

### Captura

> **[CAPTURA 17 — ABRIR CAJA]**
>
> **Qué necesito fotografiar:** pantalla de apertura con campo **Monto de apertura** y botón **Abrir caja**.
>
> **Datos sugeridos:** monto `10000` o `0`.

---

## 9.2 Durante el día (sesión abierta)

Verás:
- **Monto de apertura**
- **Saldo esperado** (lo que el sistema calcula que debería haber en efectivo)
- **Movimientos** (cantidad y tabla)

Cómo afectan al efectivo:

| Operación | Efecto en caja |
|-----------|----------------|
| Venta pagada en **Efectivo** | Suma |
| Compra pagada en **Efectivo** | Resta |
| Gasto marcado **Descontar de caja** | Resta |
| Pago por **Transferencia** | No mueve la caja física |

Tipos de movimiento que pueden aparecer: **Apertura**, **Venta**, **Compra**, **Gasto**, **Ingreso manual**, **Egreso manual**.

> Nota: en esta versión **no hay pantalla** para cargar ingresos/egresos manuales; esos tipos pueden figurar en el sistema, pero el uso diario normal es venta, compra y gasto.

### Captura

> **[CAPTURA 18 — SESIÓN ABIERTA Y MOVIMIENTOS]**
>
> **Qué necesito fotografiar:** tarjeta **Sesión abierta** con saldo esperado y la tabla de movimientos con al menos 2–3 filas.

---

## 9.3 Cerrar caja

### ¿Cómo utilizarla?

**Paso 1:** Contá el efectivo físico del cajón.

**Paso 2:** En **Cerrar caja**, ingresá **Efectivo contado**.

**Paso 3:** Revisá la **Diferencia estimada** respecto del **Esperado**.

**Paso 4:** Completá **Notas** si hace falta (opcional).

**Paso 5:** Confirmá el cierre.

### Resultado

Mensaje **Caja cerrada**. La sesión pasa al listado de **Sesiones cerradas recientes** (últimas 10), con: Cierre, Apertura, Esperado, Contado, Diferencia.

### Ejemplo

| Concepto | Valor |
|----------|-------|
| Esperado | $25.000 |
| Contado | $24.800 |
| Diferencia | −$200 |

### Captura

> **[CAPTURA 19 — CERRAR CAJA]**
>
> **Qué necesito fotografiar:** formulario de cierre con efectivo contado, diferencia y notas.
>
> **[CAPTURA 20 — SESIONES CERRADAS]**
>
> **Qué necesito fotografiar:** listado **Sesiones cerradas recientes** con al menos una fila.

---

# 10. Gastos

## ¿Para qué sirve?

Registrar egresos operativos (gas, limpieza, etc.) y, si corresponde, descontarlos de la caja.

## 10.1 Ver gastos

Entrá a **Gastos**. Columnas: **Fecha**, **Categoría**, **Monto**, **Desde caja** (Sí/No), **Descripción**.

Se listan los **últimos 100**. No hay edición ni anulación de un gasto ya cargado.

### Captura

> **[CAPTURA 21 — LISTADO DE GASTOS]**
>
> **Qué necesito fotografiar:** listado de gastos con botón **Nuevo gasto**.

---

## 10.2 Nuevo gasto

### ¿Cómo utilizarla?

**Paso 1:** **Gastos** → **Nuevo gasto**.

**Paso 2:** Completá:
- **Categoría** (lista predefinida)
- **Monto**
- **Descripción**
- **Fecha**
- Marca **Descontar de caja (efectivo)** si el dinero salió del cajón

**Paso 3:** **Registrar gasto**.

### Resultado

Mensaje **Gasto registrado**. Si marcaste descontar de caja y hay sesión abierta, el efectivo baja.

### Importante

Si no hay categorías, el sistema avisa que hay que revisar la configuración. Eso lo resuelve quien administra el sistema (no se crean categorías de gasto desde esta pantalla).

### Captura

> **[CAPTURA 22 — NUEVO GASTO]**
>
> **Qué necesito fotografiar:** formulario completo con categoría elegida y checkbox de caja visible.
>
> **Datos sugeridos:** categoría *Servicios* o *Limpieza*; monto *5000*; descripción *Pago de gas*.

---

# 11. Historiales e informes del día a día

No hay una pestaña llamada “Historial”. La información histórica se consulta así:

| Qué querés ver | Dónde |
|----------------|-------|
| Ventas recientes | **Ventas** |
| Compras recientes | **Compras** |
| Movimientos de stock | **Stock** → Movimientos recientes |
| Movimientos de efectivo del turno | **Caja** → sesión abierta |
| Cierres anteriores | **Caja** → Sesiones cerradas recientes |
| Gastos | **Gastos** |
| Totales por fechas | **Reportes** |

### Filtros

- **Productos:** buscar por nombre y estado.
- **Reportes:** desde / hasta / Hoy.
- Ventas, compras, gastos y stock **no** tienen filtros de fecha en el listado (muestran los más recientes según el límite de cada pantalla).

---

# 12. Reportes

## ¿Para qué sirve?

Ver totales de un período: ventas, compras, gastos, estado de caja y productos con stock bajo.

## ¿Cómo utilizarla?

**Paso 1:** Entrá a **Reportes**.

**Paso 2:** Elegí **Desde** y **Hasta** (fechas).

**Paso 3:** Presioná **Filtrar**.  
Para el día de hoy, usá el acceso **Hoy**.

### Resultado — qué muestra

| Bloque | Contenido |
|--------|-----------|
| **Ventas** | Total en $ y cantidad de registros (**excluye anuladas**) |
| **Compras** | Total e ingreso de mercadería |
| **Gastos** | Total de gastos operativos |
| **Caja** | Si hay sesión abierta: fecha y **saldo esperado**; si no: **Sin caja abierta** |
| **Stock bajo mínimo** | Tabla de productos activos con stock ≤ mínimo (en **g**) |

### Captura

> **[CAPTURA 23 — REPORTES]**
>
> **Qué necesito fotografiar:** pantalla **Reportes** con fechas cargadas, totales visibles y (si hay) tabla de stock bajo.
>
> **Datos sugeridos:** rango que incluya ventas y compras de prueba.

---

# 13. Funcionalidades especiales

## 13.1 Pagos múltiples (divididos)

En **Nueva venta** y **Nueva compra** podés repartir el total entre varios pagos (por ejemplo parte efectivo y parte transferencia).

**Regla:** la suma de los montos debe ser **igual al total**. El sistema muestra **Pagos = total** o la **Diferencia**.

## 13.2 Solo efectivo y transferencia

No hay opción de tarjeta ni “otros” al cargar una venta o compra.

## 13.3 Cantidades en gramos

Todo lo que la balanza muestra en gramos se carga como número entero (1200, 500, 10000). El precio/costo sigue siendo **por kg**.

## 13.4 Anulación de ventas

Ver [sección 8.3](#83-anular-una-venta).

## 13.5 Ajustes de stock con motivos

Ver [sección 6.2](#62-ajuste-de-stock).

## 13.6 Lo que este sistema no incluye (para no buscarlo)

- Crear o editar usuarios desde el panel
- Combos / recetas
- Facturación electrónica
- Clientes / cuenta corriente
- Editar o borrar compras y gastos ya guardados
- Detalle ampliados de cada venta o compra
- Menú completo en pantallas muy chicas

---

# 14. Errores y recomendaciones

| Mensaje o situación | Qué significa | Qué hacer |
|---------------------|---------------|-----------|
| **No se pudo iniciar sesión. Verificá email y contraseña.** | Credenciales incorrectas | Revisá email/clave o pedí ayuda al administrador |
| **Revisá las cantidades en gramos (enteros, como en la balanza).** | Cantidad inválida | Usá enteros positivos (ej. 1200) |
| **Stock insuficiente de …** / **Stock insuficiente. Cargá mercadería…** | No hay suficiente saldo | Comprá o ajustá stock antes de vender |
| **La suma de los pagos debe coincidir con el total.** | Pagos ≠ total | Usá **Completar con total** o corregí montos |
| **Ya hay una caja abierta.** | Intentaste abrir otra | Usá la sesión actual o cerrala primero |
| **No hay caja abierta.** | Hace falta abrir caja | Abrí caja en **Caja** |
| **Esa venta ya fue anulada.** | Ya estaba anulada | No hace falta volver a anular |
| **Sin caja abierta** (en Inicio/Reportes) | No hay turno de efectivo | Abrí caja si vas a manejar efectivo |
| Página en blanco / error raro al entrar | A veces el reloj de la PC está desfasado | Sincronizá la hora de Windows y volvé a iniciar sesión |

Si el error continúa y no está en esta lista, contactá a quien administra el sistema e indicá **qué pantalla** estabas usando y **qué mensaje** salió.

---

# 15. Buenas prácticas de uso

1. **Abrí la caja** al empezar el turno si vas a cobrar o pagar en efectivo.
2. Cargá productos **antes** de vender; el stock inicial va por **Stock** o **Compras**.
3. En ventas y compras, mirá la balanza y cargá **gramos** (1200, no 1,2).
4. Antes de **Registrar**, verificá que diga **Pagos = total**.
5. Revisá **Stock bajo** en Inicio o Reportes para reponer a tiempo.
6. Si te equivocás en una venta, usá **Anular** y cargá de nuevo (no intentes “editar” la venta: no existe edición).
7. Al cerrar, contá el efectivo y compará con el **saldo esperado**.
8. Usá el sistema preferentemente en **computadora** (menú completo).
9. No compartas usuarios ni dejes la sesión abierta en una PC compartida sin supervisión.
10. Registrá los **gastos** el mismo día, con la categoría correcta y si salieron o no de caja.

---

# 16. Listado de capturas necesarias

Usá esta lista como checklist al armar el PDF.

| # | Marcador | Pantalla | Objetivo | Datos sugeridos | Debe verse |
|---|----------|----------|----------|-----------------|------------|
| 00 | LOGO | — | Identidad | Logo oficial | Marca nítida |
| 01 | LOGIN | `/login` | Acceso | Email de ejemplo | Email, contraseña, Ingresar |
| 02 | INICIO | `/dashboard` | Resumen | Caja abierta + ventas | 3 tarjetas + accesos |
| 03 | MENÚ | cualquiera | Navegación | — | 8 ítems laterales |
| 04 | PRODUCTOS LISTADO | `/productos` | Catálogo | 2–3 productos | Filtros + tabla g y $/kg |
| 05 | CREAR PRODUCTO | `/productos/nuevo` | Alta | Pechuga, precio, mín. g | Formulario + stock 0 g |
| 06 | EDITAR PRODUCTO | `/productos/[id]` | Edición | Stock actual visible | Guardar cambios |
| 07 | STOCK SALDOS | `/stock` | Saldos | Uno bajo | Columnas Stock/Mínimo (g) |
| 08 | AJUSTE STOCK | `/stock` | Ajuste | +10000, Inventario inicial | Formulario completo |
| 09 | MOV. STOCK | `/stock` | Historial | Compra/venta/ajuste | Tabla últimos movimientos |
| 10 | COMPRAS LISTADO | `/compras` | Historial | ≥1 compra | Nueva compra |
| 11 | NUEVA COMPRA | `/compras/nueva` | Alta | 10000 g + pagos/kg + pagos | Ítems \| Pagos |
| 12 | COMPRA OK | `/compras` | Resultado | Compra recién hecha | Fila en listado |
| 13 | VENTAS LISTADO | `/ventas` | Historial | ≥1 venta | Nueva venta |
| 14 | NUEVA VENTA | `/ventas/nueva` | POS | 1200 g + pagos = total | Ítems \| Pagos + stock |
| 15 | VENTA OK | `/ventas` | Resultado | Completada | Estado Completada |
| 16 | ANULAR | `/ventas` | Anulación | Antes o después | Botón Anular / Anulada |
| 17 | ABRIR CAJA | `/caja` | Apertura | Monto 0 o 10000 | Abrir caja |
| 18 | CAJA ABIERTA | `/caja` | Día | Varios movimientos | Saldo esperado + tabla |
| 19 | CERRAR CAJA | `/caja` | Cierre | Contado ≠ esperado | Diferencia |
| 20 | CIERRES | `/caja` | Historial | ≥1 cierre | Esperado/Contado/Dif. |
| 21 | GASTOS LISTADO | `/gastos` | Historial | ≥1 gasto | Nuevo gasto |
| 22 | NUEVO GASTO | `/gastos/nuevo` | Alta | Categoría + monto | Checkbox caja |
| 23 | REPORTES | `/reportes` | Período | Desde–Hasta con datos | Totales + stock bajo |

---

## Cómo preparar datos para las capturas (sin tocar producción real)

Si podés usar un entorno de prueba:

1. Abrí caja con un monto conocido.
2. Creá 2 productos y cargá stock con ajuste **Inventario inicial**.
3. Registrá una compra y una venta (1200 g).
4. Registrá un gasto.
5. Sacá las capturas en ese orden.
6. Al final, cerrá caja con una diferencia chica a propósito para la captura 19.

Si solo tenés el entorno real: **no modifiques datos operativos solo por las fotos**; usá pantallas vacías o datos ya existentes cuando sea posible.

---

*Documento generado a partir del sistema implementado en S&F Pollería (versión 0.1.0). Fuente de verdad: funcionalidades disponibles en la aplicación.*
