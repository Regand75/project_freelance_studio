import {HttpUtils} from "../../utils/http-utils";

export class FreelancersList {
    constructor() {
        this.getFreelancers().then();
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.error || !result.response || (result.response && (result.response.error || !result.result.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }
        this.showRecords(result.result.freelancers);
    }

    showRecords(freelancers) {
        console.log(freelancers);
    }
}