describe('API Auth - Login', () => {
  const baseUrl = 'http://localhost:3000';

  it('Doit se connecter avec des identifiants valides (admin)', () => {
    cy.request('POST', `${baseUrl}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.user.role).to.eq('admin');
    });
  });

  it('Doit refuser un mauvais mot de passe', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: { email: 'admin@test.com', password: 'mauvais_mdp' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.error).to.eq('Email ou mot de passe incorrect');
    });
  });

  it('Doit refuser un email inconnu', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: { email: 'inconnu@test.com', password: 'admin123' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
