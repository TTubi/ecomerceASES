const productos = [
    { id: 1, nombre: "Remera Jordan Mural", categoria: "remeras", precio: 120000, talle: "M", disponible: false, imagen: "../assets/img/Productos/jordan-mural.jpg" },
    { id: 2, nombre: "Remera Jordan 85", categoria: "remeras", precio: 120000, talle: "L", disponible: false, imagen: "../assets/img/Productos/jordan-85.jpg" },
    { id: 3, nombre: "Buzo Nike F.R.O.G", categoria: "buzos", precio: 130000, talle: "XL (oversize)", disponible: false, imagen: "../assets/img/Productos/frog.jpg" },
    { id: 4, nombre: "Remera Jordan Sport", categoria: "remeras", precio: 115000, talle: "L", disponible: false, imagen: "../assets/img/Productos/jordan-sport.jpg" },
    { id: 5, nombre: "Pantalón Cargo Nike Tech", categoria: "pantalones", precio: 95000, talle: "M", disponible: true, destacado: true, imagen: "../assets/img/Productos/nike-cargo.jpg" },
    { id: 6, nombre: "Gorra Jordan Jumpman", categoria: "accesorios", precio: 45000, talle: "Único", disponible: true, destacado: true, imagen: "../assets/img/Productos/gorra.jpg" },
    { id: 7, nombre: "Buzo Adidas Originals", categoria: "buzos", precio: 110000, talle: "L", disponible: true, destacado: true, imagen: "../assets/img/Productos/adidas.jpg" },
    { id: 8, nombre: "Remera Nike Vintage", categoria: "remeras", precio: 85000, talle: "S", disponible: true, imagen: "../assets/img/Productos/nike-vintage.jpg" }
];

const claveCarrito = "ases_carrito";
const claveConsultas = "ases_consultas";

function leerCarrito() {
    const carrito = localStorage.getItem(claveCarrito);
    if (!carrito) return [];

    try {
        return JSON.parse(carrito);
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
    actualizarNumeroCarrito();
}

function actualizarNumeroCarrito() {
    const carrito = leerCarrito();
    let cantidad = 0;

    carrito.forEach(producto => {
        cantidad += producto.cantidad;
    });

    document.querySelectorAll(".carrito-contador").forEach(numero => {
        numero.textContent = cantidad;
        numero.style.display = cantidad > 0 ? "inline-flex" : "none";
    });
}

function precio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto || !producto.disponible) return;

    const carrito = leerCarrito();
    const encontrado = carrito.find(p => p.id === id);

    if (encontrado) {
        encontrado.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            talle: producto.talle,
            cantidad: 1,
            imagen: producto.imagen
        });
    }

    guardarCarrito(carrito);
    alert("Producto agregado al carrito");
}

function crearProducto(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto-card";

    tarjeta.innerHTML = `
        <div class="producto-img">
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; object-fit: cover;">
            ${producto.disponible ? "" : "<span class='badge-vendido'>Vendido</span>"}
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p class="producto-talle">Talle: ${producto.talle}</p>
            <p class="producto-precio">${precio(producto.precio)}</p>
            <button class="btn-agregar" data-id="${producto.id}" ${producto.disponible ? "" : "disabled"}>
                ${producto.disponible ? "Agregar al carrito" : "No disponible"}
            </button>
        </div>
    `;

    return tarjeta;
}

function mostrarCatalogo(categoria = "todos", texto = "") {
    const grid = document.getElementById("catalogo-grid");
    if (!grid) return;

    const busqueda = texto.trim().toLowerCase();
    const lista = productos.filter(producto => {
        const mismaCategoria = categoria === "todos" || producto.categoria === categoria;
        const mismoNombre = producto.nombre.toLowerCase().includes(busqueda);
        return mismaCategoria && mismoNombre;
    });

    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = "<p class='catalogo-vacio'>No encontramos productos.</p>";
        return;
    }

    lista.forEach(producto => grid.appendChild(crearProducto(producto)));
}

