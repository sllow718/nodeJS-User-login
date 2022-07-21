# nodeJS-User-login
boilerplate for nodeJS user login, signup, updatepassword

## Actions
- You can get a list of user
- User can create an account
- User can log in to their account
- User can change their password, with validation

## Backend validation
- ```JWT``` token implemented to only allow users to update their password ```check-auth.js```
- password stored in hash using ```bcrypt```
- ```mongoDB``` integration
- models created via ```mongoose``` Schema
- validation of data input done using ```mongoose-unique-validator``` package

# Testing functions
## Using postman
### Get all users
GET ```https://mf-userlogin.herokuapp.com/api/users```
```
{
    "users": [
        {
            "_id": "62d8e193bd63a2a703a0732c",
            "username": "ballster",
            "email": "mingfu@gmail.com",
            "image": "https://media.istockphoto.com/vectors/default-gray-placeholder-man-vector-id871752462?k=20&m=871752462&s=612x612&w=0&h=BTrZB8slanBvVw-1hwwf8mew5HkpDOyHIJAWDdBwIr8=",
            "__v": 0,
            "id": "62d8e193bd63a2a703a0732c"
        },
        {
            "_id": "62d8e70bfca176140e9f2df2",
            "username": "ballster1",
            "email": "mingfu1@gmail.com",
            "image": "https://media.istockphoto.com/vectors/default-gray-placeholder-man-vector-id871752462?k=20&m=871752462&s=612x612&w=0&h=BTrZB8slanBvVw-1hwwf8mew5HkpDOyHIJAWDdBwIr8=",
            "__v": 0,
            "id": "62d8e70bfca176140e9f2df2"
        },
        {
            "_id": "62d8eee276bcfcc045e13a96",
            "username": "ballster2",
            "email": "mingfu2@gmail.com",
            "image": "https://media.istockphoto.com/vectors/default-gray-placeholder-man-vector-id871752462?k=20&m=871752462&s=612x612&w=0&h=BTrZB8slanBvVw-1hwwf8mew5HkpDOyHIJAWDdBwIr8=",
            "__v": 0,
            "id": "62d8eee276bcfcc045e13a96"
        }
    ]
}
```
### Sign Up
POST ```https://mf-userlogin.herokuapp.com/api/users/signup```
  ```
  {
    "username":"ballster2",
    "email":"mingfu2@gmail.com",
    "password":"password"
}
  ```
Expected output (token details)
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmQ4ZWVlMjc2YmNmY2MwNDVlMTNhOTYiLCJ1c2VybmFtZSI6ImJhbGxzdGVyMiIsImVtYWlsIjoibWluZ2Z1MkBnbWFpbC5jb20iLCJpYXQiOjE2NTgzODQwOTksImV4cCI6MTY1ODM4NzY5OX0.dv6CwsELDZl8mme4Zoz-vvJvzw_WZsc5GtEYDZy0AtM"
}
```

### Login
POST https://mf-userlogin.herokuapp.com/api/users/login
  ```
  {
    "username":"ballster2",
    "password":"newpassword"
}
  ```
  
 Expected output
 ```
{
    "userId": "62d8eee276bcfcc045e13a96",
    "email": "mingfu2@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmQ4ZWVlMjc2YmNmY2MwNDVlMTNhOTYiLCJ1c2VybmFtZSI6ImJhbGxzdGVyMiIsImVtYWlsIjoibWluZ2Z1MkBnbWFpbC5jb20iLCJpYXQiOjE2NTgzODU3NjcsImV4cCI6MTY1ODM4OTM2N30.dgvRNbW45ol4TGx7ThEONz32PYvSW_J_WUYBmoEJyWs"
}
```
