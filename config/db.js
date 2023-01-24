const mongoose = require('mongoose');

const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,

};

const connect = (dbUrl) => {
    if (!dbUrl) {
        throw new Error(
            '[DB] The database URL is not defined. If the app is hosted: have you configured the env vars? If the app is local: have you created the .env file?',
        );
    }
    console.info(`[DB] Connecting to .ENV URL...`);

    mongoose
        .connect(dbUrl, mongooseOpts)
        .then(async () => {
            console.info('[DB] Connected');


        })
        .catch((error) => {
            console.error(error);
            console.error('[DB] This error is fatal');
            process.exit(1);
        });
};

const disconnect = () => {
    mongoose.disconnect();
};

module.exports = {
    connect,
    disconnect,
    mongooseOpts,
};
