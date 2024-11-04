import {Dashboard} from "./components/dashboard";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {FreelancersList} from "./components/freelancers/freelancers-list";
import {FileUtils} from "./utils/file-utils";
import {FreelancersView} from "./components/freelancers/freelancers-view";

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
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers',
                title: 'Фрилансеры',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js'],
            },
            {
                route: '/freelancers/view',
                title: 'Фрилансер',
                filePathTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersView(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this)); // событие при загрузке страницы
        window.addEventListener('popstate', this.activateRoute.bind(this)); // событие при переходе на другую страницу
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname; // получаем текущий путь URL из адресной строки
        history.pushState({}, '', url); // подставляем к адресу полученный url
        await this.activateRoute(null, currentRoute);
    }

    // ручная обработка ссылок
    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, ''); // удаляем корневую часть URL
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute); // берем старый route
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                // находим и удаляем старые стили
                currentRoute.styles.forEach(style => {
                    FileUtils.onloadPageStyle(style);
                });
            }

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                // находим и удаляем старые scripts
                currentRoute.scripts.forEach(script => {
                    FileUtils.onloadPageScript(script);
                });
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname; // получаем текущий путь URL из адресной строки
        const newRoute = this.routes.find(item => item.route === urlRoute); // ищем полученный путь в массиве routes

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                // добавляем ссылку на стили css на страницу index.html в секцию <head>
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle(`/css/${style}`, this.adminlteStyleElement);
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                // добавляем ссылку на scripts на страницу index.html>
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript(`/js/${script}`);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio';
            }

            if (newRoute.filePathTemplate) {
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
            history.pushState({}, '', '/404'); // подставляем к адресу /404
            await this.activateRoute();
        }
    }
}