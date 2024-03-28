// emailService.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});

export const sendConfirmationEmail = async ({ name, email, city, userId }) => {
  try {
    const mailOptions = {
      from: email,
      to: 'projectstatymai@gmail.com',
      subject: 'Naujo kliento registracija',
      html: `
        <p>Sveiki!,</p>
        <p>Jusu svetaineje nori uzsiregistruoti naujas klientas:</p>
        <ul>
          <li>Vardas: ${name}</li>
          <li>El.Pastas: ${email}</li>
          <li>Miestas: ${city}</li>
        </ul>
        <p><a href="http://your-app.com/admin/confirm/${userId}">Spauskite cia kad patvirtinti</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to admin');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};