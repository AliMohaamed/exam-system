export interface Student {
    _id?: string;
    name: string;
    level: string;
    profileImage?: {secure_url:string};
    email?: string;
    exams?: [];
    degree?: [];
    password?:string
}
