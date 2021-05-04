import { Dropbox, files } from "dropbox";
import  * as fs  from 'fs';
import * as path from 'path';
import { ManageManga, Manga } from "./managemanga/manageManga";
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

/*
  データを移動する
*/
export const moveDataForSpecifiedPath = async (dropboxClient: Dropbox, directory: string, manga: Manga) => {
  // タイトル 巻数0パートの順
  console.dir(manga);
  if (manga.title && manga.volume && manga.uncategories.length === 1) {
    const toPath = `${directory}/${manga.title} ${manga.volume}-${manga.uncategories[0]}.pdf`
    const fromPath = manga.pathOnDropbox;
    console.log('toPath:', toPath);
    console.log('fromPath:', fromPath);
    return await dropboxClient.filesMoveV2({from_path: fromPath, to_path: toPath, autorename: true});
  }
}
/*
  Dropboxから取得したデータから巻数、タイトルを抽出する 
*/