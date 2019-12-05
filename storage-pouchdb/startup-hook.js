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
    // console.log("adding hook");
    $tw.hooks.addHook("th-server-command-post-start", (wikiServer, nodeServer, platform) => {
      var PouchDB = require("pouchdb");
      PouchDB.plugin(require('pouchdb-adapter-node-websql'));
      var dbpath = require('path').resolve($tw.boot.wikiPath, 'mydatabase.db');
      // console.log(dbpath);
      wikiServer.database = new PouchDB(dbpath, { adapter: "websql" });
      wikiServer.database.getIDsFromRecipeTitle = function (recipe, title) {
        const recipes = {
          "default": { bags: ["default"] }
        }
        try {
          return recipes[recipe].bags.map(e => wikiServer.database.getIDFromBagTitle(e, title));
        } catch(e){
          console.log(recipe, title);
          throw e;
        }
      };
      wikiServer.database.getIDFromBagTitle = function(bag, title){
        const bagsep = "|";
        return bag + bagsep + title
      }
    });
  };

})();
