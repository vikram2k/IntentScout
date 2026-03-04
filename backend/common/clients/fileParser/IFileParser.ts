export interface IFileParser {
  parseToText(buffer: ArrayBuffer, mimeType: string): Promise<string>
}
