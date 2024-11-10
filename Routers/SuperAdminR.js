const express = require('express');
const {cleanupDatabase} = require('../Controllers/SuperAdminC.js'); 
const {authenticateToken} = require('../Auth/Auth.js')
const {checkRole} = require('../middleware/CheckRole.js')


let superAdminRoute = express.Router();

superAdminRoute.get('/superAdmCleanUp',authenticateToken,checkRole(["3"]), cleanupDatabase);

module.exports = {superAdminRoute};