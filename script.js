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

    // --- Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block'; // Ensure it's part of the flow for masonry
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Refresh AOS specifically when filtering happens so layout triggers properly
            setTimeout(() => AOS.refresh(), 50);
        });
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

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic UI feedback since there is no backend
            alert('Thank you for reaching out! We will contact you on WhatsApp shortly.');
            contactForm.reset();
        });
    }
});
