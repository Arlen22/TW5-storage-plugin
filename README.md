To test this run 

```sh
# run this in the tiddlywiki or tiddlyserver installation directory
npm install pouchdb pouchdb-adapter-node-websql --prod
# run this in this folder, assumes a global tiddlywiki install (`npm install -g tiddlywiki`)
tiddlywiki ++storage-filesystem datafolder --listen
```