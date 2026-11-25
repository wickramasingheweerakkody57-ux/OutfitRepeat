/* ==========================================================================
   OutfitRepeat — Interactive Digital Wardrobe & Clothing Planner
   Luxury Fashion Technology Platform (Vanilla JavaScript ES6+)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Storage Keys
  const STORAGE = {
    items: 'outfitrepeat_items_v2',
    favourites: 'outfitrepeat_favs_v2',
    history: 'outfitrepeat_history_v2'
  };

  // Curated Luxury Editorial Sample Wardrobe
  const sampleWardrobe = [
    {
      id: 1,
      name: 'Ivory Oversized Linen Shirt',
      category: 'Tops',
      color: 'Ivory / Cream',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 2,
      name: 'Ribbed Cashmere Turtleneck',
      category: 'Tops',
      color: 'Oatmeal',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 3,
      name: 'Tailored Wide-Leg Camel Trousers',
      category: 'Bottoms',
      color: 'Camel / Tan',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 4,
      name: 'Pleated Silk Satin Midi Skirt',
      category: 'Bottoms',
      color: 'Champagne',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 5,
      name: 'Minimalist Knit Column Dress',
      category: 'Dresses',
      color: 'Natural Beige',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 6,
      name: 'Tiered Linen Day Dress',
      category: 'Dresses',
      color: 'White',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 7,
      name: 'Square-Toe Leather Heeled Mules',
      category: 'Shoes',
      color: 'Espresso Black',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 8,
      name: 'Handcrafted Penny Loafers',
      category: 'Shoes',
      color: 'Cognac Brown',
      image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 9,
      name: 'Structured Calfskin Leather Tote',
      category: 'Accessories',
      color: 'Warm Tan',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 10,
      name: 'Tortoiseshell Acetate Sunglasses',
      category: 'Accessories',
      color: 'Amber Havana',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80'
    }
  ];

  // Sample initial favourites & wear history for demonstrative luxury experience
  const sampleFavourites = [
    {
      id: 1700000001,
      name: 'Elevated Monochromatic Daywear',
      items: [sampleWardrobe[0], sampleWardrobe[2], sampleWardrobe[6], sampleWardrobe[8]],
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 1700000002,
      name: 'Cashmere & Silk Evening Edit',
      items: [sampleWardrobe[1], sampleWardrobe[3], sampleWardrobe[6], sampleWardrobe[9]],
      date: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];

  const sampleHistory = [
    {
      id: 1700000010,
      items: [sampleWardrobe[0], sampleWardrobe[2], sampleWardrobe[7], sampleWardrobe[8]],
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 1700000011,
      items: [sampleWardrobe[4], sampleWardrobe[6], sampleWardrobe[9]],
      date: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  // Safely read from localStorage with fallback
  const readStore = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return fallback;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      console.warn(`[OutfitRepeat] Storage read error for ${key}:`, e);
      return fallback;
    }
  };

  // State
  let wardrobe = readStore(STORAGE.items, sampleWardrobe);
  let favourites = readStore(STORAGE.favourites, sampleFavourites);
  let history = readStore(STORAGE.history, sampleHistory);

  // 4 Visual Outfit Slots: Top, Bottom, Shoes, Accessories
  let activeSlots = {
    Top: null,
    Bottom: null,
    Shoes: null,
    Accessories: null
  };

  let currentWardrobeFilter = 'all';
  let currentSearchQuery = '';
  let currentPickerCategory = 'Tops';
  let toastTimer = null;

  // DOM Query Helpers
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Key Elements
  const wardrobeGrid = $('#wardrobe-grid');
  const wardrobeSearch = $('#wardrobe-search');
  const searchClear = $('#search-clear');
  const pickerGrid = $('#picker-grid');
  const favouritesGrid = $('#favourites-grid');
  const historyTimeline = $('#history-timeline');
  const modal = $('#add-item-modal');
  const itemForm = $('#add-item-form');
  const imageFileInput = $('#item-image-file');
  const imageUrlInput = $('#item-image');
  const imagePreview = $('#image-preview');
  const previewEmpty = $('#preview-empty');

  // Persistence to LocalStorage
  function persist() {
    try {
      localStorage.setItem(STORAGE.items, JSON.stringify(wardrobe));
      localStorage.setItem(STORAGE.favourites, JSON.stringify(favourites));
      localStorage.setItem(STORAGE.history, JSON.stringify(history));
    } catch (err) {
      console.error('[OutfitRepeat] Storage write error:', err);
      showToast('Storage quota exceeded. Consider using smaller photo sizes.');
    }
  }

  // Toast Notification
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // HTML Sanitization
  function escapeHTML(str = '') {
    return String(str).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  // Format Dates
  function formatDate(isoStr) {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatDayNumber(isoStr) {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '01';
    return String(date.getDate()).padStart(2, '0');
  }

  // Navigation Logic
  function navigate(page) {
    const target = $(`#page-${page}`);
    if (!target) return;

    $$('.page-section').forEach(sec => sec.classList.toggle('active', sec === target));
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === page));

    // Close mobile nav drawer if open
    $('#main-nav').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');

    window.location.hash = page;

    // Trigger page-specific refreshes
    if (page === 'wardrobe') renderWardrobe();
    if (page === 'planner') {
      renderPicker(currentPickerCategory);
      renderCanvas();
    }
    if (page === 'favourites') renderFavourites();
    if (page === 'history') renderHistory();
    if (page === 'dashboard') updateAnalytics();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Wire all navigation triggers (nav links, buttons, links)
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-page]');
    if (trigger) {
      e.preventDefault();
      navigate(trigger.dataset.page);
    }
  });

  // Mobile menu toggle
  $('#menu-toggle').addEventListener('click', () => {
    const nav = $('#main-nav');
    const open = nav.classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
  });

  // Sign In prototype placeholder feedback
  $('#auth-btn').addEventListener('click', () => {
    showToast('OutfitRepeat is currently in private atelier mode. Your data is saved locally.');
  });

  // Helper: Empty State UI
  function emptyStateHTML(title, description, actionText = null, actionPage = null) {
    return `
      <div class="empty-state">
        <span class="empty-mark">✧</span>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
        ${actionText && actionPage ? `<button class="btn btn-outline nav-trigger" data-page="${actionPage}">${escapeHTML(actionText)}</button>` : ''}
      </div>
    `;
  }

  /* ==========================================================================
     1. Digital Wardrobe Logic
     ========================================================================== */
  function updateWardrobeCounts() {
    const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
    const totalCount = wardrobe.length;
    
    const countAllEl = $('#count-all');
    if (countAllEl) countAllEl.textContent = totalCount;

    categories.forEach(cat => {
      const countEl = $(`#count-${cat}`);
      if (countEl) {
        countEl.textContent = wardrobe.filter(i => i.category === cat).length;
      }
    });
  }

  function renderWardrobe() {
    updateWardrobeCounts();

    let items = wardrobe;

    // Filter by Category
    if (currentWardrobeFilter !== 'all') {
      items = items.filter(item => item.category === currentWardrobeFilter);
    }

    // Filter by Search Query
    if (currentSearchQuery.trim()) {
      const q = currentSearchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.color && item.color.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      );
    }

    wardrobeGrid.innerHTML = '';

    if (!items.length) {
      if (currentSearchQuery) {
        wardrobeGrid.innerHTML = emptyStateHTML(
          'No garments match your search',
          `No pieces found for "${currentSearchQuery}". Try clearing the search bar or checking another category.`
        );
      } else {
        wardrobeGrid.innerHTML = emptyStateHTML(
          'No pieces in this category yet',
          'Add your garments to build your visual wardrobe and start styling effortlessly.'
        );
      }
      return;
    }

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'item-card';
      card.innerHTML = `
        <div class="item-img-wrap">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=70'">
          <span class="item-badge-category">${escapeHTML(item.category)}</span>
          <span class="item-badge-color">${escapeHTML(item.color || 'Neutral')}</span>
        </div>
        <div class="item-info">
          <h3 class="item-title">${escapeHTML(item.name)}</h3>
          <p class="item-meta">Category: ${escapeHTML(item.category)}</p>
          <div class="item-actions">
            <button class="slot-action quick-slot-btn" data-id="${item.id}">
              <span>+ Style Look</span>
            </button>
            <div class="item-crud-actions">
              <button class="small-action edit-item" data-id="${item.id}">Edit</button>
              <button class="small-action delete-action delete-item" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
      wardrobeGrid.appendChild(card);
    });
  }

  // Category Filter Pills
  $$('.cat-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.cat-filter').forEach(b => b.classList.toggle('active', b === btn));
      currentWardrobeFilter = btn.dataset.category;
      renderWardrobe();
    });
  });

  // Search Input Event
  if (wardrobeSearch) {
    wardrobeSearch.addEventListener('input', e => {
      currentSearchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = currentSearchQuery ? 'flex' : 'none';
      }
      renderWardrobe();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      wardrobeSearch.value = '';
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      renderWardrobe();
      wardrobeSearch.focus();
    });
  }

  /* ==========================================================================
     2. Interactive Mix-and-Match Outfit Planner
     4 Visual Slots: Top (or Dress), Bottom, Shoes, Accessories
     ========================================================================== */
  // Category to Outfit Slot Mapper
  function mapCategoryToSlot(category) {
    switch (category) {
      case 'Tops':
      case 'Dresses':
        return 'Top';
      case 'Bottoms':
        return 'Bottom';
      case 'Shoes':
        return 'Shoes';
      case 'Accessories':
        return 'Accessories';
      default:
        return 'Top';
    }
  }

  function renderPicker(category = currentPickerCategory) {
    currentPickerCategory = category;
    const items = wardrobe.filter(item => item.category === category);
    pickerGrid.innerHTML = '';

    if (!items.length) {
      pickerGrid.innerHTML = `
        <div class="picker-empty">
          <p>No pieces found in <strong>${escapeHTML(category)}</strong>.</p>
          <button class="btn btn-outline" style="margin-top:12px; font-size:0.7rem; padding:6px 14px;" id="picker-add-item-btn">
            + Add to Wardrobe
          </button>
        </div>
      `;
      const addBtn = $('#picker-add-item-btn');
      if (addBtn) addBtn.addEventListener('click', () => openModal(null, category));
      return;
    }

    const targetSlot = mapCategoryToSlot(category);
    const activeItemInSlot = activeSlots[targetSlot];

    items.forEach(item => {
      const isSelected = activeItemInSlot && activeItemInSlot.id === item.id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `picker-item ${isSelected ? 'selected' : ''}`;
      btn.innerHTML = `
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=70'">
        <span>${escapeHTML(item.name)}</span>
        ${isSelected ? '<span class="item-in-canvas-badge">In Canvas</span>' : ''}
      `;
      btn.addEventListener('click', () => {
        placeItemInSlot(item);
      });
      pickerGrid.appendChild(btn);
    });
  }

  // Mini Category Tabs in Planner Sidebar
  $$('.mini-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.mini-tab').forEach(t => t.classList.toggle('active', t === tab));
      renderPicker(tab.dataset.cat);
    });
  });

  // Place Item into Appropriate Slot (Replacing any existing item)
  function placeItemInSlot(item) {
    const slotKey = mapCategoryToSlot(item.category);
    activeSlots[slotKey] = item;
    renderCanvas();
    renderPicker(currentPickerCategory);
    showToast(`Added “${item.name}” to ${slotKey} slot.`);
  }

  // Render the 4 Visual Slots
  function renderCanvas() {
    const slots = ['Top', 'Bottom', 'Shoes', 'Accessories'];

    slots.forEach(slotKey => {
      const slotElement = $(`.outfit-slot[data-slot="${slotKey}"]`);
      if (!slotElement) return;

      const item = activeSlots[slotKey];
      if (item) {
        slotElement.classList.add('has-item');
        slotElement.innerHTML = `
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
          <div class="slot-caption">
            <span>${escapeHTML(item.name)}</span>
            <button type="button" class="remove-slot" data-slot="${slotKey}" title="Remove ${escapeHTML(item.name)}" aria-label="Remove item">×</button>
          </div>
        `;
      } else {
        slotElement.classList.remove('has-item');
        const placeholderText = slotKey === 'Top' ? 'Select a Top or Dress' :
                                slotKey === 'Bottom' ? 'Select a Bottom' :
                                slotKey === 'Shoes' ? 'Select Footwear' : 'Select Accessories';
        slotElement.innerHTML = `<span class="slot-placeholder">${placeholderText}</span>`;
      }
    });

    // Update count indicator
    const selectedCount = Object.values(activeSlots).filter(Boolean).length;
    $('#canvas-count').textContent = `${selectedCount} of 4 slots styled`;
  }

  // Clear Canvas Button
  $('#clear-canvas-btn').addEventListener('click', () => {
    Object.keys(activeSlots).forEach(key => {
      activeSlots[key] = null;
    });
    renderCanvas();
    renderPicker(currentPickerCategory);
    showToast('Canvas cleared.');
  });

  // Remove individual slot on click '×'
  document.addEventListener('click', e => {
    const removeBtn = e.target.closest('.remove-slot');
    if (removeBtn) {
      e.stopPropagation();
      const slotKey = removeBtn.dataset.slot;
      activeSlots[slotKey] = null;
      renderCanvas();
      renderPicker(currentPickerCategory);
      showToast(`Removed item from ${slotKey} slot.`);
    }
  });

  // Get current outfit items array
  function getCanvasItems() {
    return Object.values(activeSlots).filter(Boolean);
  }

  // Generate unique signature for outfit combination to prevent duplicate wear logs
  function getOutfitSignature(items) {
    return items.map(i => i.id).sort((a, b) => a - b).join('-');
  }

  // Save to Favourites Button
  $('#save-favourite-btn').addEventListener('click', () => {
    const items = getCanvasItems();
    if (items.length < 2) {
      showToast('Select at least 2 pieces to save an outfit combination.');
      return;
    }

    const title = items.map(i => i.name).slice(0, 3).join(' + ') + (items.length > 3 ? ' & More' : '');
    const newFavourite = {
      id: Date.now(),
      name: title,
      items: items.map(i => ({ ...i })),
      date: new Date().toISOString()
    };

    favourites.unshift(newFavourite);
    persist();
    renderFavourites();
    updateAnalytics();
    showToast('Outfit successfully saved to your Lookbook!');
  });

  // Log as Worn Today Button (with Duplicate Prevention!)
  $('#log-worn-btn').addEventListener('click', () => {
    const items = getCanvasItems();
    if (items.length < 2) {
      showToast('Select at least 2 pieces to log an outfit.');
      return;
    }

    const currentSig = getOutfitSignature(items);
    const todayStr = new Date().toISOString().slice(0, 10);

    // Prevent duplicate logs on the same date for the exact same garment combination
    const isAlreadyLoggedToday = history.some(entry => {
      const entryDate = new Date(entry.date).toISOString().slice(0, 10);
      const entrySig = getOutfitSignature(entry.items || []);
      return entryDate === todayStr && entrySig === currentSig;
    });

    if (isAlreadyLoggedToday) {
      showToast('This outfit is already logged for today. Rewear saved!');
      return;
    }

    const newLog = {
      id: Date.now(),
      items: items.map(i => ({ ...i })),
      date: new Date().toISOString()
    };

    history.unshift(newLog);
    persist();
    renderHistory();
    updateAnalytics();
    showToast('Logged as today’s worn look. Mindful styling recorded!');
  });

  // Quick "+ Style Look" button from wardrobe cards
  document.addEventListener('click', e => {
    const quickSlotBtn = e.target.closest('.quick-slot-btn');
    if (quickSlotBtn) {
      const itemId = Number(quickSlotBtn.dataset.id);
      const item = wardrobe.find(i => i.id === itemId);
      if (item) {
        placeItemInSlot(item);
        navigate('planner');
      }
    }
  });

  /* ==========================================================================
     3. Saved Favourites Section
     ========================================================================== */
  function renderOutfitThumbnailGrid(items) {
    if (!items || !items.length) return '';
    return `
      <div class="outfit-thumbnails">
        ${items.map(item => `
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" title="${escapeHTML(item.name)}" loading="lazy">
        `).join('')}
      </div>
    `;
  }

  function renderFavourites() {
    favouritesGrid.innerHTML = '';
    if (!favourites.length) {
      favouritesGrid.innerHTML = emptyStateHTML(
        'No saved combinations yet',
        'Create your favorite looks in the Outfit Planner and save them here for quick inspiration.',
        'Open Outfit Planner',
        'planner'
      );
      return;
    }

    favourites.forEach(fav => {
      const card = document.createElement('article');
      card.className = 'collection-card';
      const itemsList = fav.items || [];
      const itemNames = itemsList.map(i => i.name).join(' &bull; ');

      card.innerHTML = `
        ${renderOutfitThumbnailGrid(itemsList)}
        <div class="collection-info">
          <span class="collection-badge">Saved Capsule Look &bull; ${itemsList.length} Pieces</span>
          <h3>${escapeHTML(fav.name || 'Editorial Combination')}</h3>
          <p style="font-size:0.8rem; margin-bottom:8px; color:var(--text-secondary);">${itemNames}</p>
          <span class="collection-date">Saved on ${formatDate(fav.date)}</span>
          <div class="collection-actions">
            <button class="btn btn-primary load-outfit-btn" data-id="${fav.id}" style="padding:8px 18px; font-size:0.72rem; min-height:38px;">
              Load in Planner ↗
            </button>
            <button class="small-action delete-action delete-favourite" data-id="${fav.id}">
              Remove
            </button>
          </div>
        </div>
      `;
      favouritesGrid.appendChild(card);
    });
  }

  // Load Favourite into Planner
  document.addEventListener('click', e => {
    const loadBtn = e.target.closest('.load-outfit-btn');
    if (loadBtn) {
      const favId = Number(loadBtn.dataset.id);
      const outfit = favourites.find(f => f.id === favId);
      if (outfit && outfit.items) {
        // Clear slots first
        Object.keys(activeSlots).forEach(key => { activeSlots[key] = null; });
        outfit.items.forEach(item => {
          const slotKey = mapCategoryToSlot(item.category);
          activeSlots[slotKey] = item;
        });
        renderCanvas();
        renderPicker(currentPickerCategory);
        navigate('planner');
        showToast('Look loaded into Outfit Planner.');
      }
    }
  });

  /* ==========================================================================
     4. Wear History Section
     ========================================================================== */
  function renderHistory() {
    historyTimeline.innerHTML = '';
    if (!history.length) {
      historyTimeline.innerHTML = emptyStateHTML(
        'Your style journal starts here',
        'Log your worn outfits from the Outfit Planner to track garment usage and master the #30Wears challenge.',
        'Style & Log an Outfit',
        'planner'
      );
      return;
    }

    history.forEach(entry => {
      const row = document.createElement('article');
      row.className = 'history-entry';
      const itemsList = entry.items || [];
      const title = itemsList.map(i => i.name).join(' + ');

      row.innerHTML = `
        <div class="history-date-col">
          <span class="history-day">${formatDayNumber(entry.date)}</span>
          <span class="history-date-full">${formatDate(entry.date)}</span>
        </div>
        <div class="history-content">
          <div class="history-thumbnails">
            ${itemsList.slice(0, 4).map(item => `
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" title="${escapeHTML(item.name)}">
            `).join('')}
          </div>
          <div class="history-details">
            <h3>${escapeHTML(title)}</h3>
            <p>${itemsList.length} items styled &bull; Worn with intention</p>
          </div>
        </div>
        <div class="history-actions">
          <button class="btn btn-secondary restyle-btn" data-id="${entry.id}" style="padding:6px 14px; font-size:0.7rem; min-height:34px;">
            Re-style
          </button>
          <button class="small-action delete-action delete-history" data-id="${entry.id}">
            Delete
          </button>
        </div>
      `;
      historyTimeline.appendChild(row);
    });
  }

  // Restyle Worn Look in Planner
  document.addEventListener('click', e => {
    const restyleBtn = e.target.closest('.restyle-btn');
    if (restyleBtn) {
      const entryId = Number(restyleBtn.dataset.id);
      const entry = history.find(h => h.id === entryId);
      if (entry && entry.items) {
        Object.keys(activeSlots).forEach(key => { activeSlots[key] = null; });
        entry.items.forEach(item => {
          const slotKey = mapCategoryToSlot(item.category);
          activeSlots[slotKey] = item;
        });
        renderCanvas();
        renderPicker(currentPickerCategory);
        navigate('planner');
        showToast('Historical look loaded into Planner.');
      }
    }
  });

  /* ==========================================================================
     5. Personal Dashboard Analytics
     ========================================================================== */
  function updateAnalytics() {
    const totalItems = wardrobe.length;
    const totalFavs = favourites.length;
    const totalWorn = history.length;

    // Stat 1: Total items
    const statTotalEl = $('#stat-total-items');
    if (statTotalEl) statTotalEl.textContent = totalItems;

    // Stat 2: Saved outfits
    const statFavsEl = $('#stat-saved-outfits');
    if (statFavsEl) statFavsEl.textContent = totalFavs;

    // Stat 3: Total worn logs
    const statWornEl = $('#stat-repeats-avoided');
    if (statWornEl) statWornEl.textContent = totalWorn;

    // Stat 4: Capsule Wardrobe Efficiency (%)
    // Measures the proportion of items in the wardrobe that have been styled in either favourites or wear history
    const utilizedIds = new Set();
    favourites.forEach(f => (f.items || []).forEach(i => utilizedIds.add(i.id)));
    history.forEach(h => (h.items || []).forEach(i => utilizedIds.add(i.id)));

    const utilizedCount = [...utilizedIds].filter(id => wardrobe.some(w => w.id === id)).length;
    const efficiency = totalItems > 0 ? Math.round((utilizedCount / totalItems) * 100) : 0;

    const statEffEl = $('#stat-efficiency');
    const statEffBar = $('#stat-efficiency-bar');
    const statEffText = $('#stat-efficiency-text');

    if (statEffEl) statEffEl.textContent = `${efficiency}%`;
    if (statEffBar) statEffBar.style.width = `${efficiency}%`;
    if (statEffText) statEffText.textContent = `${utilizedCount} of ${totalItems} garments active in looks`;

    // Dynamic Category Breakdown Distribution Chart
    const distContainer = $('#category-distribution');
    if (distContainer) {
      const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
      distContainer.innerHTML = '';
      categories.forEach(cat => {
        const count = wardrobe.filter(w => w.category === cat).length;
        const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
        const row = document.createElement('div');
        row.className = 'dist-row';
        row.innerHTML = `
          <span class="dist-name">${cat}</span>
          <div class="dist-track">
            <div class="dist-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="dist-count">${count}</span>
        `;
        distContainer.appendChild(row);
      });
    }
  }

  /* ==========================================================================
     6. Modal: Add / Edit Wardrobe Garment
     ========================================================================== */
  function openModal(item = null, presetCategory = null) {
    itemForm.reset();
    $('#editing-item-id').value = item ? item.id : '';
    $('#modal-title').textContent = item ? 'Edit Wardrobe Garment' : 'Add Clothing Item';
    $('#modal-eyebrow').textContent = item ? 'Update Specifications' : 'Garment Registration';

    if (item) {
      $('#item-name').value = item.name;
      $('#item-category').value = item.category;
      $('#item-color').value = item.color || '';
      imageUrlInput.value = item.image && !item.image.startsWith('data:') ? item.image : '';

      if (item.image) {
        imagePreview.src = item.image;
        imagePreview.style.display = 'block';
        previewEmpty.style.display = 'none';
      } else {
        imagePreview.style.display = 'none';
        previewEmpty.style.display = 'flex';
      }
    } else {
      if (presetCategory) {
        $('#item-category').value = presetCategory;
      }
      imagePreview.src = '';
      imagePreview.style.display = 'none';
      previewEmpty.style.display = 'flex';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    $('#item-name').focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    itemForm.reset();
    $('#editing-item-id').value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    previewEmpty.style.display = 'flex';
  }

  $('#open-add-modal').addEventListener('click', () => openModal());
  $('#close-add-modal').addEventListener('click', closeModal);
  $('#cancel-item-btn').addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target.matches('[data-close-modal]')) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Live image preview from URL input
  if (imageUrlInput) {
    imageUrlInput.addEventListener('input', e => {
      const val = e.target.value.trim();
      if (val) {
        imagePreview.src = val;
        imagePreview.style.display = 'block';
        previewEmpty.style.display = 'none';
      } else if (!imageFileInput.files[0]) {
        imagePreview.style.display = 'none';
        previewEmpty.style.display = 'flex';
      }
    });
  }

  // Live image preview from File upload input with canvas image compression
  if (imageFileInput) {
    imageFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file (JPG, PNG, WEBP).');
          return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
          imagePreview.src = ev.target.result;
          imagePreview.style.display = 'block';
          previewEmpty.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Helper to resize/compress images for localStorage efficiency
  function compressImage(file, maxWidth = 800, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Handle Form Submission
  itemForm.addEventListener('submit', async e => {
    e.preventDefault();
    const editingId = $('#editing-item-id').value;
    const existing = editingId ? wardrobe.find(i => String(i.id) === editingId) : null;
    const file = imageFileInput.files[0];
    const url = imageUrlInput.value.trim();

    let imageResult = url || existing?.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80';

    if (file) {
      try {
        imageResult = await compressImage(file);
      } catch (err) {
        showToast('Error processing image. Using placeholder.');
      }
    }

    const garment = {
      id: existing ? existing.id : Date.now(),
      name: $('#item-name').value.trim(),
      category: $('#item-category').value,
      color: $('#item-color').value.trim() || 'Neutral',
      image: imageResult
    };

    if (existing) {
      wardrobe = wardrobe.map(i => (i.id === garment.id ? garment : i));
      // Update active slots if modified item was placed
      Object.keys(activeSlots).forEach(key => {
        if (activeSlots[key] && activeSlots[key].id === garment.id) {
          activeSlots[key] = garment;
        }
      });
      showToast(`“${garment.name}” updated successfully.`);
    } else {
      wardrobe.unshift(garment);
      showToast(`“${garment.name}” added to Digital Wardrobe.`);
    }

    persist();
    renderWardrobe();
    renderPicker(currentPickerCategory);
    renderCanvas();
    updateAnalytics();
    closeModal();
  });

  // Global Click Handlers for Edit and Delete
  document.addEventListener('click', e => {
    // Edit item
    const editBtn = e.target.closest('.edit-item');
    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const item = wardrobe.find(i => i.id === id);
      if (item) openModal(item);
      return;
    }

    // Delete item
    const deleteItemBtn = e.target.closest('.delete-item');
    if (deleteItemBtn) {
      const id = Number(deleteItemBtn.dataset.id);
      const item = wardrobe.find(i => i.id === id);
      if (item && window.confirm(`Remove “${item.name}” from your wardrobe collection?`)) {
        wardrobe = wardrobe.filter(i => i.id !== id);
        // Clear from canvas if present
        Object.keys(activeSlots).forEach(key => {
          if (activeSlots[key] && activeSlots[key].id === id) {
            activeSlots[key] = null;
          }
        });
        persist();
        renderWardrobe();
        renderPicker(currentPickerCategory);
        renderCanvas();
        updateAnalytics();
        showToast(`“${item.name}” deleted from wardrobe.`);
      }
      return;
    }

    // Delete favourite
    const deleteFavBtn = e.target.closest('.delete-favourite');
    if (deleteFavBtn) {
      const id = Number(deleteFavBtn.dataset.id);
      favourites = favourites.filter(f => f.id !== id);
      persist();
      renderFavourites();
      updateAnalytics();
      showToast('Saved combination removed.');
      return;
    }

    // Delete history entry
    const deleteHistBtn = e.target.closest('.delete-history');
    if (deleteHistBtn) {
      const id = Number(deleteHistBtn.dataset.id);
      history = history.filter(h => h.id !== id);
      persist();
      renderHistory();
      updateAnalytics();
      showToast('Wear record deleted.');
      return;
    }
  });

  /* ==========================================================================
     Initial App Boot
     ========================================================================== */
  // Initial storage setup if first visit
  if (localStorage.getItem(STORAGE.items) === null) {
    persist();
  }

  // Initial renders
  renderWardrobe();
  renderPicker('Tops');
  renderCanvas();
  renderFavourites();
  renderHistory();
  updateAnalytics();

  // Hash Navigation Support on Load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && $(`#page-${initialHash}`)) {
    navigate(initialHash);
  } else {
    navigate('home');
  }
});
