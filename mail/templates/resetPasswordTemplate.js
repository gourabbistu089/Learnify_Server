const resetPasswordTemplate = (resetData) => {
    const { url, email, expiryTime = '1 hour' } = resetData;
    
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Learnify</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: #f8f9fa;
                font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .main-container {
                padding: 40px 20px;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(145deg, #ffffff 0%, #f9f9ff 100%);
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                position: relative;
            }
            
            .header {
                background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%);
                padding: 25px 0;
                text-align: center;
                border-bottom: 5px solid rgba(255, 255, 255, 0.3);
                position: relative;
            }
            
            .header:after {
                content: "";
                position: absolute;
                bottom: -20px;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(to right bottom, #ee5a52 50%, transparent 50%);
                z-index: 1;
            }
            
            .logo-container {
                display: inline-block;
                background-color: white;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                margin-bottom: 10px;
            }
    
            .logo {
                max-width: 160px;
                height: auto;
            }
            
            .content {
                padding: 40px 30px 30px;
            }
    
            .security-icon {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .security-icon svg {
                width: 80px;
                height: 80px;
                fill: #FF6B6B;
                opacity: 0.9;
            }
    
            .message {
                font-size: 26px;
                font-weight: 700;
                background: linear-gradient(90deg, #2D2D2D 0%, #555555 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-align: center;
                margin-bottom: 15px;
                letter-spacing: 0.5px;
            }
            
            .subtitle {
                font-size: 16px;
                color: #FF6B6B;
                text-align: center;
                margin-bottom: 30px;
                font-weight: 500;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 30px;
                color: #4a4a4a;
                font-weight: 300;
                line-height: 1.8;
            }
            
            .body p {
                margin-bottom: 15px;
            }
    
            .security-notice {
                margin: 30px auto;
                padding: 20px;
                background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
                border-radius: 12px;
                border-left: 4px solid #FF6B6B;
                position: relative;
            }
            
            .security-notice-icon {
                display: inline-block;
                width: 24px;
                height: 24px;
                background-color: #FF6B6B;
                border-radius: 50%;
                margin-right: 10px;
                vertical-align: middle;
                position: relative;
            }
            
            .security-notice-icon:before {
                content: "!";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 14px;
            }
            
            .security-notice-title {
                font-size: 16px;
                font-weight: 600;
                color: #d63031;
                margin-bottom: 8px;
                display: inline-block;
                vertical-align: middle;
            }
            
            .security-notice-text {
                font-size: 14px;
                color: #666;
                margin: 0;
                line-height: 1.5;
            }
    
            .reset-container {
                margin: 35px auto;
                padding: 30px;
                background-color: white;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
                position: relative;
                border: 2px solid #f0f0f0;
            }
            
            .reset-container:before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: rgba(255, 107, 107, 0.15);
                z-index: -1;
            }
            
            .reset-container:after {
                content: '';
                position: absolute;
                bottom: -10px;
                right: -10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(255, 107, 107, 0.15);
                z-index: -1;
            }
    
            .reset-title {
                font-size: 18px;
                font-weight: 600;
                color: #2d2d2d;
                margin-bottom: 15px;
            }
            
            .reset-email {
                font-size: 14px;
                color: #666;
                margin-bottom: 20px;
                padding: 8px 12px;
                background-color: #f8f9fa;
                border-radius: 6px;
                font-family: monospace;
            }
            
            .expiry-info {
                font-size: 13px;
                color: #888;
                margin-top: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .expiry-info:before, .expiry-info:after {
                content: "";
                height: 1px;
                background-color: #e9e9e9;
                flex-grow: 1;
                margin: 0 10px;
            }
    
            .button-container {
                text-align: center;
                margin: 35px 0 25px;
            }
    
            .reset-button {
                display: inline-block;
                padding: 16px 45px;
                background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
                position: relative;
                overflow: hidden;
                letter-spacing: 0.5px;
            }
    
            .reset-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            }
            
            .reset-button:after {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(45deg);
                transition: all 0.5s ease;
                opacity: 0;
            }
            
            .reset-button:hover:after {
                opacity: 1;
                transform: rotate(45deg) translate(50%, -50%);
            }
            
            .alternative-text {
                text-align: center;
                font-size: 14px;
                color: #777;
                margin: 20px 0;
                font-style: italic;
                font-weight: 300;
            }
            
            .url-container {
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            
            .url-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .url-text {
                font-size: 12px;
                color: #007bff;
                word-break: break-all;
                font-family: monospace;
                line-height: 1.4;
            }
    
            .security-tips {
                margin: 35px 0;
                padding: 25px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
            }
            
            .security-tips-title {
                font-size: 18px;
                font-weight: 600;
                color: #2d2d2d;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            
            .security-tips-title:before {
                content: "🔒";
                margin-right: 8px;
                font-size: 20px;
            }
            
            .security-tips-list {
                font-size: 14px;
                color: #555;
                line-height: 1.6;
            }
            
            .security-tips-list ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .security-tips-list li {
                margin-bottom: 8px;
            }
    
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
                margin: 35px 0;
            }
    
            .support {
                font-size: 14px;
                color: #777777;
                margin-top: 25px;
                text-align: center;
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
            }
            
            .support a {
                color: #FF6B6B;
                text-decoration: none;
                font-weight: 500;
                position: relative;
            }
            
            .support a:after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: #FF6B6B;
                transform: scaleX(0);
                transition: transform 0.3s ease;
                transform-origin: right;
            }
            
            .support a:hover:after {
                transform: scaleX(1);
                transform-origin: left;
            }
    
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #999999;
                padding: 20px;
                background-color: #f0f2f5;
                border-radius: 0 0 16px 16px;
            }
    
            .highlight {
                color: #FF6B6B;
                font-weight: 600;
            }
            
            .decorative-dots {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 80px;
                height: 80px;
                opacity: 0.1;
                z-index: 0;
            }
            
            .decorative-dots::before,
            .decorative-dots::after {
                content: '';
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #FF6B6B;
            }
            
            .decorative-dots::before {
                top: 0;
                left: 0;
                box-shadow: 20px 0 0 #FF6B6B, 40px 0 0 #FF6B6B, 60px 0 0 #FF6B6B,
                            0 20px 0 #FF6B6B, 20px 20px 0 #FF6B6B, 40px 20px 0 #FF6B6B, 60px 20px 0 #FF6B6B,
                            0 40px 0 #FF6B6B, 20px 40px 0 #FF6B6B, 40px 40px 0 #FF6B6B, 60px 40px 0 #FF6B6B,
                            0 60px 0 #FF6B6B, 20px 60px 0 #FF6B6B, 40px 60px 0 #FF6B6B, 60px 60px 0 #FF6B6B;
            }
            
            @media only screen and (max-width: 600px) {
                .container {
                    border-radius: 10px;
                }
                
                .content {
                    padding: 30px 20px 20px;
                }
                
                .message {
                    font-size: 22px;
                }
                
                .subtitle {
                    font-size: 14px;
                }
                
                .reset-button {
                    padding: 14px 35px;
                    font-size: 15px;
                }
                
                .decorative-dots {
                    width: 60px;
                    height: 60px;
                }
                
                .reset-container {
                    padding: 25px 20px;
                }
                
                .security-tips {
                    padding: 20px 15px;
                }
            }
        </style>
    
    </head>
    
    <body>
        <div class="main-container">
            <div class="container">
                <div class="decorative-dots"></div>
                
                <div class="header">
                    <div class="logo-container">
                        <a href="https://learnify-two-tau.vercel.app/">
                            <img class="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShPnNzkI2MYpGnEluhObYWzjwp1MUC49mtiiyURvljSA&s&ec=72940543" alt="Learnify Logo">
                        </a>
                    </div>
                </div>
                
                <div class="content">
                    <div class="security-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                        </svg>
                    </div>
                    
                    <div class="message">Reset Your Password</div>
                    <div class="subtitle">Secure your account with a new password</div>
                    
                    <div class="body">
                        <p>Hello,</p>
                        <p>We received a request to reset the password for your <span class="highlight">Learnify</span> account. If you made this request, please click the button below to create a new password.</p>
                        <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
                    </div>
                    
                    <div class="security-notice">
                        <div class="security-notice-icon"></div>
                        <div class="security-notice-title">Security Notice</div>
                        <div class="security-notice-text">
                            This reset link is valid for ${expiryTime} only. For your security, it will expire automatically after this time period.
                        </div>
                    </div>
                    
                    <div class="reset-container">
                        <div class="reset-title">Password Reset Request</div>
                        <div class="reset-email">${email || 'your-email@example.com'}</div>
                        <div class="expiry-info">Link expires in ${expiryTime}</div>
                    </div>
                    
                    <div class="button-container">
                        <a href="${url}" class="reset-button">Reset My Password</a>
                    </div>
                    
                    <div class="alternative-text">Or copy and paste this link into your browser:</div>
                    
                    <div class="url-container">
                        <div class="url-label">Reset Link:</div>
                        <div class="url-text">${url}</div>
                    </div>
                    
                    <div class="security-tips">
                        <div class="security-tips-title">Password Security Tips</div>
                        <div class="security-tips-list">
                            <ul>
                                <li>Use a combination of uppercase and lowercase letters, numbers, and symbols</li>
                                <li>Make your password at least 8 characters long</li>
                                <li>Avoid using personal information like birthdays or names</li>
                                <li>Don't reuse passwords from other accounts</li>
                                <li>Consider using a password manager for better security</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="support">
                        <p>If you're having trouble with the reset process or didn't request this change, please contact our security team immediately at <a href="mailto:security@learnify.com">security@learnify.com</a></p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Learnify. All rights reserved.</p>
                    <p>This is an automated security email. Please do not reply to this message.</p>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
};

module.exports = {resetPasswordTemplate};