// ===== VARIABLES GLOBALES =====
let gameData = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    score: 0,
    lives: 3,
    timer: 60,
    gameInterval: null,
    gameStarted: false,
    gameEnded: false
};

// Iconos del juego temáticos para eventos infantiles
const gameIcons = [
    '🎂', '🎈', '🎁', '🎉', '🎪', '🎨', '🎭', '🎵',
    '🍰', '🍭', '🧸', '🎀', '👑', '⭐', '🌈', '🎯'
];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar loading screen
    initLoadingScreen();
    
    // Inicializar navegación
    initNavigation();
    
    // Inicializar juego
    initGame();
    
    // Inicializar formulario
    initContactForm();
    
    // Inicializar animaciones
    initScrollAnimations();
    
    // Inicializar smooth scroll
    initSmoothScroll();
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simular tiempo de carga
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// ===== NAVEGACIÓN =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu móvil
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== JUEGO DE MEMORIA =====
function initGame() {
    const startBtn = document.getElementById('start-game');
    const playAgainBtn = document.getElementById('play-again');
    const claimPrizeBtn = document.getElementById('claim-prize');
    
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);
    claimPrizeBtn.addEventListener('click', claimPrize);
}

function startGame() {
    // Reiniciar datos del juego
    gameData = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        score: 0,
        lives: 3,
        timer: 60,
        gameInterval: null,
        gameStarted: true,
        gameEnded: false
    };
    
    // Ocultar resultado anterior
    document.getElementById('game-result').classList.add('hidden');
    
    // Crear cartas del juego
    createGameCards();
    
    // Iniciar timer
    startTimer();
    
    // Actualizar UI
    updateGameUI();
    
    // Cambiar botón
    const startBtn = document.getElementById('start-game');
    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    startBtn.onclick = pauseGame;
    
    // Mostrar mensaje de inicio
    showGameMessage('¡Juego iniciado! Encuentra las parejas', 'success');
}

function createGameCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Seleccionar 8 iconos aleatorios y duplicarlos
    const selectedIcons = shuffleArray(gameIcons).slice(0, 8);
    const cardIcons = [...selectedIcons, ...selectedIcons];
    const shuffledCards = shuffleArray(cardIcons);
    
    // Crear cartas
    shuffledCards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.innerHTML = '<i class="fas fa-question"></i>';
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        
        // Agregar a datos del juego
        gameData.cards.push({
            element: card,
            icon: icon,
            isFlipped: false,
            isMatched: false
        });
    });
}

