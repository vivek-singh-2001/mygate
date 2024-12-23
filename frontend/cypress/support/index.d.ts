// cypress/support/index.d.ts
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in
     * @example cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
    restoreLoginState(): Chainable<void>;
  }
}
