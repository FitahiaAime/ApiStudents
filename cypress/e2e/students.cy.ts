describe('API Étudiants', () => {
  const baseUrl = 'http://localhost:3000';
  let token = '';

  before(() => {
    cy.request('POST', `${baseUrl}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    }).then((response) => {
      token = response.body.token;
    });
  });

  it('Doit lister tous les étudiants (route publique)', () => {
    cy.request('GET', `${baseUrl}/etudiants`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('Doit refuser la création sans token', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/etudiants`,
      body: { firstName: 'Test', lastName: 'SansToken', email: 'sanstoken@example.com' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Doit créer un étudiant avec un token valide (admin)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/etudiants`,
      headers: { Authorization: `Bearer ${token}` },
      body: { firstName: 'Marie', lastName: 'Rasoa', email: `marie${Date.now()}@example.com` }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    });
  });

  it('Doit supprimer un étudiant avec un token admin', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/etudiants`,
      headers: { Authorization: `Bearer ${token}` },
      body: { firstName: 'ASupprimer', lastName: 'Test', email: `delete${Date.now()}@example.com` }
    }).then((createResponse) => {
      const id = createResponse.body.id;
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/etudiants/${id}`,
        headers: { Authorization: `Bearer ${token}` }
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(204);
      });
    });
  });
});
