module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      questionId: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, 
        allowNull: false,
        references: {
          model: 'users', 
          key: 'userId', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(50), 
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200), 
        allowNull: false,
      },
      imageLink: {
        type: DataTypes.STRING, 
        allowNull: true, 
        defaultValue:'not available'
      },
      tag: {
        type: DataTypes.STRING(1000), 
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
      },
      updatedAt: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, 
      },
    }, {
      timestamps: true, 
      tableName: 'questions', 
    });
  
    // Associations
    Question.associate = (models) => {
      // Foreign key association with the 'User' model
      Question.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  
    return Question;
  };
  