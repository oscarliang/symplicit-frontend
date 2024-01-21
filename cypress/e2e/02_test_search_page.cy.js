describe('Test search page', () => {
  beforeEach(() => {
    cy.getDefaultMockRequest(
      `cars`,
      'initAllCars',
      'initAllCars.json',
      'get',
    ).then(() => {
      cy.window().then(() => {
        cy.setCookie('accessToken', 'test');
        cy.visit(`${Cypress.env('host')}/search`);
      });
    });
  });

  it('expect - load all of the cars', () => {
    cy.get('table tbody tr').should(($p) => {
      expect($p).to.have.length(9);
    });
  });

  it('expect - init search button should be disabled', () => {
    cy.get("button[type='submit']").should(($p) => {
      expect($p).have.class('disabled');
    });
  });

  it('expect - search cars by filtering name', () => {
    cy.get('#filter').select('name');
    cy.get('#hf-name').type('porsche');
    cy.get("button[type='submit']").should(($p) => {
      expect($p).not.have.class('disabled');
    });

    cy.mockGraphQl('filterByName', 'filterByName.json');

    cy.get("button[type='submit']").click();
    cy.wait('@filterByName').then(() => {
      cy.get('table tbody tr').should(($p) => {
        expect($p).to.have.length(3);
      });
    });
  });

  it('expect - search cars by filtering brand', () => {
    cy.get('#filter').select('brand');
    cy.get('#hf-brand').select('BMW');
    cy.get("button[type='submit']").should(($p) => {
      expect($p).not.have.class('disabled');
    });

    cy.mockGraphQl('filterByBrand', 'filterByBrand.json');

    cy.get("button[type='submit']").click();
    cy.wait('@filterByBrand').then(() => {
      cy.get('table tbody tr').should(($p) => {
        expect($p).to.have.length(2);
      });
    });
  });

  it('expect - search cars by filtering drive', () => {
    cy.get('#filter').select('drive');
    cy.get('#inline-2WD').check();
    cy.get("button[type='submit']").should(($p) => {
      expect($p).not.have.class('disabled');
    });
    cy.mockGraphQl('filterByDrive', 'filterByDrive.json');

    cy.get("button[type='submit']").click();
    cy.wait('@filterByDrive').then(() => {
      cy.get('table tbody tr').should(($p) => {
        expect($p).to.have.length(4);
      });
    });
  });
});
