# FullStack Intern Coding Challenge 🚀

This is a web application that allows users to submit ratings for registered stores. The application features a single, role-based login system that grants different functionalities to three types of users: System Administrators, Normal Users, and Store Owners.

***

### Key Features ✨

#### System Administrator
- **User & Store Management**: Can add new users (admin, normal user, store owner) and new stores.
- **Dashboard**: A centralized dashboard displaying key metrics like the total number of users, stores, and ratings.
- **User & Store Listings**: Can view, filter, and sort lists of all users and stores.
- **Password Management**: Can change their own password.

#### Normal User
- **Authentication**: Can register and log in to the platform.
- **Store Ratings**: Can view a list of all stores and submit or modify a rating from 1 to 5 for each.
- **Password Management**: Can change their own password.

#### Store Owner
- **Dashboard**: Can view their store's average rating.
- **User Ratings**: Can see a list of all users who have rated their specific store.
- **Password Management**: Can change their own password.

***

### Tech Stack 💻

* **Backend**: Node.js, Express.js
* **Database**: MySQL
* **Frontend**: React.js
* **Authentication**: JSON Web Tokens (JWT)
* **Validation**: Joi
* **Password Security**: bcrypt

***

### Getting Started 🏁

Follow these steps to set up and run the project on your local machine.

#### 1. Clone the Repository

Clone the project from GitHub to your local machine using the following command:

```bash
git clone https://github.com/Suriyan03/FullStack-Store-App.git
cd FullStack-Store-App
```

### 2. Database Setup

- Ensure MySQL is running (e.g., via **XAMPP**).  
- Run the SQL script provided in **`/database/schema.sql`** to create the database and tables.

### 3. Install Dependencies

Install the required packages for both the **backend** and **frontend**.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Environment Variables

Create a `.env` file inside the **backend** folder with your database and JWT configurations.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fullstack_challenge
JWT_SECRET=secretkey
```

### 5. Create an Admin User

Since the system has no users initially, you must create the first **System Administrator** using a tool like **Postman**.

1. Temporarily remove the `authMiddleware` and `adminMiddleware` from  
   `backend/routes/admin.routes.js`.  

2. Send a `POST` request to the following endpoint:  

POST http://localhost:5000/api/admin/users

3. Use the following **JSON body**:  

```json
{
    "name": "System Administrator",
    "email": "admin@example.com",
    "password": "AdminPassword123!",
    "address": "Admin HQ",
    "role": "system_admin"
}
```

### 6. Run the Application

Start the **backend** and **frontend** servers in separate terminals.

```bash
# In the backend directory
npm start

# In the frontend directory
npm start
```

### Future Enhancements 📈

To take this project to the next level, consider implementing the following features:

- **Search Bar**: Improve the existing search bar with real-time filtering and a more dynamic search experience.  
- **Table Sorting**: Add clickable headers to all tables for ascending/descending sorting based on fields like Name, Email, and Rating.  
- **Pagination**: Implement pagination for user and store lists to handle large datasets efficiently.  
- **Advanced Analytics**: Enhance the admin and store owner dashboards with charts and graphs for visual data representation.  
- **Testing**: Write unit and integration tests using a framework like Jest to ensure code quality and reliability.  
