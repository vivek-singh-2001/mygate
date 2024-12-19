const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app");
const authService = require("../features/authentication/authService");
const authController = require("../features/authentication/authController");
const { db } = require("../config/connection");
const CustomError = require("../utils/CustomError");

chai.use(chaiHttp);
const { expect } = chai;

describe("Authentication APIs", () => {
  let findOneStub;

  afterEach(() => {
    sinon.restore(); // Restore stubs after each test
  });

  describe("/login - POST API", () => {
    it("should return a JWT token when email and password are valid", async () => {
      const fakeUser = {
        id: 1,
        email: "test@example.com",
        validPassword: sinon.stub().resolves(true),
      };
      findOneStub = sinon.stub(db.User, "findOne").resolves(fakeUser);

      const token = await authService.login("test@example.com", "password123");

      expect(findOneStub.calledOnce).to.be.true;
      expect(fakeUser.validPassword.calledOnceWith("password123")).to.be.true;
      expect(token).to.be.a("string");
    });

    it("should throw an error when email is not found", async () => {
      findOneStub = sinon.stub(db.User, "findOne").resolves(null);

      try {
        await authService.login("invalid@example.com", "password123");
      } catch (err) {
        expect(err).to.be.instanceOf(CustomError);
        expect(err.message).to.equal("Invalid email or password");
        expect(err.statusCode).to.equal(401);
      }
      expect(findOneStub.calledOnce).to.be.true;
    });

    it("should throw an error when the password is invalid", async () => {
      const fakeUser = {
        id: 1,
        email: "test@example.com",
        validPassword: sinon.stub().resolves(false),
      };
      findOneStub = sinon.stub(db.User, "findOne").resolves(fakeUser);

      try {
        await authService.login("test@example.com", "wrongpassword");
      } catch (err) {
        expect(err).to.be.instanceOf(CustomError);
        expect(err.message).to.equal("Invalid email or password");
        expect(err.statusCode).to.equal(401);
      }
      expect(findOneStub.calledOnce).to.be.true;
      expect(fakeUser.validPassword.calledOnceWith("wrongpassword")).to.be.true;
    });
  });

  describe("/logout - POST API", () => {
    let clearCookieStub, statusStub, jsonStub, res;

    beforeEach(() => {
      clearCookieStub = sinon.stub();
      statusStub = sinon.stub();
      jsonStub = sinon.stub();

      res = {
        clearCookie: clearCookieStub,
        status: statusStub.returnsThis(),
        json: jsonStub,
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should clear cookies and return success message", async () => {
      authController.logout({}, res);

      expect(
        clearCookieStub.calledWith("jwtToken", { expires: sinon.match.date })
      ).to.be.true;
      expect(
        clearCookieStub.calledWith("connect.sid", { expires: sinon.match.date })
      ).to.be.true;

      expect(statusStub.calledOnceWith(200)).to.be.true;
      expect(
        jsonStub.calledOnceWith({
          status: "success",
          message: "Logged out successfully",
        })
      ).to.be.true;
    });
  });
});
