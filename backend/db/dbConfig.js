const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'Expense_Tracker',
        });
        console.log(`Database Connected : ${connect.connection.host}, ${connect.connection.name}`);
        console.log("MONGO URI:", process.env.MONGO_URL);


    } catch (error) {
        console.error('Database Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = { dbConnect };
