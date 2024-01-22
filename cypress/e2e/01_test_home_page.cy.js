describe('Test home page', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'test');
    const apiUrl = Cypress.env('api_url');
    cy.task('mockServer', {
      fixture: 'initAllCars.json',
      interceptUrl: `${apiUrl}/cars/`,
    });
    cy.visit(`${Cypress.env('host')}/homepage`);
  });

  it('expect - load all of the cars', () => {
    cy.get('table tbody tr').should(($p) => {
      expect($p).to.have.length(6);
    });
  });

  it('expect - init add car button should be disabled', () => {
    cy.get("button[type='submit']").should(($p) => {
      expect($p).have.class('disabled');
    });
  });

  it('expect - add a car into car list', () => {
    cy.get('input[name="name"]').type('Porsche 718');
    cy.get('select[name="brand"]').select('PORSCHE');
    cy.get('input[value="2wd"]').check();
    cy.get('input[name="price"]').type('78000.0');
    cy.get('input[name="imageUrl"]').type('test');

    cy.get("button[type='submit']")
      .first()
      .should(($p) => {
        expect($p).not.have.class('disabled');
      });
    // insert the create car mockup
    cy.mockGraphQl('createCar', 'createCar.json');

    cy.get("button[type='submit']").first().click();
    cy.wait('@createCar').then(() => {
      cy.get('table tbody tr').should(($p) => {
        expect($p).to.have.length(6);
      });
    });
  });
});
