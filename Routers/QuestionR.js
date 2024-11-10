const express = require('express');
const {createQuestion,updateQuestion,deleteQuestion,getSingleQuestion,getAllQuestions,getQuestionByTag,imageSender, getAllQuestionBySingleUser,getAllTags} = require('../Controllers/QuestionC.js'); 
const {authenticateToken} = require('../Auth/Auth.js')
const {checkRole} = require('../middleware/CheckRole.js')
const ImageFileUploader  = require('../middleware/ImageFileHandler.js')

let questionCreateRouter = express.Router();

questionCreateRouter.post('/createQuestion',authenticateToken,ImageFileUploader.single('image_file'), createQuestion);

questionCreateRouter.patch('/updateQuestion/:questionId',authenticateToken,ImageFileUploader.single('image_file'),updateQuestion);

questionCreateRouter.delete('/deleteQuestion/:questionId',authenticateToken, deleteQuestion);
questionCreateRouter.get('/getQuestion/:questionId',authenticateToken, getSingleQuestion);
questionCreateRouter.get('/getQuestionByUser',authenticateToken, getAllQuestionBySingleUser);
questionCreateRouter.get('/getAllQuestion',authenticateToken, getAllQuestions);
questionCreateRouter.get('/getQuestionByTag',authenticateToken, getQuestionByTag);
questionCreateRouter.get('/getImage/:imageLink', imageSender);
questionCreateRouter.get('/getAllTags',authenticateToken, getAllTags);





module.exports = {questionCreateRouter};