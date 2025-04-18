// === Кеш новостей ===
const NEWS_CACHE_KEY = 'cachedNews';
const NEWS_TIMESTAMP_KEY = 'cachedNewsTime';
const NEWS_CACHE_DURATION = 60 * 60 * 1000; // 1 час в мс

function shouldUpdateNews() {
  const lastUpdate = localStorage.getItem(NEWS_TIMESTAMP_KEY);
  if (!lastUpdate) return true;
  const now = Date.now();
  return now - Number(lastUpdate) > NEWS_CACHE_DURATION;
}

// === Инициализация боковой панели ===
function initSidebar() {
  console.log('[Init] Инициализация боковой панели');

  const servers = [
    'Основной PvE сервер', 
    'Хардкор PvP', 
    'Ролевой сервер', 
    'Экспериментальный', 
    'Сезонный ивент'
  ];

  const list = document.querySelector('.server-list');
  if (list) {
    list.innerHTML = servers
      .map(server => `<li class="server-item">${server}</li>`)
      .join('');
    console.log('[InitSidebar] Список серверов отрисован');
  } else {
    console.warn('[InitSidebar] Элемент .server-list не найден');
  }
}

// === Управление каруселью — прокрутка по 1 блоку ===
function initCarouselControls() {
  const carouselInner = document.querySelector('.carousel-inner');
  if (!carouselInner) return;

  let currentIndex = 3; // начинаем с первого оригинального
  const cloneCount = 3;
  let isTransitioning = false;

  const getBlockCount = () => carouselInner.querySelectorAll('.carousel-block').length;
  const blockWidth = 320;

  function updateCarousel(skipTransition = false) {
    const offset = currentIndex * blockWidth;

    if (skipTransition) {
      carouselInner.style.transition = 'none';
    } else {
      isTransitioning = true;
      carouselInner.style.transition = 'transform 0.5s ease';
    }

    carouselInner.style.transform = `translateX(-${offset}px)`;
  }

  carouselInner.addEventListener('transitionend', () => {
    isTransitioning = false;

    const total = getBlockCount();

    // Если прокрутили за последний элемент (переход к клону), откатываем к началу
    if (currentIndex >= total - cloneCount) {
      carouselInner.style.transition = 'none';
      currentIndex = cloneCount;
      carouselInner.style.transform = `translateX(-${currentIndex * blockWidth}px)`;
    }

    // Если прокрутили влево за первый элемент, откатываем к концу
    if (currentIndex < cloneCount) {
      carouselInner.style.transition = 'none';
      currentIndex = total - cloneCount * 2;
      carouselInner.style.transform = `translateX(-${currentIndex * blockWidth}px)`;
    }
  });

  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      currentIndex--;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      currentIndex++;
      updateCarousel();
    });
  }

  const carousel = document.querySelector('.custom-carousel');
  if (carousel) {
    let interval = setInterval(() => {
      if (!isTransitioning) {
        currentIndex++;
        updateCarousel();
      }
    }, 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(interval));
    carousel.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        if (!isTransitioning) {
          currentIndex++;
          updateCarousel();
        }
      }, 5000);
    });
  }

  updateCarousel(true); // Установка стартовой позиции без анимации
}

function updateCarouselFromNews(news) {
  const latestNews = news.slice(0, 6);
  const carouselInner = document.querySelector('.carousel-inner');
  if (!carouselInner) return;

  if (latestNews.length === 0) {
    carouselInner.innerHTML = '<p>Нет новостей для отображения.</p>';
    return;
  }

  const clonesBefore = latestNews.slice(-3); // последние 3
  const clonesAfter = latestNews.slice(0, 3); // первые 3
  const allSlides = [...clonesBefore, ...latestNews, ...clonesAfter];

  carouselInner.innerHTML = allSlides.map(item => `
    <a class="carousel-block" href="${item.link}" target="_blank" rel="noopener noreferrer">
      <img src="${item.imageUrl || './assets/images/default-news.png'}" alt="Изображение новости">
      <div class="carousel-content">
        <p class="carousel-title">${item.title}</p>
        <div class="carousel-meta">
          <span class="carousel-source">${item.source}</span>
          <span class="carousel-date">${new Date(item.date).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
    </a>
  `).join('');

  carouselInner.style.width = `${allSlides.length * 320}px`;
  carouselInner.style.transition = 'none';
  carouselInner.style.transform = `translateX(-${3 * 320}px)`;
}

