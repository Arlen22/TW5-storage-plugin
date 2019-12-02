/*\
title: $:/plugins/arlen22/storage/startup-hook.js
type: application/javascript
module-type: startup

Command processing

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  // Export name and synchronous status
  exports.name = "storage-hooks";
  exports.platforms = ["node"];
  exports.before = ["commands"];
  exports.synchronous = true;

  exports.startup = function () {
    $tw.hooks.addHook("th-server-command-post-start", (wikiServer, nodeServer, platform) => {
      var PouchDB = require("pouchdb");
      PouchDB.plugin(require('pouchdb-adapter-node-websql'));
      wikiServer.database = new PouchDB(require('path').resolve($tw.boot.wikiPath, 'mydatabase.db'), { adapter: "websql" });
    });
  };

})();
