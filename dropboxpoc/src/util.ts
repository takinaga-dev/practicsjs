import { Dropbox, files } from "dropbox";
import  * as fs  from 'fs';
import * as path from 'path';
/*
  サムネイルをダウンロードする
*/
export const saveThumbnail = async (dropboxClient: Dropbox, savePath: string, size: files.ThumbnailSize) => {
  const thumbnail = await dropboxClient.filesGetThumbnail({path: savePath, size});
  
  const thumbnailName = savePath.replace('/(.pdf|.jpg)$/i', '.jpg').split('/').pop();
}

/*
  データをダウンロードする
*/

export const savePdf = async (dropboxClient: Dropbox, dpath: string, saveFolder = 'saveImage') => {
  const result = await dropboxClient.filesDownload({path: dpath});
  fs.writeFileSync(path.join(saveFolder, dpath.split('/').pop()), result.result['fileBinary']);
}

interface Manga {
  title: string;

  volume: number;

  pathOnDropbox: string;
}

interface SeriseManga {
  title: string;
  author?: string;
  volues: Array<Manga>;
}
/*
  Dropboxから取得したデータから巻数、タイトルを抽出する 
*/