// === Инициализация модальных окон ===
function initModals() {
  console.log('[Init] Инициализация модальных окон');

  // Функции для открытия/закрытия модалок по ID
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  }

  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const closeBtns = document.querySelectorAll('.close');

  if (loginBtn) loginBtn.addEventListener('click', () => openModal('loginModal'));
  if (registerBtn) registerBtn.addEventListener('click', () => openModal('registerModal'));

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('loginModal');
      closeModal('registerModal');
      closeModal('forgotPasswordModal');
      closeModal('resetPasswordModal');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal('loginModal');
    if (e.target === registerModal) closeModal('registerModal');
    if (e.target.id === 'forgotPasswordModal') closeModal('forgotPasswordModal');
    if (e.target.id === 'resetPasswordModal') closeModal('resetPasswordModal');
  });

  // Открытие модального окна при клике на "Забыли пароль?"
  document.querySelector(".forgot-password-link").addEventListener("click", () => {
    openModal("forgotPasswordModal");
  });

  // Отправка email для восстановления
  document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        alert("Инструкции отправлены на ваш email");
        closeModal("forgotPasswordModal");
      } else {
        alert("Ошибка: Пользователь не найден");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  });

  // Обработка токена из URL (если пользователь перешел по ссылке из письма)
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token");

  if (resetToken) {
    openModal("resetPasswordModal"); // Автоматически открыть окно сброса пароля
    window.history.replaceState({}, document.title, window.location.pathname); // Убрать токен из URL
  }

  // Отправка нового пароля
  document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    
    try {
      const response = await fetch(`/api/auth/reset-password/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      
      if (response.ok) {
        alert("Пароль успешно изменен!");
        closeModal("resetPasswordModal");
      } else {
        alert("Ошибка: Токен недействителен");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  });
}

// === Проверка авторизации ===
function checkAuth() {
  const token = localStorage.getItem('token');
  const authLinks = document.querySelector('.sign_in');

  if (token && authLinks) {
    authLinks.innerHTML = `
      <ul>
        <li><a href="/profile/profile.html">Профиль</a></li>
        <li><a href="#" id="logoutLink">Выйти</a></li>
      </ul>
    `;
    console.log('[Auth] Пользователь авторизован');

    document.getElementById('logoutLink')?.addEventListener('click', logout);
  }
}

function logout() {
  console.log('[Auth] Выход пользователя');
  localStorage.removeItem('token');
  window.location.reload();
}

// === Загрузка и отрисовка новостей ===
const CONFIG = {
  STEAM_RSS: 'https://api.codetabs.com/v1/proxy/?quest=https://steamcommunity.com/groups/test1123234/rss',
  YT_API_KEY: 'AIzaSyCsZngzuMIzT-mcAnyBdZPxb4OH0lAeWIw',
  YT_CHANNEL_ID: 'UCGz6PoohxQWcOzsiPt8oUJg'
};

class NewsItem {
  constructor(source, title, content, date, link, imageUrl = '') {
    this.source = source;
    this.title = title;
    this.content = content;
    this.date = new Date(date);
    this.link = link;
    this.imageUrl = imageUrl;
  }
}

async function loadSteamNews() {
  try {
    const response = await fetch(CONFIG.STEAM_RSS);
    const xml = await response.text();
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    return Array.from(doc.querySelectorAll('item')).map(item => new NewsItem(
      'Steam',
      item.querySelector('title').textContent,
      item.querySelector('description').textContent.replace(/<[^>]*>/g, ''),
      item.querySelector('pubDate').textContent,
      item.querySelector('link').textContent
    ));
  } catch (error) {
    console.error('[Steam] Ошибка загрузки:', error);
    return [];
  }
}

async function loadYouTubeVideos() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.YT_API_KEY}&channelId=${CONFIG.YT_CHANNEL_ID}&part=snippet&order=date&maxResults=5`
    );
    const data = await response.json();
    return data.items.map(item => new NewsItem(
      'YouTube',
      item.snippet.title,
      item.snippet.description,
      item.snippet.publishedAt,
      `https://youtube.com/watch?v=${item.id.videoId}`,
      item.snippet.thumbnails?.medium?.url || ''
    ));
  } catch (error) {
    console.error('[YouTube] Ошибка загрузки:', error);
    return [];
  }
}

async function loadAllNews(useCache = true) {
  const container = document.getElementById('mixedNewsContainer');
  const isForNewsPage = !!container;

  try {
    if (useCache && !shouldUpdateNews()) {
      const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
      if (cachedNews) {
        console.log('[News] Используется кешированная версия');
        const news = JSON.parse(cachedNews).map(n => new NewsItem(
          n.source, n.title, n.content, n.date, n.link, n.imageUrl
        ));
        if (isForNewsPage) renderNews(container, news);
        updateCarouselFromNews(news);
        return;
      }
    }

    if (isForNewsPage) container.innerHTML = '<div class="news-loader">Загрузка новостей...</div>';
    const [steam, youtube] = await Promise.all([
      loadSteamNews(),
      loadYouTubeVideos()
    ]);

    const allNews = [...steam, ...youtube].sort((a, b) => b.date - a.date);
    localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(allNews));
    localStorage.setItem(NEWS_TIMESTAMP_KEY, Date.now().toString());

    console.log(`[News] Новости обновлены и закешированы (${allNews.length})`);
    if (isForNewsPage) renderNews(container, allNews);
    updateCarouselFromNews(allNews);
  } catch (error) {
    console.error('[News] Ошибка:', error);
    if (isForNewsPage) {
      container.innerHTML = `<div class="news-error">Ошибка загрузки.</div>`;
    }
  }
}

