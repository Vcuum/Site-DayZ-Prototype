export function initSidebar() {
    console.log('[Init] Инициализация боковой панели');
    const servers = ['Основной PvE сервер', 'Хардкор PvP', 'Ролевой сервер', 'Экспериментальный', 'Сезонный ивент'];
    const list = document.querySelector('.server-list');
    if (list) {
      list.innerHTML = servers.map(server => `<li class="server-item">${server}</li>`).join('');
      console.log('[InitSidebar] Список серверов отрисован');
    } else {
      console.warn('[InitSidebar] Элемент .server-list не найден');
    }
  }