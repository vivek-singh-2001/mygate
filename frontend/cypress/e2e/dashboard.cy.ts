describe('Dashboard Component', () => {
  beforeEach(() => {
    cy.login('Rowland_Stroman6@yahoo.com', 'password123');
    cy.intercept('GET', '/api/v1/users/getUser/me', {
      fixture: 'user.json',
    }).as('getUser');
    cy.intercept('GET', '/api/notice/getAllNotice', {
      fixture: 'notices.json',
    }).as('getNotices');
    cy.visit('/home/dashboard'); // Adjust the route based on your application
  });

  it('should render the dashboard UI correctly', () => {
    cy.contains('Notice Board').should('be.visible');
    cy.contains('Messages').should('be.visible');
    cy.contains('Thought of the Day').should('be.visible');
    cy.contains('Visitors').should('be.visible');
  });

  it('should display "No New Notices" if no notices are available', () => {
    cy.intercept('GET', '/api/notices', { noticeList: [] }); // Mock no notices
    cy.visit('/home/dashboard');
    cy.contains('No New Notices').should('be.visible');
  });

  it('should navigate to the Notice Board on clicking the card', () => {
    cy.get('.card.bg-red-300').click();
    cy.url().should('include', '/home/notice'); // Assert navigation
  });

  it('should navigate to the Messages Section on clicking the Messages card', () => {
    cy.get('.card.bg-blue-300').click();
    cy.url().should('include', '/home/messages'); // Assert navigation
  });

  it('should handle "Thought of the Day" gracefully', () => {
    cy.get('.card.bg-green-300')
      .contains('No new thought for the day!')
      .should('be.visible');
  });

  it('should navigate to Visitors section on clicking the Visitors card', () => {
    cy.get('.card.bg-indigo-300').click();
    cy.url().should('include', '/home/visitors');
  });

  describe('Calendar Component', () => {
    it('should display the current month and year', () => {
      const today = new Date();
      const currentMonthYear = today.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      cy.contains(currentMonthYear).should('be.visible');
    });

    it('should navigate to the previous and next months', () => {
      cy.get('.calander-navigation button').first().click();
      cy.wait(500);
      cy.get('.calander-navigation button').last().click();
    });

    it("should highlight today's date", () => {
      const today = new Date().getDate();
      cy.get('.calendar-table td.highlighted').should('contain.text', today);
    });

    it('should open the "Add Event" dialog and add a new event', () => {
      cy.contains('Add Event').click();
      cy.get('textarea#title').type('Society Meeting');
      cy.get('textarea#description').type('Discuss upcoming plans.');
      cy.get('p-calendar').click();
      cy.get('.p-datepicker-calendar', { timeout: 10000 })
        .should('be.visible')
        .find('td:not(.ui-state-disabled)')
        .eq(29)
        .click();
      cy.get('.event-submit-btn').should('have.text', 'Add').click();
      cy.contains('Society Meeting').scrollIntoView().should('be.visible');
    });
  });
});
