### Health Check


    npm run dev
```
open browser and paste url : localhost:4040
GET: /health-check
  response: return "OK" if api is running :)
```
    npm run dev


# Backend Api Rewritten

`BASE_URL : http://localhost:8848`

API Documentation:
=================

  #### Auto_Save
```
    nodemon installed to save all changes. instead of everytime  Ctrl+C and then run again.
```

  #### Database_Connection
```
    src/config/mongoose.js
    all models are import here. Also connection with mongodb.
```

  #### Config_Environment Variables
```
    src/config/config.js
    All env variables are in this file
```

  #### Express_Setup
```  
    src/config/express.js
    all required packages are import here. Also create public and upload directories. Route Path is also define here. e.g app.use('/auth', authRoutes). error handling middlware also used here.
````
  
  #### Passport_Setup
```
    src/config/passport. User can login via passport
```

  #### Nodemailer_Setup
```
    src/mailer/index.js.
    nodemailer setup and functionality declare in this file.
```  

  #### User_SignUp  
```
  POST: http://localhost:8848/auth/signup
    req.body should be {
      "username": "your name",
      "fullName": "your fullname",
      "email": "email address",
      "password": "your password",
      "confirmationPassword": "your password"
    }.
    
Response you will get message and payload as below
    {
      "payload": {
          "id": "5e314849fa40021164775dce",
          "email": "",
          "verified": false,
          "token": ""
      },
      "message": "User Signup Successfully."
    }
```
  
  #### User_Login
  ```  
  POST: http://localhost:8848/auth/login-via-local

    req.body should be {
      "identifier": "",
	    "password": "your password"
    }
    req.body.identifier can be username/email.

    Response you will get message and payload as below
    {
      "payload": {
          "id": "5e314849fa40021164775dce",
          "email": "",
          "verified": false,
          "token": ""
      },
      "message": "User Login Successfully."
    }
```
  ## Regards : Muhammad Asif Javed
