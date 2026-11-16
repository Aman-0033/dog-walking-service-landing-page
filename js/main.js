import { servicesData } from './services-data.js';

/**
 * Global Analytics Tracker
 * Strictly outputs the required compliance log without exposing any PII.
 */
export function trackInteraction(actionName) {
  // Pure anonymized logging per specification
  console.log('[Analytics] User interacted with Static Landing Page');
}

/**
 * Navigation Module
 * Provides accessible mobile toggle, keyboard traps, escape handling, and smooth scrolling.
 */
export function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a[href^="#"]') : [];

  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    document.body.classList.remove('menu-locked');
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    document.body.classList.add('menu-locked');
  }

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  // Close menu and navigate when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Track primary hero CTA if present
  const heroPrimaryCta = document.getElementById('hero-primary-cta');
  if (heroPrimaryCta) {
    heroPrimaryCta.addEventListener('click', () => {
      trackInteraction('hero-cta-click');
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
        backToTopBtn.removeAttribute('hidden');
      } else {
        backToTopBtn.classList.remove('is-visible');
        backToTopBtn.setAttribute('hidden', '');
      }
    });
  }
}

/**
 * Services Module
 * Dynamic rendering, category filtering, keyword searching, and empty state management.
 */
export function initServices() {
  const servicesGrid = document.getElementById('services-grid');
  const searchInput = document.getElementById('service-search');
  const filterButtons = document.querySelectorAll('.service-filter-btn');
  const emptyState = document.getElementById('services-empty-state');
  const resultsCount = document.getElementById('services-count');
  const resetBtn = document.getElementById('services-reset-btn');

  if (!servicesGrid) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Render cards initially
  renderServiceCards();

  function renderServiceCards() {
    servicesGrid.innerHTML = '';
    servicesData.forEach(service => {
      const card = document.createElement('article');
      card.className = 'service-card';
      card.dataset.category = service.category;
      card.dataset.id = service.id;

      card.innerHTML = `
        <div class="service-card-media">
          <img src="${service.image}" alt="${service.alt}" loading="lazy" class="service-img" />
          <span class="service-badge">${service.badge}</span>
        </div>
        <div class="service-card-content">
          <div class="service-header">
            <h3 class="service-title">${service.title}</h3>
            <span class="service-duration">${service.duration}</span>
          </div>
          <p class="service-desc">${service.description}</p>
          <ul class="service-highlights" aria-label="Service highlights">
            ${service.highlights.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <div class="service-action">
            <a href="#contact" class="btn btn-secondary service-book-link" data-service="${service.id}">
              Select Service
            </a>
          </div>
        </div>
      `;

      servicesGrid.appendChild(card);
    });

    // Wire up individual "Select Service" buttons
    const bookLinks = servicesGrid.querySelectorAll('.service-book-link');
    bookLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const serviceSelect = document.getElementById('service-select');
        const serviceId = link.getAttribute('data-service');
        if (serviceSelect && serviceId) {
          serviceSelect.value = serviceId;
        }
        trackInteraction('service-select-click');
      });
    });

    applyFilters();
  }

  function applyFilters() {
    const cards = servicesGrid.querySelectorAll('.service-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardText = card.textContent.toLowerCase();
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.removeAttribute('hidden');
        card.style.display = '';
        visibleCount++;
      } else {
        card.setAttribute('hidden', '');
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} service${visibleCount === 1 ? '' : 's'} available`;
    }

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.hidden = false;
        emptyState.removeAttribute('hidden');
        emptyState.style.display = 'block';
      } else {
        emptyState.hidden = true;
        emptyState.setAttribute('hidden', '');
        emptyState.style.display = 'none';
      }
    }
  }

  // Category filter clicks
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      activeCategory = btn.dataset.category;
      applyFilters();
      trackInteraction('category-filter-change');
    });
  });

  // Search input with debounce-friendly dispatch
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Reset button in empty state
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      activeCategory = 'all';
      filterButtons.forEach(b => {
        const isAll = b.dataset.category === 'all';
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
      applyFilters();
    });
  }
}

/**
 * Contact & Enquiry Form Module
 * Validates fields, manages accessible states, simulates network calls, and protects against XSS.
 */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('owner-name');
  const emailInput = document.getElementById('owner-email');
  const phoneInput = document.getElementById('owner-phone');
  const dogInput = document.getElementById('dog-name');
  const serviceSelect = document.getElementById('service-select');
  const submitBtn = document.getElementById('form-submit-btn');
  const successAlert = document.getElementById('form-success-alert');
  const errorAlert = document.getElementById('form-error-alert');
  const retryBtn = document.getElementById('form-retry-btn');
  const simulateFailCheckbox = document.getElementById('simulate-network-error');

  const fields = [
    {
      input: nameInput,
      errorId: 'owner-name-error',
      validate: (val) => val.trim().length >= 2 ? null : 'Please enter your full name (minimum 2 characters).'
    },
    {
      input: emailInput,
      errorId: 'owner-email-error',
      validate: (val) => {
        if (!val.trim()) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim()) ? null : 'Please enter a valid email address.';
      }
    },
    {
      input: phoneInput,
      errorId: 'owner-phone-error',
      validate: (val) => {
        if (!val.trim()) return 'Please enter your phone number.';
        const digitsOnly = val.replace(/\D/g, '');
        return digitsOnly.length >= 7 ? null : 'Please enter a valid phone number (minimum 7 digits).';
      }
    },
    {
      input: dogInput,
      errorId: 'dog-name-error',
      validate: (val) => val.trim().length >= 1 ? null : "Please enter your dog's name."
    },
    {
      input: serviceSelect,
      errorId: 'service-select-error',
      validate: (val) => val && val.trim().length > 0 ? null : 'Please select a walking service.'
    }
  ];

  function validateField(field) {
    if (!field.input) return true;
    const errorMsg = field.validate(field.input.value);
    const errorEl = document.getElementById(field.errorId);

    if (errorMsg) {
      field.input.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = errorMsg;
      }
      field.input.setAttribute('aria-describedby', field.errorId);
      return false;
    } else {
      field.input.setAttribute('aria-invalid', 'false');
      if (errorEl) {
        errorEl.textContent = '';
      }
      return true;
    }
  }

  // Clear validation error on user input
  fields.forEach(field => {
    if (field.input) {
      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
      field.input.addEventListener('blur', () => {
        if (field.input.value.trim().length > 0) {
          validateField(field);
        }
      });
    }
  });

  async function processSubmission() {
    let hasError = false;
    let firstInvalidInput = null;

    fields.forEach(field => {
      const isValid = validateField(field);
      if (!isValid && !firstInvalidInput) {
        firstInvalidInput = field.input;
        hasError = true;
      }
    });

    if (hasError) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="spinner" aria-hidden="true"></span>
      <span>Submitting Enquiry...</span>
    `;

    if (errorAlert) {
      errorAlert.hidden = true;
      errorAlert.setAttribute('hidden', '');
    }

    // Simulate async network request
    const isSimulatedFailure = simulateFailCheckbox && simulateFailCheckbox.checked;

    const asyncDelay = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' ? 50 : 600;
    await new Promise(resolve => setTimeout(resolve, asyncDelay));

    submitBtn.disabled = false;
    submitBtn.setAttribute('aria-busy', 'false');
    submitBtn.innerHTML = originalBtnContent;

    if (isSimulatedFailure) {
      // Handle Network Error
      if (errorAlert) {
        errorAlert.hidden = false;
        errorAlert.removeAttribute('hidden');
        errorAlert.focus();
      }
      form.dispatchEvent(new CustomEvent('form-submission-complete', { detail: { success: false } }));
    } else {
      // Handle Successful Submission
      const userDogName = dogInput ? dogInput.value.trim() : 'your companion';

      if (successAlert) {
        successAlert.hidden = false;
        successAlert.removeAttribute('hidden');

        // SECURITY: Render user text strictly via textContent, never innerHTML
        const successMessageEl = successAlert.querySelector('.success-message');
        if (successMessageEl) {
          successMessageEl.textContent = `Thank you! We have received your consultation enquiry for ${userDogName}. A certified senior walker will contact you within 2 business hours.`;
        } else {
          successAlert.textContent = `Thank you! We have received your consultation enquiry for ${userDogName}. A certified senior walker will contact you within 2 business hours.`;
        }
        successAlert.focus();
      }

      // Track analytics safely
      trackInteraction('contact-form-submission');

      // Reset form fields
      form.reset();
      fields.forEach(field => {
        if (field.input) field.input.removeAttribute('aria-invalid');
      });

      form.dispatchEvent(new CustomEvent('form-submission-complete', { detail: { success: true } }));
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processSubmission();
  });

  if (retryBtn) {
    retryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      processSubmission();
    });
  }
}

// Auto-initialize when loaded directly in the browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initServices();
    initContactForm();
  });
}
