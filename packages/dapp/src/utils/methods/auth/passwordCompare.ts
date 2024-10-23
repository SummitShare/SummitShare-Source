import bcrypt from 'bcryptjs';
import prisma from '../../../../config/db';
import users from '@prisma/client';
/**
 * finds user and compares passwords
 * @param email
 * @param password
 * @returns { compare: boolean, message: string, user?: users, error?: any }
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
