// import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// // Инициализация слайдера
// window.addEventListener("load", function () {
// 	if (document.querySelector('.swiper-container')) {
// 		new Swiper('.swiper-container', {
// 			modules: [Navigation, Pagination, Autoplay],
// 			observer: true,
// 			observeParents: true,
// 			slidesPerView: 3,
// 			spaceBetween: 0,
// 			autoHeight: true,
// 			speed: 800,
// 			centeredSlides: true,
// 			initialSlide: 1,  // Начинаем слайдер со второго слайда

// 			// Пагинация
// 			pagination: {
// 				el: '.swiper-pagination',
// 				clickable: true,
// 			},

// 			// Кнопки навигации
// 			navigation: {
// 				nextEl: '.swiper-button-next',
// 				prevEl: '.swiper-button-prev',
// 			},

// 			// Брейкпоинты
// 			breakpoints: {
// 				320: {
// 					slidesPerView: 1,
// 					spaceBetween: 20,
// 					autoHeight: true,
// 				},
// 				768: {
// 					slidesPerView: 1,
// 					spaceBetween: 0,
// 				},
// 				1100: {
// 					slidesPerView: 3,
// 					spaceBetween: 0,
// 				},
// 			},
// 		});
// 	}
// });
const swiper = new Swiper('.comand__slider', {
  loop: true,
   // Центрируем слайд
  speed: 1500, // Делаем скорость переходов плавнее (800ms)
  
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
  
  // Включаем слайдер для экранов до 1320px
  breakpoints: {
      0: {
          enabled: true, 
          centeredSlides: true,
          spaceBetween: 20,
          slidesPerView: 1,// Включаем слайдер для экранов до 1320px
      },
      1330: {
        enabled: false, // Отключаем слайдер для экранов больше 1320px
    },
  }
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





  const openButton = document.querySelector('.button-menu__open');
const nav = document.querySelector('.nav');
const icon = document.querySelector('.icon-menu')

// Добавляем класс nav-active при нажатии на кнопку открытия
openButton.addEventListener('click', () => {
  nav.classList.toggle('nav-active');
  icon.classList.toggle('icon-active');
});


