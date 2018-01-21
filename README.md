# Backend Api Test

`BASE_URL : http://localhost:3000/api`

API Documentation:
=================

### Health Check

```
GET: /health-check
  response: return "OK" if api is running :)
```
### User Operations
```
GET: /users
  response: return list of all users in the system
  
POST: /users/new
  body: 
    required : { firstName, lastName, username, email }
    optional : { gender, state, zip, country }
  response: return success message and newly created user object
  
PATCH: /users/:id
  param: id
  body:
    required : { }
    optional : { firstName, lastName, gender, state, zip, country }
  response: return success message and updated user
  
GET: /users/:id
  response: return user with perticular ID
  
DELETE: /users/:id
  response: return deleted user with perticular ID
  ```
  
  ### Picture Operations
  
  ```
  GET: /pictures
    response: return list of all pictures in the system
 
 POST: /pictures/new
  body:
    required: { title, description, url, owner }
    optional: { rights }
  note: here owner= userID who is uploading the picture.
  resposne: return updated picture and success message
 
 PATCH: /pictures/:id
  body:
    required: {}
    optional: { title, description, url }
  resposne: return updated picture and success message
 
 GET: /pictures/:id
  response: return picture object with perticular id
 
 DELETE:/pictures/:id
  response: return delted picture with perticular id
  
 GET: /pictures/:userId/pictures
  response: return list of all pictures related to perticular user
 
  ```
  
  ## Regards : Muhammad Asif Javed
