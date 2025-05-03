// Dynamic Weather Background Animation
// Add this code to the page, just before the closing </body> tag

// Create canvas element for background animation
const canvas = document.createElement('canvas');
canvas.id = 'bgCanvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-2';
canvas.style.opacity = '0.8';
canvas.style.transition = 'opacity 1.5s ease';
document.body.insertBefore(canvas, document.body.firstChild);

// Initialize animation variables
let animationFrame;
let ctx;
let width;
let height;
let particles = [];
let weatherCondition = 'clear'; // Default weather condition
let isDarkMode = document.body.classList.contains('dark-mode');
let lastWeatherIcon = '01d'; // Default clear day

// Weather particle settings
const weatherSettings = {
    clear: {
        particleCount: 20,
        particleType: 'sun',
        light: {
            background: 'linear-gradient(180deg, #87CEEB 0%, #1E90FF 100%)',
            particleColor: '#FFD700'
        },
        dark: {
            background: 'linear-gradient(180deg, #0B3D91 0%, #000000 100%)',
            particleColor: '#FFFF99'
        }
    },
    clouds: {
        particleCount: 15,
        particleType: 'cloud',
        light: {
            background: 'linear-gradient(180deg, #A9D0F5 0%, #82CAFF 100%)',
            particleColor: '#FFFFFF'
        },
        dark: {
            background: 'linear-gradient(180deg, #2C3E50 0%, #1A1A2E 100%)',
            particleColor: '#D3D3D3'
        }
    },
    rain: {
        particleCount: 100,
        particleType: 'rain',
        light: {
            background: 'linear-gradient(180deg, #5D8CAE 0%, #6D8FAA 100%)',
            particleColor: '#A6CEE3'
        },
        dark: {
            background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
            particleColor: '#6B93D6'
        }
    },
    snow: {
        particleCount: 50,
        particleType: 'snow',
        light: {
            background: 'linear-gradient(180deg, #E3E3E3 0%, #C9D6FF 100%)',
            particleColor: '#FFFFFF'
        },
        dark: {
            background: 'linear-gradient(180deg, #2A3B4C 0%, #1A202E 100%)',
            particleColor: '#F0F8FF'
        }
    },
    thunderstorm: {
        particleCount: 40,
        particleType: 'thunderstorm',
        light: {
            background: 'linear-gradient(180deg, #4B5A69 0%, #374151 100%)',
            particleColor: '#FFEB3B'
        },
        dark: {
            background: 'linear-gradient(180deg, #111827 0%, #030712 100%)',
            particleColor: '#FFEB3B'
        }
    },
    mist: {
        particleCount: 80,
        particleType: 'mist',
        light: {
            background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
            particleColor: '#F3F4F6'
        },
        dark: {
            background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
            particleColor: '#9CA3AF'
        }
    }
};

// Initialize canvas and start animation
function initCanvas() {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Update animation when dark mode changes
    modeToggle.addEventListener('click', () => {
        setTimeout(() => {
            isDarkMode = document.body.classList.contains('dark-mode');
            updateWeatherAnimation(lastWeatherIcon);
        }, 50);
    });

    // Start with default animation
    updateWeatherAnimation('01d');
    startAnimation();
}

// Resize canvas to match window size
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Map weather icon to condition
function getWeatherCondition(iconCode) {
    const code = iconCode.substring(0, 2);
    switch (code) {
        case '01': return 'clear';      // Clear sky
        case '02':
        case '03':
        case '04': return 'clouds';     // Clouds
        case '09':
        case '10': return 'rain';       // Rain
        case '11': return 'thunderstorm'; // Thunderstorm
        case '13': return 'snow';       // Snow
        case '50': return 'mist';       // Mist
        default: return 'clear';
    }
}

// Update weather animation based on icon code
function updateWeatherAnimation(iconCode) {
    lastWeatherIcon = iconCode;
    weatherCondition = getWeatherCondition(iconCode);
    const isNight = iconCode.endsWith('n');

    // Update background gradient based on weather condition and mode
    const currentSettings = weatherSettings[weatherCondition];
    const colorScheme = isDarkMode ? currentSettings.dark : currentSettings.light;

    // Apply background gradient
    document.body.style.backgroundImage = colorScheme.background;

    // Recreate particles
    createParticles(currentSettings.particleCount, currentSettings.particleType, colorScheme.particleColor, isNight);
}

