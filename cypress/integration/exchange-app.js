describe('exchange-app', function () {
    before(function () {
        cy.visit('/');
    })

    it('valida que existan la cantidad de monedas correctas', function(){
        cy.get('option').should('have.length', 33)
    });

    it('valida que exista radio button latest y este seleccionado', function(){
        cy.get(':radio#latest').should('be.checked')
    });

    it('valida que exista radio button date y no este seleccionado', function(){
        expect(':radio#date').not.to.be.checked
    });

    it('hace click en date y muestra calendario', function(){
        cy.get(':radio#date').click()
        cy.get('#start').should('be.visible')
    });

    it('valida que exista un boton de Submit', function(){
        cy.get('[data-cy=submit]').click()
    });
})