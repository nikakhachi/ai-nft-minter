import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { create } from "ipfs-http-client";

const tempImagePath = path.join(__dirname);

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: "Basic " + Buffer.from(process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET).toString("base64"),
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { uuid } = req.body;
    const files = fs.readdirSync(`${tempImagePath}/${uuid}`);
    const file = fs.readFileSync(`${tempImagePath}/${uuid}/${files[0]}`);
    console.log("upload image to ipfs");
    const ipfsImageResponse = await ipfs.add(file);
    const metadata = {
      path: "/",
      content: JSON.stringify({
        attributes: [
          {
            trait_type: "Peace",
            value: "10",
          },
          {
            trait_type: "Love",
            value: "100",
          },
          {
            trait_type: "Web3",
            value: "1000",
          },
        ],
        image: `https://ipfs.io/ipfs/${ipfsImageResponse.cid}`,
        description: "So much PLW3!",
      }),
    };
    console.log("uploading metadata");
    const result = await ipfs.add(metadata);
    res.status(200).json(result);
    fs.rmSync(`${tempImagePath}/${uuid}`, { recursive: true, force: true });
  }
}
