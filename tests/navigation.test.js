import { describe, it, expect, beforeEach } from 'vitest';
import { loadHTML } from './test-utils.js';
import { initNavigation } from '../js/main.js';

describe('Navigation Functionality', () => {
  let navToggle, navMenu;

  beforeEach(() => {
    loadHTML();
    initNavigation();
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
  });

  it('nav toggle button has appropriate ARIA attributes', () => {
    expect(navToggle).not.toBeNull();
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navToggle.getAttribute('aria-controls')).toBe('nav-menu');
    expect(navToggle.getAttribute('aria-label')).toBeTruthy();
  });

  it('clicking nav toggle toggles aria-expanded and active class', () => {
    navToggle.click();
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');
    expect(navMenu.classList.contains('is-open')).toBe(true);

    navToggle.click();
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navMenu.classList.contains('is-open')).toBe(false);
  });

  it('pressing Escape key closes the open navigation menu', () => {
    navToggle.click();
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escapeEvent);

    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(navMenu.classList.contains('is-open')).toBe(false);
  });

  it('internal nav links correspond to actual section IDs', () => {
    const navLinks = navMenu.querySelectorAll('a[href^="#"]');
    expect(navLinks.length).toBeGreaterThan(0);
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      expect(targetElement, `Target element #${targetId} for nav link should exist`).not.toBeNull();
    });
  });

  it('clicking a navigation link closes the mobile menu if open', () => {
    navToggle.click();
    expect(navMenu.classList.contains('is-open')).toBe(true);

    const firstLink = navMenu.querySelector('a');
    firstLink.click();

    expect(navMenu.classList.contains('is-open')).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
  });
});
