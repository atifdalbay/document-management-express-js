'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.User, { foreignKey: 'user_id' });
      //Document.belongsTo(models.DocumentRequest, { foreignKey: 'document_request_id' });
      // User modeli ile ilişki
      //Document.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
    }
  }

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'Documents',
      timestamps: true
    }
  );

  return Document;
};
