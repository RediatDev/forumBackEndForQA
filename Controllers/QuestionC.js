const {Question,User, Sequelize} = require('../models');
const fs = require('fs');
const path = require('path');
let createQuestion = async (req, res) => {
    const { title, description, tag } = req.body;
    const { userId } = req.user;
    const errors = [];

    // Validate the required fields
    if (!title) errors.push("Title is required.");
    if (!description) errors.push("Description is required.");
    if (!tag) errors.push("At least one tag is required.");

    // Check for file validation error (from multer's fileChecker)
    if (req.fileValidationError) {
        errors.push(req.fileValidationError);
    }

    // If there are any errors, return them and do not proceed to file saving
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    } else {
        try {
            let imageLink = null;

            // If there's a file and no errors, manually save it to the disk
            if (req.file) {
                const imagePath = `./ImageStore/${Date.now()}_${req.file.originalname}`;
                
                // Write file from memory buffer to disk
                fs.writeFileSync(imagePath, req.file.buffer);

                imageLink = imagePath; // Store the path to save in the DB
            }

            // Create the question
            const newQuestion = await Question.create({
                title,
                description,
                imageLink,
                tag,
                userId,
            });

            // Respond with the created question
            return res.status(201).json({ message: "Question created successfully" });
        } catch (err) {
            // Handle Sequelize validation errors
            if (err.name === "ValidationErrorItem") {
                const validationErrors = err.errors.map(e => e.message);
                return res.status(400).json({ errors: [validationErrors.message] });
            }
     
            return res.status(500).json({ errors: [err.message] });
        }
    }
};

let updateQuestion = async (req, res) => {
    const { questionId } = req.params; 
    const { title, description, tag } = req.body;
    const userId = req.user.userId; 
    const errors = [];

    // Ensure the question ID is provided
    if (!questionId) {
        errors.push("Question ID is required.");
    }

    // Check for file validation error (from multer's fileChecker)
    if (req.fileValidationError) {
        errors.push(req.fileValidationError);
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }else{
        try {
            // Find the question by ID and userId
            const question = await Question.findOne({ where: { questionId, userId } });
    
            // Check if question exists and belongs to the logged-in user
            if (!question) {
                return res.status(404).json({ errors: ["Question not found"] });
            }
    
            // Update fields only if they are provided
            if (title) question.title = title;
            if (description) question.description = description;
            if (tag) question.tag = tag;
    
            let newImageLink = null;
    
            // If a new image file is provided, handle file saving and old image deletion
            if (req.file) {
                newImageLink = `./ImageStore/${Date.now()}_${req.file.originalname}`;
                
                // Write the new image file from memory buffer to disk
                fs.writeFileSync(newImageLink, req.file.buffer);
                
                // Delete the old image file if it exists
                if (question.imageLink) {
                    const oldImagePath = path.resolve(question.imageLink);
                    
                    // Check if the old file exists before attempting to delete
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath); // Delete the old image file
                    }
                }
                
                // Update the image link to the new one
                question.imageLink = newImageLink;
            }
    
            // Save the updated question to the database
            await question.save();
    
            // Respond with the updated question
            return res.status(200).json({ message: "Question updated successfully"});
    
        } catch (err) {
            // Handle Sequelize validation errors
            if (err.name === "ValidationErrorItem") {
                const validationErrors = err.errors.map(e => e.message);
                return res.status(400).json({ errors: [validationErrors.message] });
            }
     
            return res.status(500).json({ errors: [err.message] });
        }
    }

    
};

let deleteQuestion = async (req, res) => {
    const { questionId } = req.params; 
    const {userId} = req.user;
    // Validation check
    if (!questionId) {
        return res.status(400).json({ errors: ["Question ID is required."] });
    }

    try {
        // Find the question by ID and ensure it belongs to the logged-in user
        const question = await Question.findOne({ where: { questionId, userId } });

        // Check if the question exists and belongs to the authenticated user
        if (!question) {
            return res.status(404).json({ errors: ["Question not found"] });
        }

        // If the question has an associated image, delete the image file from local storage
        if (question.imageLink) {
            const imagePath = path.resolve(question.imageLink); // Resolve the full path of the image

            // Check if the image file exists before attempting to delete
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the image file
            }
        }

        // Delete the question from the database
        await question.destroy();

        // Respond with a success message
        return res.status(200).json({ message: "Question and associated image deleted successfully." });

    } catch (err) {
        // Handle Sequelize validation errors
        if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }
 
        return res.status(500).json({ errors: [err.message] });
    }
};

