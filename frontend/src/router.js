import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminlteStyleElement = document.getElementById('adminlte_style');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дешборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login();
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp();
                },
                styles: ['icheck-bootstrap.min.css'],
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this)); // событие при загрузке страницы
        window.addEventListener('popstate', this.activateRoute.bind(this)); // событие при переходе на другую страницу
    }

    async activateRoute() {
        const urlRoute = window.location.pathname; // получаем текущий путь URL из адресной строки
        const newRoute = this.routes.find(item => item.route === urlRoute); // ищем полученный путь в массиве routes

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                // добавляем ссылку на стили css на страницу index.html в секцию <head>
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `/css/${style}`;
                    document.head.insertBefore(link, this.adminlteStyleElement);
                });
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio';
            }
            if (newRoute.filePathTemplate) {
                document.body.className = ''; // очищаем body от всех классов
                let contentBlock = this.contentPageElement;
                // использование layout
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout)
                        .then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    // добавляем классы для правильного скрытия левой панели
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                // запрашиваем файл шаблона, который хранится в newRoute.filePathTemplate
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            window.location = '/404';
        }
    }
}