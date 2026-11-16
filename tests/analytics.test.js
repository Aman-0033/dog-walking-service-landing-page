import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadHTML } from './test-utils.js';
import { initNavigation, initServices, initContactForm, trackInteraction } from '../js/main.js';

describe('Analytics Logging', () => {
  let consoleSpy;

  beforeEach(() => {
    loadHTML();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    initNavigation();
    initServices();
    initContactForm();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('trackInteraction logs exact analytics message', () => {
    trackInteraction('test-action');
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] User interacted with Static Landing Page');
  });

  it('logs analytics message when primary hero CTA is clicked', () => {
    const heroCta = document.getElementById('hero-primary-cta');
    expect(heroCta).not.toBeNull();
    heroCta.click();

    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] User interacted with Static Landing Page');
  });

  it('logs analytics message when service category filter is clicked', () => {
    const filterBtn = document.querySelector('.service-filter-btn[data-category="solo"]');
    expect(filterBtn).not.toBeNull();
    filterBtn.click();

    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] User interacted with Static Landing Page');
  });

  it('logs analytics message upon successful form submission and does not leak PII', async () => {
    const form = document.getElementById('contact-form');
    document.getElementById('owner-name').value = 'Confidential Person';
    document.getElementById('owner-email').value = 'secret@example.com';
    document.getElementById('owner-phone').value = '555-888-9999';
    document.getElementById('dog-name').value = 'SecretPup';
    document.getElementById('service-select').value = 'solo-walk';

    const submitPromise = new Promise(resolve => {
      form.addEventListener('form-submission-complete', resolve, { once: true });
    });

    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    await submitPromise;

    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] User interacted with Static Landing Page');

    // Verify none of the console.log calls contained PII
    consoleSpy.mock.calls.forEach(callArgs => {
      const allArgsText = callArgs.map(String).join(' ');
      expect(allArgsText).not.toContain('secret@example.com');
      expect(allArgsText).not.toContain('555-888-9999');
      expect(allArgsText).not.toContain('Confidential Person');
    });
  });
});
