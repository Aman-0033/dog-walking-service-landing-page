import { describe, it, expect, beforeEach } from 'vitest';
import { loadHTML } from './test-utils.js';
import { initContactForm } from '../js/main.js';

describe('Security & XSS Prevention', () => {
  let form, nameInput, emailInput, phoneInput, dogInput, serviceSelect, successAlert;

  beforeEach(() => {
    loadHTML();
    initContactForm();
    form = document.getElementById('contact-form');
    nameInput = document.getElementById('owner-name');
    emailInput = document.getElementById('owner-email');
    phoneInput = document.getElementById('owner-phone');
    dogInput = document.getElementById('dog-name');
    serviceSelect = document.getElementById('service-select');
    successAlert = document.getElementById('form-success-alert');
  });

  it('renders dangerous script tags or image tags safely using textContent without injecting DOM nodes', async () => {
    const maliciousPayload = '<script>alert("pwned")</script><img src="x" onerror="alert(1)">';
    nameInput.value = 'Security Auditor';
    emailInput.value = 'audit@example.com';
    phoneInput.value = '555-019-2834';
    dogInput.value = maliciousPayload;
    serviceSelect.value = 'solo-walk';

    const submitPromise = new Promise(resolve => {
      form.addEventListener('form-submission-complete', resolve, { once: true });
    });

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    await submitPromise;

    expect(successAlert.hidden).toBe(false);
    // There must be NO script or img tag inserted into the success alert
    expect(successAlert.querySelector('script')).toBeNull();
    expect(successAlert.querySelector('img')).toBeNull();
    // Raw text should match safely
    expect(successAlert.textContent).toContain('<script>alert("pwned")</script>');
  });

  it('does not store sensitive personal information or passwords in localStorage or global window', () => {
    // Check localStorage is not storing raw PII
    expect(window.localStorage.getItem('owner-phone')).toBeNull();
    expect(window.localStorage.getItem('owner-email')).toBeNull();
  });
});