// Create particles for animation
function createParticles(count, type, color, isNight) {
    particles = [];

    for (let i = 0; i < count; i++) {
        const particle = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 5 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: Math.random() * 1 + 0.5,
            color: color,
            opacity: Math.random() * 0.7 + 0.3,
            type: type,
            isNight: isNight
        };

        // Special settings for different types
        if (type === 'rain') {
            particle.speedY = Math.random() * 5 + 10;
            particle.speedX = (Math.random() - 0.5) * 2;
            particle.size = Math.random() * 2 + 1;
            particle.length = Math.random() * 20 + 10;
        } else if (type === 'snow') {
            particle.speedY = Math.random() * 1 + 0.5;
            particle.angle = Math.random() * Math.PI * 2;
            particle.angleSpeed = (Math.random() - 0.5) * 0.01;
            particle.swingRange = Math.random() * 5;
        } else if (type === 'thunderstorm') {
            particle.flash = false;
            particle.flashTimer = Math.random() * 200;
            particle.flashDuration = Math.random() * 3 + 1;
        } else if (type === 'mist') {
            particle.size = Math.random() * 100 + 50;
            particle.speedX = (Math.random() - 0.5) * 0.3;
            particle.speedY = (Math.random() - 0.5) * 0.1;
        }

        particles.push(particle);
    }
}

// Animation loop
function startAnimation() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        updateParticles();
        drawParticles();
        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// Update particle positions
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === 'rain') {
            // Rain drops fall straight down
            p.y += p.speedY;
            p.x += p.speedX;

            // Reset if off screen
            if (p.y > height) {
                p.y = -p.length;
                p.x = Math.random() * width;
            }
        } else if (p.type === 'snow') {
            // Snow has gentle swinging motion
            p.angle += p.angleSpeed;
            p.x += Math.sin(p.angle) * p.swingRange;
            p.y += p.speedY;

            // Reset if off screen
            if (p.y > height) {
                p.y = -p.size;
                p.x = Math.random() * width;
            }
        } else if (p.type === 'thunderstorm') {
            // Move like rain
            p.y += p.speedY;
            p.x += p.speedX;

            // Flash effect
            p.flashTimer--;
            if (p.flashTimer <= 0) {
                p.flash = true;
                p.flashTimer = Math.random() * 500 + 100;
            }

            if (p.flash) {
                p.flashDuration--;
                if (p.flashDuration <= 0) {
                    p.flash = false;
                    p.flashDuration = Math.random() * 3 + 1;
                }
            }

            // Reset if off screen
            if (p.y > height) {
                p.y = -p.length;
                p.x = Math.random() * width;
            }
        } else if (p.type === 'mist') {
            // Slow drifting motion
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around when off screen
            if (p.x < -p.size) p.x = width + p.size;
            if (p.x > width + p.size) p.x = -p.size;
            if (p.y < -p.size) p.y = height + p.size;
            if (p.y > height + p.size) p.y = -p.size;
        } else {
            // Default particle movement (sun/cloud)
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.speedX = -p.speedX;
            if (p.y < 0 || p.y > height) p.speedY = -p.speedY;
        }
    }
}

// Draw particles to canvas
function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.globalAlpha = p.opacity;

        if (p.type === 'rain') {
            // Draw rain drop
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.length);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.stroke();
        } else if (p.type === 'snow') {
            // Draw snowflake
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        } else if (p.type === 'thunderstorm') {
            // Draw rain drop
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.length);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.stroke();

            // Flash effect
            if (p.flash) {
                const gradient = ctx.createRadialGradient(
                    width / 2, height / 2, 0,
                    width / 2, height / 2, width
                );
                gradient.addColorStop(0, 'rgba(255, 255, 220, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 255, 220, 0)');

                ctx.globalAlpha = 0.2;
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
        } else if (p.type === 'cloud') {
            // Draw cloud puff
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 10, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        } else if (p.type === 'sun') {
            // Draw sun ray or star
            if (p.isNight) {
                // Star at night
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Add twinkle effect
                if (Math.random() < 0.01) {
                    p.opacity = Math.random() * 0.7 + 0.3;
                }
            } else {
                // Sun ray during day
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size * 3
                );
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        } else if (p.type === 'mist') {
            // Draw mist/fog
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size
            );
            gradient.addColorStop(0, `rgba(${p.color.substring(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`);
            gradient.addColorStop(1, `rgba(${p.color.substring(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0)`);
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.globalAlpha = 1;
}

// Modify the existing setWeatherBackground function to use our animation
function setWeatherBackground(iconCode) {
    // Instead of setting a background image, update our animation
    updateWeatherAnimation(iconCode);
}

// Initialize the canvas animation
document.addEventListener('DOMContentLoaded', initCanvas);