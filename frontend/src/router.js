import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дешборд',
                filePathTemplate: '/templates/dashboard.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login();
                },
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                load: () => {
                    new SignUp();
                },
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
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio';
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate) // запрашиваем файл шаблона, который хранится в newRoute.filePathTemplate
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