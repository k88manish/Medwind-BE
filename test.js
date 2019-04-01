//During test the env variable is set to test
process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./server");
let should = chai.should();
let Location = require("./server/models/Locations");

chai.use(chaiHttp);

describe("Location API testing", () => {
  before(done => {
    Location.remove({}).then(() => done());
  });

  describe("/POST Location", () => {
    it("It should save location and when give correct place name", done => {
      let payload = {
        place: "Berlin"
      };
      chai
        .request(server)
        .post("/location")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          done();
        });
    });

    it("it should not be able to save location when given invalid place name", done => {
      let payload = {
        place: "asdfasfafsf"
      };
      chai
        .request(server)
        .post("/location")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("message");
          res.body.error.message.should.be.equal("Not able to find the Locations");
          done();
        });
    });
  });

  describe("/PUT location", () => {
    it("It should update order status to 'taken'", done => {
      let payload = {
        place: "New Delhi"
      };
      chai
        .request(server)
        .post("/location")
        .send(payload)
        .end((err, locationRes) => {
          const locId = locationRes.body._id;
          let payload = {
            place: "Humberg"
          };
          chai
            .request(server)
            .put("/location/" + locId)
            .send(payload)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("Name");
              res.body.Name.should.be.equal("Humberg");
              done();
            });
        });
    });
  });

  describe("/DELETE location", () => {
    it("It should delete location", done => {
      Location.findOne({})
        .limit(1)
        .lean()
        .then(location => {
          chai
            .request(server)
            .delete("/location/" + location._id)
            .send()
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("status");
              res.body.status.should.be.equal("SUCCESS");
              done();
            });
        });
    });
  });
});
