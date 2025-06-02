export interface Student {
    _id?: string;
    name: string;
    level: string;
    profileImage?: { secure_url: string };
    email?: string;
    exams?: [];
    degree?: [];
    password?: string;
    status?: string;
    role?: string;
    attempts?: {
        startTime: any;
        answers:any;
        exam: {
            subject: any;
            description: string;
            duration: number;
            createdBy :{
                name:string;
            }
        };
        timeSpent: number;
        percentage?: any;
        totalScore:number
    }[];
}
