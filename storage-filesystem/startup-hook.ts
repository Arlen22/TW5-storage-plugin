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
      let add = new TiddlyWikiServer();
      Object.assign(wikiServer, TiddlyWikiServer.prototype, add);
    });
  };


})();


// import { promisify } from "util";
// import * as fs from "fs";
// import * as path from "path";
const path: typeof import ("path") = $tw.node && require("path");
const fs: typeof import("fs") = $tw.node && require('fs');
const promisify: typeof import("util").promisify = $tw.node && require("util").promisify;
// // console.log("adding hook");

//   //Currently TiddlyWiki5 doesn't use bags and recipes
// declare namespace PouchDB {
//   declare interface Database {

//   }
// }
declare const $tw: any;
// declare namespace $tw {
//   declare interface Tiddler {

//   }
// }


declare interface FileInfo {
  /** filepath: the absolute path to the file containing the tiddler */
  filepath: string;
  /** type: the type of the tiddler file (NOT the type of the tiddler -- see below) */
  type: string;
  /** hasMetaFile: true if the file also has a companion .meta file */
  hasMetaFile: boolean;
  /** bag: the bag this file is in */
  bag: string;
}

class TiddlyWikiServer {
  
  wiki: any;
  constructor() {
    this.files = {};
    this.recipes = { "default": { bags: ["default"] } };
    this.clientTiddlersPath = path.join($tw.boot.wikiPath, "tiddlyweb");
    this.filesCachePath = path.join($tw.boot.wikiPath, "tiddlyweb-files.json");
    let stiddlers = this.initSkinnyTiddlers("default");
    this.saveSkinnyTiddlers("default", stiddlers).then(() => { console.log("ready"); });
  }
  getIDsFromRecipeTitle(recipe: string, title: string): string[] {
    return this.recipes[recipe].bags.map(e => this.getIDFromBagTitle(e, title));
  };
  getIDFromBagTitle(bag: string, title: string): string {
    return bag + "|" + title
  }
  files: Record<string, Record<string, FileInfo>>;
  recipes: Record<string, { bags: string[] }>;
  clientTiddlersPath: string;
  filesCachePath: string;
  // stiddlers?: any[];
  skinnyCachePath(recipe: string): string {
    return path.join($tw.boot.wikiPath, "tiddlyweb-" + recipe + "-skinny.json");
  }
  findSkinnyTiddlerIndex(stiddlers: any[], title: string): number {
    return stiddlers.findIndex(e => e.title === title);
  }
  getTitleFileInfo(bag: string, title: string): FileInfo {
    return this.files[bag][title];
  }
  deleteTitleFileInfo(bag: string, title: string): void {
    this.files[bag][title] = undefined;
  }
  async getTiddlerFileInfo(tiddler: any): Promise<FileInfo> {

    var title = tiddler.fields.title,
      bag = tiddler.fields.bag,
      fileInfo = this.files[bag][title];

    if (!fileInfo) {
      // Otherwise, we'll need to generate it
      fileInfo = $tw.utils.generateTiddlerFileInfo(tiddler, {
        directory: path.join(this.clientTiddlersPath, bag),
        pathFilters: this.wiki.getTiddlerText("$:/config/ClientFileSystemPaths", "").split("\n"),
        wiki: this.wiki
      });
      fileInfo.bag = bag;
      this.files[bag][title] = fileInfo;
    }
    return fileInfo;
  }
  // async loadTiddlerFile(recipe: string, title: string): Promise<any>;
  // async saveTiddlerFile(recipe: string, tiddler: any): Promise<{ bag: string, revision: string }>;
  // async deleteTiddlerFile(bag: string, title: string): Promise<void>;
  async loadTiddlerFile(recipe, title) {
    function handleError() {
      this.deleteTitleFileInfo(recipe, title);
      return Promise.reject(new Error(`Tiddler ${title} doesn't exist in recipe ${recipe}`));
    }

    console.log("loading %s %s", recipe, title);
    var stiddlers = await this.loadSkinnyTiddlers(recipe);
    let current = stiddlers.find(e => e.title === title);
    let bag = current ? current.bag : this.recipes[recipe].bags[0];
    var fileInfo = this.getTitleFileInfo(bag, title);

    if (!fileInfo || !fs.existsSync(fileInfo.filepath)) return handleError();
    /** @type { FileInfo & { tiddlers: any[] } */
    var data = $tw.loadTiddlersFromFile(fileInfo.filepath);
    var tiddlers = {};
    data.tiddlers.forEach(e => {
      this.files[e.title] = Object.assign({}, data);
      this.files[e.title]["tiddlers"] = undefined;
      tiddlers[e.title] = e;
    });

    if (!tiddlers[title]) return handleError();

    return { tiddler: tiddlers[title] };
  };
  async saveTiddlerFile(recipe, fields) {
    let stiddlers = await this.loadSkinnyTiddlers(recipe).catch(console.log) || [];

    console.log("saving %s %s", recipe, fields.title);
    let currentIndex = stiddlers.findIndex(e => e.title === fields.title),
      current = stiddlers[currentIndex];
    fields.revision = ((current && +current.revision || 0) + 1).toString();
    //new tiddlers always get saved in the first bag
    fields.bag = current ? current.bag : this.recipes[recipe].bags[0];
    var tiddler = new $tw.Tiddler(this.wiki.getCreationFields(), fields, this.wiki.getModificationFields());

    let fileInfo = await this.getTiddlerFileInfo(tiddler);

    var skt = Object.assign({}, tiddler.fields);
    skt.text = undefined;

    if (currentIndex === -1) stiddlers.push(skt);
    else stiddlers[currentIndex] = skt;

    return Promise.all([
      this.saveSkinnyTiddlers(recipe, stiddlers),
      new Promise((resolve, reject) => {
        $tw.utils.saveTiddlerToFile(tiddler, fileInfo, function (err2) {
          if (err2) return reject(err2);
          return resolve()
        });
      })
    ]).then(res => ({ bag: fileInfo.bag, revision: fields.revision }));

  }


