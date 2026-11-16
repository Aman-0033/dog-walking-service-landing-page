import { describe, it, expect, beforeEach } from 'vitest';
import { loadHTML } from './test-utils.js';
import fs from 'fs';
import path from 'path';

describe('Accessibility Standards & WCAG Compliance', () => {
  beforeEach(() => {
    loadHTML();
  });

  it('all img elements possess a non-null alt attribute', () => {
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  it('all form controls have associated labels or aria-labels', () => {
    const formControls = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    expect(formControls.length).toBeGreaterThan(0);
    formControls.forEach(control => {
      const id = control.getAttribute('id');
      const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby');
      expect(hasAssociatedLabel || hasAriaLabel, `Control ${id || control.name} should have an accessible label`).toBeTruthy();
    });
  });

  it('all buttons have accessible text content or aria-label', () => {
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(button => {
      const text = button.textContent.trim();
      const ariaLabel = button.getAttribute('aria-label');
      expect(text.length > 0 || (ariaLabel && ariaLabel.trim().length > 0), 'Button must have accessible text or aria-label').toBe(true);
    });
  });

  it('CSS file includes :focus-visible rules for keyboard navigation', () => {
    const cssPath = path.resolve(__dirname, '../css/styles.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf-8');
      expect(css).toContain(':focus-visible');
    }
  });

  it('CSS file includes prefers-reduced-motion media query', () => {
    const cssPath = path.resolve(__dirname, '../css/styles.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf-8');
      expect(css).toContain('prefers-reduced-motion');
    }
  });

  it('CSS contains the strict monochromatic color system tokens', () => {
    const cssPath = path.resolve(__dirname, '../css/styles.css');
    if (fs.existsSync(cssPath)) {
      const css = fs.readFileSync(cssPath, 'utf-8');
      expect(css).toContain('#171717');
      expect(css).toContain('#666666');
      expect(css).toContain('#F5F5F5');
      expect(css).toContain('#E5E5E5');
    }
  });
});