let getSingleQuestion = async (req, res) => {
    const { questionId } = req.params; 
    // Validation check
    if (!questionId) {
        return res.status(400).json({ errors: ["Question ID is required."] });
    }

    try {
        // Find the question by ID
        const question = await Question.findOne({
            where: { questionId },
            include: [{
                model: User, 
                attributes: ['userId','username', 'email'] 
            }]
        });

        // Check if the question exists
        if (!question) {
            return res.status(404).json({ errors: ["Question not found."] });
        }

        // Respond with the question data
        return res.status(200).json({ question });

    } catch (err) {
         // Handle Sequelize validation errors
         if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }
 
        return res.status(500).json({ errors: [err.message] });
    }
};

let getAllQuestionBySingleUser = async (req, res) => {
    const { userId,userName } = req.user;
    // Validation check
    if (!userId) {
        return res.status(400).json({ errors: ["User ID is required."] });
    }

    try {
        // Find all questions by the given userId
        const questions = await Question.findAll({
            where: { userId }, // Find all questions where userId matches
            include: [{
                model: User, 
                attributes: ['userId', 'username', 'email'] // Optionally include user info
            }]
        });

        // Check if there are questions
        if (questions.length === 0) {
            return res.status(404).json({ errors: [`No questions found uploaded by ${userName}`] });
        }

        // Respond with the user's questions
        return res.status(200).json({ questions });

    } catch (err) {
        // Handle Sequelize validation errors
        if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }

        return res.status(500).json({ errors: [err.message] });
    }
};

let getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [{
                model: User, // Include User information if needed
                attributes: ['userId','username', 'email'] 
            }],
            order: [['createdAt', 'DESC']] 
        });

        // Check if there are any questions
        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found." });
        }

        // Respond with the list of questions
        return res.status(200).json({ questions });

    } catch (err) {
        // Handle Sequelize validation errors
        if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }

        return res.status(500).json({ errors: [err.message] });
    }
};


let getQuestionByTag = async (req, res) => {
    const { tag } = req.body; 
    // Validation check
    if (!tag) {
        return res.status(400).json({ errors: ["Tag is required."] });
    }

    try {
        // Fetch questions by tag
        const questions = await Question.findAll({
            where: { tag }, 
            include: [{
                model: User, 
                attributes: ['userId','username', 'email'] 
            }],
            order: [['createdAt', 'DESC']] 
        });

        // Check if any questions were found
        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this tag." });
        }

        // Respond with the list of questions
        return res.status(200).json({ questions });

    } catch (err) {
        // Handle Sequelize validation errors
        if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }

        return res.status(500).json({ errors: [err.message] });
    }
};

const imageSender = async (req, res) => {
	const { imageLink } = req.params;
	const imagePath = `ImageStore/${imageLink}`;
	fs.readFile(imagePath, (err, data) => {
		if (err) {
            return res.status(404).json({ errors: "File not found" });
		} else {
			// Extract the file extension to determine the content type
			const fileExtension = imageLink.split('.').pop();
			let contentType = 'image/png'; // default to PNG

			if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
				contentType = 'image/jpeg';
			} else if (fileExtension === 'png') {
				contentType = 'image/png';
			}

			// Set the content type before sending the response
			res.setHeader('Content-Type', contentType);
			res.send(data);
		}
	});
};

let getAllTags = async (req, res) => {
    try {
        // Fetch all unique tags from the Question table
        const tagsData = await Question.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('tag')), 'tag']
            ]
        });

        // Map the result to get an array of tag names
        const tags = tagsData.map(tagObj => tagObj.tag);

        // Respond with the list of unique tags in an array
        return res.status(200).json({ tags });

    } catch (err) {
        // Handle Sequelize validation errors
        if (err.name === "ValidationErrorItem") {
            const validationErrors = err.errors.map(e => e.message);
            return res.status(400).json({ errors: [validationErrors.message] });
        }

        return res.status(500).json({ errors: [err.message] });
    }
};



module.exports ={
    createQuestion,updateQuestion,deleteQuestion,getSingleQuestion,getAllQuestions,getQuestionByTag,imageSender,getAllQuestionBySingleUser,getAllTags
}