function iniciarCatalogo() {
    const grid = document.getElementById("catalogo-grid");
    if (!grid) return;

    let categoria = "todos";
    let texto = "";

    mostrarCatalogo();

    document.querySelectorAll(".filtro-categoria").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll(".filtro-categoria").forEach(b => b.classList.remove("filtro-activo"));
            boton.classList.add("filtro-activo");
            categoria = boton.dataset.categoria;
            mostrarCatalogo(categoria, texto);
        });
    });

    const buscador = document.querySelector(".busqueda");
    if (buscador) {
        buscador.addEventListener("input", () => {
            texto = buscador.value;
            mostrarCatalogo(categoria, texto);
        });
    }

    grid.addEventListener("click", evento => {
        const boton = evento.target.closest(".btn-agregar");
        if (!boton || boton.disabled) return;
        agregarAlCarrito(Number(boton.dataset.id));
    });
}

function iniciarMasVendidos() {
    const grid = document.getElementById("masvendidos-grid");
    if (!grid) return;

    productos.filter(p => p.destacado).forEach(producto => {
        grid.appendChild(crearProducto(producto));
    });

    grid.addEventListener("click", evento => {
        const boton = evento.target.closest(".btn-agregar");
        if (!boton || boton.disabled) return;
        agregarAlCarrito(Number(boton.dataset.id));
    });
}

