import bcrypt from 'bcryptjs';
import prisma from '../../../../config/db';
/**
 * finds user and compares passwords
 * @param email
 * @param password
 * @returns { compare: boolean, message: string, user?: unknown, error?: any }
 */
export async function passwordCompare(email: string, password: string) {
   try {
      if (!email || !password) {
         return {
            compare: false,
            message: 'no email or password',
         };
      }

      //const foundUser = await prisma.users.findUnique({ where: { email } });

      const foundUser = await prisma.users.findUnique({
         where: {
            email: email,
         },
         include: {
            user_wallets: true,
         },
      });

      if (!foundUser) {
         return {
            compare: false,
            message: 'failure',
         };
      }

      if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
         return {
            compare: true,
            message: 'success',
            user: foundUser,
         };
      } else {
         return {
            compare: false,
            message: 'Invalid credentials',
         };
      }
   } catch (error) {
      return {
         compare: false,
         message: 'error occured',
         error: error,
      };
   }
}

/**
 * Fetches airdrop details for a user and returns a status object.
 * @param userId - The ID of the user to search in the airdrops table.
 * @returns { valid: boolean | null, claimed: boolean | null }
 */
export async function getAirdropStatus(
   userId: string
): Promise<{ valid: boolean | null; claimed: boolean | null }> {
   try {
      // Validate the userId parameter
      if (!userId) {
         return {
            valid: false,
            claimed: false,
         };
      }

      // Query the airdrops table for the user
      const airdrop = await prisma.airdrops.findFirst({
         where: { user_id: userId },
      });

      // If airdrop data is found, return its status
      if (airdrop) {
         return {
            valid: true,
            claimed: airdrop.claimed,
         };
      }

      // If no airdrop data is found, return null statuses
      return {
         valid: false,
         claimed: false,
      };
   } catch (error) {
      console.error('Error fetching airdrop status:', error);
      throw new Error('Failed to fetch airdrop status');
   }
}
