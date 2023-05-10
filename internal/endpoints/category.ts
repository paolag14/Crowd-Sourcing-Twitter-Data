import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const createCategory = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not recieved");
  const { name } = req.body;

  if (typeof name === "undefined")
    res.status(400).send("One of the parameters is missing");
  await prisma.category
    .create({
      data: {
        name: name,
      },
    })
    .then((data) => {
      res.status(200).json({ categoryName: data.name });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect;
    });
};

export const getCategory = async (
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  await prisma.category
    .findMany()
    .then((data) => {
      res.status(200).json({ categories: data });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect;
    });
};
