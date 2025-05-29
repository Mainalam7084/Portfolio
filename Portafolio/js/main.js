// Theme Initialization and Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function updateThemeToggleButtonState() {
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', body.classList.contains('dark').toString());
    }
}

function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    let themeToApply = 'light'; // Default theme

    if (savedTheme) {
        themeToApply = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themeToApply = 'dark';
    }

    if (themeToApply === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark'); // Ensure light theme is applied if not dark
    }
    localStorage.setItem('theme', themeToApply); // Save the determined theme
    updateThemeToggleButtonState();
}

applyThemePreference(); // Call on load

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        updateThemeToggleButtonState();
    });
}

// Scroll to portfolio section
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', () => {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Reveal sections on scroll
const sections = document.querySelectorAll('.section, .about-container');
const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after visible to save resources if animation is one-time
                // sectionObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
sections.forEach(section => sectionObserver.observe(section));

// Portfolio modal
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalCloseBtn = modal.querySelector('.modal-close');
let previouslyFocusedElement = null; // To store focus before modal opens

document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
        const img = card.dataset.img;
        const title = card.dataset.title;
        const desc = card.dataset.desc;

        if (modalImage) modalImage.style.backgroundImage = `url('${img}')`;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;

        if (modal) {
            previouslyFocusedElement = document.activeElement; // Save current focus
            modal.classList.add('active');
            if (modalCloseBtn) modalCloseBtn.focus(); // Focus the close button
        }
    });
});

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus(); // Restore focus
            previouslyFocusedElement = null;
        }
    }
}

// Close modal events
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) { // Click on modal background
            closeModal();
        }
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// Dummy contact form handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Gracias por tu mensaje. Me pondré en contacto contigo pronto.');
        contactForm.reset();
    });
}

// --- COMIENZO: Lógica para Menú Hamburguesa ---
const menuToggleBtn = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
// const body = document.body; // Ya deberías tener esta variable definida arriba

if (menuToggleBtn && mainNav) {
    const navLinks = mainNav.querySelectorAll('ul li a');

    menuToggleBtn.addEventListener('click', () => {
        const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true' || false;
        menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        body.classList.toggle('mobile-nav-active'); // Para prevenir scroll del body
    });

    // Cerrar el menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                menuToggleBtn.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                body.classList.remove('mobile-nav-active');
            }
        });
    });

    // Opcional: Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (mainNav.classList.contains('active') &&
            !mainNav.contains(event.target) && // El clic no fue dentro del nav
            !menuToggleBtn.contains(event.target)) { // El clic no fue en el botón de toggle

            menuToggleBtn.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            body.classList.remove('mobile-nav-active');
        }
    });

    // Opcional: Cerrar el menú con la tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggleBtn.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            body.classList.remove('mobile-nav-active');
        }
    });
}
// --- FIN: Lógica para Menú Hamburguesa ---

// Forzar descarga CV
// ... (tu código existente para la descarga del CV) ...

// --- COMIENZO: Nuevo código para Estela de Ratón Continua Neón ---

// Crear el contenedor SVG para la estela
const svgTrailContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgTrailContainer.id = 'neon-trail-svg';
svgTrailContainer.style.position = 'fixed';
svgTrailContainer.style.top = '0';
svgTrailContainer.style.left = '0';
svgTrailContainer.style.width = '100%';
svgTrailContainer.style.height = '100%';
svgTrailContainer.style.pointerEvents = 'none'; // No interfiere con clics
svgTrailContainer.style.zIndex = '9998';      // Alto, pero podría estar debajo de modales si es necesario
document.body.appendChild(svgTrailContainer);

let prevMousePos = { x: 0, y: 0 };
let currMousePos = { x: 0, y: 0 };
let hasMouseMovedInitially = false; // Para la primera captura de posición

// --- Parámetros para ajustar la estela ---
// Intervalo (ms) para dibujar un nuevo segmento. Menor = más suave, más CPU.
const TRAIL_SEGMENT_INTERVAL = 16; // Aprox. 60 FPS.
// Duración (ms) que un segmento permanece visible antes de eliminarse (debe coincidir con la transición CSS).
const SEGMENT_LIFESPAN = 500; // Coincide con 'transition: opacity 0.5s' en CSS.
// Distancia mínima (px) que el ratón debe moverse para dibujar un nuevo segmento.
const MIN_MOVE_DISTANCE = 2;
// --- Fin de Parámetros ---

