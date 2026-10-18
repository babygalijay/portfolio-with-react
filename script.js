
 type="text/javascript">
    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. Hero Role Animation ---
        const roles = ["Web Developer", "Agri Consultant", "STEM Educator"];
        const colors = ["#4ade80", "#22d3ee", "#facc15"]; // green-400, cyan-400, amber-400
        let roleIndex = 0;
        const animatedRoleElement = document.getElementById('animated-role');

        const animateRole = () => {
            const role = roles[roleIndex];
            const color = colors[roleIndex];
            let charIndex = 0;

            const type = () => {
                if (charIndex < role.length) {
                    animatedRoleElement.textContent += role.charAt(charIndex);
                    animatedRoleElement.style.color = color; // Set color immediately
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    setTimeout(erase, 1500);
                }
            };

            const erase = () => {
                if (animatedRoleElement.textContent.length > 0) {
                    animatedRoleElement.textContent = animatedRoleElement.textContent.slice(0, -1);
                    setTimeout(erase, 50);
                } else {
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(type, 500);
                }
            };

            type();
        };

        animateRole();

        // --- 2. Scroll-triggered Metric Counter ---
        const counterElements = document.querySelectorAll('.count-value');
        let observer;

        const startCount = (entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.dataset.value);
                const unit = element.dataset.unit;
                let currentValue = 0;
                const duration = 2000; // 2 seconds
                const start = performance.now();

                const updateCount = (timestamp) => {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    currentValue = Math.floor(progress * targetValue);

                    element.textContent = currentValue + unit;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        // Ensure it hits the exact target value
                        element.textContent = targetValue + unit;
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(element); // Stop observing once counting is done
            }
        };

        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(startCount);
            }, {
                threshold: 0.5 // Start counting when 50% of the element is visible
            });

            counterElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for non-supporting browsers (set final value instantly)
            counterElements.forEach(el => {
                el.textContent = el.dataset.value + el.dataset.unit;
            });
        }


        // --- 3. Mobile Menu Toggle ---
        const menuButton = document.getElementById('menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const iconOpen = document.getElementById('icon-open');
        const iconClose = document.getElementById('icon-close');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });

        // --- 4. Navigation Active State on Scroll ---
        const sections = document.querySelectorAll('section, header#hero');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateNav = () => {
            let current = 'hero'; 
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; // Adjust for fixed nav height
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                if (link.dataset.section === current) {
                    link.classList.add('active-nav');
                }
            });
        };

        window.addEventListener('scroll', updateNav);
        updateNav(); // Initial call to set active state on load
        
        // --- 5. Firebase/Auth Placeholder Initialization (MANDATORY for Canvas environment) ---
        // These global variables are provided by the canvas environment.
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        // Note: For a static portfolio site, we only need to show the auth status.
        // We will not load the full Firebase SDK unless storage/real-time features are needed.
        const authStatusElement = document.getElementById('auth-status');
        
        const updateAuthStatus = (statusText, colorClass) => {
            authStatusElement.innerHTML = `<p class="${colorClass}">${statusText} (App ID: ${appId})</p>`;
        };

        // Simulate successful Canvas environment auth check
        if (initialAuthToken) {
            updateAuthStatus('Environment Ready: Authenticated', 'text-green-400');
        } else {
            updateAuthStatus('Environment Ready: Anonymous Session', 'text-yellow-400');
        }
    });