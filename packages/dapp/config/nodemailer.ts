
import nodemailer from "nodemailer";

export const email = process.env.EMAIL
const newemail = "thomas.gondwe@bicos.io"

const pass = process.env.PASS

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: email,
        pass
    }

}) 
export const mailOptions = {
    from: email,
    to: newemail,
}