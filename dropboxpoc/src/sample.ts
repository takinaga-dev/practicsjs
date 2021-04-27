import { Dropbox } from 'dropbox';
import * as prompt from 'prompt';
import * as fs from 'fs';

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

  console.log(ACCESS_TOKEN);
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });
  let saveThumbnail, fileName;
  const result = await dClient.filesListFolder({ path: '', recursive: false});
  const countFolder = result.result.entries.filter(file => file['.tag'] === 'folder').map(f => {
    console.log('folder:', f.name, ', metainfo: ', f.path_display);
  }).length;

  const countFiles = result.result.entries.filter(file => file['.tag'] === 'file').map(f => {
    console.log('file:', f.name, ', metainfo: ', f.path_display);
    if (f.path_display.endsWith('.pdf') || f.path_display.endsWith('.jpg')) {
      saveThumbnail = f.path_display;
      fileName = `${f.name}.jpg`;
    }
  }).length;

  console.log('folder: ', countFolder, ' file:', countFiles);
  console.log('has_more?', result.result.has_more);

  const thumbnail = await dClient.filesGetThumbnail({path: saveThumbnail, size: { '.tag': 'w256h256' }});
  fs.writeFileSync(`saveImage/${fileName}`, thumbnail.result['fileBinary']);
})();