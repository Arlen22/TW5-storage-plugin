I have a working prototype for the client-side data folders. The reason I call them client-side is because they are stored on disk exactly as they appear on the client, and are deserialized directly from disk when requested. 

The client tiddlers are lazy loaded, which TiddlyWiki has supported for several years. The browser side of things literally worked "out of the box", but the server-side took quite a bit of thought and structure to work out the details. 

I've also decided to bring back more of the TiddlyWeb protocol, although I don't know how far I will go with it yet. So the server side supports multiple bags and recipes but the details are not finalized yet. 

Ignore the storage-pouchdb folder for now. The filesystem is the current work in progress. To test it, run the following command in this folder. You can install TiddlyWiki globally by running `npm install -g tiddlywiki`. That is the recommended method for this scenario. 

```sh
# run this in this folder, assumes a global tiddlywiki install (`npm install -g tiddlywiki`)
tiddlywiki ++storage-filesystem datafolder --listen
```