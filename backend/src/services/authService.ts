import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterInput) {
  // Verifica se o e-mail já está cadastrado
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Este e-mail já está cadastrado");
  }

  // Criptografa a senha (nunca salvamos senha em texto puro)
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Não retornamos a senha, nem criptografada
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("E-mail ou senha inválidos");
  }

  // Compara a senha digitada com o hash salvo no banco
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("E-mail ou senha inválidos");
  }

  // Gera o token JWT (válido por 7 dias)
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}
