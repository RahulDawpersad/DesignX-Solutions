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

// Toast Notification System
const toast = document.getElementById('toast');
const closeToast = document.getElementById('closeToast');

function showToast(message = 'Your message has been sent successfully!', type = 'success') {
  const toast = document.getElementById('toast');
  const toastIcon = toast.querySelector('.icon');
  const toastContent = toast.querySelector('.toast-content h3');

  // Set icon and color based on type
  if (type === 'error') {
    toast.classList.add('error');
    toastIcon.className = 'fas fa-exclamation-circle icon';
    toastContent.textContent = 'Error';
  } else if (type === 'warning') {
    toast.classList.add('warning');
    toastIcon.className = 'fas fa-exclamation-triangle icon';
    toastContent.textContent = 'Warning';
  } else {
    toast.classList.remove('error', 'warning');
    toastIcon.className = 'fas fa-check-circle icon';
    toastContent.textContent = 'Success!';
  }

  // Set message (handles HTML line breaks)
  toast.querySelector('.toast-content p').innerHTML = message;
  toast.classList.add('active');

  // Auto-hide after 5 seconds (or longer for errors)
  setTimeout(() => {
    toast.classList.remove('active');
  }, type === 'error' ? 8000 : 5000);
}

closeToast.addEventListener('click', () => {
  toast.classList.remove('active');
});




function validateFormFields(formData) {
  const errors = [];

  // Name validation (2-50 characters, only letters, spaces, and apostrophes)
  const nameRegex = /^[a-zA-ZÀ-ÿ]+(?:[ '][a-zA-ZÀ-ÿ]+)*$/;
  if (!nameRegex.test(formData.name) || formData.name.length < 2 || formData.name.length > 50) {
    errors.push('Please enter a valid full name (2-50 characters, only letters, spaces, and apostrophes allowed)');
  }

  // Email validation with strict known TLDs only
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|co\.za|edu|gov|za|biz|info)$/i;
  if (
    !emailRegex.test(formData.email) ||
    formData.email.includes('..') ||
    formData.email.endsWith('.') ||
    formData.email.indexOf('@') !== formData.email.lastIndexOf('@') // Only one @ allowed
  ) {
    errors.push('Please enter a valid email address (e.g., name@domain.com)');
  }

  // Phone number validation and formatting (South Africa)
  if (formData.phone) {
    const digitsOnly = formData.phone.replace(/\D/g, '');
    let isValid = false;
    let formattedPhone = '';

    if (digitsOnly.startsWith('27') && digitsOnly.length === 11) {
      // +27 format
      isValid = /^27[6-8]\d{8}$/.test(digitsOnly);
      formattedPhone = `+${digitsOnly.substring(0, 2)} ${digitsOnly.substring(2, 5)} ${digitsOnly.substring(5, 8)} ${digitsOnly.substring(8)}`;
    } else if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
      // 0 format
      isValid = /^0[6-8]\d{8}$/.test(digitsOnly);
      formattedPhone = `${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 6)} ${digitsOnly.substring(6)}`;
    }

    if (!isValid) {
      errors.push('Please enter a valid South African phone number (e.g., +27 65 824 3463 or 065 824 3463)');
    } else {
      document.getElementById('phone').value = formattedPhone;
    }
  }

  // Service validation
  if (!formData.service) {
    errors.push('Please select a service');
  }

  // Message validation (minimum 10 characters)
  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Please enter a message with at least 10 characters');
  }

  return errors;
}



// Updated form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get form values
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value ? document.getElementById('phone').value.trim() : undefined,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value.trim()
  };

  // Validate fields
  const validationErrors = validateFormFields(formData);

  if (validationErrors.length > 0) {
    showToast(validationErrors.join('<br>'), 'error');
    return;
  }

  try {
    // Update this URL to your Render backend URL
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
