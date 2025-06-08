document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNavMenu = document.getElementById('main-nav-menu');

    // Toggle mobile navigation menu
    if (mobileMenuToggle && mainNavMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavMenu.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked (useful for single-page navigation)
        mainNavMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavMenu.classList.contains('active')) {
                    mainNavMenu.classList.remove('active');
                }
            });
        });
    }

    // Smooth scroll for all anchor links (e.g., "Start Using Tools Now")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- CHANGE START: New code to handle active navigation link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    const onScroll = () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        let activeSectionId = '';
        sections.forEach(section => {
            // Check if the section is in the viewport (with a 150px offset from the top)
            if (scrollPosition >= section.offsetTop - 150 && scrollPosition < section.offsetTop + section.offsetHeight - 150) {
                activeSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // The link's href is '#section-id'. We compare it to the current active section's ID.
            if (link.getAttribute('href') === '#' + activeSectionId) {
                link.classList.add('active');
            }
        });
        
        // A fallback for when you scroll to the very top
        if (activeSectionId === '' && scrollPosition < 400) {
            // If no section is active and we are near the top, make the first link active
            // This handles the hero section which doesn't have a corresponding nav link
            const firstLink = document.querySelector('.nav-menu .nav-link[href="#document-tools"]');
            if (firstLink) {
                 firstLink.classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', onScroll);
    // Call it once on load to set the initial correct state
    onScroll();
    // --- CHANGE END ---


    // --- GSAP Animations for Hero Section ---
    gsap.from(".hero-title .animated-text", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        stagger: 0.3,
        delay: 0.5
    });

    gsap.from(".hero-subtitle", {
        duration: 1.5,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 1.2
    });

    gsap.from(".btn-action", {
        duration: 1,
        y: 20,
        opacity: 0,
        ease: "power2.out",
        delay: 1.8
    });

    gsap.to(".bouncing-circle", {
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2,
        stagger: 0.5
    });

    // --- GSAP Animations for Highlighted Tools ---
    gsap.registerPlugin(ScrollTrigger);

    const toolCards = gsap.utils.toArray('.highlighted-tool-card');

    toolCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.8, rotationX: 20 },
            {
                opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1, ease: "power3.out",
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                }
            }
        );

        gsap.to(card.querySelector('.tool-icon'), {
            y: -5,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut",
            delay: i * 0.2
        });
    });

    // Handle clicks on all tool links (from highlighted cards or category lists)
    document.querySelectorAll('[data-tool]').forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');

            if (href && href !== '#') {
                return;
            }

            event.preventDefault();

            const toolData = this.dataset.tool;
            if (toolData) {
                const toolContentDiv = document.getElementById('tool-content');
                const toolDisplaySection = document.getElementById('tool-display-section');
                const heroSection = document.getElementById('hero-section');
                const highlightedToolsSection = document.getElementById('highlighted-tools-section');
                const categorySection = document.getElementById('category-section');

                toolContentDiv.innerHTML = `
                    <h2 style="text-align: center; color: var(--accent-cyan-glow);">You selected: ${toolData.replace(/-/g, ' ').toUpperCase()}</h2>
                    <p style="text-align: center;">This is where the **${toolData.replace(/-/g, ' ').toUpperCase()}** tool's functionality would be displayed.</p>
                    <p style="text-align: center; font-style: italic;">(Tool functionality coming soon!)</p>
                `;
                heroSection.style.display = 'none';
                highlightedToolsSection.style.display = 'none';
                categorySection.style.display = 'none';
                toolDisplaySection.style.display = 'block';
                toolDisplaySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Handle "View All" category buttons (placeholder logic)
    document.querySelectorAll('.btn-view-all').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.dataset.category;
            const toolContentDiv = document.getElementById('tool-content');
            const toolDisplaySection = document.getElementById('tool-display-section');
            const heroSection = document.getElementById('hero-section');
            const highlightedToolsSection = document.getElementById('highlighted-tools-section');
            const categorySection = document.getElementById('category-section');

            toolContentDiv.innerHTML = `
                <h2 style="text-align: center; color: var(--accent-cyan-glow);">All ${categoryName.replace(/-/g, ' ').toUpperCase()} Tools</h2>
                <p style="text-align: center;">This section would list all tools under the ${categoryName} category.</p>
                <p style="text-align: center; font-style: italic;">(More tools for this category are on the way!)</p>
            `;
            heroSection.style.display = 'none';
            highlightedToolsSection.style.display = 'none';
            categorySection.style.display = 'none';
            toolDisplaySection.style.display = 'block';
            toolDisplaySection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Back to tools button
    const backToToolsBtn = document.getElementById('back-to-tools-btn');
    if (backToToolsBtn) {
        backToToolsBtn.addEventListener('click', function() {
            document.getElementById('tool-display-section').style.display = 'none';
            document.getElementById('hero-section').style.display = 'block';
            document.getElementById('highlighted-tools-section').style.display = 'block';
            document.getElementById('category-section').style.display = 'block';
            document.getElementById('category-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

});