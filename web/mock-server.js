const http = require("http");
const url = require("url");

const mockUsers = [];
const mockMedicines = [];
let nextUserId = 1;
let nextMedicineId = 1;

// JWT Mock
const generateMockToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Collect request body
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = body ? JSON.parse(body) : {};

      // Auth endpoints
      if (path === "/auth/register" && method === "POST") {
        const { email, name, password } = data;
        const existingUser = mockUsers.find((u) => u.email === email);

        if (existingUser) {
          res.writeHead(400);
          res.end(
            JSON.stringify({ success: false, message: "User already exists" })
          );
          return;
        }

        const user = {
          id: nextUserId++,
          email,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockUsers.push({ ...user, password });
        const token = generateMockToken(user.id);

        res.writeHead(200);
        res.end(
          JSON.stringify({
            success: true,
            data: { user, token },
            message: "User registered successfully",
          })
        );
        return;
      }

      if (path === "/auth/login" && method === "POST") {
        const { email, password } = data;
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          res.writeHead(401);
          res.end(
            JSON.stringify({ success: false, message: "Invalid credentials" })
          );
          return;
        }

        const { password: _, ...userWithoutPassword } = user;
        const token = generateMockToken(user.id);

        res.writeHead(200);
        res.end(
          JSON.stringify({
            success: true,
            data: { user: userWithoutPassword, token },
            message: "Login successful",
          })
        );
        return;
      }

      // Medicine endpoints (require auth)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
        return;
      }

      const token = authHeader.split(" ")[1];
      const userId = parseInt(token.split("-")[2]) || 1; // Extract user ID from mock token

      if (path === "/medicines" && method === "GET") {
        const userMedicines = mockMedicines.filter((m) => m.userId === userId);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: userMedicines }));
        return;
      }

      if (path === "/medicines" && method === "POST") {
        const medicine = {
          id: nextMedicineId++,
          userId,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockMedicines.push(medicine);
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, data: medicine }));
        return;
      }

      // 404 for other routes
      res.writeHead(404);
      res.end(JSON.stringify({ success: false, message: "Not found" }));
    } catch (error) {
      console.error("Server error:", error);
      res.writeHead(500);
      res.end(
        JSON.stringify({ success: false, message: "Internal server error" })
      );
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);

  // Add some default test data
  const testUser = {
    id: 1,
    email: "test@test.com",
    name: "Test User",
    password: "Test123!!!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(testUser);
  nextUserId = 2;

  // Add some test medicines
  const testMedicines = [
    {
      id: 1,
      userId: 1,
      name: "Dipirona 500mg",
      description: "Analgésico e antipirético",
      location: "Armário do quarto",
      category: "Analgésicos",
      quantity: 30,
      notes: "Tomar 1 comprimido até 4x ao dia",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      name: "Paracetamol 750mg",
      description: "Analgésico e antipirético",
      location: "Cozinha - gaveta superior",
      category: "Analgésicos",
      quantity: 20,
      notes: "Máximo 3g por dia",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  mockMedicines.push(...testMedicines);
  nextMedicineId = 3;

  console.log("Test user created: test@test.com / Test123!!!");
  console.log("Sample medicines added");
});
