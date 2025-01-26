const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config()

// Function to connect to the database using Mongoose
const databaseConnection = () => {
    mongoose.connect(process.env.MONOGODB_CLOUD).then(() => {
        console.log('Database connected successfully!!!') // Log a success message once the database is connected
    }).catch(err => {
        console.error('Database connection failed:', err); // Log an error message if the connection fails
    });
}

// Export the databaseConnection function so it can be used in other files
module.exports = databaseConnection;
