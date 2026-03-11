document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark & Light Mode Theme Toggle with Logo inversion logic (handled mostly via CSS pseudo-selectors, but ensuring JS sets data-theme) ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('khayyam-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('khayyam-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // --- Mobile Navigation Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            mobileIcon.className = 'fas fa-times';
        } else {
            mobileIcon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking a link
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileIcon.className = 'fas fa-bars';
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Balanced Masonry Gallery Layout ---
    const galleryGrid = document.getElementById('galleryGrid');
    let originalGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    // Fisher-Yates Shuffle Function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffle items once on load
    shuffleArray(originalGalleryItems);

    function distributeGallery() {
        if (!galleryGrid) return;
        
        const width = window.innerWidth;
        let numCols = 3;
        if (width <= 600) numCols = 1;
        else if (width <= 900) numCols = 2;

        // Clear and create columns
        galleryGrid.innerHTML = '';
        const columns = [];
        const colHeights = [];
        for (let i = 0; i < numCols; i++) {
            const col = document.createElement('div');
            col.className = 'gallery-col';
            galleryGrid.appendChild(col);
            columns.push(col);
            colHeights.push(0); // Track height of each column
        }

        // Get currently visible items (based on filter)
        const filterBtn = document.querySelector('.filter-btn.active');
        const filterValue = filterBtn ? filterBtn.getAttribute('data-filter') : 'all';
        
        const visibleItems = originalGalleryItems.filter(item => {
            return filterValue === 'all' || item.classList.contains(filterValue);
        });

        // Use Greedy Algorithm for height balancing
        visibleItems.forEach((item) => {
            item.style.display = 'block';
            
            // Find the shortest column
            let shortestIndex = 0;
            let minHeight = colHeights[0];
            for (let i = 1; i < numCols; i++) {
                if (colHeights[i] < minHeight) {
                    minHeight = colHeights[i];
                    shortestIndex = i;
                }
            }

            // Append item to shortest column
            columns[shortestIndex].appendChild(item);
            
            // Estimate height (if not loaded, use a default ratio)
            // Using offsetHeight is ideal but requires the item to be in DOM
            // Since we just appended it, we can get a rough height.
            // If height is 0 (not loaded), we use a placeholder height (say 300)
            const h = item.getBoundingClientRect().height;
            colHeights[shortestIndex] += (h > 0 ? h : 400); 
        });
    }

    // --- Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Re-distribute gallery based on new filter
            distributeGallery();
            
            // Refresh AOS specifically when filtering happens
            setTimeout(() => AOS.refresh(), 100);
        });
    });

    // Initial distribution
    window.addEventListener('load', distributeGallery);
    distributeGallery(); // Run once immediately

    // Re-run after a short delay to account for image loading if 'load' already fired
    setTimeout(distributeGallery, 1000);

    // Re-distribute on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(distributeGallery, 100);
    });

    // --- Initialize AOS ---
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        offset: 50
    });

    // --- Dynamic Copyright Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Back to Top Button Logic ---
    const backToTopBtn = document.getElementById('backToTopBtn');
            
    window.addEventListener('scroll', () => {
        // Show button after scrolling down 400px
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Contact Form Logic: Send to WhatsApp ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const eventType = document.getElementById('eventType').value;
            const message = document.getElementById('message').value.trim();

            // Build WhatsApp message with form details
            const waMessage = `Assalam Alaikum!%0A%0A` +
                `*Name:* ${encodeURIComponent(name)}%0A` +
                `*Phone:* ${encodeURIComponent(phone)}%0A` +
                `*Event Type:* ${encodeURIComponent(eventType)}%0A` +
                `*Message:* ${encodeURIComponent(message)}`;

            const waUrl = `https://wa.me/923437093906?text=${waMessage}`;

            // Open WhatsApp in a new tab
            window.open(waUrl, '_blank');
            contactForm.reset();
        });
    }
});
