"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
// declare namespace $tw {
//   declare interface Tiddler {
//   }
// }
var util_1 = require("util");
var fs = require("fs");
var path = require("path");
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
                    case 0: return [4 /*yield*/, util_1.promisify(fs.readFile)(this.skinnyCachePath(recipe), "utf8")];
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
                    case 0: return [4 /*yield*/, util_1.promisify(fs.writeFile)(this.skinnyCachePath(recipe), JSON.stringify(json, null, 2), "utf8")];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhcnR1cC1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7OztHQU9HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILENBQUM7SUFHQyxxQ0FBcUM7SUFDckMsc0JBQXNCO0lBQ3RCLFlBQVksQ0FBQztJQUViLHFDQUFxQztJQUNyQyxPQUFPLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQztJQUMvQixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0IsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBRTNCLE9BQU8sQ0FBQyxPQUFPLEdBQUc7UUFDaEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsOEJBQThCLEVBQUUsVUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVE7WUFDakYsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUdKLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFlTCwwQkFBMEI7QUFDMUIsZ0NBQWdDO0FBRWhDLE1BQU07QUFDTixJQUFJO0FBRUosNkJBQWlDO0FBQ2pDLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFhN0I7SUFFRTtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFD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