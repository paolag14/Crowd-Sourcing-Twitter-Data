import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import category from "../../pages/api/category";
import { uploadToS3, getObject } from "../services/aws_client";

const prisma = new PrismaClient();

export const uploadDictionary = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not recieved");

  const { userId, categoryId, filename, contentType, checksum, state } =
    req.body;

  if (
    typeof userId === "undefined" ||
    typeof categoryId === "undefined" ||
    typeof filename === "undefined" ||
    typeof contentType === "undefined" ||
    typeof checksum === "undefined" ||
    typeof state === "undefined"
  )
    res.status(400).send("One of the parameters is missing");

  await prisma.dictionary.create({
    data: {
      userId: userId,
      categoryId: categoryId,
      filename: filename,
      contentType: contentType,
      checksum: checksum,
      state: state,
    },
  });

  await prisma.category
    .findFirst({
      where: {
        id: categoryId,
      },
      select: {
        name: true,
      },
    })
    .then(async (data) => {
      if (data !== undefined) {
        await uploadToS3(category.name, filename, 10000)
          .then((data) => {
            res.status(200).json({ signedURL: data });
          })
          .catch((err) => {
            res.status(400).send(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

export const getDictionaries = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await prisma.dictionary
    .findMany()
    .then((data) => {
      res.status(200).json({ dictionaries: data });
    })
    .catch(async (err) => {
      res.status(400).send(err.message);
      await prisma.$disconnect;
    });
};

export const getDictionary = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (typeof req.body === "undefined")
    res.status(400).send("Parameters not recieved");

  const { category, name } = req.body;

  if (typeof category === "undefined" || typeof name === "undefined")
    res.status(400).send("One of the parameters is missing");

  await getObject(category, name)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
