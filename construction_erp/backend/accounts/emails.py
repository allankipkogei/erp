from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_welcome_email(user):
    """Send welcome email to newly registered user"""
    subject = 'Welcome to Construction ERP!'
    
    # Plain text message
    message = f"""
    Hello {user.first_name or user.email}!
    
    Welcome to Construction ERP - Your Complete Construction Enterprise Resource Planning Solution!
    
    Your account has been successfully created with the following details:
    - Email: {user.email}
    - Role: {user.role.title()}
    
    You can now login to access your dashboard and start managing construction projects.
    
    Features available to you:
    • Project Management
    • Task Tracking
    • Equipment Management
    • Team Collaboration
    • Real-time Reports
    
    If you have any questions, please don't hesitate to contact our support team.
    
    Best regards,
    Construction ERP Team
    """
    
    # HTML message (optional, more visually appealing)
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .features {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
            .feature {{ padding: 10px 0; border-bottom: 1px solid #e5e7eb; }}
            .footer {{ text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏗️ Welcome to Construction ERP!</h1>
                <p>Construction Enterprise Resource Planning System</p>
            </div>
            <div class="content">
                <h2>Hello {user.first_name or user.email}!</h2>
                <p>Your account has been successfully created! We're excited to have you on board.</p>
                
                <div class="features">
                    <h3>Your Account Details:</h3>
                    <div class="feature">
                        <strong>📧 Email:</strong> {user.email}
                    </div>
                    <div class="feature">
                        <strong>👤 Role:</strong> {user.role.title()}
                    </div>
                </div>
                
                <div class="features">
                    <h3>Available Features:</h3>
                    <div class="feature">✅ Project Management</div>
                    <div class="feature">✅ Task Tracking</div>
                    <div class="feature">✅ Equipment Management</div>
                    <div class="feature">✅ Team Collaboration</div>
                    <div class="feature">✅ Real-time Reports & Analytics</div>
                </div>
                
                <p>Start managing your construction projects efficiently with our comprehensive platform.</p>
                
                <div style="text-align: center;">
                    <a href="http://localhost:3000/login" class="button">Login to Your Dashboard</a>
                </div>
            </div>
            <div class="footer">
                <p>© 2025 Construction ERP - Enterprise Resource Planning System</p>
                <p>If you have any questions, contact us at support@constructionerp.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_password_reset_email(user, reset_link):
    """Send password reset email"""
    subject = 'Reset Your Construction ERP Password'
    
    message = f"""
    Hello {user.first_name or user.email},
    
    We received a request to reset your password for your Construction ERP account.
    
    Click the link below to reset your password:
    {reset_link}
    
    This link will expire in 24 hours.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    Construction ERP Team
    """
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .warning {{ background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hello {user.first_name or user.email},</h2>
                <p>We received a request to reset your password for your Construction ERP account.</p>
                
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul>
                        <li>This link will expire in 24 hours</li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>Never share this link with anyone</li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
