// Инициализация боковой панели
function initSidebar() {
  const servers = [
    'Основной PvE сервер', 
    'Хардкор PvP', 
    'Ролевой сервер', 
    'Экспериментальный', 
    'Сезонный ивент'
  ];
  
  const list = document.querySelector('.server-list');
  if (list) {
    list.innerHTML = servers.map(server => 
      `<li class="server-item">${server}</li>`
    ).join('');
  }
}

// Инициализация карусели
function initCarousel() {
  const originalSlides = [
    {
      items: [
        {img: 'hq720.jpg', text: 'Добавлены новые локации'},
        {img: 'hq7201.jpg', text: 'Исправлены баги'},
        {img: 'hq720.jpg', text: 'Оптимизация сервера'}
      ]
    },
    {
      items: [
        {img: 'hq7201.jpg', text: 'Хэллоуин ивент'},
        {img: 'hq720.jpg', text: 'Турнир PvP'},
        {img: 'hq7201.jpg', text: 'Новые квесты'}
      ]
    }
  ];

  // Клонируем первый слайд и добавляем в конец для бесконечности
  const slides = [...originalSlides, originalSlides[0]];
  const slidesCount = slides.length;

  const carouselInner = document.querySelector('.carousel-inner');
  if (!carouselInner) return;

  // Рендерим слайды с клоном
  carouselInner.innerHTML = slides.map((slide, slideIndex) => `
    <div class="carousel-slide ${slideIndex === 0 ? 'active' : ''}">
      <div class="slide-content">
        ${slide.items.map(item => `
          <div class="carousel-block">
            <img src="/assets/images/${item.img}" alt="Image">
            <p>${item.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  let currentSlide = 0;
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');

  function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Обработчик завершения анимации
  function handleTransitionEnd() {
    if (currentSlide === slidesCount - 1) {
      carouselInner.style.transition = 'none';
      currentSlide = 0;
      updateCarousel();
      void carouselInner.offsetWidth; // Принудительный рефлоу
      carouselInner.style.transition = 'transform 0.5s ease';
    }
  }

  carouselInner.addEventListener('transitionend', handleTransitionEnd);

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = currentSlide === 0 ? slidesCount - 1 : currentSlide - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slidesCount;
      updateCarousel();
    });
  }

  // Автопрокрутка
  let interval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slidesCount;
    updateCarousel();
  }, 5000);

  // Пауза при наведении
  const carousel = document.querySelector('.custom-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(interval));
    carousel.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slidesCount;
        updateCarousel();
      }, 5000);
    });
  }
}

// Инициализация модальных окон
function initModals() {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const closeBtns = document.querySelectorAll('.close');

  // Открытие модальных окон
  if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
  if (registerBtn) registerBtn.addEventListener('click', () => registerModal.style.display = 'block');

  // Закрытие модальных окон
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      registerModal.style.display = 'none';
    });
  });

  // Закрытие при клике вне окна
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
  });
}

// Проверка авторизации
function checkAuth() {
  const token = localStorage.getItem('token');
  const authLinks = document.querySelector('.sign_in');
  
  if (token && authLinks) {
    authLinks.innerHTML = `
      <ul>
        <li><a href="/pages/profile.html">Профиль</a></li>
        <li><a href="#" id="logoutLink">Выйти</a></li>
      </ul>
    `;
    
    document.getElementById('logoutLink')?.addEventListener('click', logout);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}


document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.asideListFaq button');
  const contentBlocks = document.querySelectorAll('.content-block');

  buttons.forEach(button => {
      button.addEventListener('click', () => {
          const targetId = button.dataset.target;
          // Скрыть все блоки
          contentBlocks.forEach(block => block.classList.remove('active'));
          // Показать целевой блок
          document.getElementById(targetId).classList.add('active');
          // Обновить стиль кнопки (опционально)
          buttons.forEach(btn => btn.classList.remove('active-btn'));
          button.classList.add('active-btn');
      });
  });

  // Показать первый блок по умолчанию
  document.querySelector('.content-block').classList.add('active');
  buttons[0].classList.add('active-btn');
});

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initCarousel();
  initModals();
  checkAuth();
});