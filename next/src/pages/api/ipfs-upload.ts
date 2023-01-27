import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { SIGNATURE_MESSAGE } from "@/constants";
import { jsonRpsServices } from "@/services/jsonRpc.service";
import { NFTStorage } from "nft.storage";
import { Blob } from "@web-std/blob";

const tempImagePath = path.join(__dirname);

const nftStorageClient = new NFTStorage({
  token: process.env.NFT_STORAGE_API || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { uuid, name, description, signature } = req.body;
    ethers.utils.verifyMessage(SIGNATURE_MESSAGE, signature);
    const isTotalSupplyLessThanMaxSupply = await jsonRpsServices.isTotalSupplyLessThanMaxSupply();
    if (!isTotalSupplyLessThanMaxSupply) return res.status(400).json({ error: "NFT max supply is reached" });
    const files = fs.readdirSync(`${tempImagePath}/${uuid}`);
    const file = fs.readFileSync(`${tempImagePath}/${uuid}/${files[0]}`);
    const nftStorageRes = await nftStorageClient.store({
      name,
      description,
      image: new Blob([file], { type: "image/png" }),
    });
    res.status(200).json({ ipfsUri: nftStorageRes.url });
    fs.rmSync(`${tempImagePath}/${uuid}`, { recursive: true, force: true });
  }
}
