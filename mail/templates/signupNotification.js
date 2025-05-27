const signupNotificationTemplate = (userData) => {
    const { firstName, lastName, email } = userData;
    
    const name = `${firstName} ${lastName}`;
    
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Learnify!</title>
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
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
                background: linear-gradient(to right bottom, #45a049 50%, transparent 50%);
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
    
            .welcome-icon {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .welcome-icon svg {
                width: 80px;
                height: 80px;
                fill: #4CAF50;
                opacity: 0.9;
            }
    
            .message {
                font-size: 28px;
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
                font-size: 18px;
                color: #4CAF50;
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
    
            .welcome-container {
                margin: 30px auto;
                padding: 25px;
                background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
                border-radius: 12px;
                text-align: center;
                border: 2px solid #4CAF50;
                position: relative;
                overflow: hidden;
            }
            
            .welcome-container:before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: rgba(76, 175, 80, 0.15);
                z-index: -1;
            }
            
            .welcome-container:after {
                content: '';
                position: absolute;
                bottom: -10px;
                right: -10px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(76, 175, 80, 0.15);
                z-index: -1;
            }
    
            .user-info {
                font-size: 18px;
                font-weight: 600;
                color: #2d2d2d;
                margin-bottom: 10px;
            }
            
            .user-email {
                font-size: 14px;
                color: #666;
                font-weight: 400;
            }
    
            .features-section {
                margin: 35px 0;
                padding: 25px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
            }
            
            .features-title {
                font-size: 20px;
                font-weight: 600;
                color: #2d2d2d;
                text-align: center;
                margin-bottom: 20px;
            }
            
            .features-list {
                display: grid;
                gap: 15px;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                padding: 12px;
                background-color: #f9f9f9;
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
            }
            
            .feature-icon {
                margin-right: 12px;
                font-size: 20px;
            }
            
            .feature-text {
                font-size: 14px;
                color: #555;
                font-weight: 400;
            }
    
            .button-container {
                text-align: center;
                margin: 35px 0 25px;
            }
    
            .get-started-button {
                display: inline-block;
                padding: 14px 40px;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                position: relative;
                overflow: hidden;
                letter-spacing: 0.5px;
            }
    
            .get-started-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
            }
            
            .get-started-button:after {
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
            
            .get-started-button:hover:after {
                opacity: 1;
                transform: rotate(45deg) translate(50%, -50%);
            }
            
            .social-section {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 10px;
            }
            
            .social-title {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 15px;
            }
            
            .social-links {
                display: flex;
                justify-content: center;
                gap: 15px;
            }
            
            .social-link {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-color: #4CAF50;
                border-radius: 50%;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .social-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            }
            
            .social-link svg {
                width: 20px;
                height: 20px;
                fill: white;
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
                color: #4CAF50;
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
                background-color: #4CAF50;
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
                color: #4CAF50;
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
                background-color: #4CAF50;
            }
            
            .decorative-dots::before {
                top: 0;
                left: 0;
                box-shadow: 20px 0 0 #4CAF50, 40px 0 0 #4CAF50, 60px 0 0 #4CAF50,
                            0 20px 0 #4CAF50, 20px 20px 0 #4CAF50, 40px 20px 0 #4CAF50, 60px 20px 0 #4CAF50,
                            0 40px 0 #4CAF50, 20px 40px 0 #4CAF50, 40px 40px 0 #4CAF50, 60px 40px 0 #4CAF50,
                            0 60px 0 #4CAF50, 20px 60px 0 #4CAF50, 40px 60px 0 #4CAF50, 60px 60px 0 #4CAF50;
            }
            
            @media only screen and (max-width: 600px) {
                .container {
                    border-radius: 10px;
                }
                
                .content {
                    padding: 30px 20px 20px;
                }
                
                .message {
                    font-size: 24px;
                }
                
                .subtitle {
                    font-size: 16px;
                }
                
                .get-started-button {
                    padding: 12px 30px;
                }
                
                .decorative-dots {
                    width: 60px;
                    height: 60px;
                }
                
                .social-links {
                    gap: 10px;
                }
                
                .features-list {
                    gap: 10px;
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
                    <div class="welcome-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L22 12L13.09 15.74L12 22L10.91 15.74L2 12L10.91 8.26L12 2Z"/>
                        </svg>
                    </div>
                    
                    <div class="message">Welcome to Learnify!</div>
                    <div class="subtitle">Your learning journey starts here</div>
                    
                    <div class="body">
                        <p>Hello ${name || 'there'},</p>
                        <p>Congratulations! You've successfully joined the <span class="highlight">Learnify</span> community. We're thrilled to have you on board and can't wait to help you unlock your learning potential.</p>
                        <p>Your account has been created and you're all set to explore our comprehensive learning platform designed to make education accessible, engaging, and effective.</p>
                    </div>
                    
                    <div class="welcome-container">
                        <div class="user-info">Account Successfully Created!</div>
                        <div class="user-email">${email}</div>
                    </div>
                    
                    <div class="features-section">
                        <div class="features-title">What you can do with Learnify:</div>
                        <div class="features-list">
                            <div class="feature-item">
                                <div class="feature-icon">📚</div>
                                <div class="feature-text">Access thousands of courses across various subjects and skill levels</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🎯</div>
                                <div class="feature-text">Set learning goals and track your progress with detailed analytics</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">👥</div>
                                <div class="feature-text">Connect with fellow learners and expert instructors in our community</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🏆</div>
                                <div class="feature-text">Earn certificates and badges as you complete courses and milestones</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">📱</div>
                                <div class="feature-text">Learn on-the-go with our mobile-friendly platform and offline content</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="button-container">
                        <a href="https://learnify-two-tau.vercel.app/login" class="get-started-button">Start Learning Today</a>
                    </div>
                    
                    
                    <div class="divider"></div>
                    
                    <div class="support">
                        <p>Questions? We're here to help! Reach out to our support team at <a href="mailto:support@learnify.com">support@learnify.com</a></p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Learnify. All rights reserved.</p>
                    <p>Thank you for choosing Learnify as your learning partner!</p>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
};

module.exports = {signupNotificationTemplate};