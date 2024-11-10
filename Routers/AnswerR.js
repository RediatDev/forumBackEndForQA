const express = require('express');
const {  createAnswer,getAnswerByQuestionId,updateAnswer,deleteAnswer,getAnswerByUserId} = require('../Controllers/AnswaerC.js'); 
const {authenticateToken} = require('../Auth/Auth.js')
const {checkRole} = require('../middleware/CheckRole.js')

let answerCreateRouter = express.Router();

answerCreateRouter.post('/createAnswer/:questionId',authenticateToken, createAnswer);
answerCreateRouter.get('/getAnswer/:questionId',authenticateToken,getAnswerByQuestionId);
answerCreateRouter.patch('/updateAnswer/:answerId/:questionId',authenticateToken, updateAnswer);
answerCreateRouter.delete('/deleteAnswer/:answerId',authenticateToken, deleteAnswer);
answerCreateRouter.get('/answerByUser/:questionId/:userId',authenticateToken, getAnswerByUserId);


module.exports = {answerCreateRouter};