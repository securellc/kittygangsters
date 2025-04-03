        const canvas = document.getElementById('particlesCanvas');
        const ctx = canvas.getContext('2d');
        const particles = [];
        let mouse = { x: 0, y: 0 };
        let devicePixelRatio = window.devicePixelRatio || 1;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth * devicePixelRatio;
            canvas.height = window.innerHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };

        const generateParticle = () => {
            const size = Math.random() * 0.3 + 0.2;  
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                alpha: 0,
                targetAlpha: parseFloat((0.6 * Math.random() + 0.2).toFixed(1)),  
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                translateX: 0,
                translateY: 0,
                magnetism: 0.1 + Math.random() * 3,
                spawnTime: Date.now(),  
                maxSize: size  
            };
        };

        const drawParticleWithBlur = (particle) => {
            const blurEffect = 10; 
            const fadeInDuration = 1000;  

            for (let i = 0; i < blurEffect; i++) {
                const trailAlpha = Math.max(0, particle.alpha - (i * 0.02));  
                const trailSize = particle.size * (1 - i * 0.05);  

                const trailX = particle.x - (particle.dx * i); 
                const trailY = particle.y - (particle.dy * i); 

                ctx.beginPath();
                ctx.arc(trailX, trailY, trailSize, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`;
                ctx.fill();
            }

            const elapsedTime = Date.now() - particle.spawnTime;
            if (elapsedTime < fadeInDuration) {
                const fadeInProgress = elapsedTime / fadeInDuration;
                particle.size = particle.maxSize * fadeInProgress; 
                particle.alpha = Math.min(particle.targetAlpha, fadeInProgress); 
            }
        };

        const clearContext = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const updateParticles = () => {
            clearContext();
            ctx.globalCompositeOperation = 'lighter';  

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.dx;
                p.y += p.dy;

                p.translateX += (mouse.x / (p.magnetism * 1) - p.translateX) / 50;
                p.translateY += (mouse.y / (p.magnetism * 1) - p.translateY) / 50;

                if (p.x < -p.size || p.x > canvas.width + p.size || p.y < -p.size || p.y > canvas.height + p.size) {
                    particles.splice(i, 1);
                    particles.push(generateParticle());
                }

                drawParticleWithBlur(p);
            }

            requestAnimationFrame(updateParticles); 
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX * devicePixelRatio;
            mouse.y = e.clientY * devicePixelRatio;
        });

        const initParticles = () => {
            particles.length = 0;  
            for (let i = 0; i < 90; i++) {
                particles.push(generateParticle());  
            }
        };

        window.addEventListener('resize', resizeCanvas);

        resizeCanvas();
        initParticles();
        updateParticles();