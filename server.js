require('dotenv').config();
const express = require('express');
const server = express();
const { Pool } = require('pg');
server.use(express.json()); // Middleware to parse JSON
const userRoutes = require('./src/routes/getClientByIdApi');
const userLoginApi = require('./src/routes/userLogin');
const userRegisterApi = require('./src/routes/userRegisterApi');
const createOrderApi = require('./src/routes/createOrderApi');
const createClientApi = require('./src/routes/createClientApi');
const getDriversApi = require('./src/routes/getDrivers');
const getOrdersApi = require('./src/routes/getOrdersApi');
const getClients = require('./src/routes/getClients.js');
const getAllClientData = require('./src/routes/getAllClientDataById.js');
const driverPasswordChange =  require('./src/routes/driverPasswordChange.js');

// Import the scheduled job
require('./loyaltyBonusJob.js'); // This will start the cron job

// Use user routes
server.use('/api/clients', userRoutes);
//User login API
server.use('/api/login', userLoginApi);
//User register API
server.use('/api/register', userRegisterApi);
//Create order API
server.use('/api/orders', createOrderApi);
//Create client API
server.use('/api/clients/register', createClientApi);
//Get drivers API
server.use('/api/drivers', getDriversApi);
//Get orders API
server.use('/api/getOrders', getOrdersApi);
//Get clients API
server.use('/api/allClients', getClients);
//Get all client data by ID API
server.use('/api/allClientDataById', getAllClientData);
//Get all client data by ID API
server.use('/api/driverPasswordChange', driverPasswordChange);

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});