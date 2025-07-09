# MongoDB Atlas Setup Guide

## Steps to Configure MongoDB Atlas

### 1. Get Your Connection String
1. Log in to your MongoDB Atlas account
2. Go to your cluster dashboard
3. Click "Connect" button
4. Choose "Connect your application"
5. Select "Node.js" as driver and version 4.1 or later
6. Copy the connection string

### 2. Update Your .env File
Replace the placeholders in your `.env` file:

```env
MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/ecommerce-db?retryWrites=true&w=majority
```

**Replace:**
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password
- `<cluster-url>` - Your cluster URL (e.g., cluster0.abc123.mongodb.net)

**Example:**
```env
MONGO_URL=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/ecommerce-db?retryWrites=true&w=majority
```

### 3. Network Access Configuration
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. For development, you can add `0.0.0.0/0` (allows access from anywhere)
4. For production, add only your specific IP addresses

### 4. Database User Setup
1. Go to "Database Access" in MongoDB Atlas
2. Click "Add New Database User"
3. Create a user with "Read and write to any database" permissions
4. Use this username/password in your connection string

### 5. Test Your Connection
Run your server to test the connection:
```bash
npm start
```

You should see: "Connected to MongoDB Atlas successfully"

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check username/password in connection string
   - Ensure user has proper permissions

2. **Network Timeout**
   - Check Network Access settings
   - Ensure your IP is whitelisted

3. **Database Name**
   - The database name in the connection string will be created automatically
   - You can change "ecommerce-db" to any name you prefer

### Security Best Practices:

1. **Never commit .env file to version control**
   - Add `.env` to your `.gitignore` file

2. **Use strong passwords**
   - Generate secure passwords for database users

3. **Restrict IP access**
   - Only allow necessary IP addresses in production

4. **Use environment-specific databases**
   - Different databases for development, staging, and production