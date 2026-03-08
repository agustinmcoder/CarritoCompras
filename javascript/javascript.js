//Aparecen algunas alertas en consola (Tracking Prevention blocked access to storage for <URL>.) No estoy muy seguro de que hacer con eso. Estuve buscando en internet, pero aparecen cosas que no vimos en el curso

//defino los objetos productos (donde va a ir mi catalogo) y carrito (el carrito del cliente). Antes estaban definidos aca. Ahora estan definidos en productos.json y se traen con fetch-await
let productos = [];

let carrito = [];

//defino las funciones a usar

function guardarCarritoEnSession() { 
//guarda el carrito en el SessionStorage para que este ahi hasta que se cierre la pestaña
    sessionStorage.setItem('carrito', JSON.stringify(carrito)); 
}

function cargarCarritoDesdeSession() { 
//carga el carrito desde el SessionStorage al iniciar la pagina, si es que hay algo guardado
    const auxiliar = sessionStorage.getItem('carrito'); 
    if (!auxiliar) return; 
    const parsed = JSON.parse(auxiliar); 
    if (Array.isArray(parsed)) carrito = parsed; }

//funcion nueva. Ahora carga productos desde el json.
async function cargarProductosDesdeArchivo(ruta = 'productos.json') {
  try {
    const res = await fetch(ruta);
    if (!res.ok) {
      console.warn('No se pudo obtener productos.json, status:', res.status);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      productos = data;
    } else {
      console.warn('productos.json no contiene un array válido');
    }
  } catch (err) {
    console.warn('Error cargando productos desde archivo:', err);
  }
}

function asignarBotonAProducto() {
    //hace el matck entre botones y productos usando el data-serial
  const botones = document.querySelectorAll('.btn-mio');
  botones.forEach(boton => {
    const serial = Number(boton.dataset.serial);
    if (!serial) return;
    boton.addEventListener('click', () => agregarAlCarrito(serial));
  });
}


function agregarAlCarrito(serial) {
  // Agrega al carrito buscando el serial en productos
  const productoEncontrado = productos.find(p => p.serial === serial);
  if (!productoEncontrado) return;

  const item = carrito.find(it => it.serial === serial);
  // busca la coincidencia, si la hay le agrega 1 a la cantidad.
  if (item) {
    item.cantidad = (item.cantidad || 0) + 1;
  // si no existia, entramos al else, donde le agregamos una linea al final con cantidad 1
  } else {
    carrito.push({
      serial: productoEncontrado.serial,
      name: productoEncontrado.name,
      precio: productoEncontrado.precio,
      cantidad: 1
    });
  }

  const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "success",
  title: `${productoEncontrado.name} agregado al carrito`
});
  guardarCarritoEnSession(); 
  mostrarCarrito(); 
  agregarControlesAlCarrito();
}

function mostrarCarrito() {
//Muestro el carrito al agregar alguna linea. Si no tiene nada dice que esta vacio. Luego quiero agregarle botones para sumar / disminuir cantidades, pero no me esta saliendo.
  const cont = document.getElementById('carrito-container');
  if (!cont) return;

  cont.innerHTML = '';

  if (carrito.length === 0) {
    cont.textContent = 'El carrito está vacío.';
    return;
  }

  const ol = document.createElement('ol');
  
  carrito.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('liCarrito')
    li.dataset.serial = item.serial; //lo agregue al ver como poder agregar botones +/-
    const subtotal = item.precio * item.cantidad;
    li.textContent = `${item.name} — Cant: ${item.cantidad} — Subtotal: $${subtotal}`;
    ol.appendChild(li);
  });

  cont.appendChild(ol);

  const total = carrito.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const resumen = document.createElement('p');
  resumen.classList.add('resumen');
  resumen.textContent = `Total: $${total}`;
  cont.appendChild(resumen);
}

function agregarControlesAlCarrito() {
    //le agrega los botones + / - a cada linea del carrito. Al llegar a 0 desaparece la linea
  const cont = document.getElementById('carrito-container');
  if (!cont) return;

  const itemsLi = cont.querySelectorAll('li[data-serial]');
  itemsLi.forEach(li => {
    if (li.querySelector('.carrito-control')) return;

    const serial = Number(li.dataset.serial);
    const controls = document.createElement('div');
    controls.classList.add('carrito-control');

    const btnMenos = document.createElement('button');
    btnMenos.type = 'button';
    btnMenos.classList.add('carrito-btn-masmenos');
    btnMenos.textContent = '-';
    btnMenos.addEventListener('click', () => {
      const item = carrito.find(x => x.serial === serial);
      if (!item) return;
      item.cantidad = (item.cantidad || 0) - 1;
      if (item.cantidad <= 0) carrito = carrito.filter(x => x.serial !== serial);

      const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "error",
      title: `${item.name} cantidad disminuida`
    });
      guardarCarritoEnSession();
      mostrarCarrito();
      agregarControlesAlCarrito();
    });

    const btnMas = document.createElement('button');
    btnMas.type = 'button';
    btnMas.textContent = '+';
    btnMas.classList.add('carrito-btn-masmenos');
    btnMas.addEventListener('click', () => {
    const item = carrito.find(x => x.serial === serial);
    if (!item) return;
    item.cantidad = (item.cantidad || 0) + 1;

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: `${item.name} cantidad aumentada`
    });

    guardarCarritoEnSession();
    mostrarCarrito();
    agregarControlesAlCarrito();
  });

    controls.appendChild(btnMenos);
    controls.appendChild(btnMas);
    li.appendChild(controls);
  });
}


function finalizarCompra() {
  const btnFinalizar = document.getElementById('finalizar-compra-btn');
  if (!btnFinalizar) return;

  btnFinalizar.addEventListener('click', () => {
    Swal.fire({
      title: "Estas seguro que quieres finalizar la compra?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalizar!"
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        sessionStorage.removeItem('carrito');
        mostrarCarrito();
        agregarControlesAlCarrito();

        Swal.fire({
          title: "Realizado!",
          text: "Su compra ha sido completada.",
          icon: "success"
        });
      }
    });
  })};



//Creo un boton para finalizar compra

const divBboton = document.createElement('div');
divBboton.id = 'finalizar-compra';

const btnFinalizarCompra = document.createElement('button');
btnFinalizarCompra.id = 'finalizar-compra-btn';
btnFinalizarCompra.classList.add('btn-finalizar')
btnFinalizarCompra.textContent = 'Finalizar Compra';

divBboton.appendChild(btnFinalizarCompra);

const contCarrito = document.getElementById('carrito-container'); if (contCarrito && contCarrito.parentNode) { contCarrito.parentNode.insertBefore(divBboton, contCarrito.nextSibling); } else { document.body.appendChild(divBboton); }



(async () => {
  await cargarProductosDesdeArchivo(); // primero tiene que cargar productos, antes de hacer todo lo demas
  cargarCarritoDesdeSession();
  asignarBotonAProducto();
  mostrarCarrito();
  agregarControlesAlCarrito();
  finalizarCompra();
})();