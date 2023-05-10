import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const createDynamic = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not recieved");

  const { userId, dictionaryId, packageId, evaluation } = req.body;

  if (
    typeof userId === "undefined" ||
    typeof dictionaryId === "undefined" ||
    typeof packageId === "undefined" ||
    typeof evaluation === "undefined"
  )
    res.status(400).send("One of the parameters is missing");

  await prisma.dynamic
    .create({
      data: {
        userId: userId,
        dictionaryId: dictionaryId,
        tweetPackageId: packageId,
        evaluations: evaluation,
      },
    })
    .then((data) => {
      res
        .status(200)
        .json({ dynamicId: data.id, evaluations: data.evaluations });
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

export const getDynamnics = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await prisma.dynamic
    .findMany()
    .then((data) => {
      res.status(200).json({ dynamics: data });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect;
    });
};
