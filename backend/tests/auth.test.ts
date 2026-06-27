import request from "supertest";
import app from "../src/app"; 
import User from "../src/models/User";


describe("Auth API Endpoints", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123"
    };

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.user).toHaveProperty("email", testUser.email);
            expect(res.body).toHaveProperty("token");
        });

        it("should return 400 if email already exists", async () => {
            await User.create(testUser); 
            const res = await request(app)
                .post("/api/auth/register")
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Email already exists");
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send(testUser);
        });

        it("should login with correct credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: testUser.password });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });

        it("should fail with incorrect password", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: testUser.email, password: "wrongpassword" });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/auth/me", () => {
        it("should deny access without token", async () => {
            const res = await request(app).get("/api/auth/me");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("No token");
        });
    });
});