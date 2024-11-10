const express = require('express');
const { 
    createUser,userLogIn,userProfileUpdate,userRoleUpdater,userProfileDelete,singleUserFinder,userPasswordResetRequest,allUserFinder,userPasswordUpdate
  } = require('../Controllers/UserC');
  const {authenticateToken} = require('../Auth/Auth.js')
  const {checkRole} = require('../middleware/CheckRole.js')
const userCreateRouter = express.Router();

userCreateRouter.post('/register', createUser);
userCreateRouter.post('/login', userLogIn);
userCreateRouter.patch('/userRole/:userId',authenticateToken,checkRole(["1","2","3"]), userRoleUpdater);
userCreateRouter.delete('/userProfileDelete/:userId',authenticateToken,checkRole(["1","2","3"]),userProfileDelete);
userCreateRouter.patch('/userProfileUpdate/:userId',authenticateToken,checkRole(["1","2","3"]), userProfileUpdate);
userCreateRouter.get('/getSingleUser/:userId',authenticateToken,checkRole(["1","2","3"]),singleUserFinder);
userCreateRouter.post('/userPasswordResetRequest', userPasswordResetRequest);
userCreateRouter.post('/userPasswordReset/:userId', userPasswordUpdate);
userCreateRouter.get('/allUsers',authenticateToken,checkRole(["1","2","3"]), allUserFinder);

module.exports = {userCreateRouter};
