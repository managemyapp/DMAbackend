exports.createUserEmailTemplate = (name, type) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Request Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://your-logo-url.com/logo.png" alt="Your Company Logo" style="max-width: 200px;">
          </div>
          <div class="content">
            <h2>Request Confirmation</h2>
            <p>Dear ${name},</p>
            <p>Thank you for your ${type} request. We have received your message and will get back to you soon.</p>
            <p>Our team is committed to providing you with the best possible assistance.</p>
            <p>If you have any urgent concerns, please don't hesitate to contact us directly.</p>
            <p>Best regards,<br>Your Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>123 Your Street, Your City, Your Country</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

exports.createAdminEmailTemplate = (type, data) => {
  const requestDetails = Object.entries(data)
    .map(
      ([key, value]) =>
        `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`
    )
    .join("");

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${type} Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://your-logo-url.com/logo.png" alt="Your Company Logo" style="max-width: 200px;">
          </div>
          <div class="content">
            <h2>New ${type} Request</h2>
            <p>A new ${type} request has been submitted. Details are as follows:</p>
            <table>
              <tbody>
                ${requestDetails}
              </tbody>
            </table>
            <p>Please respond to this request as soon as possible.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

exports.adminEmailTemplate = (password, userName) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Credentials</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Admin Credentials</h1>
          </div>
          <div class="content">
            <p>Here are your admin panel credentials:</p>
            <p><strong>User ID:</strong> ${userName}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please keep this information confidential and secure.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