let lastTrailSegmentTime = 0;

document.addEventListener('mousemove', (e) => {
    currMousePos.x = e.clientX;
    currMousePos.y = e.clientY;

    if (!hasMouseMovedInitially) {
        // Inicializa prevMousePos a la posición actual en el primer movimiento
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
        hasMouseMovedInitially = true;
    }
});

function createSvgLineSegment(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('class', 'neon-svg-line'); // Clase para estilos CSS
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));

    svgTrailContainer.appendChild(line);

    // Forzar la transición de opacidad para el desvanecimiento
    // La opacidad inicial (0.9) y la transición están definidas en CSS.
    // Al cambiar la opacidad a 0 aquí, se activa la transición CSS.
    requestAnimationFrame(() => {
        line.style.opacity = '0';
    });

    // Eliminar el segmento de línea del DOM después de que termine la transición
    setTimeout(() => {
        if (line.parentElement) {
            line.remove();
        }
    }, SEGMENT_LIFESPAN);
}

function renderContinuousTrail() {
    const now = performance.now();

    if (hasMouseMovedInitially && (now - lastTrailSegmentTime > TRAIL_SEGMENT_INTERVAL)) {
        const dx = currMousePos.x - prevMousePos.x;
        const dy = currMousePos.y - prevMousePos.y;
        // Usamos distancia al cuadrado para evitar Math.sqrt() que es más costoso
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq >= MIN_MOVE_DISTANCE * MIN_MOVE_DISTANCE) {
            createSvgLineSegment(prevMousePos.x, prevMousePos.y, currMousePos.x, currMousePos.y);

            // Actualizar la posición previa para el siguiente segmento
            prevMousePos.x = currMousePos.x;
            prevMousePos.y = currMousePos.y;
            lastTrailSegmentTime = now;
        }
    }
    requestAnimationFrame(renderContinuousTrail);
}

// Iniciar el bucle de animación para la estela continua
// Asegúrate de que el antiguo `requestAnimationFrame(neonTrailAnimationLoop);` esté eliminado o comentado.
if (svgTrailContainer) { // Solo inicia si el contenedor SVG se añadió correctamente
    requestAnimationFrame(renderContinuousTrail);
}

// --- FIN: Nuevo código para Estela de Ratón Continua Neón ---

// --- COMIENZO: Forzar descarga directa del CV ---
const cvDownloadBtn = document.getElementById('cv-download-btn');

if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir la navegación por defecto del enlace

        const fileUrl = cvDownloadBtn.href;
        let fileName = cvDownloadBtn.getAttribute('download');

        // Si por alguna razón el atributo download está vacío, intenta obtener el nombre del archivo de la URL
        if (!fileName) {
            const urlParts = fileUrl.split('/');
            fileName = urlParts[urlParts.length - 1];
        }

        try {
            // 1. Obtener el archivo como un Blob
            const response = await fetch(fileUrl);
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanza un error
                throw new Error(`Error al obtener el archivo: ${response.status} ${response.statusText}`);
            }
            const blob = await response.blob();

            // 2. Crear una URL temporal para el Blob
            const blobUrl = URL.createObjectURL(blob);

            // 3. Crear un enlace temporal, configurar atributos y simular clic
            const tempLink = document.createElement('a');
            tempLink.href = blobUrl;
            tempLink.download = fileName; // Sugerir el nombre de archivo para la descarga

            // Es necesario añadir el enlace al DOM para que funcione en todos los navegadores (especialmente Firefox)
            document.body.appendChild(tempLink);
            tempLink.click(); // Simular clic para iniciar la descarga

            // 4. Limpieza: remover el enlace temporal y revocar la URL del Blob
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error('Error al intentar descargar el CV:', error);
            // En caso de error, puedes mostrar un mensaje al usuario o
            // como último recurso, intentar la descarga de la forma tradicional (que podría abrirlo en el navegador)
            alert('Hubo un problema al intentar descargar el CV. Por favor, intentalo de nuevo o haz clic derecho sobre el botón y selecciona "Guardar enlace como..."');
            // Opcional: si falla el método forzado, podrías redirigir para que el navegador maneje el enlace
            // window.location.href = fileUrl;
        }
    });
}
// --- FIN: Forzar descarga directa del CV ---

// ... tu código JavaScript existente ...

// --- COMIENZO: Lluvia de Puntos Neón (Efecto Hacker) ---
const rainContainer = document.getElementById('hacker-rain-container');

