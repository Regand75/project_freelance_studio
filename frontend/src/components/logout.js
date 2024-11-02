import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        // если пользователь уже находится в системе, перенаправляем его на главную страницу
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        this.logout().then();
    }

    async logout() {
        await HttpUtils.request('/logout', 'POST', {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        // удаляем данные из localStorage
        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}