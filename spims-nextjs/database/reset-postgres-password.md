# 🔐 Reset PostgreSQL Password Guide

## If You Don't Remember Your PostgreSQL Password:

### **Method 1: Using Windows Services**

1. **Open Services** (Windows + R → `services.msc`)
2. **Find "postgresql-x64-xx"** service
3. **Right-click** → **"Stop"**
4. **Navigate to PostgreSQL installation** (usually `C:\Program Files\PostgreSQL\xx\data\`)
5. **Edit `pg_hba.conf`** file
6. **Change the line:**
   ```
   host    all             all             127.0.0.1/32            md5
   ```
   **To:**
   ```
   host    all             all             127.0.0.1/32            trust
   ```
7. **Save the file**
8. **Start PostgreSQL service** again
9. **Connect to pgAdmin without password**
10. **Change password:**
    ```sql
    ALTER USER postgres PASSWORD 'keerthi';
    ```
11. **Change `pg_hba.conf` back to `md5`**
12. **Restart PostgreSQL service**

### **Method 2: Using Command Line (if psql works)**

1. **Open Command Prompt as Administrator**
2. **Navigate to PostgreSQL bin folder:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
3. **Connect to PostgreSQL:**
   ```cmd
   psql -U postgres
   ```
4. **Change password:**
   ```sql
   ALTER USER postgres PASSWORD 'keerthi';
   ```

### **Method 3: Reinstall PostgreSQL (Last Resort)**

If nothing works:
1. **Uninstall PostgreSQL**
2. **Download fresh installer** from postgresql.org
3. **Install with password: `keerthi`**
4. **Remember to note down the password this time!**