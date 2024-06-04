import { checkAuth } from "@/middleware/auth";
import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  checkAuth(req, res, async () => {
    if (req.method === "GET") {
      const email = req.headers.email as string;

      const accountOwner = email
        ? await prisma.users.findFirst({ where: { email } })
        : null;

      const hidePasswordAccountOwner = accountOwner
        ? {
            id: accountOwner.id,
            name: accountOwner.name,
            email: accountOwner.email,
            created_at: accountOwner.createdAt,
            updated_at: accountOwner.updatedAt,
          }
        : null;

      return res.send({
        accountOwner: hidePasswordAccountOwner,
      });
    }
  });
}