function mostrarCarrito() {
    const lista = document.getElementById("carrito-lista");
    if (!lista) return;

    const carrito = leerCarrito();
    const mensajeVacio = document.getElementById("carrito-vacio");
    const resumen = document.getElementById("carrito-resumen");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        mensajeVacio.style.display = "block";
        resumen.style.display = "none";
        actualizarNumeroCarrito();
        return;
    }

    mensajeVacio.style.display = "none";
    resumen.style.display = "flex";

    carrito.forEach(producto => {
        const fila = document.createElement("div");
        fila.className = "carrito-item";
        fila.innerHTML = `
            <div class="carrito-item-img">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="carrito-item-info">
                <h4>${producto.nombre}</h4>
                <p class="carrito-item-talle">Talle: ${producto.talle}</p>
                <p class="carrito-item-precio">${precio(producto.precio)}</p>
            </div>
            <div class="carrito-item-cantidad">
                <button class="btn-cantidad btn-menos" data-id="${producto.id}">-</button>
                <span>${producto.cantidad}</span>
                <button class="btn-cantidad btn-mas" data-id="${producto.id}">+</button>
            </div>
            <p class="carrito-item-subtotal">${precio(producto.precio * producto.cantidad)}</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        lista.appendChild(fila);
    });

    let total = 0;
    let cantidad = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        cantidad += producto.cantidad;
    });

    document.getElementById("carrito-total").textContent = precio(total);
    document.getElementById("carrito-cantidad-items").textContent = cantidad;
    actualizarNumeroCarrito();
}

function iniciarCarrito() {
    const lista = document.getElementById("carrito-lista");
    if (!lista) return;

    mostrarCarrito();

    lista.addEventListener("click", evento => {
        const boton = evento.target.closest("button");
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const carrito = leerCarrito();
        const producto = carrito.find(p => p.id === id);

        if (!producto) return;

        if (boton.classList.contains("btn-mas")) producto.cantidad++;
        if (boton.classList.contains("btn-menos")) producto.cantidad--;
        if (boton.classList.contains("btn-eliminar")) producto.cantidad = 0;

        const nuevoCarrito = carrito.filter(p => p.cantidad > 0);
        guardarCarrito(nuevoCarrito);
        mostrarCarrito();
    });

    document.getElementById("btn-vaciar").addEventListener("click", () => {
        if (confirm("¿Querés vaciar el carrito?")) {
            guardarCarrito([]);
            mostrarCarrito();
        }
    });

    document.getElementById("btn-finalizar").addEventListener("click", () => {
        if (leerCarrito().length === 0) return;
        alert("Gracias por tu compra. Esta parte es una simulación.");
        guardarCarrito([]);
        mostrarCarrito();
    });
}

function iniciarCuenta() {
    const botones = document.querySelectorAll(".tab-btn");
    if (botones.length === 0) return;

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            botones.forEach(b => b.classList.remove("tab-activo"));
            boton.classList.add("tab-activo");

            document.querySelectorAll("[data-tab-panel]").forEach(panel => {
                panel.hidden = panel.dataset.tabPanel !== boton.dataset.tab;
            });
        });
    });

    document.querySelectorAll(".cuenta-form").forEach(form => {
        form.addEventListener("submit", evento => {
            evento.preventDefault();
            alert("Esta función todavía está en construcción.");
        });
    });
}

function leerConsultas() {
    const datos = localStorage.getItem(claveConsultas);
    if (!datos) return [];

    try {
        return JSON.parse(datos);
    } catch {
        return [];
    }
}

function guardarConsultas(consultas) {
    localStorage.setItem(claveConsultas, JSON.stringify(consultas));
}

function validarContacto(form) {
    let correcto = true;

    const nombre = form.elements.nombre;
    const email = form.elements.email;
    const telefono = form.elements.telefono;
    const fecha = form.elements.fecha;
    const motivo = form.elements.motivo;
    const mensaje = form.elements.mensaje;

    const errores = {
        nombre: nombre.value.trim() ? "" : "Ingresá tu nombre y apellido.",
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? "" : "Ingresá un email válido.",
        telefono: /^[0-9\s+\-]{8,}$/.test(telefono.value) ? "" : "Ingresá un teléfono válido.",
        fecha: fecha.value ? "" : "Elegí una fecha.",
        motivo: motivo.value ? "" : "Seleccioná un motivo.",
        mensaje: mensaje.value.trim().length >= 10 ? "" : "Escribí un mensaje de al menos 10 caracteres."
    };

    Object.keys(errores).forEach(nombreCampo => {
        const campo = form.elements[nombreCampo];
        const contenedor = campo.closest(".campo");
        const error = contenedor.querySelector(".campo-error");
        error.textContent = errores[nombreCampo];
        contenedor.classList.toggle("campo-invalido", Boolean(errores[nombreCampo]));
        if (errores[nombreCampo]) correcto = false;
    });

    const talles = form.querySelectorAll('input[name="talles"]:checked');
    const tallesError = form.querySelector('input[name="talles"]').closest("fieldset").querySelector(".campo-error");
    tallesError.textContent = talles.length ? "" : "Elegí al menos un talle.";
    if (!talles.length) correcto = false;

    const metodo = form.querySelector('input[name="metodo-contacto"]:checked');
    const metodoError = form.querySelector('input[name="metodo-contacto"]').closest("fieldset").querySelector(".campo-error");
    metodoError.textContent = metodo ? "" : "Elegí una forma de contacto.";
    if (!metodo) correcto = false;

    const terminos = document.getElementById("terminos");
    const terminosCampo = terminos.closest(".campo");
    const terminosError = terminosCampo.querySelector(".campo-error");
    terminosError.textContent = terminos.checked ? "" : "Tenés que aceptar para continuar.";
    terminosCampo.classList.toggle("campo-invalido", !terminos.checked);
    if (!terminos.checked) correcto = false;

    return correcto;
}

function mostrarConsultas() {
    const lista = document.getElementById("consultas-lista");
    if (!lista) return;

    const consultas = leerConsultas();
    const mensaje = document.getElementById("consultas-vacio");
    lista.innerHTML = "";

    if (consultas.length === 0) {
        mensaje.style.display = "block";
        return;
    }

    mensaje.style.display = "none";

    const motivos = {
        "consulta-general": "Consulta general",
        "estado-pedido": "Estado de un pedido",
        "cambio-devolucion": "Cambio / Devolución",
        "sugerencia": "Sugerencia"
    };

    consultas.slice().reverse().forEach(consulta => {
        const item = document.createElement("div");
        item.className = "consulta-item";
        item.innerHTML = `
            <div class="consulta-info">
                <h4>${consulta.nombre} - <span class="consulta-motivo">${motivos[consulta.motivo]}</span></h4>
                <p class="consulta-meta">${consulta.email} · ${consulta.telefono}</p>
                <p class="consulta-mensaje">"${consulta.mensaje}"</p>
            </div>
            <div class="consulta-acciones">
                <button class="btn-editar-consulta" data-id="${consulta.id}">Editar</button>
                <button class="btn-eliminar-consulta" data-id="${consulta.id}">Eliminar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function iniciarContacto() {
    const form = document.getElementById("form-contacto");
    if (!form) return;

    let consultaEditando = null;

    form.addEventListener("submit", evento => {
        evento.preventDefault();

        if (!validarContacto(form)) return;

        const talles = [...form.querySelectorAll('input[name="talles"]:checked')].map(i => i.value);
        const metodo = form.querySelector('input[name="metodo-contacto"]:checked');
        const datos = {
            id: consultaEditando || Date.now(),
            nombre: form.elements.nombre.value.trim(),
            email: form.elements.email.value.trim(),
            telefono: form.elements.telefono.value.trim(),
            fecha: form.elements.fecha.value,
            motivo: form.elements.motivo.value,
            talles: talles,
            metodoContacto: metodo ? metodo.value : "",
            mensaje: form.elements.mensaje.value.trim()
        };

        const consultas = leerConsultas();
        const posicion = consultas.findIndex(c => c.id === datos.id);

        if (posicion >= 0) {
            consultas[posicion] = datos;
        } else {
            consultas.push(datos);
        }

        guardarConsultas(consultas);
        mostrarConsultas();
        form.reset();
        consultaEditando = null;
        document.querySelector(".btn-enviar").textContent = "Enviar consulta";
        document.getElementById("contacto-confirmacion").hidden = false;

        setTimeout(() => {
            document.getElementById("contacto-confirmacion").hidden = true;
        }, 2500);
    });

    document.getElementById("consultas-lista").addEventListener("click", evento => {
        const boton = evento.target.closest("button");
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const consultas = leerConsultas();
        const consulta = consultas.find(c => c.id === id);
        if (!consulta) return;

        if (boton.classList.contains("btn-eliminar-consulta")) {
            if (confirm("¿Eliminar esta consulta?")) {
                guardarConsultas(consultas.filter(c => c.id !== id));
                mostrarConsultas();
            }
        }

        if (boton.classList.contains("btn-editar-consulta")) {
            consultaEditando = id;
            form.elements.nombre.value = consulta.nombre;
            form.elements.email.value = consulta.email;
            form.elements.telefono.value = consulta.telefono;
            form.elements.fecha.value = consulta.fecha;
            form.elements.motivo.value = consulta.motivo;
            form.elements.mensaje.value = consulta.mensaje;

            form.querySelectorAll('input[name="talles"]').forEach(input => {
                input.checked = consulta.talles.includes(input.value);
            });

            form.querySelectorAll('input[name="metodo-contacto"]').forEach(input => {
                input.checked = input.value === consulta.metodoContacto;
            });

            document.querySelector(".btn-enviar").textContent = "Guardar cambios";
            form.scrollIntoView({ behavior: "smooth" });
        }
    });

    mostrarConsultas();
}

function iniciarMenu() {
    const boton = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-mobile");
    if (!boton || !menu) return;

    boton.addEventListener("click", () => {
        menu.classList.toggle("menu-abierto");
        boton.classList.toggle("activo");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarNumeroCarrito();
    iniciarCatalogo();
    iniciarMasVendidos();
    iniciarCarrito();
    iniciarCuenta();
    iniciarContacto();
    iniciarMenu();
});
