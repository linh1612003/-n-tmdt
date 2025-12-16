import { Model } from 'mongoose';
import { Otp } from '../schemas/otp.schema';
export declare class OtpRepository {
    private OtpModel;
    constructor(OtpModel: Model<Otp>);
    createOtp(email: string, otp: string, expiresAt: Date, type?: string): Promise<import("mongoose").Document<unknown, {}, Otp> & Otp & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findValidOtp(email: string, otp: string, type?: string): Promise<import("mongoose").Document<unknown, {}, Otp> & Otp & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    markOtpAsUsed(email: string, otp: string): Promise<import("mongoose").Document<unknown, {}, Otp> & Otp & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
