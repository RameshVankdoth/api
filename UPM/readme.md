
# User Profile Management Application
## Overview
This project is a full-stack application that enables users to manage their profiles. It features functionalities for login, registration, updating profiles, deleting accounts, and viewing a dashboard. The application uses a Node.js backend with MongoDB and an Angular 18 frontend.

## Steps to Setup the Application
1. Create a Folder Structure
Create the following folder structure for your project:

```bash
UserProfileManagement/
│
├── backend/                # Node.js backend
│   ├── config/             # Configuration files
│   │   └── dbConfig.js     # Database configuration
│   ├── controllers/        # Controllers for API logic
│   │   └── userController.js
│   ├── models/             # Mongoose schemas
│   │   └── User.js
│   ├── routes/             # API routes
│   │   └── userRoutes.js
│   ├── node_modules/       # Node.js dependencies
│   ├── .env                # Environment variables
│   ├── package.json        # NPM package descriptor
│   ├── server.js           # Main server file
│
└── frontend/               # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Angular components
    │   │   │   ├── login/
    │   │   │   ├── register/
    │   │   │   ├── delete/
    │   │   │   ├── dashboard/
    │   │   │   └── update/
    │   │   └── services/     # Angular services
    │   ├── assets/           # Static assets
    │   └── index.html        # Entry point HTML
    ├── angular.json          # Angular CLI configuration
    ├── package.json          # NPM package descriptor for Angular
    └── tsconfig.json         # TypeScript configuration
```
## 2. Backend API Development
Step 1: Initialize the Backend
Navigate to the backend directory:

```bash
cd backend
```

Initialize a Node.js project and install necessary dependencies:

```bash

npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors body-parser dotenv
```

Step 2: Create the server.js
In server.js, set up your Express server:

```javascript

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```
Step 3: Create the Database Configuration
Create a file named dbConfig.js in the config directory:

```javascript

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```
Step 4: Create the User Model
In models/User.js, define the Mongoose schema:

```javascript

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);
```
Step 5: Create the User Controller
In controllers/userController.js, implement the logic for user operations:

```javascript

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // Registration logic
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    // Login logic
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

exports.updateProfile = async (req, res) => {
    // Update profile logic
    const { username, email } = req.body;
    await User.updateOne({ _id: req.user.id }, { username, email });
    res.json({ message: 'Profile updated successfully' });
};

exports.deleteProfile = async (req, res) => {
    // Delete profile logic
    await User.deleteOne({ _id: req.user.id });
    res.json({ message: 'Profile deleted successfully' });
};

exports.getUserProfile = async (req, res) => {
    // Get user profile logic
    const user = await User.findById(req.user.id);
    res.json(user);
};
```
Step 6: Create the User Routes
In routes/userRoutes.js, define the routes for user APIs:

```javascript

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth'); // Middleware to authenticate users

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update', authMiddleware, userController.updateProfile);
router.delete('/delete', authMiddleware, userController.deleteProfile);
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
```

## 3. Frontend Development with Angular
Step 1: Initialize the Angular Application
Navigate to the frontend directory:

```bash
cd frontend
```
Create a new Angular application:

```bash
ng new UPM
```
Navigate into the application folder:

```bash
cd UPM
```
Install required dependencies (if needed):

```bash
npm install
```
Step 2: Generate Components and Services
Generate the components and services using Angular CLI:

```bash
ng generate component components/login
ng generate component components/register
ng generate component components/delete
ng generate component components/dashboard
ng generate component components/update
ng generate service services/user
```
Step 3: Implement Each Component
Login Component (components/login/login.component.ts):

```typescript

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    username: string = '';
    password: string = '';

    constructor(private userService: UserService) {}

    onLogin() {
        this.userService.login(this.username, this.password).subscribe(
            response => {
                // Handle successful login
            },
            error => {
                // Handle login error
            }
        );
    }
}
```

```html

<!-- components/login/login.component.html -->
<form (ngSubmit)="onLogin()">
    <label for="username">Username</label>
    <input type="text" id="username" [(ngModel)]="username" name="username" required>
    
    <label for="password">Password</label>
    <input type="password" id="password" [(ngModel)]="password" name="password" required>
    
    <button type="submit">Login</button>
</form>
```
Register Component (components/register/register.component.ts):

