import type { IFileParser } from "./IFileParser"
import { FileParserClient } from "./fileParserClient"

export const createFileParser = (): IFileParser => {
  return new FileParserClient()
}
