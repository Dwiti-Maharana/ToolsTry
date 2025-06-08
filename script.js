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
            e.preventDefault();

            // Ensure the target element exists before attempting to scroll
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Dynamic Tool Display Logic ---
    const toolLinks = document.querySelectorAll('[data-tool]'); // Selects all tool links
    const categoryViewAllBtns = document.querySelectorAll('.btn-view-all'); // Selects "View All" buttons
    const toolDisplaySection = document.getElementById('tool-display-section');
    const toolContent = document.getElementById('tool-content');
    const backToToolsBtn = document.getElementById('back-to-tools-btn');
    const categorySection = document.getElementById('category-section');
    const heroSection = document.getElementById('hero-section');
    const highlightedToolsSection = document.getElementById('highlighted-tools-section'); // New reference

    // Handle clicks on individual tool links
    toolLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior (page reload)
            const toolName = this.dataset.tool; // Get the tool name from data-tool attribute

            // Populate the tool-content div with a placeholder message
            toolContent.innerHTML = `
                <h2 style="text-align: center; color: var(--accent-cyan-glow);">You selected: ${toolName.replace(/-/g, ' ').toUpperCase()}</h2>
                <p style="text-align: center;">This is where the **${toolName.replace(/-/g, ' ').toUpperCase()}** tool's functionality would be displayed.</p>
                <p style="text-align: center; font-style: italic;">(Tool functionality coming soon!)</p>
            `;

            // Hide main sections and show the tool display section
            categorySection.style.display = 'none';
            heroSection.style.display = 'none';
            highlightedToolsSection.style.display = 'none'; // Hide new section
            toolDisplaySection.style.display = 'block';

            // Scroll to the top of the page for a smooth transition
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle clicks on "View All" category buttons
    categoryViewAllBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const categoryName = this.dataset.category; // Get the category name from data-category attribute

            // Populate the tool-content div with a placeholder message for the category
            toolContent.innerHTML = `
                <h2 style="text-align: center; color: var(--accent-cyan-glow);">All ${categoryName.replace(/-/g, ' ').toUpperCase()} Tools</h2>
                <p style="text-align: center;">This section would list all specific tools available under the **${categoryName.replace(/-/g, ' ').toUpperCase()}** category.</p>
                <p style="text-align: center; font-style: italic;">(More tools for this category are on the way!)</p>
            `;

            // Hide main sections and show the tool display section
            categorySection.style.display = 'none';
            heroSection.style.display = 'none';
            highlightedToolsSection.style.display = 'none'; // Hide new section
            toolDisplaySection.style.display = 'block';

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Handle click on the "Back to all tools" button
    if (backToToolsBtn) {
        backToToolsBtn.addEventListener('click', function() {
            // Hide the tool display section and show the main sections
            toolDisplaySection.style.display = 'none';
            categorySection.style.display = 'block';
            heroSection.style.display = 'block';
            highlightedToolsSection.style.display = 'block'; // Show new section
        });
    }


    // --- GSAP Animations for Highlighted Tools ---

    // Register ScrollTrigger plugin (important!)
    gsap.registerPlugin(ScrollTrigger);

    const toolCards = gsap.utils.toArray('.highlighted-tool-card');

    toolCards.forEach((card, i) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 50,
                scale: 0.8,
                rotationX: 20 // Slight 3D tilt
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 1,
                ease: "power3.out",
                // Stagger the animation of elements within the grid
                delay: i * 0.15, // Stagger delay based on index
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%", // When the top of the card is 85% down from the top of the viewport
                    end: "bottom 20%",
                    toggleActions: "play none none reverse", // Play on scroll in, reverse on scroll out
                    // markers: true, // Uncomment for debugging scroll trigger positions
                }
            }
        );

        // Optional: Add a subtle continuous animation for the icons or cards themselves
        // This won't be scroll-triggered, but runs perpetually once visible
        gsap.to(card.querySelector('.tool-icon'), {
            y: -5,
            repeat: -1, // Infinite repeat
            yoyo: true, // Go back and forth
            duration: 2,
            ease: "sine.inOut",
            delay: i * 0.2 // Stagger the subtle animation
        });
    });

});