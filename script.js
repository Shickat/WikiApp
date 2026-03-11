const urls = [
    'https://shickat.me',
    'https://wikishickat.pages.dev/',
    'https://b5168cd1.wikishickat.pages.dev/',
    'https://ipfs.io/ipfs/QmQEDa9PuAaAGDMycpTDcNDbzjRz84zdpeNG6XreveJAPm/',
    'https://ipfs.io/ipns/k51qzi5uqu5dgkcvogpofvprp6i8i2rtr6ej0li3ueqimgxw3803gjoqhar1uw/',
    'https://k51qzi5uqu5dgkcvogpofvprp6i8i2rtr6ej0li3ueqimgxw3803gjoqhar1uw.ipns.dweb.link/',
    'https://shickat.blog',
    'https://shickatblog.pages.dev/',
    'https://2d60bb55.shickatblog.pages.dev/'
];

const timeout = 5000; // 5 segundos de timeout

// Función para verificar disponibilidad de una URL
async function checkURL(url) {
    try {
        const response = await Promise.race([
            fetch(url, { 
                method: 'HEAD',
                mode: 'no-cors'
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
        return true;
    } catch (error) {
        return false;
    }
}

// Función para actualizar el estado en la pantalla
function updateStatus(text, server = '') {
    const statusElement = document.getElementById('status');
    const serverElement = document.getElementById('current-server');
    
    if (statusElement) {
        statusElement.textContent = text;
    }
    if (serverElement && server) {
        serverElement.textContent = `Probando: ${server}`;
    }
}

// Función principal para redirigir
async function findAvailableURL() {
    console.log('Iniciando búsqueda de servidor disponible...');
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const displayURL = new URL(url).hostname;
        
        updateStatus(`Verificando disponibilidad... (${i + 1}/${urls.length})`, displayURL);
        console.log(`Verificando: ${url}`);
        
        const isAvailable = await checkURL(url);
        
        if (isAvailable) {
            console.log(`✓ Servidor disponible: ${url}`);
            updateStatus(`¡Servidor encontrado! Redirigiendo...`, displayURL);
            
            // Pequeña pausa antes de redirigir para que el usuario vea el mensaje
            setTimeout(() => {
                window.location.href = url;
            }, 500);
            return;
        } else {
            console.log(`✗ Servidor no disponible: ${url}`);
        }
    }
    
    // Si ningún servidor está disponible
    console.log('Ningún servidor disponible');
    updateStatus('Error: No hay servidores disponibles en este momento');
    
    // Mostrar opciones alternativas después de 3 segundos
    setTimeout(() => {
        showAvailableServers();
    }, 3000);
}

// Función para mostrar opciones si ninguno está disponible
function showAvailableServers() {
    const card = document.querySelector('.card');
    const spinner = document.querySelector('.spinner');
    const progressContainer = document.querySelector('.progress-container');
    
    if (spinner) spinner.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'none';
    
    const serverList = document.createElement('div');
    serverList.style.cssText = `
        text-align: left;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Opciones disponibles:';
    title.style.cssText = 'color: #333; font-size: 16px; margin-bottom: 15px;';
    serverList.appendChild(title);
    
    urls.forEach(url => {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = new URL(url).hostname;
        link.style.cssText = `
            display: block;
            padding: 10px;
            margin-bottom: 8px;
            background: #f5f5f5;
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            border-left: 3px solid #667eea;
        `;
        
        link.onmouseover = () => {
            link.style.background = '#667eea';
            link.style.color = 'white';
        };
        link.onmouseout = () => {
            link.style.background = '#f5f5f5';
            link.style.color = '#667eea';
        };
        
        serverList.appendChild(link);
    });
    
    card.appendChild(serverList);
}

// Iniciar búsqueda cuando se cargue la página
document.addEventListener('DOMContentLoaded', findAvailableURL);