function flipCard(cardElement) {
    if (!gameData.gameStarted || gameData.gameEnded) return;
    
    const cardIndex = parseInt(cardElement.dataset.index);
    const card = gameData.cards[cardIndex];
    
    // No permitir voltear cartas ya volteadas o emparejadas
    if (card.isFlipped || card.isMatched || gameData.flippedCards.length >= 2) {
        return;
    }
    
    // Voltear carta
    card.isFlipped = true;
    cardElement.classList.add('flipped');
    cardElement.innerHTML = card.icon;
    gameData.flippedCards.push(card);
    
    // Reproducir sonido (simulado con vibración si está disponible)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Comprobar si hay dos cartas volteadas
    if (gameData.flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = gameData.flippedCards;
    
    if (card1.icon === card2.icon) {
        // ¡Pareja encontrada!
        card1.isMatched = true;
        card2.isMatched = true;
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        
        gameData.matchedPairs++;
        gameData.score += 100;
        
        // Bonus por tiempo restante
        if (gameData.timer > 30) {
            gameData.score += 50;
        }
        
        showGameMessage('¡Pareja encontrada! +100 puntos', 'success');
        
        // Comprobar si el juego terminó
        if (gameData.matchedPairs === 8) {
            endGame(true);
        }
    } else {
        // No es pareja
        setTimeout(() => {
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.innerHTML = '<i class="fas fa-question"></i>';
            card2.element.innerHTML = '<i class="fas fa-question"></i>';
            
            // Perder vida
            gameData.lives--;
            showGameMessage('No es pareja. -1 vida', 'error');
            
            if (gameData.lives <= 0) {
                endGame(false);
            }
        }, 1000);
    }
    
    // Limpiar cartas volteadas
    gameData.flippedCards = [];
    updateGameUI();
}

function startTimer() {
    gameData.gameInterval = setInterval(() => {
        gameData.timer--;
        updateGameUI();
        
        if (gameData.timer <= 0) {
            endGame(false);
        }
        
        // Advertencia cuando quedan 10 segundos
        if (gameData.timer === 10) {
            showGameMessage('¡Solo quedan 10 segundos!', 'warning');
        }
    }, 1000);
}

function pauseGame() {
    if (gameData.gameInterval) {
        clearInterval(gameData.gameInterval);
        gameData.gameInterval = null;
        gameData.gameStarted = false;
        
        const startBtn = document.getElementById('start-game');
        startBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
        startBtn.onclick = resumeGame;
        
        showGameMessage('Juego pausado', 'info');
    }
}

function resumeGame() {
    gameData.gameStarted = true;
    startTimer();
    
    const startBtn = document.getElementById('start-game');
    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    startBtn.onclick = pauseGame;
    
    showGameMessage('¡Continuando juego!', 'success');
}

function endGame(won) {
    gameData.gameEnded = true;
    gameData.gameStarted = false;
    
    if (gameData.gameInterval) {
        clearInterval(gameData.gameInterval);
    }
    
    // Calcular puntuación final
    let finalScore = gameData.score;
    if (won) {
        finalScore += gameData.timer * 10; // Bonus por tiempo restante
        finalScore += gameData.lives * 50; // Bonus por vidas restantes
    }
    
    // Mostrar resultado
    const resultDiv = document.getElementById('game-result');
    const titleElement = document.getElementById('result-title');
    const messageElement = document.getElementById('result-message');
    
    if (won) {
        titleElement.textContent = '¡Felicitaciones! 🎉';
        messageElement.innerHTML = `
            ¡Has completado el juego!<br>
            Puntuación final: ${finalScore}<br>
            Tiempo restante: ${gameData.timer}s<br>
            Vidas restantes: ${gameData.lives}<br>
            <strong>¡Has ganado un premio especial!</strong>
        `;
        
        // Confetti effect
        createConfetti();
    } else {
        titleElement.textContent = '¡Casi lo logras! 😊';
        messageElement.innerHTML = `
            Puntuación: ${finalScore}<br>
            Parejas encontradas: ${gameData.matchedPairs}/8<br>
            <strong>¡No te rindas, inténtalo de nuevo!</strong>
        `;
    }
    
    resultDiv.classList.remove('hidden');
    
    // Resetear botón
    const startBtn = document.getElementById('start-game');
    startBtn.innerHTML = '<i class="fas fa-play"></i> Nuevo Juego';
    startBtn.onclick = startGame;
}

function resetGame() {
    // Reiniciar completamente el juego
    startGame();
}

function claimPrize() {
    const message = encodeURIComponent(
        `¡Hola! He completado el juego de Apelolito y quiero reclamar mi premio. Mi puntuación fue: ${gameData.score}`
    );
    
    window.open(`https://wa.me/+5491122334455?text=${message}`, '_blank');
}

function updateGameUI() {
    document.getElementById('timer').textContent = gameData.timer;
    document.getElementById('score').textContent = gameData.score;
    document.getElementById('lives').textContent = gameData.lives;
    
    // Cambiar color de las vidas según la cantidad
    const livesElement = document.getElementById('lives');
    const livesContainer = livesElement.parentElement;
    
    if (gameData.lives <= 1) {
        livesContainer.style.color = '#ef4444';
    } else if (gameData.lives <= 2) {
        livesContainer.style.color = '#f59e0b';
    } else {
        livesContainer.style.color = '#334155';
    }
}

function showGameMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `game-message ${type}`;
    messageElement.textContent = message;
    
    // Estilos del mensaje
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    // Colores según tipo
    const colors = {
        success: { bg: '#10b981', text: '#ffffff' },
        error: { bg: '#ef4444', text: '#ffffff' },
        warning: { bg: '#f59e0b', text: '#ffffff' },
        info: { bg: '#3b82f6', text: '#ffffff' }
    };
    
    const color = colors[type] || colors.info;
    messageElement.style.backgroundColor = color.bg;
    messageElement.style.color = color.text;
    
    // Agregar al DOM
    document.body.appendChild(messageElement);
    
    // Mostrar con animación
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

// ===== UTILIDADES =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createConfetti() {
    const colors = ['#7DD3FC', '#A855F7', '#FCD34D'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

// CSS para la animación de confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validar datos
            if (validateForm(data)) {
                // Simular envío exitoso
                showFormMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
                form.reset();
                
                // Redirigir a WhatsApp con el mensaje
                const message = encodeURIComponent(
                    `Hola, me interesa contratar sus servicios para un ${data['event-type']}. 
                    Mi nombre es ${data.name}, mi teléfono es ${data.phone} y mi email es ${data.email}. 
                    Detalles: ${data.message}`
                );
                
                setTimeout(() => {
                    window.open(`https://wa.me/+5491122334455?text=${message}`, '_blank');
                }, 2000);
            }
        });
    }
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Por favor ingresa un teléfono válido');
    }
    
    if (!data['event-type']) {
        errors.push('Por favor selecciona un tipo de evento');
    }
    
    if (errors.length > 0) {
        showFormMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = message;
    
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    const colors = {
        success: { bg: '#10b981', text: '#ffffff' },
        error: { bg: '#ef4444', text: '#ffffff' },
        info: { bg: '#3b82f6', text: '#ffffff' }
    };
    
    const color = colors[type] || colors.info;
    messageElement.style.backgroundColor = color.bg;
    messageElement.style.color = color.text;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

// ===== ANIMACIONES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.service-card, .game-container, .contact-content');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== EASTER EGGS =====
// Konami Code para activar modo especial
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateSpecialMode();
        konamiCode = [];
    }
});

function activateSpecialMode() {
    // Modo especial: colores rainbow
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    showGameMessage('¡Modo especial activado! 🌈', 'success');
    
    // Desactivar después de 10 segundos
    setTimeout(() => {
        document.body.style.animation = '';
        showGameMessage('Modo especial desactivado', 'info');
    }, 10000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy loading para imágenes si se agregan
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS (placeholder) =====
function trackEvent(eventName, properties = {}) {
    // Aquí se puede integrar con Google Analytics, Mixpanel, etc.
    console.log(`Event: ${eventName}`, properties);
}

// Trackear eventos importantes
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('page_loaded');
});

// Trackear clicks en botones importantes
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('cta_clicked', { button: e.target.textContent });
    }
}); 