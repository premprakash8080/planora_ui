import { environment } from "src/environments/environment";

export const ENDPOINTS = {
    Login:environment.apiBaseUrl+'/api/users/login',
    forgot_password:environment.apiBaseUrl+'/api/users/resetPasswordEmail',
    verifyToken : environment.apiBaseUrl +'/api/users/verifyToken',
    resetPassword: environment.apiBaseUrl +'/api/users/resetPassword',
    editProfile:environment.apiBaseUrl+'/api/users/editProfile',
    register:environment.apiBaseUrl+'/api/users/register',
    uploadProfilePicture:environment.apiBaseUrl+'/api/users/uploadProfilePicture',
    getPermissionsByRoleId:environment.apiBaseUrl+'/api/permission/getPermissions',

}