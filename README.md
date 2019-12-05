Ignore the storage-pouchdb folder for now. The filesystem is the current work in progress. To test it, run the following command in this folder. You can install TiddlyWiki globally by running `npm install -g tiddlywiki`. That is the recommended method for this scenario. 

```sh
# run this in this folder, assumes a global tiddlywiki install (`npm install -g tiddlywiki`)
tiddlywiki ++storage-filesystem datafolder --listen
```