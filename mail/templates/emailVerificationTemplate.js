const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification - Learnify</title>
        <style>
            body {
                background-color: #f4f7f6; /* Light gray background */
                font-family: 'Inter', Arial, sans-serif; /* Modern font */
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }

            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 30px;
                background-color: #ffffff;
                border-radius: 12px; /* More rounded corners */
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* Subtle shadow */
                text-align: center;
            }

            .header {
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
                margin-bottom: 30px;
            }

            .logo {
                max-width: 180px; /* Slightly smaller logo */
                height: auto;
                display: block;
                margin: 0 auto;
            }

            .message {
                font-size: 24px; /* Larger heading */
                font-weight: 700; /* Bolder */
                color: #2c3e50; /* Darker heading color */
                margin-bottom: 20px;
            }

            .body-text {
                font-size: 16px;
                color: #555555;
                margin-bottom: 25px;
            }

            .otp-highlight {
                font-size: 32px; /* Prominent OTP */
                font-weight: 800; /* Extra bold */
                color: #007bff; /* Primary blue color for OTP */
                background-color: #e9f5ff; /* Light blue background for OTP */
                padding: 15px 25px;
                border-radius: 8px;
                display: inline-block;
                letter-spacing: 2px; /* Spacing for readability */
                margin: 25px 0;
            }

            .cta-button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #007bff; /* Primary blue button */
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                margin-top: 30px;
                transition: background-color 0.3s ease; /* Smooth hover effect */
            }

            .cta-button:hover {
                background-color: #0056b3; /* Darker blue on hover */
            }

            .support-text {
                font-size: 14px;
                color: #777777;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
            }

            .support-text a {
                color: #007bff;
                text-decoration: none;
            }

            .support-text a:hover {
                text-decoration: underline;
            }

            .footer-text {
                font-size: 12px;
                color: #aaaaaa;
                margin-top: 20px;
            }

            /* Responsive adjustments */
            @media only screen and (max-width: 620px) {
                .container {
                    margin: 20px;
                    padding: 20px;
                }
                .message {
                    font-size: 20px;
                }
                .otp-highlight {
                    font-size: 28px;
                    padding: 12px 20px;
                }
                .cta-button {
                    font-size: 16px;
                    padding: 12px 25px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://learnify-two-tau.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <img class="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPnNzkI2MYpGnEluhObYWzjwp1MUC49mtiiyURvljSA&s&ec=72940543" alt="Learnify Logo">
                </a>
            </div>
            <div class="message">Verify Your Learnify Account</div>
            <div class="body-text">
                <p>Dear User,</p>
                <p>Thank you for registering with Learnify. To complete your registration and unlock all features, please use the following One-Time Password (OTP) to verify your account:</p>
            </div>
            <div class="otp-highlight">${otp}</div>
            <div class="body-text">
                <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
                <p>If you did not request this verification, please disregard this email.</p>
            </div>
            <a href="https://learnify-two-tau.vercel.app/verify-otp" class="cta-button" target="_blank" rel="noopener noreferrer">
                Verify Account Now
            </a>
            <div class="support-text">
                If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:info@learnify.com">info@learnify.com</a>. We are here to help!
            </div>
            <div class="footer-text">
                &copy; ${new Date().getFullYear()} Learnify. All rights reserved.
            </div>
        </div>
    </body>
</html>`;
};

module.exports = otpTemplate;