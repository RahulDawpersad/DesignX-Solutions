     // Improved card flip with click handling
        document.querySelectorAll('.project-card').forEach(card => {
            // Front side elements that shouldn't trigger flip
            const frontSideElements = card.querySelectorAll('.card-front > *');
            
            card.addEventListener('click', function(e) {
                // Check if click was on the view project button
                const isViewProjectBtn = e.target.classList.contains('view-project-btn') || 
                                       e.target.closest('.view-project-btn');
                
                if (!isViewProjectBtn) {
                    // Close other open cards
                    document.querySelectorAll('.project-card').forEach(otherCard => {
                        if (otherCard !== this && otherCard.classList.contains('flipped')) {
                            otherCard.classList.remove('flipped');
                        }
                    });
                    
                    // Toggle current card
                    this.classList.toggle('flipped');
                }
            });
        });

        // Intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });