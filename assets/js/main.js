// Инициализация боковой панели
function initSidebar() {
  const servers = ['Сервер 1', 'Сервер 2', 'Сервер 3', 'Сервер 4', 'Сервер 5', 'Сервер 6', 'Сервер 7'];
  const serverList = document.querySelector('.server-list');
  
  servers.forEach(server => {
      const li = document.createElement('li');
      li.textContent = server;
      li.className = 'server-item';
      serverList.appendChild(li);
  });
}

// Динамическая регулировка ширины сайдбара
function adjustSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const items = document.querySelectorAll('.server-item');
  let maxWidth = 150; // Минимальная ширина
  
  items.forEach(item => {
      const itemWidth = item.scrollWidth;
      if(itemWidth > maxWidth) maxWidth = itemWidth;
  });
  
  // Ограничиваем максимальную ширину
  maxWidth = Math.min(maxWidth, 300);
  
  sidebar.style.width = `${maxWidth + 40}px`; // + padding
}

// Инициализация сайдбара
function initSidebar() {
  const servers = [
      'Основной PvE сервер', 
      'Хардкор PvP', 
      'Ролевой сервер', 
      'Экспериментальный', 
      'Сезонный ивент', 
      'Тестовый сервер', 
      'Резервный сервер'
  ];
  
  const list = document.querySelector('.server-list');
  list.innerHTML = servers.map(server => 
      `<li class="server-item">${server}</li>`
  ).join('');
  
  adjustSidebar();
  
  // Обновляем при изменении окна
  window.addEventListener('resize', adjustSidebar);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initSidebar);


///////////////////////////////////////////Sidebar//////////////////////////////////////////////////////////////







///////////////////////////////////////////Modals/////////////////////////////////////////////////////////////

function initModals() {
    // Элементы модальных окон
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Обработчики для кнопок входа и регистрации
    document.querySelectorAll('.sign_in a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if(link.textContent === 'Вход') {
          loginModal.style.display = 'block';
        } else {
          registerModal.style.display = 'block';
        }
      });
    });
  
    // Закрытие по крестику
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
      });
    });
  
    // Закрытие при клике вне окна
    window.addEventListener('click', (e) => {
      if(e.target === loginModal) {
        loginModal.style.display = 'none';
      }
      if(e.target === registerModal) {
        registerModal.style.display = 'none';
      }
    });
  
    // Обработка форм
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      // Логика входа
      alert('Форма входа отправлена!');
      loginModal.style.display = 'none';
    });
  
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      // Логика регистрации
      alert('Форма регистрации отправлена!');
      registerModal.style.display = 'none';
    });
  }
  
///////////////////////////////////////////Modals/////////////////////////////////////////////////////////////






///////////////////////////////////////////Carousel//////////////////////////////////////////////////////////////

// Инициализация карусели
function initCarousel() {
  const carouselInner = document.querySelector('.carousel-inner');
  const slides = [
      [
          {img: 'hq720.jpg', text: 'Текст для блока 1'},
          {img: 'hq7201.jpg', text: 'Текст для блока 2'},
          {img: 'hq720.jpg', text: 'Текст для блока 3'}
      ],
      [
          {img: 'hq7201.jpg', text: 'Текст для блока 4'},
          {img: 'hq7201.jpg', text: 'Текст для блока 5'},
          {img: 'hq720.jpg', text: 'Текст для блока 6'}
      ]
  ];

  // Создание слайдов
  slides.forEach((slide, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
      
      slide.forEach(item => {
          const block = document.createElement('div');
          block.className = 'carousel-block';
          block.innerHTML = `
              <img src="assets/images/${item.img}" alt="Image" width="200" height="150">
              <p>${item.text}</p>
          `;
          slideDiv.appendChild(block);
      });
      
      carouselInner.appendChild(slideDiv);
  });

  // Логика управления каруселью
  let currentSlide = 0;
  const slidesCount = slides.length;
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');

  function updateCarousel() {
      carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  prevButton.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
      updateCarousel();
  });

  nextButton.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slidesCount;
      updateCarousel();
  });

  // Автопрокрутка
  let autoPlay = setInterval(() => {
      currentSlide = (currentSlide + 1) % slidesCount;
      updateCarousel();
  }, 10000);

  // Пауза при наведении
  carouselInner.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carouselInner.parentElement.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
          currentSlide = (currentSlide + 1) % slidesCount;
          updateCarousel();
      }, 10000);
  });
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initCarousel();
  initModals();
});