```typescript

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    username: string = '';
    password: string = '';
    email: string = '';

    constructor(private userService: UserService) {}

    onRegister() {
        this.userService.register(this.username, this.password, this.email).subscribe(
            response => {
                // Handle successful registration
            },
            error => {
                // Handle registration error
            }
        );
    }
}
```
```html

<!-- components/register/register.component.html -->
<form (ngSubmit)="onRegister()">
    <label for="username">Username</label>
    <input type="text" id="username" [(ngModel)]="username" name="username" required>

    <label for="email">Email</label>
    <input type="email" id="email" [(ngModel)]="email" name="email" required>

    <label for="password">Password</label>
    <input type="password" id="password" [(ngModel)]="password" name="password" required>

    <button type="submit">Register</button>
</form>
```
Dashboard Component (components/dashboard/dashboard.component.ts):

```typescript

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    userProfile: any;

    constructor(private userService: UserService) {
        this.getUserProfile();
    }

    getUserProfile() {
        this.userService.getUserProfile().subscribe(profile => {
            this.userProfile = profile;
        });
    }
}
```
```html

<!-- components/dashboard/dashboard.component.html -->
<h1>Dashboard</h1>
<div *ngIf="userProfile">
    <p>Username: {{ userProfile.username }}</p>
    <p>Email: {{ userProfile.email }}</p>
</div>
```
Update Component (components/update/update.component.ts):

```typescript

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
})
export class UpdateComponent {
    username: string = '';
    email: string = '';

    constructor(private userService: UserService) {}

    onUpdate() {
        this.userService.updateProfile(this.username, this.email).subscribe(
            response => {
                // Handle successful update
            },
            error => {
                // Handle update error
            }
        );
    }
}
```
```html

<!-- components/update/update.component.html -->
<form (ngSubmit)="onUpdate()">
    <label for="username">Username</label>
    <input type="text" id="username" [(ngModel)]="username" name="username" required>

    <label for="email">Email</label>
    <input type="email" id="email" [(ngModel)]="email" name="email" required>

    <button type="submit">Update</button>
</form>
```
Delete Component (components/delete/delete.component.ts):

```typescript

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
})
export class DeleteComponent {
    constructor(private userService: UserService) {}

    onDelete() {
        this.userService.deleteProfile().subscribe(
            response => {
                // Handle successful deletion
            },
            error => {
                // Handle deletion error
            }
        );
    }
}
```
```html

<!-- components/delete/delete.component.html -->
<button (click)="onDelete()">Delete My Profile</button>
```
Step 4: Create the User Service
In services/user.service.ts, create the service to interact with the backend:

```typescript

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class UserService {
   private apiUrl = 'http://localhost:4000/api/users';

   constructor(private http: HttpClient) {}

   login(username: string, password: string): Observable<any> {
       return this.http.post(`${this.apiUrl}/login`, { username, password });
   }

   register(username: string, password: string, email: string): Observable<any> {
       return this.http.post(`${this.apiUrl}/register`, { username, password, email });
   }

   updateProfile(username: string, email: string): Observable<any> {
       return this.http.put(`${this.apiUrl}/update`, { username, email });
   }

   deleteProfile(): Observable<any> {
       return this.http.delete(`${this.apiUrl}/delete`);
   }

   getUserProfile(): Observable<any> {
       return this.http.get(`${this.apiUrl}/profile`);
   }
}
```

Step 5: Routing
In src/app/app.routes.ts, configure your routes like this:
```typescript

import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteComponent } from './delete/delete.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UpdateComponent } from './update/update.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: "LoginPage",
        
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: "RegisterPage"
    },
    {
        path: 'update',
        component: UpdateComponent,
        title: "UpdatePage"
    },
    {
        path: 'delete',
        component: DeleteComponent,
        title: "DeletePage"
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: "DashboardPage"
    },
];


```
Step 6: Running the Application
Start the Node.js Backend

In the backend directory, run:

```bash
node server.js
```
Start the Angular Frontend
In the frontend/UPM directory, run:

```bash
ng serve
```
Open your browser and navigate to http://localhost:4200 to view the Angular app.

## API Endpoints
Login: POST /api/users/login
Register: POST /api/users/register
Update Profile: PUT /api/users/update
Delete Profile: DELETE /api/users/delete
Get Profile: GET /api/users/profile

### Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes relevant tests.

### License
This project is licensed under the MIT License.

### Contact
For any questions or feedback, please contact Ramesh Vankdoth (vankyrs@gmail.com).