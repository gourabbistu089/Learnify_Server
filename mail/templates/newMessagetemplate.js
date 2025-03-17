exports.userMessageTemplate = (name, email, mobile, message) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #333;
                line-height: 1.6;
            }
  
            .email-container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
  
            .email-header {
                background-color: #4CAF50;
                color: #ffffff;
                text-align: center;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
            }
  
            .email-body {
                padding: 20px;
            }
  
            .email-footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
                text-align: center;
            }
  
            .highlight {
                color: #4CAF50;
                font-weight: bold;
            }
  
            .contact-info {
                background-color: #f9f9f9;
                padding: 10px;
                border-left: 4px solid #4CAF50;
                margin-top: 15px;
                border-radius: 5px;
            }
  
            .cta-button {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
  
            a {
                color: #4CAF50;
                text-decoration: none;
            }
  
            .email-footer a {
                color: #777;
            }
        </style>
    </head>
  
    <body>
        <div class="email-container">
            <div class="email-header">
                <h2>📩 New Contact Form Submission</h2>
            </div>
            <div class="email-body">
                <p>Hi Admin,</p>
                <p>You have received a new message from <span class="highlight">${name}</span>.</p>
  
                <div class="contact-info">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                </div>
  
                <div class="contact-info">
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
  
                <a href="mailto:${email}" class="cta-button">Reply to ${name}</a>
            </div>
  
            <div class="email-footer">
                <p>This is an automated notification. Please do not reply to this email.</p>
                <p>Need help? <a href="mailto:support@learnify.com">Contact Support</a></p>
            </div>
        </div>
    </body>
    </html>`;
  };
  