function createNeonDot() {
    if (!rainContainer) return; // Salir si el contenedor no se encuentra

    const dot = document.createElement('div');
    dot.classList.add('neon-dot');

    // Posición horizontal aleatoria
    dot.style.left = `${Math.random() * 100}vw`;

    // Duración aleatoria de la animación (velocidad de caída)
    // Entre 2 y 6 segundos para variar la velocidad
    const duration = Math.random() * 4 + 2;
    dot.style.animationDuration = `${duration}s`;

    // Retraso aleatorio de la animación (cuándo empieza a caer el punto)
    // Hasta 7 segundos de retraso para un efecto de lluvia escalonado
    const delay = Math.random() * 7;
    dot.style.animationDelay = `${delay}s`;

    rainContainer.appendChild(dot);

    // Eliminar el punto del DOM después de que termine su animación + retraso
    // para evitar la acumulación y mantener el rendimiento.
    // Se suma un pequeño buffer (100ms) para asegurar que la animación haya terminado.
    setTimeout(() => {
        if (dot.parentElement) {
            dot.remove();
        }
    }, (duration + delay) * 1000 + 100);
}

// Crear una cantidad inicial de puntos y luego añadir más periódicamente
// para un efecto continuo.
if (rainContainer) {
    const initialDots = 100; // Número de puntos al cargar la página, ajusta según la densidad deseada
    const creationInterval = 150; // Milisegundos: cada cuánto se crea un nuevo punto para el efecto continuo

    for (let i = 0; i < initialDots; i++) {
        // Esparcir la creación inicial de los puntos para que no aparezcan todos de golpe
        setTimeout(createNeonDot, i * 10); // Pequeño retraso escalonado
    }

    // Opcional: Crear nuevos puntos continuamente para un efecto infinito
    // Si prefieres que la lluvia sea constante y no solo una ráfaga inicial, descomenta la siguiente línea:
    setInterval(createNeonDot, creationInterval);
    // Considera el rendimiento si lo dejas activo mucho tiempo con muchos puntos.
    // Para un portafolio, una cantidad inicial generosa suele ser suficiente.
}
// --- FIN: Lluvia de Puntos Neón (Efecto Hacker) ---
// --- COMIENZO: Barra de Texto Neón en Secciones ---
document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const logoChar = '©'; // Símbolo de Copyright como mini logo

  // Definimos las partes del texto con el logo
  const namePart = ` ${logoChar} Main Alam `;
  const yearPart = ` ${logoChar} ${currentYear} `;
  const portfolioPart = ` ${logoChar} Portfolio `;

  // Unimos las partes para una instancia completa del texto
  // El espacio extra al final es intencional para el padding-right del CSS
  const singleTextInstance = `${namePart} ${yearPart} ${portfolioPart}`;

  // Seleccionamos todos los contenedores de la barra de neón
  const neonTextBars = document.querySelectorAll('.section-neon-text-bar');

  neonTextBars.forEach(bar => {
    // Limpiamos cualquier contenido previo que pudiera tener la barra
    bar.innerHTML = '';

    // Creamos el div wrapper que se animará
    const wrapper = document.createElement('div');
    wrapper.classList.add('neon-text-wrapper');

    // Creamos dos spans con el contenido del texto.
    // Esto es necesario para que la animación de marquesina (translateX(-50%))
    // cree un bucle infinito y fluido.
    const contentSpan1 = document.createElement('span');
    contentSpan1.classList.add('neon-text-content');
    contentSpan1.textContent = singleTextInstance;

    const contentSpan2 = document.createElement('span');
    contentSpan2.classList.add('neon-text-content');
    contentSpan2.textContent = singleTextInstance;// La segunda copia del texto

    const contentSpan3 = document.createElement('span');
    contentSpan3.classList.add('neon-text-content');
    contentSpan3.textContent = singleTextInstance;

    const contentSpan4 = document.createElement('span');
    contentSpan4.classList.add('neon-text-content');
    contentSpan4.textContent = singleTextInstance;

    // Añadimos los spans al wrapper
    wrapper.appendChild(contentSpan1);
    wrapper.appendChild(contentSpan2);
    wrapper.appendChild(contentSpan3);
    wrapper.appendChild(contentSpan4);

    // Añadimos el wrapper a la barra de la sección
    bar.appendChild(wrapper);
  });
});
// --- FIN: Barra de Texto Neón en Secciones ---
