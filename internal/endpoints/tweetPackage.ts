import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import tweetParser from "../lambas/tweetPackageParser";
import { uploadToS3 } from "../services/aws_client";

const prisma = new PrismaClient();

export const uploadTweetPackage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not received");
  const { userId, filename, contentType, checksum, state } = req.body;

  if (
    typeof userId === "undefined" ||
    typeof filename === "undefined" ||
    typeof contentType === "undefined" ||
    typeof checksum === "undefined" ||
    typeof state === "undefined"
  )
    res.status(400).send("One of the required parameters is missing");
  await prisma.tweetPackage
    .create({
      data: {
        userId: userId,
        filename: filename,
        contentType: contentType,
        checksum: checksum,
        state: state,
      },
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  await uploadToS3("tweetPackage", filename, 1000)
    .then((data) => {
      res.status(200).json({ signedURL: data });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
export const getTweetPackages = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await prisma.tweetPackage
    .findMany()
    .then((data) => {
      res.status(200).json({ tweetpackages: data });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect;
    });
};
