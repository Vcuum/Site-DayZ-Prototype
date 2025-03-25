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


// Функция проверки авторизации
function checkAuth() {
  const token = localStorage.getItem('token');
  const authLinks = document.querySelector('.sign_in');
  
  if (token) {
      authLinks.innerHTML = `
          <ul>
              <li><a href="#" id="profileLink">Профиль</a></li>
              <li><a href="#" id="logoutLink">Выйти</a></li>
          </ul>
      `;
      
      // Обработчик выхода
      document.getElementById('logoutLink').addEventListener('click', logout);
  }

  document.getElementById('profileLink').addEventListener('click', () => {
    window.location.href = '/pages/profile.html';
  });
}

// Функция выхода
function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}




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
  
    // Обработка формы входа
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();
          
          if (response.ok) {
              localStorage.setItem('token', data.token);
              window.location.reload();
          } else {
              showError(loginModal, data.message || 'Ошибка входа');
          }
      } catch (error) {
          showError(loginModal, 'Сервер недоступен');
      }
  });

  // Обработка формы регистрации
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      // Проверка заполненности полей на клиенте
    if (!username || !email || !password) {
      showError(registerModal, 'Все поля обязательны!');
      return;
  }

      try {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, username })
          });

          const data = await response.json();
          
          if (response.ok) {
              localStorage.setItem('token', data.token);
              window.location.reload();
          } else {
              showError(registerModal, data.message || 'Ошибка регистрации');
          }
      } catch (error) {
          showError(registerModal, 'Сервер недоступен');
      }
  });
}

// Функция отображения ошибок
function showError(modal, message) {
  const errorDiv = modal.querySelector('.error-message') || document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';
  errorDiv.textContent = message;
  
  if (!modal.contains(errorDiv)) {
      modal.querySelector('form').appendChild(errorDiv);
  }
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
              <img src="/assets/images/${item.img}" alt="Image" width="200" height="150">
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
  checkAuth(); // Добавляем проверку авторизации
});