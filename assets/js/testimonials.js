document.addEventListener('DOMContentLoaded', function () {
    // Testimonial data
    const testimonials = [
        {
            name: "Sarah Johnson",
            position: "CEO, TechSolutions Inc.",
            text: "Working with this team has been transformative for our business. Their innovative approach and attention to detail resulted in a 40% increase in our online engagement.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 5
        },
        {
            name: "Michael Chen",
            position: "Marketing Director, Global Corp",
            text: "The level of professionalism and expertise is unmatched. They delivered our project ahead of schedule while exceeding all our expectations. Truly a pleasure to work with.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            position: "Founder, Creative Minds",
            text: "From the initial consultation to the final delivery, every step was handled with care and precision. Our website traffic has doubled since launch!",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 4
        },
        {
            name: "David Kim",
            position: "Product Manager, Innovate Co.",
            text: "Their team understood our vision perfectly and brought it to life in ways we couldn't have imagined. The results speak for themselves - our conversion rates are up by 35%.",
            image: "https://randomuser.me/api/portraits/men/75.jpg",
            rating: 5
        }
    ];

    const sliderContainer = document.querySelector('.slider-container');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentSlide = 0;

    // Create testimonial items
    function createTestimonials() {
        testimonials.forEach((testimonial, index) => {
            // Create testimonial item
            const testimonialItem = document.createElement('div');
            testimonialItem.classList.add('testimonial-item');
            if (index === 0) testimonialItem.classList.add('active');

            // Create rating stars
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < testimonial.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }

            testimonialItem.innerHTML = `
                <img src="${testimonial.image}" alt="${testimonial.name}" class="client-image">
                <div class="rating">${stars}</div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <h4 class="client-name">${testimonial.name}</h4>
                <p class="client-position">${testimonial.position}</p>
            `;

            sliderContainer.appendChild(testimonialItem);

            // Create dots
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);

            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }

    // Add this to your existing script.js
    function handleResize() {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        let maxHeight = 0;

        // Reset all heights first
        testimonialItems.forEach(item => {
            item.style.minHeight = '0';
        });

        // Find the tallest item
        testimonialItems.forEach(item => {
            if (item.offsetHeight > maxHeight) {
                maxHeight = item.offsetHeight;
            }
        });

        // Set all items to the same height
        testimonialItems.forEach(item => {
            item.style.minHeight = `${maxHeight}px`;
        });
    }

    // Initialize and add resize listener
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    // Go to specific slide
    function goToSlide(index) {
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dots = document.querySelectorAll('.dot');

        // Update current slide
        currentSlide = index;

        // Update testimonial items
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active', 'prev', 'next');

            if (i === currentSlide) {
                item.classList.add('active');
            } else if (i < currentSlide) {
                item.classList.add('prev');
            } else {
                item.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlide) dot.classList.add('active');
        });
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        goToSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        goToSlide(currentSlide);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Auto-rotate (optional)
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });



    // Initialize
    createTestimonials();
});