import { z } from "zod";

export const nftMetadataSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      }),
    )
    .optional(),
});

export const nftMintSchema = z.object({
  imageFile: z.instanceof(File, { message: "Image file is required" }),
  metadata: nftMetadataSchema,
});

export type NFTMetadata = z.infer<typeof nftMetadataSchema>;
export type NFTMintInput = z.infer<typeof nftMintSchema>;
