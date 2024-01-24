export default class Ticket {
    #ticketID;
    #fullName;
    #startDate;
    #endDate;
    #flightID;

        constructor({
            ticketID,
            fullName,
            startDate,
            endDate,
            flightID
        }) {
        this.#ticketID = ticketID;
        this.#fullName = fullName;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#flightID = flightID;
    }

    get ticketID() { return this.#ticketID; }

    set flightID(value) { this.#flightID = value; }

    render() {
        // Создание HTML элементов билета
        const liElement = document.createElement('li');
        liElement.classList.add('flight__tickets-list-item', 'ticket', 'row');
        liElement.setAttribute('ticketID', this.#ticketID);

            const divOuter = document.createElement('div');
            divOuter.classList.add('ticket-info', 'row');

                const div1 = document.createElement('div');
                div1.classList.add('row');

                    const div1Span1 = document.createElement('span');
                    div1Span1.classList.add('clarify-text-small', 'align-self-end', 'col-2');
                    div1Span1.innerHTML = 'Арендатор:';

                    const div1Span2 = document.createElement('span');
                    div1Span2.classList.add('ticket__full_name', 'col-4', 'align-self-end');
                    div1Span2.innerHTML = this.#fullName;

                div1.appendChild(div1Span1);
                div1.appendChild(div1Span2);

                const div2 = document.createElement('div');
                div2.classList.add('row');

                    const div2div1 = document.createElement('div');
                    div2div1.classList.add('col-6');

                        const div2div1div = document.createElement('div');
                        div2div1div.classList.add('row');

                            const div2div1divSpan1 = document.createElement('span');
                            div2div1divSpan1.classList.add('clarify-text-small', 'align-self-end', 'col-6');
                            div2div1divSpan1.innerHTML = 'Дата начала аренды';

                            const div2div1divSpan2 = document.createElement('span');
                            div2div1divSpan2.classList.add('ticket__start_date', 'col-4');
                            div2div1divSpan2.innerHTML = this.#startDate;

                        div2div1div.appendChild(div2div1divSpan1);
                        div2div1div.appendChild(div2div1divSpan2);

                    div2div1.appendChild(div2div1div);

                    const div2div2 = document.createElement('div');
                    div2div2.classList.add('col-6')

                        const div2div2div = document.createElement('div');
                        div2div2div.classList.add('row');

                            const div2div2divSpan1 = document.createElement('span');
                            div2div2divSpan1.classList.add('clarify-text-small', 'align-self-end', 'col-6');
                            div2div2divSpan1.innerHTML = 'Дата конца аренды';

                            const div2div2divSpan2 = document.createElement('span');
                            div2div2divSpan2.classList.add('ticket__end_date', 'col-4');
                            div2div2divSpan2.innerHTML = this.#endDate;

                        div2div2div.appendChild(div2div2divSpan1);
                        div2div2div.appendChild(div2div2divSpan2);

                    div2div2.appendChild(div2div2div);

                div2.appendChild(div2div1);
                div2.appendChild(div2div2);

                const div3 = document.createElement('div');
                div3.classList.add('row', 'justify-content-center');

                    const buttonElement2 = document.createElement('button');
                    buttonElement2.classList.add('ticket__move-btn', 'btn', 'btn-outline-info', 'col-2');
                    buttonElement2.setAttribute('type', 'button');
                    buttonElement2.addEventListener('click', () => {
                        const button = document.getElementById('modal-move-ticket').querySelector('.modal-ok-btn');
                        button.setAttribute('flight_id', this.#flightID);
                        button.setAttribute('ticket_id', this.#ticketID);
                        document.getElementById('modal-move-ticket').showModal();
                    });
                    buttonElement2.innerHTML = '&#8617;';

                    const buttonElement3 = document.createElement('button');
                    buttonElement3.classList.add('ticket__delete-btn', 'btn', 'btn-outline-danger', 'col-2');
                    buttonElement3.setAttribute('type', 'button');
                    buttonElement3.addEventListener('click', () => {
                        const button = document.getElementById('modal-delete-ticket').querySelector('.modal-ok-btn');
                        button.setAttribute('flight_id', this.#flightID);
                        button.setAttribute('ticket_id', this.#ticketID);
                        document.getElementById('modal-delete-ticket').showModal();
                    });
                    buttonElement3.innerHTML = '&#10008;';

                div3.appendChild(buttonElement2);
                div3.appendChild(buttonElement3);

            divOuter.appendChild(div1);
            divOuter.appendChild(div2);
            divOuter.appendChild(div3);

        liElement.appendChild(divOuter);

        return liElement;
    }
};
