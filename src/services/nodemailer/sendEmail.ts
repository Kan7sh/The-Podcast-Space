"use server";

import { db } from "@/db/db";
import { VerifyOTPTable } from "@/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email: string, id: number) {
  try {
    const randomFourDigitOtp = Math.floor(1000 + Math.random() * 9000);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "The Podcast space Signup OTP",
      html: `
      <h1>Hey this is your OTP:  ${randomFourDigitOtp}!</h1>
      <p>Best regards,<br>The Podcast space Team</p>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    const uuid = await db.insert(VerifyOTPTable).values({
      email: email,
      otp: randomFourDigitOtp.toString(),
      createdAt: new Date(),
      isVerified: false,
      validTill: new Date(new Date().getTime() + 15 * 60 * 1000),
      updatedAt: new Date(),
      tempUserId: id,
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }
}
