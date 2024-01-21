/* Tests to confirm test server is running properly */

describe('Test server', () => {
  it('expect - the test server to be running', () => {
    cy.request(Cypress.env('host')).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

  it('assert - global variables are properly set', () => {
    cy.window()
      .then((json) => {
        cy.setCookie('accessToken', 'test');
        cy.visit(`${Cypress.env('host')}`, {
          onBeforeLoad: (win) => {
            let nextData;
            Object.defineProperty(win, '__initialData__', {
              set() {
                nextData = json;
              },
              get() {
                return nextData;
              },
            });
          },
        });
      })
      .should('have.property', '__initialData__');
  });

  it('expect - url forward to login', () => {
    cy.window().then(() => {
      cy.setCookie('accessToken', 'test');
      cy.getDefaultMockRequest(
        'roles/modules',
        'initModules',
        'modules',
        'get',
      ).then(() => {
        cy.window().then(() => {
          cy.setCookie('accessToken', 'test');
          cy.visit(`${Cypress.env('host')}/`);
        });
      });
    });
    cy.url().should('eq', `${Cypress.env('host')}/login`);
  });
});
