// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

//  New Variables
const hamburgerIcon = document.querySelector('.hamburger-icon');
const closeIcon = document.querySelector('.close-icon');

// Pricing Variable
const pricingButtons = document.querySelectorAll('.pricing-btn');


//  hamburger.addEventListener('click', () => {
//      navLinks.classList.toggle('active');
//  });
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');

    // Toggle between hamburger and close icons
    if (navLinks.classList.contains('active')) {
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
});
//  document.querySelectorAll('.nav-links a').forEach(link => {
//      link.addEventListener('click', () => {
//          navLinks.classList.remove('active');
//      });
//  });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const validationPatterns = {
  name: {
    regex: /^[a-zA-Z\u00C0-\u017F\s'-]{2,50}$/, // Allows international characters and South African names
    error: "Please enter a valid name (2-50 characters, no numbers/special chars)"
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    error: "Please enter a valid email address"
  },
  phone: {
    regex: /^(\+27|0)[6-8][0-9]{8}$/, // South African mobile numbers
    error: "Please enter a valid South African phone number (e.g. +27761234567 or 0712345678)"
  },
  message: {
    regex: /^[\w\s\-.,!?()'"\u00C0-\u017F]{10,500}$/, // Basic message validation
    error: "Message must be 10-500 characters long"
  }
};

// Add this function to validate form fields
function validateField(fieldId, value, isRequired = true) {
  const field = document.getElementById(fieldId);
  const pattern = validationPatterns[fieldId];
  
  if (!pattern) return true; // No validation pattern for this field
  
  if (isRequired && !value.trim()) {
    showToast(`${field.labels[0].textContent} is required`, 'error');
    field.classList.add('error');
    return false;
  }
  
  if (value && !pattern.regex.test(value)) {
    showToast(pattern.error, 'error');
    field.classList.add('error');
    return false;
  }
  
  field.classList.remove('error');
  return true;
}

// Toast Notification System
const toast = document.getElementById('toast');
const closeToast = document.getElementById('closeToast');

function showToast(message = 'Your message has been sent successfully!', type = 'success') {
  const toast = document.getElementById('toast');
  const icon = toast.querySelector('.icon');
  
  // Set icon based on type
  if (type === 'error') {
    toast.classList.add('error');
    icon.className = 'icon fas fa-exclamation-circle';
  } else if (type === 'warning') {
    toast.classList.add('warning');
    icon.className = 'icon fas fa-exclamation-triangle';
  } else {
    toast.classList.remove('error', 'warning');
    icon.className = 'icon fas fa-check-circle';
  }
  
  toast.querySelector('p').textContent = message;
  toast.classList.add('active');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('active');
  }, 5000);
}

closeToast.addEventListener('click', () => {
    toast.classList.remove('active');
});



// Updated form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Validate all fields
  const isValidName = validateField('name', document.getElementById('name').value);
  const isValidEmail = validateField('email', document.getElementById('email').value);
  const isValidPhone = validateField('phone', document.getElementById('phone').value, false); // Phone is optional
  const isValidMessage = validateField('message', document.getElementById('message').value);
  const isValidService = document.getElementById('service').value !== '';

  if (!isValidName || !isValidEmail || !isValidMessage || !isValidService) {
    if (!isValidService) {
      showToast('Please select a service', 'error');
    }
    return;
  }

  // Get form values
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value ? document.getElementById('phone').value.trim() : undefined,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value.trim()
  };

  // Additional spam checks
  if (formData.message.includes('http://') || formData.message.includes('https://')) {
    showToast('Links are not allowed in messages', 'error');
    return;
  }

  if (formData.message.length > 500) {
    showToast('Message is too long (max 500 characters)', 'error');
    return;
  }

  try {
    const response = await fetch('https://designx-server.onrender.com/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    showToast(`Thanks ${formData.name}! We'll contact you soon at ${formData.email}.`);
    contactForm.reset();
  } catch (error) {
    console.error('Submission error:', error);
    showToast(error.message || 'There was an error sending your message.', 'error');
  }
});

// Add real-time validation as users type
document.getElementById('name').addEventListener('blur', function() {
  validateField('name', this.value);
});
document.getElementById('email').addEventListener('blur', function() {
  validateField('email', this.value);
});
document.getElementById('phone').addEventListener('blur', function() {
  if (this.value) validateField('phone', this.value, false);
});
document.getElementById('message').addEventListener('blur', function() {
  validateField('message', this.value);
});


// Pricing Fetched and sent to the Contact form
pricingButtons.forEach(button => {
    button.addEventListener('click', function () {
        const planCard = this.closest('.pricing-card');
        const planName = planCard.querySelector('h3').textContent;
        const price = planCard.querySelector('.amount').textContent;

        // Get all features
        const features = [];
        const featureItems = planCard.querySelectorAll('.features-list li:not(.highlight):not(.note):not(.excluded)');
        featureItems.forEach(item => {
            features.push(item.textContent.trim());
        });

        // Get hosting details
        const hostingItems = planCard.querySelectorAll('.note');
        const hostingDetails = [];
        hostingItems.forEach(item => {
            hostingDetails.push(item.textContent.trim());
        });

        // Create the message
        let messageText = `I'm interested in the ${planName} package (${price}).\n\n`;
        messageText += `Features included:\n`;
        features.forEach(feature => {
            messageText += `- ${feature}\n`;
        });

        messageText += `\nHosting options:\n`;
        hostingDetails.forEach(detail => {
            messageText += `- ${detail}\n`;
        });

        messageText += `\nPlease contact me to discuss this further.`;

        // Set the message
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = messageText;
        }

        // Set service to Web Development
        const serviceDropdown = document.getElementById('service');
        if (serviceDropdown) {
            serviceDropdown.value = 'web-development';
        }
    });
});

// // Toast notification function
// function showToast(message) {
//     // Create toast element if it doesn't exist
//     let toast = document.getElementById('toast-notification');
//     if (!toast) {
//         toast = document.createElement('div');
//         toast.id = 'toast-notification';
//         toast.style.position = 'fixed';
//         toast.style.bottom = '20px';
//         toast.style.right = '20px';
//         toast.style.padding = '15px 20px';
//         toast.style.backgroundColor = '#333';
//         toast.style.color = 'white';
//         toast.style.borderRadius = '5px';
//         toast.style.zIndex = '1000';
//         toast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
//         toast.style.transform = 'translateY(100px)';
//         toast.style.opacity = '0';
//         toast.style.transition = 'all 0.3s ease';
//         document.body.appendChild(toast);
//     }

//     toast.textContent = message;
//     toast.style.transform = 'translateY(0)';
//     toast.style.opacity = '1';

//     // Hide after 5 seconds
//     setTimeout(() => {
//         toast.style.transform = 'translateY(100px)';
//         toast.style.opacity = '0';
//     }, 5000);
// }



// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Add scroll effect to navbar
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
