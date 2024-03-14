const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('./books'); 

chai.use(chaiHttp);

describe('Library API', () => {
  beforeEach(() => {
    // Reset library array before each test
    app.library = [];
  });

  it('should add a book to the library', (done) => {
    chai.request(app)
      .post('/add/book')
      .send({ book: 'New Book' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(app.library).to.include('New Book');
        done();
      });
  });

  it('should remove a book from the library', (done) => {
    app.library =  ['sachin', 'kumar', 'sachin 2'];

    chai.request(app)
      .delete('/remove/book')
      .send({ book: 'kumar' })
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(app.library).to.not.include('kumar');
        done();
      });
  });

  it('should update the name of an existing book', (done) => {
    app.library =  ['sachin', 'kumar', 'sachin 2'];

    chai.request(app)
      .patch('/update/book')
      .send({ original_book: 'kumar', new_book: 'Updated Book' })
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(app.library).to.include('Updated Book');
        expect(app.library).to.not.include('kumar');
        done();
      });
  });

  it('should retrieve the full contents of the library', (done) => {
    app.library =  ['sachin', 'kumar', 'sachin 2'];

    chai.request(app)
      .get('/get/library')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('sachin, kumar, sachin 2');
        done();
      });
  });

  it('should save books to a database', (done) => {
    app.library = ['sachin', 'kumar', 'sachin 2'];

    chai.request(app)
      .put('/saveto/database')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
