export type JwtType = {
    email:string;
    username:string;
    googleId?:string;
    githubId?:string;
    provider:string;
    profilePhotoColor?:string;
    dateCreated:Date;
    emailVerified:boolean;
}