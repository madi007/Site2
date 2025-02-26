document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("nav ul li a");

    links.forEach(link => {
        link.addEventListener("click", function () {
            links.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

// Получаем все элементы с атрибутами data-ru и data-kz
const elements = document.querySelectorAll('[data-ru], [data-kz]');

// Функция для переключения языка
function switchLanguage(language) {
    elements.forEach(element => {
        if (language === 'ru') {
            // Меняем текст на русский с использованием HTML (для <br>)
            element.innerHTML = element.getAttribute('data-ru') || element.innerHTML;

            // Меняем изображения на русские
            if (element.tagName === 'IMG') {
                element.src = element.getAttribute('data-ru');
            }
        } else if (language === 'kz') {
            // Меняем текст на казахский с использованием HTML (для <br>)
            element.innerHTML = element.getAttribute('data-kz') || element.innerHTML;

            // Меняем изображения на казахские
            if (element.tagName === 'IMG') {
                element.src = element.getAttribute('data-kz');
            }
        }
    });

    // Меняем активный класс на кнопках
    document.getElementById('lang-ru').classList.toggle('active', language === 'ru');
    document.getElementById('lang-kz').classList.toggle('active', language === 'kz');
}

// Добавляем обработчики событий для кнопок
document.getElementById('lang-ru').addEventListener('click', () => switchLanguage('ru'));
document.getElementById('lang-kz').addEventListener('click', () => switchLanguage('kz'));

// Устанавливаем начальный язык (например, русский)
switchLanguage('ru');
