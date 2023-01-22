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
    const { uuid, name, description } = req.body;
    const files = fs.readdirSync(`${tempImagePath}/${uuid}`);
    const file = fs.readFileSync(`${tempImagePath}/${uuid}/${files[0]}`);
    const ipfsImageResponse = await ipfs.add(file);
    const metadata = {
      path: "/",
      content: JSON.stringify({
        name,
        attributes: [],
        image: `https://ipfs.io/ipfs/${ipfsImageResponse.cid}`,
        description,
      }),
    };
    const result = await ipfs.add(metadata);
    res.status(200).json(result);
    fs.rmSync(`${tempImagePath}/${uuid}`, { recursive: true, force: true });
  }
}
