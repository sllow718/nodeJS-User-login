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

