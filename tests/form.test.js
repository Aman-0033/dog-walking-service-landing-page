import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadHTML } from './test-utils.js';
import { initContactForm } from '../js/main.js';

describe('Contact & Enquiry Form Validation, Loading, and Network States', () => {
  let form, nameInput, emailInput, phoneInput, dogInput, serviceSelect, submitBtn, successAlert, errorAlert;

  beforeEach(() => {
    loadHTML();
    initContactForm();
    form = document.getElementById('contact-form');
    nameInput = document.getElementById('owner-name');
    emailInput = document.getElementById('owner-email');
    phoneInput = document.getElementById('owner-phone');
    dogInput = document.getElementById('dog-name');
    serviceSelect = document.getElementById('service-select');
    submitBtn = document.getElementById('form-submit-btn');
    successAlert = document.getElementById('form-success-alert');
    errorAlert = document.getElementById('form-error-alert');
  });

  it('prevents submission and displays field errors when fields are empty', () => {
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    expect(phoneInput.getAttribute('aria-invalid')).toBe('true');
    expect(dogInput.getAttribute('aria-invalid')).toBe('true');

    const nameError = document.getElementById('owner-name-error');
    expect(nameError.textContent.trim().length).toBeGreaterThan(0);
    expect(nameInput.getAttribute('aria-describedby')).toContain('owner-name-error');
  });

  it('validates email format and displays error for malformed email', () => {
    nameInput.value = 'John Doe';
    emailInput.value = 'invalid-email-address';
    phoneInput.value = '+1 555-123-4567';
    dogInput.value = 'Barnaby';
    serviceSelect.value = 'solo-walk';

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    const emailError = document.getElementById('owner-email-error');
    expect(emailError.textContent.toLowerCase()).toContain('valid email');
  });

  it('validates phone format and displays error for malformed phone', () => {
    nameInput.value = 'John Doe';
    emailInput.value = 'john@example.com';
    phoneInput.value = '12'; // too short
    dogInput.value = 'Barnaby';
    serviceSelect.value = 'solo-walk';

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(phoneInput.getAttribute('aria-invalid')).toBe('true');
    const phoneError = document.getElementById('owner-phone-error');
    expect(phoneError.textContent.toLowerCase()).toContain('phone');
  });

  it('clears error on input when user corrects a field', () => {
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(nameInput.getAttribute('aria-invalid')).toBe('true');

    nameInput.value = 'Jane Doe';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(nameInput.getAttribute('aria-invalid')).toBe('false');
    const nameError = document.getElementById('owner-name-error');
    expect(nameError.textContent).toBe('');
  });

  it('shows loading state during async submission and displays success message upon completion', async () => {
    nameInput.value = 'Jane Doe';
    emailInput.value = 'jane@example.com';
    phoneInput.value = '555-123-4567';
    dogInput.value = 'Charlie';
    serviceSelect.value = 'solo-walk';

    const submitPromise = new Promise(resolve => {
      form.addEventListener('form-submission-complete', resolve, { once: true });
    });

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    // During async operation, button should show loading state
    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.getAttribute('aria-busy')).toBe('true');

    await submitPromise;

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.getAttribute('aria-busy')).toBe('false');
    expect(successAlert.hidden).toBe(false);
    expect(successAlert.textContent).toContain('Charlie');
  });

  it('handles simulated network failure and provides retry functionality', async () => {
    const networkFailCheckbox = document.getElementById('simulate-network-error');
    if (networkFailCheckbox) {
      networkFailCheckbox.checked = true;
    }

    nameInput.value = 'Jane Doe';
    emailInput.value = 'jane@example.com';
    phoneInput.value = '555-123-4567';
    dogInput.value = 'Charlie';
    serviceSelect.value = 'solo-walk';

    const submitPromise = new Promise(resolve => {
      form.addEventListener('form-submission-complete', resolve, { once: true });
    });

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    await submitPromise;

    expect(errorAlert.hidden).toBe(false);
    expect(errorAlert.textContent.toLowerCase()).toContain('network');

    const retryBtn = document.getElementById('form-retry-btn');
    expect(retryBtn).not.toBeNull();

    // Now uncheck failure and test retry button
    if (networkFailCheckbox) {
      networkFailCheckbox.checked = false;
    }

    const retryPromise = new Promise(resolve => {
      form.addEventListener('form-submission-complete', resolve, { once: true });
    });

    retryBtn.click();
    await retryPromise;

    expect(errorAlert.hidden).toBe(true);
    expect(successAlert.hidden).toBe(false);
  });
});
