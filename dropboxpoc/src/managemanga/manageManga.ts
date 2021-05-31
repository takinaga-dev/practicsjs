import { Dropbox, files } from "dropbox";

export class ManageManga {
  dropboxClient: Dropbox;
  // 検索効率凄く悪そうだけど、ここで悩むと先に進まないからいったんArrayで管理する。
  mangas: Array<SeriseManga>;
  constructor(client: Dropbox) {
    this.dropboxClient = client;
  }

  async getAllMangaFromDropBox(path: string, recursive: boolean = false, extensions = ['pdf']): Promise<Array<Manga>> {
    let result = await this.dropboxClient.filesListFolder({ path, recursive });
    const allData: Array<files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference> = [];
    // データ格納
    allData.push(...result.result.entries);
    let nextCursor = result.result.cursor;
    while(result.result.has_more) { 
      result = await this.dropboxClient.filesListFolderContinue({cursor: nextCursor})
      allData.push(...result.result.entries);
      nextCursor = result.result.cursor;   
    }
    
    // 
    let comics: Array<Manga> = [], cs: Array<Manga> = [];
    for(let data of allData) {
      if(data[".tag"] === 'file' && extensions.some(extension => data.name.endsWith(extension))) {
        const regex = /\..*$/i;
        comics.push(this.parseInfoFromFileName(data.name.replace(regex, ''), data.path_display));
      }
    }

    for(let comic of comics) {
      cs.push(this.parseInfoFromMangaInfo(comic))
    }
    return comics;
  }

  /*
    ファイル名(string)からMangaオブジェクトを生成する
    ファイルおよびディレクトリのネーミングについてはルールがいくつか存在する。
    - ファイル名に漫画名/巻数/著者が記載されいるケース
      - その中でも区切り文字がアンダースコア/スペースが存在する
      - なお順序はそれぞれである
    - ディレクトリ名に著者またはタイトルがありファイル名としては巻数が存在するケース
  */
  private parseInfoFromFileName(fileName: string, path: string, delimiters: Array<string> = [' ', '_']): Manga {
    for (const delimiter of delimiters ){
      const results = fileName.split(delimiter);
      if (results.length === 1) {
        continue;
      }
      let uncategories = results;
      // 一番高い可能性は、タイトル/巻数
      // 多分ここも関数化するべき部分だと思う。
      let index = -1;
      const vp = uncategories.find((r, i) => {
        const v = r.split('-')[0];
        if (parseInt(v)) {
          index = i
          return r;
        }
      })?.split('-');

      
      let volume = vp? parseInt(vp[0]): undefined;
      const part = vp? vp.length === 2? vp[1]: vp[2]: undefined;

      // タイトル
      uncategories = uncategories.filter((_r, i) => i !== index);
      volume = uncategories.length === 1 && !volume ? 1 : volume;
      const manga: Manga = {volume, part, pathOnDropbox: path, uncategories };
      return manga;
    }
    // タイトルの末尾に数字ならそれが巻数
    const result = fileName.match(/([0-9０-９]{1,2})(|表紙|はがき|広告)$/)?.filter(v => v);
    
    let volume: string | number  = result && result.length > 1 ? this.toNumber(result[1]): 1
    const part = result && result.length > 2 ? result[2]: undefined
    const f = result ? fileName.slice(0, -result[0].length): fileName;
    const manga: Manga = { pathOnDropbox: path, uncategories: [f], volume, part };

    // 本来ここでparseInfoFromMangaInfoを実行してmanga objectの詳細を埋めていくべき
    return manga;
  }

  private toNumber(volume): number {
    if (parseInt(volume)) {
      return parseInt(volume);
    } else {
      const t = volume.replace(/[０-９]{1,2}/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      return parseInt(t);
    }
  }


  private parseInfoFromMangaInfo(manga:Manga): Manga {
    if (manga.pathOnDropbox.includes('.Trash')) {
      return manga;
    }
    const results = manga.pathOnDropbox.split('/').filter(v => v);
    if(results.length > 2 && parseInt(results[results.length -2])) {
      manga.title = results[results.length -3];
      manga.volume = parseInt(results[results.length - 2]);
    }
    if (manga.title) {
      console.dir(manga);
    }
    return manga;
  }
}

export interface Manga {
  title?: string;

  volume?: number;

  part?: string;

  author?: string;

  pathOnDropbox: string;

  uncategories?: Array<string>;

}

export interface SeriseManga {
  title: string;
  author?: string;
  volues: Array<Manga>;
}

