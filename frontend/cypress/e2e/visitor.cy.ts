describe('Visitor Module Tests', () => {
  before(() => {
    cy.login('Rowland_Stroman6@yahoo.com', 'password123');
  });

  beforeEach(() => {
    cy.restoreLoginState();
    cy.visit('/home/visitors');
  });

  it('Should navigate to the Visitors page', () => {
    cy.visit('/home/visitors');
    cy.contains('Pending').should('be.visible');
    cy.contains('Past').should('be.visible');
    cy.contains('Expected').should('be.visible');
  });

  //   it('Should display pending visitors in the "Pending" tab', () => {
  //     // Click on the "Pending" tab
  //     cy.contains('Pending').click();

  //     // Verify if the table for pending visitors is visible
  //     cy.get('p-tabPanel[header="Pending"]').find('p-table').should('be.visible');

  //     // Check if a visitor's name is displayed in the pending visitors list
  //     cy.get('p-tabPanel[header="Pending"]')
  //       .contains('tr', 'John Doe') // Replace with an example visitor name from your data
  //       .should('exist');
  //   });

  it('Should display a message when no pending visitors are present', () => {
    cy.contains('Pending').click();

    cy.get('p-tabPanel[header="Pending"]')
      .contains('No pending visitors to display.')
      .should('be.visible');
  });

  it('Should display a message when no visitors are present', () => {
    cy.contains('Past').click();

    cy.get('p-tabPanel[header="Past"]')
      .contains('No past visitors to display.')
      .should('be.visible');
  });

  it('Should add a new expected visitor', () => {
    cy.contains('Expected').click();

    cy.contains('Add Visitor').click();

    cy.get('#name').type('Jane Smith');
    cy.get('#number').type('9876543210');
    cy.get('#vehicleNumber').type('GJ-18-AA-0000');
    cy.get('#startDate').click();
    cy.get('.p-datepicker-calendar', { timeout: 10000 })
      .should('be.visible')
      .find('td:not(.ui-state-disabled)')
      .eq(29)
      .click();
    cy.get('#endDate').click();
    cy.get('.p-datepicker-calendar', { timeout: 10000 })
      .should('be.visible')
      .find('td:not(.ui-state-disabled)')
      .eq(29)
      .click();
    cy.get('#visitTime').click();
    cy.get('button[aria-label="Next Hour"]').click();

    cy.contains('Submit').click();

    cy.get('.p-toast').should('contain', 'Visitor added successfully');
  });

  it('Should allow sharing a visitor pass', () => {
    cy.contains('Expected').click();

    cy.get('p-tabPanel[header="Expected"]')
      .contains('tr', 'Jane Smith')
      .find('.p-button-info')
      .click();

    cy.contains('Share Visitor Pass').should('be.visible');

    cy.contains('Share on WhatsApp').click();

    cy.log('WhatsApp sharing triggered');
  });

  //   it('Should update visitor status to "Approved"', () => {
  //     // Click on the "Pending" tab
  //     cy.contains('Pending').click();

  //     // Find the approve button for a visitor and click it
  //     cy.get('p-tabPanel[header="Pending"]')
  //       .contains('tr', 'John Doe') // Replace with visitor name
  //       .find('button[icon="pi pi-check"]') // Approve button icon
  //       .click();

  //     // Verify if the confirmation dialog is displayed
  //     cy.contains('Confirmation').should('be.visible');

  //     // Confirm the approval action
  //     cy.contains('Yes').click();

  //     // Verify if the visitor is removed from the "Pending" tab
  //     cy.get('p-tabPanel[header="Pending"]')
  //       .contains('tr', 'John Doe')
  //       .should('not.exist');
  //   });

  //   it('Should update visitor status to "Rejected"', () => {
  //     // Click on the "Pending" tab
  //     cy.contains('Pending').click();

  //     // Find the reject button for a visitor and click it
  //     cy.get('p-tabPanel[header="Pending"]')
  //       .contains('tr', 'John Doe') // Replace with visitor name
  //       .find('button[icon="pi pi-times"]') // Reject button icon
  //       .click();

  //     // Verify if the confirmation dialog is displayed
  //     cy.contains('Confirmation').should('be.visible');

  //     // Confirm the rejection action
  //     cy.contains('Yes').click();

  //     // Verify if the visitor is removed from the "Pending" tab
  //     cy.get('p-tabPanel[header="Pending"]')
  //       .contains('tr', 'John Doe')
  //       .should('not.exist');
  //   });
});
