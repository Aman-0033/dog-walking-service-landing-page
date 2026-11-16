import { describe, it, expect, beforeEach } from 'vitest';
import { loadHTML } from './test-utils.js';

describe('Page Structure & Semantic HTML', () => {
  beforeEach(() => {
    loadHTML();
  });

  it('has semantic landmarks: header, nav, main, sections, footer', () => {
    expect(document.querySelector('header')).not.toBeNull();
    expect(document.querySelector('nav')).not.toBeNull();
    expect(document.querySelector('main#main-content')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
  });

  it('includes a skip-to-content link pointing to #main-content', () => {
    const skipLink = document.querySelector('a.skip-link');
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('contains all required sections: hero, about, services, how-it-works, why-choose-us, testimonials, contact', () => {
    const requiredSections = [
      'hero',
      'about',
      'services',
      'how-it-works',
      'why-choose-us',
      'testimonials',
      'contact'
    ];
    requiredSections.forEach(id => {
      const section = document.getElementById(id);
      expect(section, `Section with id #${id} should exist`).not.toBeNull();
    });
  });

  it('has a valid heading hierarchy with exactly one h1 and appropriate h2 elements', () => {
    const h1s = document.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent.trim().length).toBeGreaterThan(0);

    const h2s = document.querySelectorAll('h2');
    expect(h2s.length).toBeGreaterThanOrEqual(6);
  });

  it('has essential meta tags: charset, viewport, description, and title', () => {
    expect(document.querySelector('meta[charset]')).not.toBeNull();
    expect(document.querySelector('meta[name="viewport"]')).not.toBeNull();
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content').trim().length).toBeGreaterThan(0);
    expect(document.title.trim().length).toBeGreaterThan(0);
  });
});
