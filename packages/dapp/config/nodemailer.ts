
import nodemailer from "nodemailer";

export const emailServer = process.env.EMAIL
const newemail = "thomas.gondwe@bicos.io"

const pass = process.env.PASS

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