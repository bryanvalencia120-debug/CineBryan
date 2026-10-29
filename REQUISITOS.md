# CineBryan - Requisitos del Sistema

## 1. Requisitos funcionales

### RF-01. Inicio de sesión
El sistema deberá solicitar usuario y contraseña.
El usuario válido será Cinecali y la contraseña Estrenos.
Si los datos son correctos, mostrará el panel principal.
Si son incorrectos, informará del error.

### RF-02. Registro de ventas
El sistema deberá permitir ingresar el nombre de la película,
la sala, la cantidad de boletas vendidas y el precio por boleta.

### RF-03. Cálculo de recaudación
El sistema deberá calcular la recaudación multiplicando
la cantidad de boletas por el precio de cada una.
Antes de mostrar el resultado, presentará un efecto
visual similar a un reloj de carga.

### RF-04. Validación de continuidad
Después de calcular la recaudación, el sistema solicitará
la clave CINE mediante una ventana de diálogo.
Si la clave es correcta, limpiará los campos para registrar
otra venta.
Si es incorrecta, mostrará una alerta y volverá al login.

### RF-05. Cambio de asiento
El sistema deberá permitir gestionar un cambio de asiento.
Si el cambio se realiza entre las 15:00 y las 18:00,
aplicará un recargo del 5 % sobre el precio base de la boleta.

### RF-06. Gráfica de recaudaciones
El sistema almacenará cada recaudación calculada en un
arreglo y actualizará una gráfica de líneas.

### RF-07. Foto del operador
El sistema deberá incluir un componente visual que permita
capturar una foto del operador.

----------------------------------------

## 2. Requisitos no funcionales

### RNF-01. Usabilidad
La interfaz deberá organizar las funciones de manera clara
para facilitar el registro de ventas y los cambios de asiento.

### RNF-02. Compatibilidad
La aplicación deberá poder utilizarse desde un navegador web
moderno en un computador.

### RNF-03. Validación de datos
El sistema deberá validar los campos obligatorios y evitar
cantidades de boletas iguales a cero, negativas o fraccionarias.

### RNF-04. Privacidad
La captura de la foto del operador deberá solicitar permiso
para acceder a la cámara del dispositivo.

### RNF-05. Mantenibilidad
El código deberá organizarse por separado en archivos
HTML, CSS y JavaScript para facilitar su mantenimiento.

----------------------------------------

## 3. Requisitos de dominio

### RD-01. Precio base
El precio base de cada boleta será de $12.000 COP.

### RD-02. Recargo por cambio de asiento
Los cambios de asiento realizados entre las 15:00 y las
18:00 tendrán un recargo del 5 % sobre el precio base
de la boleta.

### RD-03. Clave de continuidad
La clave para continuar registrando ventas será CINE,
respetando las letras mayúsculas.

### RD-04. Cantidad de boletas
La cantidad de boletas vendidas deberá ser un número
entero positivo.

### RD-05. Acceso al sistema
El acceso al panel principal requerirá las credenciales
definidas para el ejercicio: usuario Cinecali y
contraseña Estrenos.

----------------------------------------

### HU-03. Consultar la recaudación
Como operador de taquilla,
quiero ver el total recaudado por una venta,
para conocer los ingresos generados.

### HU-04. Continuar registrando ventas
Como operador de taquilla,
quiero validar la clave CINE después de cada cálculo,
para registrar una nueva venta o regresar al inicio de sesión.

### HU-05. Cambiar de asiento
Como operador de taquilla,
quiero gestionar un cambio de asiento,
para aplicar el recargo cuando corresponda según el horario.

### HU-06. Consultar estadísticas
Como operador de taquilla,
quiero visualizar una gráfica de las recaudaciones,
para observar los ingresos de las ventas registradas.

### HU-07. Capturar foto
Como operador de taquilla,
quiero capturar una foto desde la aplicación,
para cumplir con el control visual del operador.