import request from "supertest";
import express from "express";
import authControllers from "./authControllers";
import * as authServices from "../services/authServices";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.post("/login", authControllers.login);

jest.mock("../services/authServices");
jest.mock("jsonwebtoken");

describe("Login Controller", () => {
  const mockUser = {
    id: "1",
    email: "test@example.com",
    password: "hashedpassword",
    subscription: "starter",
  };

  const mockToken = "mocked_jwt_token";

  beforeEach(() => {
    authServices.findUser.mockClear();
    authServices.updateUser.mockClear();
    jwt.sign.mockClear();
  });

  it("returns a status code of 200 and a token along with a user object", async () => {
    authServices.findUser.mockResolvedValue(mockUser);
    authServices.updateUser.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post("/login")
      .send({ email: mockUser.email, password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBe(mockToken);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", mockUser.email);
    expect(response.body.user).toHaveProperty(
      "subscription",
      mockUser.subscription
    );
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  it("returns a 401 status code if the user is not found", async () => {
    authServices.findUser.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "wrong@example.com", password: "password" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("returns a 401 status code if the password is incorrect", async () => {
    authServices.findUser.mockResolvedValue(mockUser);
    authServices.updateUser.mockResolvedValue(true);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: mockUser.email, password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
