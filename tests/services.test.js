import { describe, it, expect, beforeEach } from 'vitest';
import { loadHTML } from './test-utils.js';
import { initServices } from '../js/main.js';

describe('Dog Walking Services & Filter / Empty State', () => {
  let searchInput, filterButtons, servicesGrid, emptyState, resultsCount;

  beforeEach(() => {
    loadHTML();
    initServices();
    searchInput = document.getElementById('service-search');
    filterButtons = document.querySelectorAll('.service-filter-btn');
    servicesGrid = document.getElementById('services-grid');
    emptyState = document.getElementById('services-empty-state');
    resultsCount = document.getElementById('services-count');
  });

  it('renders all services by default', () => {
    const cards = servicesGrid.querySelectorAll('.service-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(emptyState.hidden).toBe(true);
    expect(resultsCount.textContent).toContain(cards.length.toString());
  });

  it('filters services when category button is clicked', () => {
    const soloBtn = Array.from(filterButtons).find(btn => btn.dataset.category === 'solo');
    expect(soloBtn).toBeDefined();

    soloBtn.click();
    expect(soloBtn.getAttribute('aria-pressed')).toBe('true');

    const cards = servicesGrid.querySelectorAll('.service-card:not([hidden])');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.dataset.category).toBe('solo');
    });
  });

  it('filters services by search query in title or description', () => {
    searchInput.value = 'puppy';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    const cards = servicesGrid.querySelectorAll('.service-card:not([hidden])');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      expect(text).toContain('puppy');
    });
  });

  it('displays "No data found" empty state when no services match', () => {
    searchInput.value = 'nonexistent_service_query_xyz';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    const visibleCards = servicesGrid.querySelectorAll('.service-card:not([hidden])');
    expect(visibleCards.length).toBe(0);
    expect(emptyState.hidden).toBe(false);
    expect(emptyState.textContent).toContain('No data found');
  });

  it('restores all services when reset button is clicked in empty state', () => {
    searchInput.value = 'nonexistent_query';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(emptyState.hidden).toBe(false);

    const resetBtn = document.getElementById('services-reset-btn');
    expect(resetBtn).not.toBeNull();
    resetBtn.click();

    const visibleCards = servicesGrid.querySelectorAll('.service-card:not([hidden])');
    expect(visibleCards.length).toBeGreaterThan(0);
    expect(emptyState.hidden).toBe(true);
    expect(searchInput.value).toBe('');
  });
});
