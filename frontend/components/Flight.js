export default class Flight {
    #tickets = [];
    #flightID;
    #fullName;

        constructor({
            flightID,
            fullName
        }) {
        this.#flightID = flightID;
        this.#fullName = fullName;
    }

    get flightID() { return this.#flightID; }

    get tickets() { return this.#tickets; }

    set fullName(value) { this.#fullName = value; }

    appendNewTicket(ticketObject) {
        this.#tickets.push(ticketObject);
    }

    popTicket(ticketID) {
        this.#tickets = this.#tickets.filter((ticket) => ticket.ticketID !== ticketID);
    }

    render() {

        const liElement = document.createElement('li');
        liElement.classList.add('flights-list__item', 'flight', 'row');

            const divOuter = document.createElement('div');
            divOuter.classList.add('flights-list__item-info');

                const div1 = document.createElement('div');
                div1.classList.add('flights-list__item-info__header', 'row')

                    const span1 = document.createElement('span');
                    span1.classList.add('clarify-text', 'col-2', 'align-self-end');
                    span1.innerHTML = 'Адрес:';

                    const span2 = document.createElement('span');
                    span2.classList.add('flight__full_name', 'col-8', 'align-self-end');
                    span2.innerHTML = this.#fullName;

                    const buttonEdit = document.createElement('button');
                    buttonEdit.classList.add('flight__edit-btn', 'btn', 'btn-outline-primary', 'col-2');
                    buttonEdit.setAttribute('type', 'button');
                    buttonEdit.innerHTML = '&#10000;';
                    buttonEdit.addEventListener('click', () => {
                        document.getElementById('modal-edit-flight').querySelector('.modal-ok-btn')
                            .setAttribute('flight_id', this.#flightID);
                        document.getElementById('modal-edit-flight').showModal();
                    });

                    const buttonDelete = document.createElement('button');
                    buttonDelete.classList.add('flight__delete-btn', 'btn', 'btn-outline-danger', 'col-2');
                    buttonDelete.setAttribute('type', 'button');
                    buttonDelete.innerHTML = '&#10008;';
                    buttonDelete.addEventListener('click', () => {
                        document.getElementById('modal-delete-flight').querySelector('.modal-ok-btn')
                            .setAttribute('flight_id', this.#flightID);
                        document.getElementById('modal-delete-flight').showModal();
                    });

                div1.appendChild(span1);
                div1.appendChild(span2);
                div1.appendChild(buttonEdit);
                div1.appendChild(buttonDelete);

                const ulElement = document.createElement('ul');
                ulElement.classList.add('flight__tickets-list');

                // Добавление билетов
                let ticketElement;
                for(let ticket of this.#tickets) {
                    ticketElement = ticket.render();
                    ulElement.appendChild(ticketElement);
                }

                const div2 = document.createElement('div');
                div2.classList.add('row', 'justify-content-center');

                    const buttonAddTicket = document.createElement('button');
                    buttonAddTicket.classList.add('flight__add-ticket-btn', 'btn', 'btn-outline-danger', 'col-auto');
                    buttonAddTicket.setAttribute('type', 'button');
                    buttonAddTicket.innerHTML = '&#10010; Добавить заявку';
                    buttonAddTicket.addEventListener('click', () => {
                        document.getElementById('modal-add-ticket').querySelector('.modal-ok-btn')
                            .setAttribute('flight_id', this.#flightID);
                        document.getElementById('modal-add-ticket').showModal();
                    });

                div2.appendChild(buttonAddTicket);


            divOuter.appendChild(div1);
            divOuter.appendChild(ulElement);
            divOuter.appendChild(div2);

        liElement.appendChild(divOuter);

        return liElement;
    }
};
