const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("POST /tasks with empty title", async (t) => {
  const newTask = {
    title: "",
    description: "Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Title and description cannot be empty" });
  t.end();
});

tap.test("POST /tasks with empty description", async (t) => {
  const newTask = {
    title: "Title",
    description: "",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Title and description cannot be empty" });
  t.end();
});

tap.test("POST /tasks with whitespace only title", async (t) => {
  const newTask = {
    title: "   ",
    description: "Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Title and description cannot be empty" });
  t.end();
});

tap.test("POST /tasks with non-boolean completed", async (t) => {
  const newTask = {
    title: "Title",
    description: "Description",
    completed: "false",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Completed must be a boolean value" });
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "title");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "completed");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].title, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].completed, "boolean");
  t.end();
});

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Completed must be a boolean value" });
  t.end();
});

tap.test("PUT /tasks/:id with empty title", async (t) => {
  const updatedTask = {
    title: "",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Title and description cannot be empty" });
  t.end();
});

tap.test("PUT /tasks/:id with empty description", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Title and description cannot be empty" });
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

// Tests for filtering by completion status
tap.test("GET /tasks?completed=true - Filter completed tasks", async (t) => {
  const response = await server.get("/tasks?completed=true");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  // All returned tasks should be completed
  response.body.forEach(task => {
    t.equal(task.completed, true);
  });
  t.end();
});

tap.test("GET /tasks?completed=false - Filter incomplete tasks", async (t) => {
  const response = await server.get("/tasks?completed=false");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  // All returned tasks should be incomplete
  response.body.forEach(task => {
    t.equal(task.completed, false);
  });
  t.end();
});

// Tests for sorting by creation date
tap.test("GET /tasks?sortBy=createdAt - Sort tasks by creation date", async (t) => {
  const response = await server.get("/tasks?sortBy=createdAt");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  
  // Verify tasks are sorted by createdAt (ascending)
  for (let i = 1; i < response.body.length; i++) {
    const prevDate = new Date(response.body[i - 1].createdAt);
    const currDate = new Date(response.body[i].createdAt);
    t.ok(prevDate <= currDate, "Tasks should be sorted by creation date");
  }
  t.end();
});

// Tests for priority field in POST
tap.test("POST /tasks with priority", async (t) => {
  const newTask = {
    title: "High priority task",
    description: "This is a high priority task",
    completed: false,
    priority: "high",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.equal(response.body.priority, "high");
  t.ok(response.body.createdAt, "Task should have a createdAt timestamp");
  t.end();
});

tap.test("POST /tasks without priority (should default to medium)", async (t) => {
  const newTask = {
    title: "Task without priority",
    description: "This task has no priority specified",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.equal(response.body.priority, "medium");
  t.end();
});

tap.test("POST /tasks with invalid priority", async (t) => {
  const newTask = {
    title: "Invalid priority task",
    description: "This task has invalid priority",
    completed: false,
    priority: "urgent",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Priority must be low, medium, or high" });
  t.end();
});

// Tests for priority field in PUT
tap.test("PUT /tasks/:id with priority update", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "low",
  };
  const response = await server.put("/tasks/2").send(updatedTask);
  t.equal(response.status, 200);
  t.equal(response.body.priority, "low");
  t.end();
});

tap.test("PUT /tasks/:id with invalid priority", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "critical",
  };
  const response = await server.put("/tasks/3").send(updatedTask);
  t.equal(response.status, 400);
  t.match(response.body, { error: "Priority must be low, medium, or high" });
  t.end();
});

// Tests for GET /tasks/priority/:level
tap.test("GET /tasks/priority/high - Get high priority tasks", async (t) => {
  const response = await server.get("/tasks/priority/high");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  // All returned tasks should have high priority
  response.body.forEach(task => {
    t.equal(task.priority, "high");
  });
  t.end();
});

tap.test("GET /tasks/priority/medium - Get medium priority tasks", async (t) => {
  const response = await server.get("/tasks/priority/medium");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  // All returned tasks should have medium priority
  response.body.forEach(task => {
    t.equal(task.priority, "medium");
  });
  t.end();
});

tap.test("GET /tasks/priority/low - Get low priority tasks", async (t) => {
  const response = await server.get("/tasks/priority/low");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  // All returned tasks should have low priority
  response.body.forEach(task => {
    t.equal(task.priority, "low");
  });
  t.end();
});

tap.test("GET /tasks/priority/:level with invalid level", async (t) => {
  const response = await server.get("/tasks/priority/urgent");
  t.equal(response.status, 400);
  t.match(response.body, { error: "Invalid priority level. Must be low, medium, or high" });
  t.end();
});

// Test combining filters and sorting
tap.test("GET /tasks?completed=false&sortBy=createdAt - Combine filters", async (t) => {
  const response = await server.get("/tasks?completed=false&sortBy=createdAt");
  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));
  
  // Verify all tasks are incomplete
  response.body.forEach(task => {
    t.equal(task.completed, false);
  });
  
  // Verify tasks are sorted by createdAt
  for (let i = 1; i < response.body.length; i++) {
    const prevDate = new Date(response.body[i - 1].createdAt);
    const currDate = new Date(response.body[i].createdAt);
    t.ok(prevDate <= currDate);
  }
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
