# Clean24 Deployment & Cloud Configuration Guide

This guide describes how to push your local repository to GitHub, host the application on Vercel, and configure the Supabase database.

---

## 1. Push to GitHub (ការរៀបចំបញ្ជូនកូដទៅ GitHub)

Run the following commands in your local terminal to link and push your code to your GitHub repository:

```bash
# 1. Rename local primary branch to 'main'
git branch -M main

# 2. Add your GitHub remote origin URL (Replace URL below with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 3. Push the commits to your GitHub repository
git push -u origin main
```

---

## 2. Vercel Hosting Configuration (ការរៀបចំសម្រាប់ Vercel)

The codebase has been prepared with a \`vercel.json\` routing configuration and a serverless backend adapter.

### Step-by-Step Vercel Setup:
1. Open your **Vercel Console** and click **Add New Project**.
2. Select your imported GitHub repository.
3. In the **Build and Development Settings**, verify the default configurations:
   - **Framework Preset**: \`Vite\` (Vercel automatically detects this).
4. Expand **Environment Variables** and add the following keys to connect to Supabase:
   - \`SUPABASE_URL\`: (Your Supabase URL)
   - \`SUPABASE_ANON_KEY\`: (Your Supabase Anon API key)
5. Click **Deploy**. Vercel will automatically build the static React frontend and host the Express API endpoints as serverless node functions under \`/api/*\`.

---

## 3. Supabase Database Setup (ការរៀបចំ Supabase)

Supabase PostgreSQL is used as the persistent cloud database for Vercel.

### Step-by-Step Supabase Setup:
1. Go to [Supabase Console](https://supabase.com) and create a **New Free Project**.
2. Once the project is provisioned, go to the **SQL Editor** tab from the left sidebar.
3. Click **New Query**, and copy-paste the SQL script from \`supabase_schema.sql\` in your project root:
   \`\`\`sql
   CREATE TABLE IF NOT EXISTS clean24_collections (
     id TEXT PRIMARY KEY,
     data JSONB NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX IF NOT EXISTS idx_collections_data ON clean24_collections USING gin (data);
   \`\`\`
4. Click **Run** to execute the query. This creates a high-performance JSONB collection table.
5. Go to **Project Settings** -> **API** to copy the URL and Anon Key and paste them into Vercel's Environment Variables.

---

### Local Test Mode vs. Live Supabase Mode
- **Local Fallback:** When \`SUPABASE_URL\` is empty, the server automatically reads/writes to your local \`server-db.json\` file.
- **Production Mode:** When Supabase keys are set (in Vercel/production), the server reads/writes to Supabase, guaranteeing stateless persistence.
