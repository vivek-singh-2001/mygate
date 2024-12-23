// Example custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('restoreLoginState', () => {
  cy.request('POST', 'http://localhost:7500/api/v1/auth/login', {
    email: 'Rowland_Stroman6@yahoo.com',
    password: 'password123',
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
    cy.setCookie('authToken', response.body.token);
  });
});