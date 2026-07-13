import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { users, messages, contents, images } from "./src/db/schema.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { desc, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase limit for base64 images
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/auth/login", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await getOrCreateUser(req.user.uid, req.user.email || "");
      res.json({ user });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const [user] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      res.json({ user });
    } catch (error) {
      console.error("Auth me error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Routes (Messages)
  app.get("/api/admin/messages", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const [dbUser] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!dbUser || !dbUser.isAdmin) return res.status(403).json({ error: "Forbidden" });

      const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
      res.json(allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Routes
  app.get("/api/contents", async (req, res) => {
    try {
      const allContents = await db.select().from(contents);
      res.json(allContents);
    } catch (error) {
      console.error("Error fetching contents:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/contents", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const [dbUser] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!dbUser || !dbUser.isAdmin) return res.status(403).json({ error: "Forbidden" });

      const { key, title, body, type } = req.body;
      await db.insert(contents)
        .values({ key, title, body, type })
        .onConflictDoUpdate({
          target: contents.key,
          set: { title, body, type, updatedAt: new Date() }
        });
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/images", async (req, res) => {
    try {
      const allImages = await db.select().from(images).orderBy(desc(images.createdAt));
      res.json(allImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/images", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const [dbUser] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!dbUser || !dbUser.isAdmin) return res.status(403).json({ error: "Forbidden" });

      const { name, url } = req.body;
      const result = await db.insert(images).values({ name, url }).returning();
      res.json({ success: true, image: result[0] });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/images/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const [dbUser] = await db.select().from(users).where(eq(users.uid, req.user.uid));
      if (!dbUser || !dbUser.isAdmin) return res.status(403).json({ error: "Forbidden" });

      await db.delete(images).where(eq(images.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      await db.insert(messages).values({ name, email, message });
      res.json({ success: true });
    } catch (error) {
      console.error("Error inserting message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const { history, message } = req.body;
      
      const systemInstruction = `أنت مساعد ذكي لشركة زجاج. مهمتك هي الإجابة عن أسئلة العملاء حول مواصفات الزجاج (مثل السيكوريت، الدبل جلاس، الزجاج المعماري، وغيرها). 
يجب أن تكون إجاباتك دقيقة ومهنية وباللغة العربية، وقم بتوجيه العملاء للتواصل عبر واتساب أو صفحة اتصل بنا إذا كانت لديهم استفسارات تتطلب معاينة أو عرض أسعار.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
        }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Sitemap Route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      res.header("Content-Type", "application/xml");
      const hostname = `${req.protocol}://${req.get("host")}`;
      
      const allContents = await db.select().from(contents);
      const blogPosts = allContents.filter(c => c.type === 'blog');

      let urls = `  <url>
    <loc>${hostname}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      for (const post of blogPosts) {
        urls += `\n  <url>
    <loc>${hostname}/#${post.key}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
      
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
