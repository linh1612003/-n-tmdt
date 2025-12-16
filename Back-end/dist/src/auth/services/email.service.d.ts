export declare class EmailService {
    private transporter;
    constructor();
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendResetPasswordEmail(email: string, otp: string): Promise<void>;
}
