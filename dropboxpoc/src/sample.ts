import { Dropbox, files } from 'dropbox';
import * as prompt from 'prompt';
import * as fs from 'fs';
import * as util from 'util';
import { moveDataForSpecifiedPath, savePdf } from './util';
import { ManageManga } from './managemanga/manageManga';

prompt.start();
const promtGet = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    prompt.get(['accessToken'], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.accessToken as string);
    })
  });
}


(async () => {
    
  const ACCESS_TOKEN = await promtGet();
  
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });
  const mClient =  new ManageManga(dClient);

  const results = await mClient.getAllMangaFromDropBox('', true);

  console.log('all files:', results.filter(m => !m.pathOnDropbox.includes('.Trash')).length);
  console.log('分類できたデータ', results.filter(m => m.volume && m.uncategories.length === 1 && !parseInt(m.uncategories[0])).length);
  //console.dir(results.filter(m => m.volume && m.uncategories.length === 1 && !parseInt(m.uncategories[0])));

  // saveCacheData
  fs.writeFileSync('cache.json', JSON.stringify(results));;
  fs.writeFileSync('uncategoriesdData.json', JSON.stringify(results.filter(m => !m.volume && !m.pathOnDropbox.includes('.Trash'))));
  // fs.writeFileSync('categoriesdData.json', util.inspect(results.filter(m => m.volume), {maxArrayLength: null}), 'utf-8');
  fs.writeFileSync('categoriesdData.json', JSON.stringify(results.filter(m => m.volume)), 'utf-8');
})();

(async () => {
  const ACCESS_TOKEN = await promtGet();
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });
  await savePdf(dClient, '');
});