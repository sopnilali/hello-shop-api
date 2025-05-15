export interface IAuth {
    email: string;
    password: string;
}


export interface IResetPassword {
    email: string;
    newPassword: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IAuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
}