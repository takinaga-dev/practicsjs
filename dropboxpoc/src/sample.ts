import { Dropbox } from 'dropbox';
import * as prompt from 'prompt';

prompt.start();
const promtGet = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    prompt.get(['accessToken'], (err, result) => {
      resolve(result.accessToken as string);
    })
  });
}

(async () => {
    
  const ACCESS_TOKEN = await promtGet();

  console.log(ACCESS_TOKEN);
  const dClient = new Dropbox({accessToken: ACCESS_TOKEN });

  const result = await dClient.filesListFolder({ path: ''});
  result.result.entries.filter(file => file['.tag'] === 'folder').map(f => {
    console.log('folder:', f.name);
  })

  result.result.entries.filter(file => file['.tag'] === 'file').map(f => {
    console.log('file:', f.name);
  })
})();