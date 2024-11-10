const express = require('express');
const AllRouters = express.Router();
const {answerCreateRouter} = require('./Routers/AnswerR')
const {questionCreateRouter} = require('./Routers/QuestionR')
const {userCreateRouter} = require('./Routers/UserR')
const {superAdminRoute} = require('./Routers/SuperAdminR')


AllRouters.use('/users', userCreateRouter);
AllRouters.use('/questions', questionCreateRouter);
AllRouters.use('/answers', answerCreateRouter);
AllRouters.use('/superAdmin', superAdminRoute);


module.exports = { AllRouters };