  async deleteTiddlerFile(bag, title) {
    return new Promise<void>((resolve, reject) => ((callback) => {
      var old_callback = callback;
      callback = (err) => {
        if (err) return reject(err);
        var finished = [];
        var recipesToUpdate = Object.keys(this.recipes).filter((k) => {
          return this.recipes[k].bags.indexOf(bag) !== -1;
        });

        resolve(Promise.all(recipesToUpdate.map(async (recipe) => {
          let skinny = await this.loadSkinnyTiddlers(recipe).catch(() => []);
          if (!skinny.length) return;
          var currentIndex = skinny.findIndex(e => e.title === title);
          var current = skinny[currentIndex];
          if (current.bag !== bag) return;
          else skinny.splice(currentIndex, 1);
          return this.saveSkinnyTiddlers(recipe, skinny);
        })).then(() => old_callback(null)));
      }
      var fileInfo = this.files[bag][title];
      console.log("deleting %s", bag, title);
      // Only delete the tiddler if we have writable information for the file
      // and the bag matches the bag specifed in the url
      if (fileInfo && fileInfo.bag === bag) {
        // Delete the file
        fs.unlink(fileInfo.filepath, function (err) {
          if (err) {
            return callback(err);
          }
          // Delete the metafile if present
          if (fileInfo.hasMetaFile) {
            fs.unlink(fileInfo.filepath + ".meta", function (err) {
              if (err) {
                return callback(err);
              }
              return $tw.utils.deleteEmptyDirs(path.dirname(fileInfo.filepath), callback);
            });
          }
          else {
            return $tw.utils.deleteEmptyDirs(path.dirname(fileInfo.filepath), callback);
          }
        });
      } else {
        callback(null);
      }
    })(function (err) {
      if (err) reject(err);
      else resolve();
    }));
  }


  async loadSkinnyTiddlers(recipe: string): Promise<any[]> {
    let data = await promisify(fs.readFile)(this.skinnyCachePath(recipe), "utf8");
    return JSON.parse(data) as any[];
  };

  async saveSkinnyTiddlers(recipe: string, json: any[]): Promise<void> {
    return await promisify(fs.writeFile)(
      this.skinnyCachePath(recipe),
      JSON.stringify(json, null, 2),
      "utf8"
    );
  }
  initSkinnyTiddlers(recipe: string): any[] {
    var tiddlers = [];
    var titlesIndex = {};
    this.recipes[recipe].bags.forEach(bag => {
      this.files[bag] = {};
      var bagpath = path.join(this.clientTiddlersPath, bag);
      $tw.utils.each($tw.loadTiddlersFromPath(bagpath), (tiddlerFile) => {
        if (tiddlerFile.filepath) {
          $tw.utils.each(tiddlerFile.tiddlers, (tiddler) => {
            //titles in higher bags override titles in lower bags
            if (titlesIndex[tiddler.title] === undefined) {
              tiddler.text = undefined;
              tiddler.bag = bag;

              this.files[bag][tiddler.title] = {
                filepath: tiddlerFile.filepath,
                type: tiddlerFile.type,
                hasMetaFile: tiddlerFile.hasMetaFile,
                bag: bag
              };
              titlesIndex[tiddler.title] = tiddlers.length;
              tiddlers.push(tiddler);
            }
          });
        }
      });
    });
    return tiddlers;
  }

  /**
   * 
   * @param tiddler a $tw.Tiddler instance
   */
  convertTiddlerToTiddlyWebFormat(tiddler: any) {
    var result = {} as any,
      knownFields = [
        "bag", "created", "creator", "modified", "modifier", "permissions", "recipe", "revision", "tags", "text", "title", "type", "uri"
      ];
    if (tiddler) {
      $tw.utils.each(tiddler.fields, function (fieldValue, fieldName) {
        var fieldString = fieldName === "tags" ?
          tiddler.fields.tags :
          tiddler.getFieldString(fieldName); // Tags must be passed as an array, not a string

        if (knownFields.indexOf(fieldName) !== -1) {
          // If it's a known field, just copy it across
          result[fieldName] = fieldString;
        } else {
          // If it's unknown, put it in the "fields" field
          result.fields = result.fields || {};
          result.fields[fieldName] = fieldString;
        }
      });
    }
    // Default the content type
    result.type = result.type || "text/vnd.tiddlywiki";
    return JSON.stringify(result, null, $tw.config.preferences.jsonSpaces);
  }

  /*
  Convert a field set in TiddlyWeb format into ordinary TiddlyWiki5 format
  */
  convertTiddlerFromTiddlyWebFormat(tiddlerFields) {
    var result = {} as any;
    // Transfer the fields, pulling down the `fields` hashmap
    $tw.utils.each(tiddlerFields, function (element, title, object) {
      if (title === "fields") {
        $tw.utils.each(element, function (element, subTitle, object) {
          result[subTitle] = element;
        });
      } else {
        result[title] = tiddlerFields[title];
      }
    });
    // Make sure the revision is expressed as a string
    if (typeof result.revision === "number") {
      result.revision = result.revision.toString();
    }
    // Some cleanup of content types
    if (result.type === "text/javascript") {
      result.type = "application/javascript";
    } else if (!result.type || result.type === "None") {
      result.type = "text/x-tiddlywiki";
    }
    return result;
  };

}
