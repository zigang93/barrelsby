import { buildImportPath, getBasename } from '../builder';
import { BaseUrl } from '../options/baseUrl';
import { Logger } from '../options/logger';
import { SemicolonCharacter } from '../options/noSemicolon';
import { QuoteCharacter } from '../options/quoteCharacter';
import { Directory } from '../interfaces/directory.interface';
import { FileTreeLocation } from '../interfaces/location.interface';

function toCamelCase(str: string): string {
  return str.replace(/[-_./](\w)/g, (_, c) => c.toUpperCase());
}

function getFirstImportPath(path: string) {
  const lastSlashIndex = path.lastIndexOf('/');
  const pathname = path.substring(0, lastSlashIndex)
  return pathname.replaceAll('/', '.')
}

export function buildFlatBarrel(
  directory: Directory,
  modules: FileTreeLocation[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean
): string {
  return modules.reduce((previous: string, current: FileTreeLocation) => {
    const importPath = buildImportPath(directory, current, baseUrl);
    logger.debug(`Including path ${importPath}`);
   
    if (exportDefault) {
      const filename = getBasename(current.path);
      logger.debug(`filename`, filename);
      logger.debug(`importPath`, importPath);
      previous += `export { default as ${toCamelCase(
        getFirstImportPath(importPath.replaceAll('.', '')) + filename
      )} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
    }
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
  }, '');
}
