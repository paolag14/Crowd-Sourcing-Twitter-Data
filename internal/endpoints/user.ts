import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not recieved");

  const { email, name, password, role } = req.body;
  if (
    typeof email === "undefined" ||
    typeof name === "undefined" ||
    typeof password === "undefined" ||
    typeof role === "undefined"
  )
    res.status(400).send("One of the parameters is missing");

  await prisma.user
    .create({
      data: {
        email: email,
        name: name,
        password: password,
        role: role,
      },
    })
    .then((data) => {
      res.status(200).json({ email: data.email, id: data.id });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect();
    });
};
