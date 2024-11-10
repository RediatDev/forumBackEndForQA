module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
      answerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "userId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "questions",
          key: "questionId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      answer: {
        type: DataTypes.STRING(200), // VARCHAR(200)
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(200), // VARCHAR(200) for the URL
        allowNull: true, // Allow it to be null
        defaultValue: "NOT PROVIDED !",
      },
      createdAt: {
        type: DataTypes.DATE, // TIMESTAMP for created_at
        defaultValue: DataTypes.NOW, // Equivalent to DEFAULT CURRENT_TIMESTAMP
      },
      updatedAt: {
        type: DataTypes.DATE, // TIMESTAMP for updated_at
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, // Automatically update on modification
      },
    },
    {
      timestamps: true, // Automatically handles createdAt and updatedAt
      tableName: "answers", // Explicitly specify the table name
    }
  );

  // Associations
  Answer.associate = (models) => {
    Answer.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Answer.belongsTo(models.Question, {
      foreignKey: "questionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Answer;
};
