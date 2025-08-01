// Vercel Analytics - load via CDN instead of ES6 imports
// Will be loaded via script tag in HTML

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Track page view
    trackEvent('page_view', {
        page: 'landing',
        referrer: document.referrer,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
    });

    // Handle navigation clicks
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and submission
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleFormSubmission);
    }

    // Instagram handle formatting
    const instagramInput = document.getElementById('instagram');
    if (instagramInput) {
        instagramInput.addEventListener('input', formatInstagramHandle);
        instagramInput.addEventListener('blur', validateInstagramHandle);
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }

    // Add loading states and animations
    initializeAnimations();
    
    // Header scroll effect
    initializeHeaderScroll();
});

// Form submission handler
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Validate form before submission
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span>Joining waitlist...</span>
    `;
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            instagram: formData.get('instagram'),
            goals: formData.get('goals'),
            timestamp: new Date().toISOString(),
            source: 'landing-page'
        };
        
        // Submit to Supabase via API route
        await submitToWaitlist(data);
        
        // Track successful form submission
        trackEvent('waitlist_signup_success', {
            email: data.email,
            instagram: data.instagram,
            goals_length: data.goals.length,
            source: data.source
        });
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
        
        // Reset form (though user will be redirected)
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Track failed submission
        trackEvent('waitlist_signup_failed', {
            error: error.message,
            email: data.email,
            source: data.source
        });
        
        // Show specific error messages
        if (error.message.includes('already registered')) {
            showErrorMessage('This email is already on our waitlist! Check your inbox for updates.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            showErrorMessage('Network error. Please check your connection and try again.');
        } else {
            showErrorMessage('Something went wrong. Please try again.');
        }
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Submit data to Supabase via API route
async function submitToWaitlist(data) {
    const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
    }

    return result;
}

// Form validation
function validateForm(form) {
    const email = form.querySelector('#email').value;
    const instagram = form.querySelector('#instagram').value;
    const goals = form.querySelector('#goals').value;
    
    // Clear previous errors
    clearFormErrors(form);
    
    let isValid = true;
    
    // Email validation
    if (!validateEmailFormat(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Instagram handle validation
    if (!validateInstagramFormat(instagram)) {
        showFieldError('instagram', 'Please enter a valid Instagram handle (e.g., @username)');
        isValid = false;
    }
    
    if (!goals || goals.trim().length < 10) {
        showFieldError('goals', 'Please provide more details about your goals (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Email format validation
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Instagram handle validation and formatting
function validateInstagramFormat(handle) {
    if (!handle) return false;
    
    // Remove @ if present and validate format
    const cleanHandle = handle.replace('@', '');
    const instagramRegex = /^[a-zA-Z0-9_.]{1,30}$/;
    return instagramRegex.test(cleanHandle);
}

// Format Instagram handle input
function formatInstagramHandle(e) {
    let value = e.target.value;
    
    // Remove any characters that aren't allowed
    value = value.replace(/[^a-zA-Z0-9_.@]/g, '');
    
    // Ensure it starts with @ if user doesn't include it
    if (value && !value.startsWith('@')) {
        value = '@' + value;
    }
    
    // Limit length
    if (value.length > 31) { // 30 characters + @
        value = value.substring(0, 31);
    }
    
    e.target.value = value;
}

// Validate Instagram handle on blur
function validateInstagramHandle(e) {
    const handle = e.target.value;
    if (handle && !validateInstagramFormat(handle)) {
        showFieldError('instagram', 'Please enter a valid Instagram handle');
    } else {
        clearFieldError('instagram');
    }
}

// Validate email on blur
function validateEmail(e) {
    const email = e.target.value;
    if (email && !validateEmailFormat(email)) {
        showFieldError('email', 'Please enter a valid email address');
    } else {
        clearFieldError('email');
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: hsl(0 62.8% 50%);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeInUp 0.3s ease;
    `;
    
    formGroup.appendChild(errorElement);
    
    // Add error styling to field
    field.style.borderColor = 'hsl(0 62.8% 50%)';
    field.style.boxShadow = '0 0 0 2px hsl(0 62.8% 50% / 0.2)';
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset field styling
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// Clear all form errors
function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    const fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

// Show success message
function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: hsl(142 76% 36% / 0.1);
            border: 1px solid hsl(142 76% 36% / 0.3);
            color: hsl(142 76% 40%);
            padding: 1rem;
            border-radius: var(--radius);
            text-align: center;
            margin-bottom: 1rem;
            animation: fadeInUp 0.5s ease;
        ">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <strong>Welcome to the SocialSage waitlist!</strong>
            </div>
            <p style="margin: 0; font-size: 0.875rem;">
                🎉 You'll receive an email confirmation shortly. Early users get extra credits on their free plan!
            </p>
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove success message after 8 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 8000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show error message
function showErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <div style="
            background: hsl(0 62.8% 30.6% / 0.1);
            border: 1px solid hsl(0 62.8% 30.6% / 0.3);
            color: hsl(0 62.8% 50%);
            padding: 1rem;
            border-radius: var(--radius);
            text-align: center;
            margin-bottom: 1rem;
            animation: fadeInUp 0.5s ease;
        ">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <strong>Oops! Something went wrong</strong>
            </div>
            <p style="margin: 0; font-size: 0.875rem;">${message}</p>
        </div>
    `;
    
    const form = document.getElementById('waitlistForm');
    form.parentNode.insertBefore(errorMessage, form);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 5000);
}

// Initialize animations
function initializeAnimations() {
    // Add CSS for spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Header scroll effect
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'hsl(var(--background) / 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 4px 20px hsl(0 0% 0% / 0.1)';
        } else {
            header.style.background = 'hsl(var(--background) / 0.95)';
            header.style.backdropFilter = 'blur(12px)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Generate or get session ID
let sessionId = sessionStorage.getItem('socialsage_session_id');
if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('socialsage_session_id', sessionId);
}

// Utility function to track events with Vercel Analytics and store in DB
async function trackEvent(eventName, properties = {}) {
    // Track with Vercel Analytics (if available)
    if (window.va) {
        window.va('track', eventName, properties);
    }
    
    // Also store in our database
    try {
        await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: eventName,
                page_url: window.location.href,
                properties: {
                    ...properties,
                    timestamp: new Date().toISOString(),
                    page_title: document.title,
                    screen_resolution: `${screen.width}x${screen.height}`,
                    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                    user_language: navigator.language,
                    platform: navigator.platform
                },
                session_id: sessionId
            })
        });
    } catch (error) {
        console.error('Failed to store analytics event:', error);
    }
    
    // Also log for debugging
    console.log('Event tracked:', eventName, properties);
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track form field interactions
    const formFields = document.querySelectorAll('#waitlistForm input, #waitlistForm select, #waitlistForm textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            trackEvent('form_field_focus', { field: field.name });
        });
    });
    
    // Track button clicks
    const ctaButtons = document.querySelectorAll('.btn-hero, .btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('cta_click', { button_text: button.textContent.trim() });
        });
    });
    
    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
});

// Export functions for potential testing
window.SocialSage = {
    validateEmailFormat,
    validateInstagramFormat,
    formatInstagramHandle,
    trackEvent
};