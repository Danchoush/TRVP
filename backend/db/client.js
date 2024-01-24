import pg from 'pg';

export default class DB {
    #dbClient = null;
    #dbHost = '';
    #dbPort = '';
    #dbName = '';
    #dbLogin = '';
    #dbPassword = '';

    constructor() {
        this.#dbHost = process.env.DB__HOST;
        this.#dbPort = process.env.DB__PORT;
        this.#dbName = process.env.DB__DATABASE;
        this.#dbLogin = process.env.DB__USER;
        this.#dbPassword = process.env.DB__PASSWORD;

        this.#dbClient = new pg.Client({
            user: this.#dbLogin,
            password: this.#dbPassword,
            host: this.#dbHost,
            port: this.#dbPort,
            database: this.#dbName
        });
    }

    async connect() {
        try {
            await this.#dbClient.connect();
            console.log('DB connection established')
        } catch (error) {
            console.error('Unable to connect to DB: ', error)
        }
    }

    async disconnect() {
        await this.#dbClient.end();
        console.log('DB connection was closed')
    }

    //                                                      БИЛЛБОРДЫ

    async getFlights() {
        try {
            const flights = await this.#dbClient.query(
                'SELECT * FROM billboards;'
            );
            return flights.rows;
        } catch (error) {
            console.error('Unable to get billboards. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async addFlight({
        billboardID,
        place
    } = {
        billboardID: null,
        place: ''
    }) {
        if (!place) {
            const errMsg = `Add billboard error: wrong params (place: ${place})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'INSERT INTO billboards (id, place) VALUES ($1, $2);',
                [billboardID, place]
            );
        } catch (error) {
            console.error('Unable to create billboard. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async updateFlight({
        billboardID,
        place
    } = {
        billboardID: null,
        place: ''
    }) {
        if (!billboardID || !place) {
            const errMsg = `Update billboard error: wrong params (billboardID: ${billboardID}, place: ${place})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'UPDATE billboards SET place = $2 WHERE id = $1;',
                [billboardID, place]
            );
        } catch (error) {
            console.error('Unable to update billboard. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async deleteFlight ({ billboardID } = { billboardID: null }) {
        if (!billboardID) {
            const errMsg = `Delete billboard error: wrong params (billboardID: ${billboardID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'DELETE FROM billboards WHERE id = $1;',
                [billboardID]
            );
        } catch (error) {
            console.error('Unable to delete billboard. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    //                                                      ЗАЯВКИ

    async getTickets() {
        try {
            const tickets = await this.#dbClient.query(
                'SELECT * from orders;'
            );
            return tickets.rows;
        } catch (error) {
            console.error('Unable to get orders. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async addTicket({
        orderID,
        fullName,
        startDate,
        endDate,
        billboardID
    } = {
        orderID: null,
        fullName: '',
        startDate: null,
        endDate: null,
        billboardID: null
    }) {
        if (!orderID || !fullName || !startDate || !endDate || !billboardID ) {
            const errMsg = `Create order error: wrong params (orderID: ${orderID}, fullName: ${fullName}, startDate: ${startDate}, endDate: ${endDate}, billboardID: ${billboardID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'INSERT INTO orders (id, full_name, start_date, end_date, billboard_id) VALUES ($1, $2, $3, $4, $5);',
                [
                    orderID,
                    fullName,
                    startDate,
                    endDate,
                    billboardID
                ]
            );
            await this.#dbClient.query(
                'UPDATE billboards SET orders = array_append(orders, $1) WHERE id = $2;',
                [orderID, billboardID]
            );
        } catch (error) {
            console.error('Unable to create order. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async moveTicket({
        orderID,
        srcBillboardID,
        destBillboardID
    } = {
        orderID: null,
        srcBillboardID: null,
        destBillboardID: null
    }) {
        if (!orderID || !srcBillboardID || !destBillboardID) {
            const errMsg = `Move order error: wrong params (orderID: ${orderID}, srcBillboardID: ${srcBillboardID}, destBillboardID: ${destBillboardID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            await this.#dbClient.query(
                'UPDATE orders SET billboard_id = $2 WHERE id = $1;',
                [orderID, destBillboardID]
            );
            await this.#dbClient.query(
                'UPDATE billboards SET orders = array_append(orders, $1) WHERE id = $2;',
                [orderID, destBillboardID]
            );
            await this.#dbClient.query(
                'UPDATE billboards SET orders = array_remove(orders, $1) WHERE id = $2;',
                [orderID, srcBillboardID]
            );
        } catch (error) {
            console.error('Unable to move order. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    async deleteTicket ({ orderID } = { ticketID: null }) {
        if (!orderID ) {
            const errMsg = `Delete order error: wrong params (orderID: ${orderID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            const queryResult = await this.#dbClient.query(
                'SELECT billboard_id FROM orders WHERE id = $1;',
                [orderID]
            );

            const { billboard_id: billboardID } = queryResult.rows[0]; // TODO

            await this.#dbClient.query(
                'DELETE FROM orders WHERE id = $1;',
                [orderID]
            );

            await this.#dbClient.query(
                'UPDATE billboards SET orders = array_remove(orders, $1)\n WHERE id = $2;',
                [orderID, billboardID]
            );

        } catch (error) {
            console.error('Unable to delete order. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ДЛЯ ПРОВЕРОК

    // Метод проверки, пустой ли биллборд
    async checkIfFlightIsEmpty({ billboardID } = { billboardID: null }) {
        if (!billboardID ) {
            const errMsg = `Check if billboard is empty error: wrong params (billboardID: ${billboardID})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            const queryResult1 = await this.#dbClient.query(
                'SELECT orders FROM billboards WHERE id = $1;',
                [billboardID]
            );
            const currentTicketCount = queryResult1.rows[0]['orders'].length;

            if (currentTicketCount > 0) {
                const errMsg = `Billboard ${billboardID} is not empty`;
                return Promise.reject({
                    type: 'client',
                    error: new Error(errMsg)
                });
            }
        } catch (error) {
            console.error('Unable to check if billboard is empty. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }

    // Метод для проверки допустимости дат заявки
    async checkFlightCapacity({
        startDate,
        endDate,
        minPeriod,
        maxPeriod
    } = {
        startDate: null,
        endDate: null,
        minPeriod: -1,
        maxPeriod: -1
    }) {
        if (!startDate || !endDate) {
            const errMsg = `Check order period error: wrong params (startDate: ${startDate}, endDate: ${endDate})`;
            console.error(errMsg);
            return Promise.reject({
                type: 'client',
                error: new Error(errMsg)
            });
        }

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDiff = end.getTime() - start.getTime();
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (timeDiff <= 0) {
                const errMsg = `End date >= start date`;
                return Promise.reject({
                    type: 'client',
                    error: new Error(errMsg)
                });
            }

            console.log("diffDays", diffDays);
            console.log("minPeriod", minPeriod);
            console.log("maxPeriod", maxPeriod);

            if (!(diffDays >= minPeriod) || !(diffDays <= maxPeriod)) {
                const errMsg = `Order period does not satisfy limits`;
                return Promise.reject({
                    type: 'client',
                    error: new Error(errMsg)
                });
            }
        } catch (error) {
            console.error('Unable to check order period. Error: ', error);
            return Promise.reject({
                type: 'internal',
                error
            });
        }
    }
};