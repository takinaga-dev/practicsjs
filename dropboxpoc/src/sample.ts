import { Dropbox, files } from 'dropbox';
import * as prompt from 'prompt';
import * as fs from 'fs';
import { savePdf } from './util';

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
  const allData: Array<files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference> = [];
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });
  let saveThumbnail, fileName, nextCursor;
  let result = await dClient.filesListFolder({ path: '', recursive: true});
  allData.push(...result.result.entries);
  nextCursor = result.result.cursor;
  let count = 0;
  while(result.result.has_more) {
    result = await dClient.filesListFolderContinue({cursor: nextCursor})
    allData.push(...result.result.entries);
    nextCursor = result.result.cursor;
    count++;
  }
  const countFolder = allData.filter(file => file['.tag'] === 'folder').map(f => {
    console.log('folder:', f.name, ', metainfo: ', f.path_display);
  }).length;

  const countFiles = allData.filter(file => file['.tag'] === 'file').map(f => {
    console.log('file:', f.name, ', metainfo: ', f.path_display);
    if (f.path_display.endsWith('.pdf') || f.path_display.endsWith('.jpg')) {
      saveThumbnail = f.path_display;
      fileName = `${f.name}.jpg`;
    }
  }).length;

  console.log('folder: ', countFolder, ' file:', countFiles);
  console.log('call count:', count);
  
});

(async () => {
  const ACCESS_TOKEN = await promtGet();
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });
  await savePdf(dClient, '');
})();