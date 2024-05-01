"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conditions", {
      ews_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "ews",
          key: "id",
        },
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      voltage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      ampere: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conditions");
  },
};
