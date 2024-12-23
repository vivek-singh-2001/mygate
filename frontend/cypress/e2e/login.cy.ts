describe('MyGate Login Page', () => {
  it('should log in successfully with valid credentials', () => {
    cy.login('Rowland_Stroman6@yahoo.com', 'password123');
    cy.url().should('include', '/dashboard');
  });

  it('should show error message for invalid credentials', () => {
    cy.login('wrong@example.com', 'wrongpassword');
    cy.contains('Invalid email or password').should('be.visible'); // Assert error
  });
});
