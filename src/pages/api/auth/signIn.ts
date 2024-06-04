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
    const { email, password } = req.body;
    const isValid = email.length > 0 && password.length > 0;
    if (!isValid) return res.status(400).json({ message: "bad request!" });

    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ message: "user doesn't exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "wrong credential!" });

    const dataForAccessToken = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = jwt.sign(dataForAccessToken, config.jwtSecret);

    return res.send({ accessToken });
  }
}
