// emailService.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   host: process.env.HOST,
   service: process.env.SERVICE,
   port: process.env.EMAIL_PORT,
   secure: process.env.SECURE,
   auth: {
      user: process.env.USER,
      pass: process.env.PASS,
   },
});

export const sendConfirmationEmail = async ({
   name,
   email,
   city,
   userId,
   url,
}) => {
   try {
      const mailOptions = {
         from: email,
         to: "projectstatymai@gmail.com",
         subject: "Naujo kliento registracija",
         html: `
        <p>Sveiki!,</p>
        <p>Jusu svetaineje nori uzsiregistruoti naujas klientas:</p>
        <ul>
          <li>Vardas: ${name}</li>
          <li>El.Pastas: ${email}</li>
          <li>Miestas: ${city}</li>
        </ul>
        <p><a href="${url}">Spauskite cia kad patvirtinti</a></p>
      `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Confirmation email sent to admin");
   } catch (error) {
      console.error("Error sending confirmation email:", error);
   }
};
