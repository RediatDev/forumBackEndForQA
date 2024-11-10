const { Answer,User } = require('../models'); 

// Create a new answer
const createAnswer = async (req, res) => {
  const { userId } = req.user;
  const { questionId } = req.params;
  try {
    const { answer, url } = req.body;
    console.log("this are answer and urls",answer,url)

    // Validate that the answer is not empty
    if (!answer || answer.trim() === "") {
      return res.status(400).json({ errors: ["Answer cannot be empty."] });
    }

    // Check if the URL is provided and validate its format
    if (url && !url.startsWith("https://www.")) {
      return res.status(400).json({ errors: ["Invalid URL format. URL must start with 'https://www.'"] });
    }

    // Create the answer
    const newAnswer = await Answer.create({
      userId,
      questionId,
      answer,
      url: url || null,
    });

    return res.status(201).json({ message: "Answer created successfully" });
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map(e => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
  }
  return res.status(500).json({ errors: [err.message] });
  }
};

// Get answers by question ID
let getAnswerByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.findAll({
      where: { questionId },
      include: [{
        model: User, 
        attributes: ['userId','username', 'email'] 
    }]
    });
    console.log(answers)
    return res.status(200).json(answers);
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map(e => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
  }
  return res.status(500).json({ errors: [err.message] });
  }
};

// Update an answer
const updateAnswer = async (req, res) => {
  try {
    const { answerId,questionId } = req.params; 
    const { answer, url } = req.body;
    const {userId}=req.user

    // Create an object to hold the fields to update
    const updateData = {};

    // Add fields to updateData if they are provided and not empty
    if (answer !== undefined && answer.trim() !== "") { // Check if provided and not empty
      updateData.answer = answer;
    }
    if (url !== undefined && url.trim() !== "") { // Check if provided and not empty
      updateData.url = url;
    }

    // If no fields to update, return a bad request response
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "At least one field should be passed for updating." });
    }

    // Validate URL format if provided
    if (url && !url.startsWith("https://www.")) {
      return res.status(400).json({ errors: ["Invalid URL format. URL must start with 'https://www.'"] });
    }

    const [updated] = await Answer.update(updateData, { where: { answerId,questionId,userId } });

    if (updated) { 
      const updatedAnswer = await Answer.findOne({ where: { answerId } });
      return res.status(200).json(updatedAnswer);
    }

    return res.status(404).json({ message: "Answer not found" });
  } catch (error) {
    console.error("Error updating answer:", error);
    if (error.name === "ValidationErrorItem") {
      const validationErrors = error.errors.map(e => e.message);
      return res.status(400).json({ errors: validationErrors });
    }
    return res.status(500).json({ errors: [error.message] });
  }
};

// Delete an answer
let deleteAnswer = async (req, res) => {
    try {
      const { answerId } = req.params; 
      const deleted = await Answer.destroy({
        where: { answerId },
      });
  
      if (deleted) {
        return res.status(200).json({ message: "Answer deleted successfully" }); 
      }
  
      return res.status(404).json({ message: "Answer not found" });
    } catch (error) {
      if (error.name === "ValidationErrorItem") {
        const validationErrors = error.errors.map(e => e.message);
        return res.status(400).json({ errors: validationErrors });
      }
      return res.status(500).json({ errors: [error.message] });
    }
  };
  

// Get answers by user ID
let getAnswerByUserId = async (req, res) => {
  try {
    const { userId } = req.user;
    const { questionId } = req.params;

    console.log("to get answer by a single user",userId,questionId)
    const answers = await Answer.findAll({
      where: { userId ,questionId},
    });
    return res.status(200).json(answers);
  } catch (error) {
    if (error.name === "ValidationErrorItem") {
      const validationErrors = error.errors.map(e => e.message);
      return res.status(400).json({ errors: validationErrors });
    }
    return res.status(500).json({ errors: [error.message] });
  }
};



module.exports = {
  createAnswer,
  getAnswerByQuestionId,
  updateAnswer,
  deleteAnswer,
  getAnswerByUserId,
};
