document.addEventListener('DOMContentLoaded', () => {
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.classList.add('lightbox-overlay');

  const lightboxContent = document.createElement('div');
  lightboxContent.classList.add('lightbox-content');

  const lightboxImage = document.createElement('img');
  lightboxContent.appendChild(lightboxImage);

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('lightbox-close');
  closeBtn.textContent = '×';
  lightboxContent.appendChild(closeBtn);

  lightboxOverlay.appendChild(lightboxContent);
  document.body.appendChild(lightboxOverlay);

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    lightboxImage.src = '';
    currentScale = 1;
    resetPosition();
    updateTransform();
  }

  closeBtn.addEventListener('click', closeLightbox);

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  const links = document.querySelectorAll('a.lightbox');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = link.getAttribute('href');
      lightboxImage.src = imgSrc;
      lightboxOverlay.classList.add('active');
      currentScale = 1;
      resetPosition();
      updateTransform();
    });
  });

  // Skalowanie
  let currentScale = 1;
  const scaleStep = 0.1;
  const minScale = 1;
  const maxScale = 5;

  // Pozycja przesunięcia (drag)
  let currentX = 0;
  let currentY = 0;

  // Dragging variables
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Obsługa zoomu na scroll
  lightboxImage.addEventListener('wheel', (e) => {
    e.preventDefault();
    // Zmiana skali
    if (e.deltaY < 0) {
      currentScale = Math.min(currentScale + scaleStep, maxScale);
    } else {
      currentScale = Math.max(currentScale - scaleStep, minScale);
      // Jeśli pomniejszamy do 1, resetuj przesunięcie
      if (currentScale === 1) {
        resetPosition();
      }
    }
    updateTransform();
  });

  // Obsługa drag
  lightboxImage.style.cursor = 'grab';

  lightboxImage.addEventListener('mousedown', (e) => {
    if (currentScale <= 1) return; // drag tylko przy zoom > 1
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    lightboxImage.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (currentScale > 1) {
      lightboxImage.style.cursor = 'grab';
    } else {
      lightboxImage.style.cursor = 'default';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    updateTransform();
  });

  // Funkcje do transformacji i resetów
  function updateTransform() {
    lightboxImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }

  function resetPosition() {
    currentX = 0;
    currentY = 0;
  }
});
