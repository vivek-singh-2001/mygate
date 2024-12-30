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

const LOCAL_STORAGE_MEMORY: Record<string, string> = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('cleanupTestData', (tableName, filter) => {
  cy.request('POST', 'http://localhost:7500/api/v1/test/cleanup', {
    tableName,
    filter,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property(
      'message',
      `Test data from ${tableName} cleaned up successfully`
    );
    cy.log(`Cleanup for table ${tableName} was successful.`);
  });
});
