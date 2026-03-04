export interface IScraperClient {
  scrape(url: string): Promise<string>
}
