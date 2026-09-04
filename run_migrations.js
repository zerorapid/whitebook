const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const connectionString = "postgresql://postgres:SaiVarsha%401997@db.acqtvusjoridrnrelhni.supabase.co:5432/postgres";
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL!");

    const sql = `
      -- 1. Extensions
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- 2. Tables
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT NOT NULL,
        company TEXT,
        role TEXT,
        email TEXT,
        phone TEXT,
        location TEXT,
        avatar TEXT,
        last_contact TEXT,
        notes TEXT,
        tags TEXT[] DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT NOT NULL,
        description TEXT,
        tags TEXT[] DEFAULT '{}',
        members UUID[] DEFAULT '{}'
      );

      -- 3. Auth Columns
      ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
      ALTER TABLE groups ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

      -- 4. Enable RLS
      ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

      -- 5. Drop policies if they exist to prevent errors on re-run
      DO $$ BEGIN
        DROP POLICY IF EXISTS "Users can view their own contacts" ON contacts;
        DROP POLICY IF EXISTS "Users can insert their own contacts" ON contacts;
        DROP POLICY IF EXISTS "Users can update their own contacts" ON contacts;
        DROP POLICY IF EXISTS "Users can delete their own contacts" ON contacts;
        
        DROP POLICY IF EXISTS "Users can view their own groups" ON groups;
        DROP POLICY IF EXISTS "Users can insert their own groups" ON groups;
        DROP POLICY IF EXISTS "Users can update their own groups" ON groups;
        DROP POLICY IF EXISTS "Users can delete their own groups" ON groups;
      END $$;

      -- 6. Create RLS Policies
      CREATE POLICY "Users can view their own contacts" ON contacts FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "Users can insert their own contacts" ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "Users can update their own contacts" ON contacts FOR UPDATE USING (auth.uid() = user_id);
      CREATE POLICY "Users can delete their own contacts" ON contacts FOR DELETE USING (auth.uid() = user_id);

      CREATE POLICY "Users can view their own groups" ON groups FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "Users can insert their own groups" ON groups FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "Users can update their own groups" ON groups FOR UPDATE USING (auth.uid() = user_id);
      CREATE POLICY "Users can delete their own groups" ON groups FOR DELETE USING (auth.uid() = user_id);
    `;

    console.log("Executing schema migrations...");
    await client.query(sql);
    console.log("Success! Database schema completely applied.");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
