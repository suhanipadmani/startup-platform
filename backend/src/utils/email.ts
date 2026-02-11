import nodemailer from 'nodemailer';

const sendEmail = async (
    options: {
        email: string;
        subject: string;
        message: string
    }
) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('No email credentials found. Mocking email send.');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Startup Platform'}" <${process.env.FROM_EMAIL || 'no-reply@example.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
