import { config } from "@/config/config";
import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    const isValid = name && email && password;

    if (!isValid) return res.status(400);

    const isUserExist = await prisma.users.findFirst({ where: { email } });
    if (isUserExist)
      return res.status(409).json({ message: "user is already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

    const dataForAccessToken = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    const accessToken = jwt.sign(dataForAccessToken, config.jwtSecret);

    return res.send({ accessToken });
  }
}
