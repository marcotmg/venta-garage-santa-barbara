import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // GitHub OAuth Endpoints
  app.get("/api/auth/github/url", (req, res) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    if (!client_id) {
      return res.status(500).json({ error: "GITHUB_CLIENT_ID not configured" });
    }
    const redirect_uri = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo`;
    res.json({ url });
  });

  app.get("/api/auth/github/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("Failed to get access token");
      }

      // Store token in a cookie (SameSite=None for iframe)
      res.cookie("github_token", access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("GitHub OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/github/user", async (req, res) => {
    const token = req.cookies.github_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/project/download", async (req, res) => {
    try {
      const zip = new JSZip();
      
      const walk = (dir: string, base: string = "") => {
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const relativePath = path.join(base, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (file !== "node_modules" && file !== ".git" && file !== "dist" && file !== ".next") {
              walk(fullPath, relativePath);
            }
          } else {
            if (file === "package-lock.json" || file.startsWith(".")) continue;
            const content = fs.readFileSync(fullPath);
            zip.file(relativePath.replace(/\\/g, "/"), content);
          }
        }
      };

      walk(process.cwd());
      
      const content = await zip.generateAsync({ type: "nodebuffer" });
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=project.zip");
      res.send(content);
    } catch (error) {
      console.error("Download Error:", error);
      res.status(500).send("Failed to generate ZIP");
    }
  });

  app.post("/api/github/publish", async (req, res) => {
    const token = req.cookies.github_token;
    const { repoName } = req.body;

    if (!token) return res.status(401).json({ error: "Not authenticated" });
    if (!repoName) return res.status(400).json({ error: "Repo name required" });

    try {
      const headers = { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" };

      // 1. Get user login
      const userRes = await axios.get("https://api.github.com/user", { headers });
      const login = userRes.data.login;

      // 2. Check if repo exists, create if not
      let repo;
      try {
        const repoRes = await axios.get(`https://api.github.com/repos/${login}/${repoName}`, { headers });
        repo = repoRes.data;
      } catch (e) {
        const createRes = await axios.post("https://api.github.com/user/repos", { name: repoName, private: true }, { headers });
        repo = createRes.data;
      }

      // 3. Get all files to upload (simplified: just src and public)
      const files: { path: string; content: string }[] = [];
      
      const walk = (dir: string, base: string = "") => {
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const relativePath = path.join(base, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (file !== "node_modules" && file !== ".git" && file !== "dist" && file !== ".next") {
              walk(fullPath, relativePath);
            }
          } else {
            if (file === "package-lock.json" || file.startsWith(".")) continue;
            const content = fs.readFileSync(fullPath);
            files.push({
              path: relativePath.replace(/\\/g, "/"),
              content: content.toString("base64"),
            });
          }
        }
      };

      walk(process.cwd());

      if (files.length === 0) {
        return res.status(400).json({ error: "No se encontraron archivos para subir. Verifica la estructura del proyecto." });
      }

      // 4. Create a commit using the GitHub API (Blobs -> Tree -> Commit -> Ref)
      // This is the "proper" way without git CLI
      
      // a. Create blobs (in chunks to avoid rate limits)
      const blobResponses = [];
      const chunkSize = 10;
      for (let i = 0; i < files.length; i += chunkSize) {
        const chunk = files.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(f => 
          axios.post(`https://api.github.com/repos/${login}/${repoName}/git/blobs`, {
            content: f.content,
            encoding: "base64"
          }, { headers })
        );
        const chunkResponses = await Promise.all(chunkPromises);
        blobResponses.push(...chunkResponses);
        if (i + chunkSize < files.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      const tree = files.map((f, i) => ({
        path: f.path,
        mode: "100644",
        type: "blob",
        sha: blobResponses[i].data.sha
      }));

      // b. Create tree
      console.log("Creating tree...");
      const treeRes = await axios.post(`https://api.github.com/repos/${login}/${repoName}/git/trees`, { tree }, { headers });
      const treeSha = treeRes.data.sha;
      console.log("Tree created.");

      // c. Get latest commit (if any)
      let parentSha: string | null = null;
      try {
        const refRes = await axios.get(`https://api.github.com/repos/${login}/${repoName}/git/refs/heads/main`, { headers });
        parentSha = refRes.data.object.sha;
      } catch (e) {
        // Branch might not exist yet
      }

      // d. Create commit
      const commitRes = await axios.post(`https://api.github.com/repos/${login}/${repoName}/git/commits`, {
        message: "Publish from AI Studio",
        tree: treeSha,
        parents: parentSha ? [parentSha] : []
      }, { headers });
      const commitSha = commitRes.data.sha;

      // e. Update ref
      if (parentSha) {
        await axios.patch(`https://api.github.com/repos/${login}/${repoName}/git/refs/heads/main`, { sha: commitSha }, { headers });
      } else {
        await axios.post(`https://api.github.com/repos/${login}/${repoName}/git/refs`, { ref: "refs/heads/main", sha: commitSha }, { headers });
      }

      res.json({ success: true, url: repo.html_url });
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Publish Error:", JSON.stringify(errorData || error.message, null, 2));
      res.status(500).json({ 
        error: "Failed to publish", 
        details: errorData || { message: error.message } 
      });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
