const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { User, Question, Answer } = require('../models');

const cleanupDatabase = async (req, res) => {
  try {

    // Delete all users except the super admin
    await User.destroy({ where: { role: { [Op.ne]: 3 } } });

    // Delete all questions
    await Question.destroy({ where: {} });

    // Delete all answers
    await Answer.destroy({ where: {} });

    // Remove all image files in the ImageStore folder
    fs.readdir('ImageStore/', (err, files) => {
      if (err) {
        console.log("Error reading ImageStore directory:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join('ImageStore/', file);
        // Check if the file is a .png or .jpeg
        if (file.endsWith('.png') || file.endsWith('.jpeg')) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(`Error deleting file ${file}:`, err);
            } else {
              console.log(`Deleted file: ${file}`);
            }
          });
        }
      });
    }); 
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [err.message] });
  }
};

module.exports = {
  cleanupDatabase,
};
