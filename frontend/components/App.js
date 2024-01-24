import Flight from "./Flight";
import Ticket from "./Ticket";
import AppModel from "../model/AppModel";

export default class App {
    #flights = [];

    // uuid() {
    //     return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    //         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //     );
    // }

    // Функция очистки формы с заданными инпутами
    clearInputs = (ids) => {
        let input;
        for (let id of ids) {
            input = document.getElementById(id);
            input.value = '';
        }
    }

    // Функция чтения заданных инпутов
    readInputs = (ids, keys) => {
        let input
        let inputs = new Map();
        let i = 0;

        for (let id of ids) {
            input = document.getElementById(id);
            if (input.value) {
                inputs.set(keys[i], input.value);
            }
            i++;
        }
        return inputs;
    }

    // Функция создания нового рейса
    addNewFlight = async ({
            flightID,
            destination,
        }) => {
        try {
            const addFlightResult = await AppModel.addFlight({
                flightID,
                place: destination,
            });

            const newFlight = new Flight({
                flightID,
                fullName: destination,
            });
            this.#flights.push(newFlight);
            this.render();

            this.addNotification({ text: addFlightResult.message, type: 'success' });
            console.log(addFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    // Функция изменения параметров существующего рейса
    editFlight = async ({
            flightID,
            destination
        }) => {
        try {
            const editFlightResult = await AppModel.editFlight({
                flightID,
                place: destination
            });

            const flightObject = this.#flights.find((flight) => flight.flightID === flightID);

            flightObject.fullName = destination;

            this.render();

            this.addNotification({ text: editFlightResult.message, type: 'success' });
            console.log(editFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    // Функция удаления существующего рейса
    deleteFlight = async ({ flightID }) => {
        try {
            const deleteFlightResult = await AppModel.deleteFlight({ flightID });

            this.#flights = this.#flights.filter((flight) => flight.flightID !== flightID);

            this.render();

            this.addNotification({ text: deleteFlightResult.message, type: 'success' });
            console.log(deleteFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }

    }

    // Функция добавления нового билета
    addNewTicket = async ({
              ticketID,
              fullName,
              startDate,
              endDate,
              flightID
        }) => {

        try {
            const addTicketResult = await AppModel.addTicket({
                ticketID,
                fullName,
                startDate,
                endDate,
                flightID
            });

            const newTicket = new Ticket({
                ticketID,
                fullName,
                startDate,
                endDate,
                flightID
            });

            this.#flights.find((flight) => flight.flightID === flightID).appendNewTicket(newTicket);

            this.render();

            this.addNotification({ text: addTicketResult.message, type: 'success' });
            console.log(addTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    // Функция удаления билета
    deleteTicket = async ({
        flightID,
        ticketID,
    }) => {

        try {
            const deleteTicketResult = await AppModel.deleteTicket({ ticketID });

            const flightObject = this.#flights.find((flight) => flight.flightID === flightID);

            flightObject.popTicket(ticketID);

            this.render();

            this.addNotification({ text: deleteTicketResult.message, type: 'success' });
            console.log(deleteTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    // Функция переноса билета в другой рейс
    moveTicket = async ({
        srcFlightID,
        ticketID,
        destFlightID
    }) => {

        try {
            const moveTicketResult = await AppModel.moveTicket({
                ticketID,
                srcFlightID,
                destFlightID
            });

            const srcFlightObject = this.#flights.find((flight) => flight.flightID === srcFlightID);
            const ticketObject = srcFlightObject.tickets.find((ticket) => ticket.ticketID === ticketID);
            const destFlightObject = this.#flights.find((flight) => flight.flightID === destFlightID);

            srcFlightObject.popTicket(ticketID);
            ticketObject.flightID = destFlightID;
            destFlightObject.appendNewTicket(ticketObject);

            this.render();

            this.addNotification({ text: moveTicketResult.message, type: 'success' });
            console.log(moveTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    render() {
        document.querySelector('.flights-list').remove();

        const ulElement = document.createElement('ul');
        ulElement.classList.add('flights-list', 'row');

        const liElement = document.createElement('li');
        liElement.classList.add('row', 'flights-adder-li');

        const buttonElement = document.createElement('button');
        buttonElement.classList.add('flights-adder', 'btn', 'btn-outline-danger');
        buttonElement.setAttribute('type', 'button');
        buttonElement.innerHTML = '&#10010; Добавить билборд';
        buttonElement.addEventListener('click', () => { document.getElementById('modal-add-flight').showModal(); });

        liElement.appendChild(buttonElement);

        ulElement.appendChild(liElement);

        const mainElement = document.querySelector('.app-main');
        mainElement.appendChild(ulElement);

        for (let flight of this.#flights) {
            const flightElement = flight.render();
            const flightAdderElement = document.querySelector('.flights-adder-li');
            flightAdderElement.parentElement.insertBefore(flightElement, flightAdderElement);
        }
    }

    async init() {

        // Очистка форм диалогов и закрытие модального окна при нажатии кнопки Отмена
        // РЕЙСЫ
        document.getElementById('modal-add-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-flight-input-id',
                    'modal-add-flight-input-destination',
                    'modal-add-flight-input-departure_timestamp',
                    'modal-add-flight-input-airplane_id',
                ];
                document.getElementById('modal-add-flight').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-edit-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-edit-flight-input-destination',
                    'modal-edit-flight-input-departure_timestamp',
                    'modal-edit-flight-input-airplane_id',
                ];
                document.getElementById('modal-edit-flight').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-delete-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                document.getElementById('modal-delete-flight').close();
            });
        // БИЛЕТЫ
        document.getElementById('modal-add-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-ticket-input-id',
                    'modal-add-ticket-input-full_name'
                ];
                document.getElementById('modal-add-ticket').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-move-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-move-ticket-input-flight_id',
                ];
                document.getElementById('modal-move-ticket').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-delete-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                document.getElementById('modal-delete-ticket').close();
            });

        // Добавление обработчиков CRUD операций на кнопки соответствующие им кнопки ОК
        // РЕЙСЫ
        document.getElementById('modal-add-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-flight-input-destination'
                ];
                const keys = [
                    'destination',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    destination,
                } = {
                    destination: inputs.get(keys[0]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-add-flight').close();

                const flightID = crypto.randomUUID();

                this.addNewFlight({
                    flightID,
                    destination,
                });
            });
        document.getElementById('modal-edit-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                const ids = [
                    'modal-edit-flight-input-destination'
                ];
                const keys = [
                    'destination',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    destination,
                } = {
                    destination: inputs.get(keys[0]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-edit-flight').close();

                this.editFlight({
                    flightID,
                    destination,
                });
            });
        document.getElementById('modal-delete-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                document.getElementById('modal-delete-flight').close();

                this.deleteFlight({
                    flightID
                });
            });
        // БИЛЕТЫ
        document.getElementById('modal-add-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                const ids = [
                    'modal-add-ticket-input-full_name',
                    'modal-add-ticket-input-start_date',
                    'modal-add-ticket-input-end_date'
                ];
                const keys = [
                    'fullName',
                    'startDate',
                    'endDate'
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    fullName,
                    startDate,
                    endDate
                } = {
                    fullName: inputs.get(keys[0]),
                    startDate: inputs.get(keys[1]),
                    endDate: inputs.get(keys[2]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-add-ticket').close();

                const ticketID = crypto.randomUUID();

                this.addNewTicket({
                    ticketID,
                    fullName,
                    startDate,
                    endDate,
                    flightID
                });
            });
        document.getElementById('modal-delete-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');
                const ticketID = event.target.getAttribute('ticket_id');

                document.getElementById('modal-delete-ticket').close();

                this.deleteTicket({
                    flightID,
                    ticketID
                });
            });
        document.getElementById('modal-move-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const srcFlightID = event.target.getAttribute('flight_id');
                const ticketID = event.target.getAttribute('ticket_id');

                const ids = [
                    'modal-move-ticket-input-flight_id',
                ];
                const keys = [
                    'destFlightID',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    destFlightID
                } = {
                    destFlightID: inputs.get(keys[0]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-move-ticket').close();

                this.moveTicket({
                    srcFlightID,
                    ticketID,
                    destFlightID
                });
            });


        try {
            const {flights} = await AppModel.getFlights();

            // Перенос серверной модели данных на клиент
            for (const flight of flights) {
                const flightObject = new Flight({
                    flightID: flight.billboardID,
                    fullName: flight.place,
                })

                for (const ticket of flight.orders) {
                    const ticketObject = new Ticket({
                        ticketID: ticket.orderID,
                        fullName: ticket.fullName,
                        startDate: ticket.startDate,
                        endDate: ticket.endDate,
                        flightID: ticket.billboardID
                    })

                    flightObject.appendNewTicket(ticketObject);
                }

                this.#flights.push(flightObject);
            }

            this.render();
        } catch(err) {
            this.addNotification({ text: err.message, type: 'error' });
        }
    }

    addNotification = ({ text, type }) => {
        const notifications = document.getElementById('app-notifications');

        const notificationID = crypto.randomUUID();
        const notification = document.createElement('div');
        notification.classList.add(
            'notification',
            type === 'success' ? 'notification-success' : 'notification-error'
        );
        notification.setAttribute('id', notificationID);
        notification.innerHTML = text;

        notifications.appendChild(notification);

        notifications.show();

        setTimeout(() => {document.getElementById(notificationID).remove();}, 5000);
    }
};
