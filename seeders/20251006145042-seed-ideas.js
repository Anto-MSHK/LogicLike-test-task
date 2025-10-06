'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('Ideas', [
      {
        title: 'Implement Dark Mode',
        description: 'Add a dark mode theme to improve user experience during night time usage and reduce eye strain.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Add Real-time Notifications',
        description: 'Implement WebSocket-based real-time notifications to keep users informed about important updates instantly.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Create Mobile App',
        description: 'Develop native mobile applications for iOS and Android to increase accessibility and user engagement.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Integrate Social Media Login',
        description: 'Allow users to sign in using their Google, Facebook, or GitHub accounts for easier authentication.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Advanced Search with Filters',
        description: 'Implement an advanced search system with multiple filters to help users find content more efficiently.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Export Data Feature',
        description: 'Enable users to export their data in various formats (CSV, JSON, PDF) for backup and analysis purposes.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Multi-language Support',
        description: 'Add internationalization (i18n) to support multiple languages and reach a global audience.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Collaborative Editing',
        description: 'Implement real-time collaborative editing features similar to Google Docs for team projects.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'AI-Powered Recommendations',
        description: 'Use machine learning algorithms to provide personalized content recommendations based on user behavior.',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Accessibility Improvements',
        description: 'Enhance accessibility features to comply with WCAG 2.1 standards and support users with disabilities.',
        createdAt: now,
        updatedAt: now,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ideas', null, {});
  }
};
