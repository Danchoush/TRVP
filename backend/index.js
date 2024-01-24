import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import DB from './db/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appHost = process.env.APP_BACKEND__HOST;
const appPort = Number(process.env.APP_BACKEND__PORT);

const minPeriod = Number(process.env.APP_BACKEND__MIN_PERIOD);
const maxPeriod = Number(process.env.APP_BACKEND__MAX_PERIOD);

const app = express();

const db = new DB();

app.use('*', (req, res, next) => {
    console.log(
        req.method,
        req.baseUrl || req.url,
        new Date().toISOString()
    );
    next();
});

app.use('/', express.static(path.resolve(__dirname, '../dist')));

//                                      БИЛЛБОРДЫ

// GET
app.get('/billboards', async (req, res) => {
    try {
        const [dbFlights, dbTickets] =
           await Promise.all([db.getFlights(), db.getTickets()]);

        const tickets = dbTickets.map(({
            id,
            full_name,
            start_date,
            end_date,
            billboard_id
        }) => ({
            orderID: id,
            fullName: full_name,
            startDate: start_date,
            endDate: end_date,
            billboardID: billboard_id
        }))

        const billboards = dbFlights.map(flight => ({
            billboardID: flight.id,
            place: flight.place,
            orders: tickets.filter(ticket => flight.orders.indexOf(ticket.orderID) !== -1)
        }))

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ billboards });
    } catch (err) {
        res.statusCode = 500;
        res.statusMessage = 'Internal server error';
        res.json({
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `Getting billboards and tickets error: ${err}`
        });
    }
});

// POST
app.use('/billboards', express.json());
app.post('/billboards', async (req, res) => {
    try {
        const {
            billboardID,
            place
        } = req.body;

        await db.addFlight({ billboardID, place });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Create billboard error: ${err.error.message || err.error}`
        });
    }
});

// PATCH
app.use('/billboards/:billboardID', express.json());
app.patch('/billboards/:billboardID', async (req, res) => {
    try {
        const { billboardID } = req.params;
        const {
            place
        } = req.body;

        await db.updateFlight({ billboardID, place });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Update billboard error: ${err.error.message || err.error}`
        });
    }
});

// DELETE
app.delete('/billboards/:billboardID', async (req, res) => {
    try {
        const { billboardID } = req.params;

        await db.checkIfFlightIsEmpty({ billboardID });
        await db.deleteFlight({ billboardID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Delete billboard error: ${err.error.message || err.error}`
        });
    }
});

//                                      ЗАЯВКИ

// POST
app.use('/orders', express.json());
app.post('/orders', async (req, res) => {
    try {
        const {
            orderID,
            fullName,
            startDate,
            endDate,
            billboardID
        } = req.body;

        // Цепочка из проверки допустимости создания и создания
        await db.checkFlightCapacity({
            startDate,
            endDate,
            minPeriod,
            maxPeriod
        });
        await db.addTicket({
            orderID,
            fullName,
            startDate,
            endDate,
            billboardID
        });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Create order error: ${err.error.message || err.error}`
        });
    }
});

// DELETE
app.delete('/orders/:orderID', async (req, res) => {
    try {
        const { orderID } = req.params;
        await db.deleteTicket({ orderID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Delete order params error: ${err.error.message || err.error}`
        });
    }
});

// PATCH
app.patch('/billboards', async (req, res) => {
    try {
        const {
            orderID,
            srcBillboardID,
            destBillboardID
        } = req.body;

        await db.moveTicket({ orderID, srcBillboardID, destBillboardID });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send();
    } catch(err) {
        switch (err.type) {
            case 'client':
                res.statusCode = 400;
                res.statusMessage = 'Bad request';
                break;

            default:
                res.statusCode = 500;
                res.statusMessage = 'Internal server error';
        }

        res.json({
            timestamp: new Date().toISOString(),
            statusCode: res.statusCode,
            message: `Move billboard params error: ${err.error.message || err.error}`
        });
    }
});

app.listen(appPort, appHost, async () => {
    try {
        await db.connect();
    } catch (error) {
        console.log('Billboard manager app shut down');
        process.exit(100);
    }

    console.log(`Billboard manager app started at host http://${appHost}:${appPort}`);
});

process.on('SIGTERM', () => {
   console.log('SIGTERM signal received: closing HTTP server..');
   server.close(async  () => {
       await db.disconnect();
       console.log('HTTP server was closed');
   });
});