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