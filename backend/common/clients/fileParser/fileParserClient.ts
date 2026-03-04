import { HttpError } from "@/common/errors"
import mammoth from "mammoth"
import pdf from "pdf-parse"
import type { IFileParser } from "./IFileParser"

export class FileParserClient implements IFileParser {
  async parseToText(buffer: ArrayBuffer, mimeType: string): Promise<string> {
    const nodeBuffer = Buffer.from(buffer)

    if (mimeType === "application/pdf") {
      return this.parsePdf(nodeBuffer)
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return this.parseDocx(nodeBuffer)
    }

    throw new HttpError(
      "Unsupported file type. Please upload a PDF or Word document.",
      400
    )
  }

  private async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer)
      return data.text.replace(/\s+/g, " ").trim()
    } catch (err) {
      console.error("PDF parse error:", err)
      throw new HttpError("Failed to parse PDF file", 422)
    }
  }

  private async parseDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value.replace(/\s+/g, " ").trim()
    } catch (err) {
      console.error("DOCX parse error:", err)
      throw new HttpError("Failed to parse Word document", 422)
    }
  }
}
