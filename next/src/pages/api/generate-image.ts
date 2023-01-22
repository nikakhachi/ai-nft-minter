import type { NextApiRequest, NextApiResponse } from "next";
import { generateAsync } from "stability-client";
import fs from "fs";
import path from "path";

const tempImagePath = path.join(__dirname);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { keyword, uuid } = req.body;
    if (!keyword) return res.status(400).json({ error: "Keyword is Missing" });
    const imagePath = `${tempImagePath}/${uuid}`;
    console.log("IMAGE PATH: ===>  ", imagePath);
    fs.mkdirSync(imagePath);
    console.log("dir created");
    const aiResponse = (await generateAsync({
      prompt: keyword,
      apiKey: process.env.STABILITY_API_KEY || "",
      width: 512,
      height: 512,
      cfgScale: 10,
      steps: 10,
      samples: 1,
      outDir: imagePath,
    })) as any;
    console.log(aiResponse.images[0]);
    fs.readFile(aiResponse.images[0].filePath, function (err, data) {
      if (err) throw err;
      res.send(data);
    });
  }
}
