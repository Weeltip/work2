const openButton = document.querySelector('.button-menu__open');
const nav = document.querySelector('.nav');
const icon = document.querySelector('.icon-menu')

// Добавляем класс nav-active при нажатии на кнопку открытия
openButton.addEventListener('click', () => {
  nav.classList.toggle('nav-active');
  icon.classList.toggle('icon-active');
});



const swiper = new Swiper('.comand__slider', {
  // loop: true,
  speed: 1500,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 3,
  spaceBetween: 170,
  breakpoints: {
    0: {
      centeredSlides: true,
      spaceBetween: 20,
      slidesPerView: 1,
    },
    1330: {
      slidesPerView: 3,
      spaceBetween: 170,
    },
  },
  touchEventsTarget: 'container', // Привязываем события касания к контейнеру
  touchRatio: 1, // Устанавливаем коэффициент для лучшего управления
  simulateTouch: true,
});

document.addEventListener("DOMContentLoaded", function () {
    const spollers = document.querySelectorAll('.header__spollers');
  
    spollers.forEach(spoller => {
      const button = spoller.querySelector('button');
      const body = spoller.querySelector('.header__body');
      const a = spoller.querySelector('.spoller__a');
  
      button.addEventListener('click', function (e) {
        e.preventDefault(); // чтобы ссылка не перенаправляла
  
        // Закрываем все открытые спойлеры перед открытием текущего
        spollers.forEach(otherSpoller => {
          if (otherSpoller !== spoller) {
            const otherBody = otherSpoller.querySelector('.header__body');
            const otherA = otherSpoller.querySelector('.spoller__a');
            otherBody.classList.remove('s-body__active');
            otherA.classList.remove('s-btn__active');
          }
        });
  
        // Открываем/закрываем текущий спойлер
        a.classList.toggle('s-btn__active');
        body.classList.toggle('s-body__active');
      });
    });
  
    // Закрытие всех спойлеров при клике вне спойлера
    document.addEventListener('click', function (e) {
      spollers.forEach(spoller => {
        if (!spoller.contains(e.target)) {
          const body = spoller.querySelector('.header__body');
          const a = spoller.querySelector('.spoller__a');
          body.classList.remove('s-body__active');
          a.classList.remove('s-btn__active');
        }
      });
    });
  });




  function DynamicAdapt(type) {
    this.type = type;
  }
  DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");
    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    });
    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
        return item.breakpoint === mediaBreakpoint;
      });
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };
  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
    } else {
      //for (let i = 0; i < оbjects.length; i++) {
      for (let i = оbjects.length - 1; i >= 0; i--) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname)) {
          this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
      }
    }
  };
  // Функция перемещения
  DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend', element);
      return;
    }
    if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
  }
  // Функция возврата
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }
  // Функция получения индекса внутри родителя
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };
  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
  
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
  
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
  
          return a.place - b.place;
        }
  
        return a.breakpoint - b.breakpoint;
      });
    } else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
  
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
  
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
  
          return b.place - a.place;
        }
  
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };
  const da = new DynamicAdapt("max");
  da.init();



  document.querySelectorAll('.select').forEach(select => {
    const title = select.querySelector('.select__title');
    const options = select.querySelector('.select__options');
    const optionItems = options.querySelectorAll('.select__option');
    
    // Открытие и закрытие списка опций при клике на заголовок
    title.addEventListener('click', () => {
      select.classList.toggle('_select-open');
    });
    
    // Выбор опции
    optionItems.forEach(option => {
      option.addEventListener('click', () => {
      const value = option.dataset.value;
      const text = option.textContent;
      
      title.textContent = text; // Обновляем заголовок
      select.classList.remove('_select-open'); // Закрываем список опций
    
      // Здесь можно выполнить дополнительные действия, например, обновить скрытое поле формы
      console.log(`Выбрано значение: ${value}`);
      });
    });
    
    // Закрытие списка при клике вне селекта
    document.addEventListener('click', (e) => {
      if (!select.contains(e.target)) {
      select.classList.remove('_select-open');
      }
    });
    });
  

    document.addEventListener("DOMContentLoaded", function () {
      const form = document.querySelector('#popup form');
  
      // Обработчик отправки формы
      form.addEventListener('submit', function (event) {
          event.preventDefault(); // Отключаем стандартное поведение формы (перезагрузка)
  
          // Собираем данные формы
          const formData = new FormData(form);
  
          // Имитация отправки данных через AJAX (замените на реальный сервер)
          fetch('https://example.com/submit', { // Замените URL на свой сервер
              method: 'POST',
              body: formData
          }).then(response => response.json())
            .then(data => {
                console.log('Успешная отправка:', data);
  
                // Закрываем первый попап
                closePopup(document.querySelector('#popup'));
  
                // Открываем второй попап после успешной отправки
                openPopup(document.querySelector('#popup2'));
            }).catch(error => {
                console.error('Ошибка при отправке:', error);
            });
      });
  
      // Функция для открытия попапа и блокировки скролла
      function openPopup(popup) {
          popup.setAttribute('aria-hidden', 'false');
          popup.classList.add('popup_show');
          document.body.classList.add('no-scroll');
      }
  
      // Функция для закрытия попапа и разблокировки скролла
      function closePopup(popup) {
          popup.setAttribute('aria-hidden', 'true');
          popup.classList.remove('popup_show');
          document.body.classList.remove('no-scroll');
      }
  
      // Открытие попапа при нажатии на кнопки
      document.querySelectorAll('[data-popup]').forEach(button => {
          button.addEventListener('click', function () {
              const popupId = this.getAttribute('data-popup');
              const popup = document.querySelector(popupId);
              openPopup(popup);
          });
      });
  
      // Закрытие попапа при нажатии на кнопки закрытия
      document.querySelectorAll('[data-close]').forEach(button => {
          button.addEventListener('click', function () {
              const popup = this.closest('.popup');
              closePopup(popup);
          });
      });
  
      // Закрытие попапа при клике вне контента
      document.querySelectorAll('.popup').forEach(popup => {
          popup.addEventListener('click', function (event) {
              if (!event.target.closest('.popup__content')) {
                  closePopup(popup);
              }
          });
      });
  });




  document.getElementById('myForm').addEventListener('submit', function(event) {
    // Отменяем стандартное поведение отправки формы
    event.preventDefault();
    
    // Получаем данные формы
    var formData = new FormData(this);
    
    // Отправляем данные с помощью Fetch API или другого метода
    fetch('/your-endpoint-url', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Обработка ответа
        console.log('Success:', data);
        // Вы можете добавить здесь код для отображения сообщений, очистки формы и т.д.
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});