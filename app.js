

(function () {
    'use strict';

    
    const STORAGE_KEY = 'flashmind_cards';
    const SAMPLE_CARDS = [
        { id: 1, question: 'What does HTML stand for?', answer: 'HyperText Markup Language' },
        { id: 2, question: 'What is the purpose of CSS?', answer: 'CSS (Cascading Style Sheets) is used to style and layout web pages — controlling colors, fonts, spacing, and responsive design.' },
        { id: 3, question: 'What is a closure in JavaScript?', answer: 'A closure is a function that remembers and can access variables from its outer (enclosing) scope, even after the outer function has returned.' },
        { id: 4, question: 'What does API stand for?', answer: 'Application Programming Interface — a set of rules and protocols that allows different software applications to communicate with each other.' },
        { id: 5, question: 'What is the DOM?', answer: 'The Document Object Model (DOM) is a programming interface for web documents. It represents the page as a tree of nodes that can be manipulated with JavaScript.' },
        { id: 6, question: 'Explain the difference between let, const, and var.', answer: 'var is function-scoped and hoisted. let is block-scoped and not hoisted. const is block-scoped, not hoisted, and cannot be reassigned after declaration.' },
    ];

    
    let cards = [];
    let currentIndex = 0;
    let editingId = null;
    let isFlipped = false;
    let isAnimating = false;

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const els = {
        emptyState: $('#empty-state'),
        cardViewer: $('#card-viewer'),
        flashcard: $('#flashcard'),
        flashcardInner: $('#flashcard-inner'),
        cardQuestion: $('#card-question'),
        cardAnswer: $('#card-answer'),
        btnPrev: $('#btn-prev'),
        btnNext: $('#btn-next'),
        currentIndex: $('#current-index'),
        totalCards: $('#total-cards'),
        statTotal: $('#stat-total'),
        statCurrent: $('#stat-current'),
        progressRing: $('#progress-ring'),
        progressText: $('#progress-text'),
        statsBar: $('#stats-bar'),
        
        cardModal: $('#card-modal'),
        modalOverlay: $('#modal-overlay'),
        modalTitle: $('#modal-title'),
        cardForm: $('#card-form'),
        inputQuestion: $('#input-question'),
        inputAnswer: $('#input-answer'),
        
        deleteConfirm: $('#delete-confirm'),
        deleteOverlay: $('#delete-overlay'),
        
        managePanel: $('#manage-panel'),
        manageOverlay: $('#manage-overlay'),
        cardList: $('#card-list'),
        
        toast: $('#toast'),
    };

   
    function loadCards() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                cards = JSON.parse(data);
            }
            if (!cards || cards.length === 0) {
                cards = [...SAMPLE_CARDS];
                saveCards();
            }
        } catch {
            cards = [...SAMPLE_CARDS];
            saveCards();
        }
    }

    function saveCards() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }

    function getNextId() {
        return cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    }

    
    function render() {
        if (cards.length === 0) {
            els.emptyState.classList.remove('hidden');
            els.cardViewer.classList.add('hidden');
            els.statsBar.style.display = 'none';
        } else {
            els.emptyState.classList.add('hidden');
            els.cardViewer.classList.remove('hidden');
            els.statsBar.style.display = '';

            
            if (currentIndex >= cards.length) currentIndex = cards.length - 1;
            if (currentIndex < 0) currentIndex = 0;

            displayCard(currentIndex);
            updateNav();
            updateStats();
        }
    }

    function displayCard(index) {
        const card = cards[index];
        if (!card) return;

        
        if (isFlipped) {
            els.flashcard.classList.remove('flipped');
            isFlipped = false;
        }

        els.cardQuestion.textContent = card.question;
        els.cardAnswer.textContent = card.answer;
    }

    function updateNav() {
        els.currentIndex.textContent = currentIndex + 1;
        els.totalCards.textContent = cards.length;
        els.btnPrev.disabled = currentIndex === 0;
        els.btnNext.disabled = currentIndex === cards.length - 1;
    }

    function updateStats() {
        els.statTotal.textContent = cards.length;
        els.statCurrent.textContent = currentIndex + 1;

        const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
        const circumference = 2 * Math.PI * 16; // r=16
        const offset = circumference - (progress / 100) * circumference;
        els.progressRing.style.strokeDashoffset = offset;
        els.progressText.textContent = Math.round(progress) + '%';
    }

    
    function navigateCard(direction) {
        if (isAnimating) return;
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0 || newIndex >= cards.length) return;

        isAnimating = true;
        const slideOut = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
        const slideIn = direction === 'next' ? 'slide-in-left' : 'slide-in-right';

        
        if (isFlipped) {
            els.flashcard.classList.remove('flipped');
            isFlipped = false;
        }

        els.flashcard.classList.add(slideOut);

        setTimeout(() => {
            els.flashcard.classList.remove(slideOut);
            currentIndex = newIndex;
            displayCard(currentIndex);
            updateNav();
            updateStats();

            els.flashcard.classList.add(slideIn);
            setTimeout(() => {
                els.flashcard.classList.remove(slideIn);
                isAnimating = false;
            }, 350);
        }, 300);
    }

    
    function flipCard() {
        if (isAnimating) return;
        isFlipped = !isFlipped;
        els.flashcard.classList.toggle('flipped', isFlipped);
    }

    
    function openModal(mode, card = null) {
        if (mode === 'edit' && card) {
            editingId = card.id;
            els.modalTitle.textContent = 'Edit Flashcard';
            els.inputQuestion.value = card.question;
            els.inputAnswer.value = card.answer;
        } else {
            editingId = null;
            els.modalTitle.textContent = 'New Flashcard';
            els.inputQuestion.value = '';
            els.inputAnswer.value = '';
        }

        els.cardModal.classList.remove('hidden');
        els.modalOverlay.classList.remove('hidden');

        requestAnimationFrame(() => {
            els.cardModal.classList.add('visible');
            els.modalOverlay.classList.add('visible');
            els.inputQuestion.focus();
        });
    }

    function closeModal() {
        els.cardModal.classList.remove('visible');
        els.modalOverlay.classList.remove('visible');
        setTimeout(() => {
            els.cardModal.classList.add('hidden');
            els.modalOverlay.classList.add('hidden');
            els.cardForm.reset();
            editingId = null;
        }, 350);
    }

    function saveCard(e) {
        e.preventDefault();
        const question = els.inputQuestion.value.trim();
        const answer = els.inputAnswer.value.trim();
        if (!question || !answer) return;

        if (editingId !== null) {
            const card = cards.find(c => c.id === editingId);
            if (card) {
                card.question = question;
                card.answer = answer;
                showToast('Card updated ✓');
            }
        } else {
            cards.push({ id: getNextId(), question, answer });
            currentIndex = cards.length - 1;
            showToast('Card created ✓');
        }

        saveCards();
        closeModal();
        render();
        renderManageList();
    }

    
    function openDeleteConfirm() {
        els.deleteConfirm.classList.remove('hidden');
        els.deleteOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            els.deleteConfirm.classList.add('visible');
            els.deleteOverlay.classList.add('visible');
        });
    }

    function closeDeleteConfirm() {
        els.deleteConfirm.classList.remove('visible');
        els.deleteOverlay.classList.remove('visible');
        setTimeout(() => {
            els.deleteConfirm.classList.add('hidden');
            els.deleteOverlay.classList.add('hidden');
        }, 350);
    }

    function deleteCurrentCard() {
        cards.splice(currentIndex, 1);
        saveCards();
        closeDeleteConfirm();
        showToast('Card deleted');
        render();
        renderManageList();
    }

    function deleteCardById(id) {
        const idx = cards.findIndex(c => c.id === id);
        if (idx === -1) return;
        cards.splice(idx, 1);
        if (currentIndex >= cards.length) currentIndex = Math.max(0, cards.length - 1);
        saveCards();
        showToast('Card deleted');
        render();
        renderManageList();
    }

    
    function openManagePanel() {
        renderManageList();
        els.managePanel.classList.remove('hidden');
        els.manageOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            els.managePanel.classList.add('visible');
            els.manageOverlay.classList.add('visible');
        });
    }

    function closeManagePanel() {
        els.managePanel.classList.remove('visible');
        els.manageOverlay.classList.remove('visible');
        setTimeout(() => {
            els.managePanel.classList.add('hidden');
            els.manageOverlay.classList.add('hidden');
        }, 350);
    }

    function renderManageList() {
        if (cards.length === 0) {
            els.cardList.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:40px 0;">No cards yet.</p>';
            return;
        }

        els.cardList.innerHTML = cards.map((card, i) => `
            <div class="card-list-item" style="animation-delay:${i * 0.04}s" data-id="${card.id}">
                <span class="item-number">${i + 1}</span>
                <div class="item-content">
                    <div class="item-q">${escapeHtml(card.question)}</div>
                    <div class="item-a">${escapeHtml(card.answer)}</div>
                </div>
                <div class="item-actions">
                    <button class="item-btn edit" title="Edit" data-action="edit" data-id="${card.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="item-btn delete" title="Delete" data-action="delete" data-id="${card.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

  
    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        els.toast.textContent = message;
        els.toast.classList.remove('hidden');
        requestAnimationFrame(() => els.toast.classList.add('visible'));
        toastTimer = setTimeout(() => {
            els.toast.classList.remove('visible');
            setTimeout(() => els.toast.classList.add('hidden'), 350);
        }, 2200);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    
    function handleKeyboard(e) {
        
        if (!els.cardModal.classList.contains('hidden') ||
            !els.deleteConfirm.classList.contains('hidden')) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateCard('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateCard('next');
                break;
            case ' ':
            case 'Enter':
                if (document.activeElement === els.flashcard || document.activeElement === document.body) {
                    e.preventDefault();
                    flipCard();
                }
                break;
        }
    }

    
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;

        
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) navigateCard('next');
            else navigateCard('prev');
        }
    }

    function bindEvents() {
        
        els.flashcard.addEventListener('click', flipCard);

        
        els.btnPrev.addEventListener('click', () => navigateCard('prev'));
        els.btnNext.addEventListener('click', () => navigateCard('next'));

        
        $('#btn-add').addEventListener('click', () => openModal('add'));
        $('#btn-add-empty').addEventListener('click', () => openModal('add'));

        
        $('#btn-close-modal').addEventListener('click', closeModal);
        $('#btn-cancel-modal').addEventListener('click', closeModal);
        els.modalOverlay.addEventListener('click', closeModal);
        els.cardForm.addEventListener('submit', saveCard);

        
        $('#btn-edit-card').addEventListener('click', () => {
            if (cards[currentIndex]) openModal('edit', cards[currentIndex]);
        });
        $('#btn-delete-card').addEventListener('click', openDeleteConfirm);
        $('#btn-cancel-delete').addEventListener('click', closeDeleteConfirm);
        $('#btn-confirm-delete').addEventListener('click', deleteCurrentCard);
        els.deleteOverlay.addEventListener('click', closeDeleteConfirm);

        
        $('#btn-manage').addEventListener('click', openManagePanel);
        $('#btn-close-manage').addEventListener('click', closeManagePanel);
        els.manageOverlay.addEventListener('click', closeManagePanel);

        
        els.cardList.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) {
                
                const item = e.target.closest('.card-list-item');
                if (item) {
                    const id = parseInt(item.dataset.id);
                    const idx = cards.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        currentIndex = idx;
                        render();
                        closeManagePanel();
                    }
                }
                return;
            }

            const id = parseInt(btn.dataset.id);
            const action = btn.dataset.action;

            if (action === 'edit') {
                const card = cards.find(c => c.id === id);
                if (card) {
                    closeManagePanel();
                    setTimeout(() => openModal('edit', card), 400);
                }
            } else if (action === 'delete') {
                deleteCardById(id);
            }
        });

        
        document.addEventListener('keydown', handleKeyboard);

        // Touch swipe on card
        els.flashcard.addEventListener('touchstart', handleTouchStart, { passive: true });
        els.flashcard.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    
    function registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    
    function init() {
        loadCards();
        bindEvents();
        render();
        registerSW();
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
