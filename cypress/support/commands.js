// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add(
  'getDefaultMockRequest',
  (url, operationName, fixture, method = 'POST') => {
    cy.intercept(
      {
        url,
        method,
      },
      {
        fixture,
      },
    ).as(operationName);
  },

  //   // cy.route('GET', '/api/cars?key=brand*', 'fixture:filterByBrand.json').as('filterByBrand');

  //   // cy.route('GET', '/api/cars?key=drive*', 'fixture:filterByDrive.json').as('filterByDrive');

  //   // cy.route('*/makes.json', 'fixture:makes.json');

  //   // cy.route('*/models.json', 'fixture:models.json');
);

Cypress.Commands.add(
  'mockGraphQl',
  (operationName, fixture, method = 'POST') => {
    // cy.server();
    cy.intercept(
      {
        url: '/graphql',
        method,
      },
      {
        fixture,
      },
    ).as(operationName);
  },
);
