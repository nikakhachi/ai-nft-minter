import type { NextApiRequest, NextApiResponse } from "next";
import { jsonRpsServices } from "@/services/jsonRpc.service";
import { NftType } from "@/contexts/NFTCollectionContext";
import axios from "axios";
import { ipfsUriToUrl } from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const nftsRes = await jsonRpsServices.fetchNfts();
  const nfts: NftType[] = await Promise.all(
    nftsRes.map((item) =>
      axios.get(ipfsUriToUrl(item.uri)).then(({ data: metadata }) => {
        return {
          name: metadata.name,
          description: metadata.description,
          owner: item.owner,
          id: item.id,
          imageUrl: ipfsUriToUrl(metadata.image),
        };
      })
    )
  );
  res.status(200).json(nfts);
}
