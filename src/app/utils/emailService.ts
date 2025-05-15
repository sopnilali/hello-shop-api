import nodemailer from 'nodemailer';
import config from '../config';

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (email: string, orderDetails: any) => {
    const mailOptions = {
        from: config.email.user,
        to: email,
        subject: 'Order Placed Successfully! - Hello Shop',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://your-logo-url.com" alt="Hello Shop Logo" style="max-width: 150px;">
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Order Placed Successfully!</h1>
                    <p style="color: #666666; line-height: 1.6;">Thank you for your purchase, ${orderDetails.name}. Your order has been received and is being processed.</p>
                    <h2 style="color: #333333; margin-top: 30px;">Order Details:</h2>
                    <p style="color: #666666;"><strong>Order ID:</strong> ${orderDetails.id}</p>
                    <p style="color: #666666;"><strong>Total Amount:</strong> ${orderDetails.total} BDT</p>
                    <p style="color: #666666;"><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                    <p style="color: #666666;"><strong>Shipping Address:</strong> ${orderDetails.address}, ${orderDetails.city}</p>
                    <h3 style="color: #333333;">Order Items:</h3>
                    <ul style="color: #666666; padding-left: 20px;">
                        ${orderDetails.items.map((item: any) => `
                            <li>${item.product.name} - Quantity: ${item.quantity} - Price: ${item.price} BDT</li>
                        `).join('')}
                    </ul>
                    <p style="color: #666666; margin-top: 30px;">Thank you for shopping with us!</p>
                    <p style="color: #666666;">Best regards,<br>Hello Shop Team</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                    <p>This is an automated email, please do not reply.</p>
                    <p>© 2023 Hello Shop. All rights reserved.</p>
                </div>
            </div>
            <h1>Order Confirmation</h1>
            <p>Dear ${orderDetails.name},</p>
            <p>Thank you for your order! Your order has been confirmed.</p>
            <h2>Order Details:</h2>
            <p>Order ID: ${orderDetails.id}</p>
            <p>Total Amount: ${orderDetails.total} BDT</p>
            <p>Payment Method: ${orderDetails.paymentMethod}</p>
            <p>Shipping Address: ${orderDetails.address}, ${orderDetails.city}</p>
            <h3>Order Items:</h3>
            <ul>
                ${orderDetails.items.map((item: any) => `
                    <li>${item.product.name} - Quantity: ${item.quantity} - Price: ${item.price} BDT</li>
                `).join('')}
            </ul>
            <p>We will process your order shortly.</p>
            <p>Thank you for shopping with us!</p>
            <p>Best regards,<br>Hello Shop Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
}; 