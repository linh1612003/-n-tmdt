export declare class Otp {
    email: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
    type: string;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, import("mongoose").Document<unknown, any, Otp> & Otp & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Otp>> & import("mongoose").FlatRecord<Otp> & {
    _id: import("mongoose").Types.ObjectId;
}>;
