import request from "supertest";
import app from "../src/app";

describe("Task API Endpoints", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Task Creator",
            email: "creator@example.com",
            password: "password123"
        });
        token = res.body.token;
        userId = res.body.user._id;
    });

    describe("POST /api/tasks", () => {
        it("should create a task when authenticated", async () => {
            const taskData = {
                title: "Setup CI/CD",
                description: "Write tests and GitHub Actions",
                priority: "HIGH"
            };

            const res = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send(taskData);

            expect(res.status).toBe(201);
            expect(res.body.title).toBe(taskData.title);
            expect(res.body.createdBy.toString()).toBe(userId);
        });
    });

    describe("GET /api/tasks", () => {
        it("should return a paginated list of tasks", async () => {
            await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Task 1" });

            const res = await request(app)
                .get("/api/tasks")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.pagination).toBeDefined();
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        it("should allow creator to delete their task", async () => {
            const createRes = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "To be deleted" });

            const taskId = createRes.body._id;

            const delRes = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(delRes.status).toBe(200);
            expect(delRes.body.message).toBe("Task deleted");
        });
    });
});