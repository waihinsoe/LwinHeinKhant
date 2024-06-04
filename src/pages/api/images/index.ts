import { checkAuth } from "@/middleware/auth";
import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  checkAuth(req, res, async () => {
    if (req.method === "GET") {
      //@ts-ignore
      const userEmail = req.headers.email as string;

      if (!userEmail) return res.status(401);

      const user = await prisma.users.findFirst({
        where: { email: userEmail },
      });

      if (!user) return res.status(404);

      const images = await prisma.images.findMany({
        where: {
          userId: user.id,
        },
      });

      return res.status(200).json(images);
    }

    if (req.method === "POST") {
      const { title, url, userId } = req.body;
      const isValid = title && url && userId > -1;
      if (!isValid) return res.send(400);

      try {
        const createdImage = await prisma.images.create({
          data: {
            title,
            url,
            userId,
          },
        });

        console.log(createdImage);
        return res.status(200).json({
          status: "success",
          message: "Image data successfully created!",
        });
      } catch (error) {
        return res.status(405).json({ status: "failed", error: error });
      }
    }

    if (req.method === "DELETE") {
      const id = req.query.imageId as string;
      if (!id) return res.status(404);

      await prisma.images.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: "delete success!" });
    }
  });
}
