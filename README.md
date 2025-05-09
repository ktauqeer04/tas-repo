## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ktauqeer04/task.git
cd task
```

### 2. Install Dependencies 
```bash
npm install
```

### 3. Create a .env File

PORT=port of your choice  
MONGODB_CONNECTION= get the connection string from mongoDB Atlas  
SECRET= give your secret key (A randomly generated UUID is recommended)



### 4. Start the Server
```bash
npm run dev
```

## Postman Collection

The Postman collection is available in this repository for testing the API endpoints.

🔗 [Download Postman Collection](./Task_API_Collection.postman_collection.json)

### 🚀 How to Use It

1. Open Postman.
2. Click on **Import** → **Upload Files**.
3. Select the `postman_collection.json` file from the repo.
4. Start testing the endpoints!

> 💡 Make sure your `.env` and server are configured correctly before testing the APIs.


