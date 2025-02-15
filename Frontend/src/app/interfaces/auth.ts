export interface RegisterPostData {
    fullName: string;
    email: string;
    password: string;
}

export interface User extends RegisterPostData {
    id: string;
}

export interface email {
    email: string
}

export interface loginDetails {
    islogged: boolean,
    user: string,
    id:string,
    email:string,
    name:string,
}