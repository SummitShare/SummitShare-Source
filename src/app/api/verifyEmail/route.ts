// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(req, res) {
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).json({ error: "Token is required" });
//   }

//   try {
//     const verificationRecord = await prisma.userVerification.findUnique({
//       where: { token },
//     });

//     if (!verificationRecord || new Date() > new Date(verificationRecord.expires)) {
//       return res.status(400).json({ error: "Invalid or expired token" });
//     }

//     await prisma.$transaction([
//       prisma.user.update({
//         where: { id: verificationRecord.userId },
//         data: { isVerified: true },
//       }),
//       prisma.userVerification.delete({
//         where: { id: verificationRecord.id },
//       }),
//     ]);

//     return res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }
