export default class AppModel {
    static async getFlights() {
        try {
            const flightsResponse = await fetch('http://localhost:6116/billboards');
            const flightsBody = await flightsResponse.json();

            if (flightsResponse.status !== 200) {
                return Promise.reject(flightsBody);
            }

            return {
                flights: flightsBody.billboards,
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    // РЕЙСЫ
    static async addFlight({
        flightID,
        place
    }) {
        try {
            const addFlightResponse = await fetch(
                'http://localhost:6116/billboards',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        billboardID: flightID,
                        place
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (addFlightResponse.status !== 200) {
                const addFlightBody = await addFlightResponse.json();
                return Promise.reject(addFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Биллборд ${flightID} успешно создан`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async editFlight({
        flightID,
        place
    }) {
        try {
            const editFlightResponse = await fetch(
                `http://localhost:6116/billboards/${flightID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        place
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (editFlightResponse.status !== 200) {
                const editFlightBody = await editFlightResponse.json();
                return Promise.reject(editFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Биллборд ${flightID} успешно изменен`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async deleteFlight({ flightID }) {
        try {
            const deleteFlightResponse = await fetch(
                `http://localhost:6116/billboards/${flightID}`,
                {
                    method: 'DELETE',
                }
            );

            if (deleteFlightResponse.status !== 200) {
                const deleteFlightBody = await deleteFlightResponse.json();
                return Promise.reject(deleteFlightBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Биллборд ${flightID} успешно удален`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    // БИЛЕТЫ
    static async addTicket({
        ticketID,
        fullName,
        startDate,
        endDate,
        flightID
    }) {
        try {
            const addTicketResponse = await fetch(
                'http://localhost:6116/orders',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        orderID: ticketID,
                        fullName,
                        startDate,
                        endDate,
                        billboardID: flightID
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (addTicketResponse.status !== 200) {
                const addTicketBody = await addTicketResponse.json();
                return Promise.reject(addTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Заявка ${ticketID} успешно создана`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async deleteTicket({ ticketID }) {
        try {
            const deleteTicketResponse = await fetch(
                `http://localhost:6116/orders/${ticketID}`,
                {
                    method: 'DELETE',
                }
            );

            if (deleteTicketResponse.status !== 200) {
                const deleteTicketBody = await deleteTicketResponse.json();
                return Promise.reject(deleteTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Заявка ${ticketID} успешно удалена`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async moveTicket({
            ticketID,
            srcFlightID,
            destFlightID
        }) {
        try {
            const moveTicketResponse = await fetch(
                `http://localhost:6116/billboards`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        orderID: ticketID,
                        srcBillboardID: srcFlightID,
                        destBillboardID: destFlightID
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (moveTicketResponse.status !== 200) {
                const moveTicketBody = await moveTicketResponse.json();
                return Promise.reject(moveTicketBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Заявка ${ticketID} успешно перемещена`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }
};