'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Votes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ideaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ideas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add composite unique index on ideaId and ipAddress
    await queryInterface.addIndex('Votes', ['ideaId', 'ipAddress'], {
      unique: true,
      name: 'votes_idea_ip_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Votes', 'votes_idea_ip_unique');
    await queryInterface.dropTable('Votes');
  }
};
