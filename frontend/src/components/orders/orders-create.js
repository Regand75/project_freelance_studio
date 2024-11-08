import {HttpUtils} from "../../utils/http-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        // The Calender
        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });

        const calendarComplete = $('#calendar-complete');
        calendarComplete.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            buttons: {
                showClear: true,
            }
        });
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.getFreelancers().then();
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        const freelancers = result.response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = freelancers[i].id;
            option.innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            this.freelancerSelectElement.appendChild(option);
        }
        //Initialize Select2 Elements
        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    }

    validateForm() {
        let isValid = true;
        let textInputArray = [
            this.amountInputElement,
            this.descriptionInputElement,
        ];
        let calenderCardArray = [
            {
                date: this.scheduledDate,
                cardElement: this.scheduledCardElement,
            },
            {
                date: this.deadlineDate,
                cardElement: this.deadlineCardElement,
            },
        ];

        for (let i = 0; i < textInputArray.length; i++) {
            // валидация полей
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }

        for (let i = 0; i < calenderCardArray.length; i++) {
            // валидация полей
            if (calenderCardArray[i].date) {
                calenderCardArray[i].cardElement.classList.remove('is-invalid');
            } else {
                calenderCardArray[i].cardElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        // if (this.scheduledDate) {
        //     this.scheduledCardElement.classList.remove('is-invalid');
        // } else {
        //     this.scheduledCardElement.classList.add('is-invalid');
        //     isValid = false;
        // }
        //
        // if (this.deadlineDate) {
        //     this.deadlineCardElement.classList.remove('is-invalid');
        // } else {
        //     this.deadlineCardElement.classList.add('is-invalid');
        //     isValid = false;
        // }

        return isValid;
    }

    async saveOrder(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
            };

            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }

            const result = await HttpUtils.request(`/orders`, 'POST', true, createData);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении заказа. Обратитесь в поддержку');
            }
            return this.openNewRoute(`/orders/view?id=${result.response.id}`);
        }
    }
}