import { File, fileModel } from "../entities/file";
import UUID from "uuid";
import path from "path";
import fs from "fs";
import { GraphQLUpload } from "graphql-upload";

export const fileUpload = async (userId: string, File: GraphQLUpload) => {
  const { createReadStream, filename, mimeType, encoding } = await File;
  const stream = createReadStream();

  const { ext, name } = path.parse(filename);
  const generatedName = UUID.randomUUID().toString();

  const pathname = path.join(process.cwd(), `/uploads/${ext}/${generatedName}`);

  await stream.pipe(fs.createWriteStream(pathname));

  const uploadedFile = new fileModel({
    originalFileName: name,
    fileExtension: ext,
    savedFileName: generatedName,
    location: pathname,
    User: userId,
  });

  return uploadedFile;
};
