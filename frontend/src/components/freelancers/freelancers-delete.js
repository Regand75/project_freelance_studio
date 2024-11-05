import {HttpUtils} from "../../utils/http-utils";

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search); // создаем объект, который позволяет работать с параметрами строки запроса в URL
        const id = urlParams.get('id'); // получаем id из текущего URL
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    }

    async deleteFreelancer(id) {
        const result = await HttpUtils.request(`/freelancers/${id}`, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении фрилансера. Обратитесь в поддержку');
        }
        return this.openNewRoute(`/freelancers`);
    }
}