/*\
title: $:/plugins/arlen22/storage/startup-hook.js
type: application/javascript
module-type: startup

Command processing

\*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        $tw.hooks.addHook("th-server-command-post-start", function (wikiServer, nodeServer, platform) {
            var add = new TiddlyWikiServer();
            Object.assign(wikiServer, TiddlyWikiServer.prototype, add);
        });
    };
})();
// import { promisify } from "util";
// import * as fs from "fs";
// import * as path from "path";
var path = $tw.node && require("path");
var fs = $tw.node && require('fs');
var promisify = $tw.node && require("util").promisify;
var TiddlyWikiServer = /** @class */ (function () {
    function TiddlyWikiServer() {
        this.files = {};
        this.recipes = { "default": { bags: ["default"] } };
        this.clientTiddlersPath = path.join($tw.boot.wikiPath, "tiddlyweb");
        this.filesCachePath = path.join($tw.boot.wikiPath, "tiddlyweb-files.json");
        var stiddlers = this.initSkinnyTiddlers("default");
        this.saveSkinnyTiddlers("default", stiddlers).then(function () { console.log("ready"); });
    }
    TiddlyWikiServer.prototype.getIDsFromRecipeTitle = function (recipe, title) {
        var _this = this;
        return this.recipes[recipe].bags.map(function (e) { return _this.getIDFromBagTitle(e, title); });
    };
    ;
    TiddlyWikiServer.prototype.getIDFromBagTitle = function (bag, title) {
        return bag + "|" + title;
    };
    // stiddlers?: any[];
    TiddlyWikiServer.prototype.skinnyCachePath = function (recipe) {
        return path.join($tw.boot.wikiPath, "tiddlyweb-" + recipe + "-skinny.json");
    };
    TiddlyWikiServer.prototype.findSkinnyTiddlerIndex = function (stiddlers, title) {
        return stiddlers.findIndex(function (e) { return e.title === title; });
    };
    TiddlyWikiServer.prototype.getTitleFileInfo = function (bag, title) {
        return this.files[bag][title];
    };
    TiddlyWikiServer.prototype.deleteTitleFileInfo = function (bag, title) {
        this.files[bag][title] = undefined;
    };
    TiddlyWikiServer.prototype.getTiddlerFileInfo = function (tiddler) {
        return __awaiter(this, void 0, void 0, function () {
            var title, bag, fileInfo;
            return __generator(this, function (_a) {
                title = tiddler.fields.title, bag = tiddler.fields.bag, fileInfo = this.files[bag][title];
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
                return [2 /*return*/, fileInfo];
            });
        });
    };
    // async loadTiddlerFile(recipe: string, title: string): Promise<any>;
    // async saveTiddlerFile(recipe: string, tiddler: any): Promise<{ bag: string, revision: string }>;
    // async deleteTiddlerFile(bag: string, title: string): Promise<void>;
    TiddlyWikiServer.prototype.loadTiddlerFile = function (recipe, title) {
        return __awaiter(this, void 0, void 0, function () {
            function handleError() {
                this.deleteTitleFileInfo(recipe, title);
                return Promise.reject(new Error("Tiddler " + title + " doesn't exist in recipe " + recipe));
            }
            var stiddlers, current, bag, fileInfo, data, tiddlers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("loading %s %s", recipe, title);
                        return [4 /*yield*/, this.loadSkinnyTiddlers(recipe)];
                    case 1:
                        stiddlers = _a.sent();
                        current = stiddlers.find(function (e) { return e.title === title; });
                        bag = current ? current.bag : this.recipes[recipe].bags[0];
                        fileInfo = this.getTitleFileInfo(bag, title);
                        if (!fileInfo || !fs.existsSync(fileInfo.filepath))
                            return [2 /*return*/, handleError()];
                        data = $tw.loadTiddlersFromFile(fileInfo.filepath);
                        tiddlers = {};
                        data.tiddlers.forEach(function (e) {
                            _this.files[e.title] = Object.assign({}, data);
                            _this.files[e.title]["tiddlers"] = undefined;
                            tiddlers[e.title] = e;
                        });
                        if (!tiddlers[title])
                            return [2 /*return*/, handleError()];
                        return [2 /*return*/, { tiddler: tiddlers[title] }];
                }
            });
        });
    };
    ;
    TiddlyWikiServer.prototype.saveTiddlerFile = function (recipe, fields) {
        return __awaiter(this, void 0, void 0, function () {
            var stiddlers, currentIndex, current, tiddler, fileInfo, skt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSkinnyTiddlers(recipe).catch(console.log)];
                    case 1:
                        stiddlers = (_a.sent()) || [];
                        console.log("saving %s %s", recipe, fields.title);
                        currentIndex = stiddlers.findIndex(function (e) { return e.title === fields.title; }), current = stiddlers[currentIndex];
                        fields.revision = ((current && +current.revision || 0) + 1).toString();
                        //new tiddlers always get saved in the first bag
                        fields.bag = current ? current.bag : this.recipes[recipe].bags[0];
                        tiddler = new $tw.Tiddler(this.wiki.getCreationFields(), fields, this.wiki.getModificationFields());
                        return [4 /*yield*/, this.getTiddlerFileInfo(tiddler)];
                    case 2:
                        fileInfo = _a.sent();
                        skt = Object.assign({}, tiddler.fields);
                        skt.text = undefined;
                        if (currentIndex === -1)
                            stiddlers.push(skt);
                        else
                            stiddlers[currentIndex] = skt;
                        return [2 /*return*/, Promise.all([
                                this.saveSkinnyTiddlers(recipe, stiddlers),
                                new Promise(function (resolve, reject) {
                                    $tw.utils.saveTiddlerToFile(tiddler, fileInfo, function (err2) {
                                        if (err2)
                                            return reject(err2);
                                        return resolve();
                                    });
                                })
                            ]).then(function (res) { return ({ bag: fileInfo.bag, revision: fields.revision }); })];
                }
            });
        });
    };
    TiddlyWikiServer.prototype.deleteTiddlerFile = function (bag, title) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return (function (callback) {
                        var old_callback = callback;
                        callback = function (err) {
                            if (err)
                                return reject(err);
                            var finished = [];
                            var recipesToUpdate = Object.keys(_this.recipes).filter(function (k) {
                                return _this.recipes[k].bags.indexOf(bag) !== -1;
                            });
                            resolve(Promise.all(recipesToUpdate.map(function (recipe) { return __awaiter(_this, void 0, void 0, function () {
                                var skinny, currentIndex, current;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.loadSkinnyTiddlers(recipe).catch(function () { return []; })];
                                        case 1:
                                            skinny = _a.sent();
                                            if (!skinny.length)
                                                return [2 /*return*/];
                                            currentIndex = skinny.findIndex(function (e) { return e.title === title; });
                                            current = skinny[currentIndex];
                                            if (current.bag !== bag)
                                                return [2 /*return*/];
                                            else
                                                skinny.splice(currentIndex, 1);
                                            return [2 /*return*/, this.saveSkinnyTiddlers(recipe, skinny)];
                                    }
                                });
                            }); })).then(function () { return old_callback(null); }));
                        };
                        var fileInfo = _this.files[bag][title];
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
                        }
                        else {
                            callback(null);
                        }
                    })(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    }); })];
            });
        });
    };
    TiddlyWikiServer.prototype.loadSkinnyTiddlers = function (recipe) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisify(fs.readFile)(this.skinnyCachePath(recipe), "utf8")];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, JSON.parse(data)];
                }
            });
        });
    };
    ;
    TiddlyWikiServer.prototype.saveSkinnyTiddlers = function (recipe, json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promisify(fs.writeFile)(this.skinnyCachePath(recipe), JSON.stringify(json, null, 2), "utf8")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TiddlyWikiServer.prototype.initSkinnyTiddlers = function (recipe) {
        var _this = this;
        var tiddlers = [];
        var titlesIndex = {};
        this.recipes[recipe].bags.forEach(function (bag) {
            _this.files[bag] = {};
            var bagpath = path.join(_this.clientTiddlersPath, bag);
            $tw.utils.each($tw.loadTiddlersFromPath(bagpath), function (tiddlerFile) {
                if (tiddlerFile.filepath) {
                    $tw.utils.each(tiddlerFile.tiddlers, function (tiddler) {
                        //titles in higher bags override titles in lower bags
                        if (titlesIndex[tiddler.title] === undefined) {
                            tiddler.text = undefined;
                            tiddler.bag = bag;
                            _this.files[bag][tiddler.title] = {
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
    };
    /**
     *
     * @param tiddler a $tw.Tiddler instance
     */
    TiddlyWikiServer.prototype.convertTiddlerToTiddlyWebFormat = function (tiddler) {
        var result = {}, knownFields = [
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
                }
                else {
                    // If it's unknown, put it in the "fields" field
                    result.fields = result.fields || {};
                    result.fields[fieldName] = fieldString;
                }
            });
        }
        // Default the content type
        result.type = result.type || "text/vnd.tiddlywiki";
        return JSON.stringify(result, null, $tw.config.preferences.jsonSpaces);
    };
    /*
    Convert a field set in TiddlyWeb format into ordinary TiddlyWiki5 format
    */
    TiddlyWikiServer.prototype.convertTiddlerFromTiddlyWebFormat = function (tiddlerFields) {
        var result = {};
        // Transfer the fields, pulling down the `fields` hashmap
        $tw.utils.each(tiddlerFields, function (element, title, object) {
            if (title === "fields") {
                $tw.utils.each(element, function (element, subTitle, object) {
                    result[subTitle] = element;
                });
            }
            else {
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
        }
        else if (!result.type || result.type === "None") {
            result.type = "text/x-tiddlywiki";
        }
        return result;
    };
    ;
    return TiddlyWikiServer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhcnR1cC1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxDQUFDO0lBR0MscUNBQXFDO0lBQ3JDLHNCQUFzQjtJQUN0QixZQUFZLENBQUM7SUFFYixxQ0FBcUM7SUFDckMsT0FBTyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7SUFDL0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUUzQixPQUFPLENBQUMsT0FBTyxHQUFHO1FBQ2hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRO1lBQ2pGLElBQUksR0FBRyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFHSixDQUFDLENBQUMsRUFBRSxDQUFDO0FBR0wsb0NBQW9DO0FBQ3BDLDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEMsSUFBTSxJQUFJLEdBQTJCLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLElBQU0sRUFBRSxHQUF3QixHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxRCxJQUFNLFNBQVMsR0FBb0MsR0FBRyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFD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