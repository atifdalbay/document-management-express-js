'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Şifreler için bcrypt ile hash oluşturma
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('adminpassword', salt);
    const hrPassword = await bcrypt.hash('hrpassword', salt);

    // Kullanıcı verilerini ekleme
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HR User',
        email: 'hr@example.com',
        password: hrPassword,
        role: 'human_resources',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Kullanıcıları silme işlemi
    await queryInterface.bulkDelete('Users', {
      email: ['admin@example.com', 'hr@example.com']
    }, {});
  }
};