function renderNews(container, news) {
  container.innerHTML = news.map(item => `
    <a href="${item.link}" target="_blank" class="news-card">
      <div class="news-thumbnail">
        <img src="${item.imageUrl || '../assets/images/default-news.png'}" 
             alt="Превью новости" 
             onerror="this.src='../assets/images/default-news.png'">
      </div>
      <span class="news-source">${item.source}</span>
      <h4 class="news-title">${item.title}</h4>
      <p class="news-content">${item.content.substring(0, 100)}...</p>
      <span class="news-date">${item.date.toLocaleDateString('ru-RU')}</span>
    </a>
  `).join('');
}

function showReq(type) {
  const el = type === 'user' ? 'userReq' : 'passReq';
  document.getElementById(el).style.display = 'block';
}

function hideReq() {
  document.getElementById('userReq').style.display = 'none';
  document.getElementById('passReq').style.display = 'none';
}

function validateUsername() {
  const usernameInput = document.getElementById("regUsername");
  const userLength = document.getElementById("userLength");
  const userChars = document.getElementById("userChars");

  if (!usernameInput || !userLength || !userChars) return false;

  const value = usernameInput.value;
  const isLongEnough = value.length >= 3;
  const hasValidChars = /^[a-zA-Z0-9]*$/.test(value);

  userLength.className = isLongEnough ? 'valid' : 'invalid';
  userChars.className = hasValidChars ? 'valid' : 'invalid';

  return isLongEnough && hasValidChars;
}



function validatePassword() {
  const passwordInput = document.getElementById("regPassword");
  const passLength = document.getElementById("passLength");
  const passLetter = document.getElementById("passLetter");
  const passDigit = document.getElementById("passDigit");

  if (!passwordInput || !passLength || !passLetter || !passDigit) return false;

  const value = passwordInput.value;
  const isLongEnough = value.length >= 6;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasDigit = /\d/.test(value);

  passLength.className = isLongEnough ? 'valid' : 'invalid';
  passLetter.className = hasLetter ? 'valid' : 'invalid';
  passDigit.className = hasDigit ? 'valid' : 'invalid';

  return isLongEnough && hasLetter && hasDigit;
}


// === DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Init] DOM загружен');

  initSidebar();
  initCarouselControls();
  initModals();
  checkAuth();
  loadAllNews();

  const usernameInput = document.getElementById("regUsername");
  const passwordInput = document.getElementById("regPassword");

  if (usernameInput) {
    usernameInput.addEventListener('input', validateUsername);
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', validatePassword);
  }

  const buttons = document.querySelectorAll('.asideListFaq button');
  const contentBlocks = document.querySelectorAll('.content-block');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      contentBlocks.forEach(block => block.classList.remove('active'));
      const targetBlock = document.getElementById(targetId);
      if (targetBlock) targetBlock.classList.add('active');
    });
  });

  const firstContentBlock = document.querySelector('.content-block');
  if (buttons.length > 0 && firstContentBlock) {
    firstContentBlock.classList.add('active');
    buttons[0].classList.add('active-btn');
  }

  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateUsername() || !validatePassword()) {
        alert('Пожалуйста, проверьте имя пользователя и пароль.');
        return;
      }

      const username = registerForm.querySelector('input[type="text"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;
      const password = registerForm.querySelector('input[type="password"]').value;
      
      try {
        console.log('[Register] Попытка отправки запроса:', {
          username, email, password,
          endpoint: '/api/auth/signup'
        });
      
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
      
        console.log('[Register] HTTP статус:', response.status);
      
        const data = await response.json();
        console.log('[Register] Ответ от сервера:', data);
      
        if (response.ok) {
          alert('Регистрация прошла успешно! Код с подтверждением был выслан вам на почту.');
          registerForm.reset();
          document.getElementById('registerModal').style.display = 'none';
        } else {
          alert(data.message || `Ошибка регистрации (${response.status})`);
        }
      } catch (error) {
        console.error('[Register] Ошибка:', error);
        alert('Ошибка подключения к серверу');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('[Login] Ответ от сервера:', data);

        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
          alert('Успешный вход!');
          loginForm.reset();
          document.getElementById('loginModal').style.display = 'none';
          window.location.reload();
        } else {
          alert(data.message || 'Ошибка входа');
        }
      } catch (error) {
        console.error('[Login] Ошибка:', error);
        alert('Ошибка подключения к серверу');
      }
    });
  }

 

});
