
import nodemailer from "nodemailer";

export const emailServer = process.env.SEMAIL
const newemail = "thomas.gondwe@bicos.io"

const pass = process.env.S_APP_PASSWORD

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: emailServer,
        pass
    }

}) 
export const mailOptions = {
    from: emailServer,
    to: newemail,
}