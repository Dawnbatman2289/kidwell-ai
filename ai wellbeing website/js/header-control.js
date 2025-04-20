// Add this new JavaScript file for header control
class HeaderController {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.initialized = false;
        this.hideTimeout = null;
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
    }

    init() {
        if (this.initialized) return;
        
        // Scroll event listener
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateHeaderVisibility();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });

        // Mouse move event listener
        document.addEventListener('mousemove', this.mouseMoveHandler);

        this.initialized = true;
    }

    handleMouseMove(event) {
        // Show header when mouse is near the top of the screen (within 100px)
        if (event.clientY <= 100) {
            this.header.classList.remove('header-hidden');
            
            // Clear any existing timeout
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }
        } else {
            // Hide header after a delay if mouse moves away
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }
            this.hideTimeout = setTimeout(() => {
                if (event.clientY > 100) {
                    this.header.classList.add('header-hidden');
                }
            }, 2000); // 2 second delay before hiding
        }
    }

    updateHeaderVisibility() {
        // Only hide header with scroll if mouse isn't near the top
        if (document.querySelector(':hover')?.closest('.header')) {
            return;
        }

        if (window.scrollY > this.lastScrollY) {
            // Scrolling down
            this.header.classList.add('header-hidden');
        } else {
            // Scrolling up
            this.header.classList.remove('header-hidden');
        }
    }
}

// Initialize header controller
const headerController = new HeaderController();
headerController.init();

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 19);
    document.getElementById('current-time').textContent = formattedDate;
}

// Update time every second
setInterval(updateCurrentTime, 1000);