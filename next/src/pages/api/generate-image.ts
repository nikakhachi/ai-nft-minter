import type { NextApiRequest, NextApiResponse } from "next";
import { generateAsync } from "stability-client";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { SIGNATURE_MESSAGE } from "@/constants";
import { jsonRpsServices } from "@/services/jsonRpc.service";

const tempImagePath = path.join(__dirname);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { keyword, uuid, signature } = req.body;
    if (!keyword) return res.status(400).json({ error: "Keyword is Missing" });
    ethers.utils.verifyMessage(SIGNATURE_MESSAGE, signature);
    const isTotalSupplyLessThanMaxSupply = await jsonRpsServices.isTotalSupplyLessThanMaxSupply();
    if (!isTotalSupplyLessThanMaxSupply) return res.status(400).json({ error: "NFT max supply is reached" });
    const imagePath = `${tempImagePath}/${uuid}`;
    fs.mkdirSync(imagePath);
    const aiResponse = (await generateAsync({
      prompt: keyword,
      apiKey: process.env.STABILITY_API_KEY || "",
      width: 512,
      height: 512,
      cfgScale: 20,
      steps: 15,
      samples: 1,
      outDir: imagePath,
    })) as any;
    setTimeout(() => {
      try {
        fs.rmSync(imagePath, { recursive: true, force: true });
      } catch (error) {}
    }, 1000 * 60 * 10); // Deletes the created image and its folder in 10 minutes
    fs.readFile(aiResponse.images[0].filePath, function (err, data) {
      if (err) throw err;
      res.send(data);
    });
  }
}
