----Carrrito de Compras en Js----

Este proyecto fue confeccionado como entrega final del curso de javascript de Coderhouse (comisión 88150). 

El mismo permite simular un carrito de compras. Toma los items definidos en productos.Json (totalmente modificable parapoder agregar/modificar/quitar productos).
Carga los productos con sus imagenes, precios y descpriciiones y permite agregarlos al carrito del usuario mediante un botón.

Un toast nos indica que se ha agregado al carrito, además de inicializar la lista con el detalle del carrito y botones +/- para poder agregar/sustraer de forma más comoda unidades de productos que ya están en el carrito.
Cada vez que se agregue un producto nuevo, se aumente la cantidad del mismo en el carrito o se saque alguna unidade del carrito, un toast nos lo indicará en la esquina superior derecha.

Una vez que el usuario quiere finalizar su compra, lo puede hacer mediante el boton "finalizar compra" a lo que un nuevo modal se le presentará pidiendo confirmación de finalización. Mensaje de success si confirma.

Elcarrito del usuario es guardado en SessionStroage lo que permite recuperarlo siempre y cuando no se cierre la pestaña donde estuvo trabajado.

La estética y productos corresponden a un trabajo anterior, que fue usado como base.

