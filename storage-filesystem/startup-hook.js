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
var path = $tw.node && require("path");
var fs = $tw.node && require('fs');
var promisify = $tw.node && require("util").promisify;
var TiddlyWikiServer = /** @class */ (function () {
    function TiddlyWikiServer() {
        this.files = {};
        this.recipes = { "default": { bags: ["default"] } };
        this.clientTiddlersPath = path.join($tw.boot.wikiPath, "tiddlyweb");
        this.filesCachePath = path.join($tw.boot.wikiPath, "tiddlyweb-files.json");
        var stiddlers = this.initSkinnyTiddlers();
        this.saveSkinnyTiddlers("default", stiddlers["default"]).then(function () { console.log("ready"); });
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
            var fileInfo;
            var _this = this;
            return __generator(this, function (_a) {
                fileInfo = this.files[bag][title];
                console.log("deleting %s", bag, title);
                // Only delete the tiddler if we have writable information for the file
                // and the bag matches the bag specifed in the url
                if (fileInfo && fileInfo.bag === bag) {
                    // Delete the file
                    return [2 /*return*/, Promise.all([
                            promisify(fs.unlink)(fileInfo.filepath),
                            fileInfo.hasMetaFile ? promisify(fs.unlink)(fileInfo.filepath + ".meta") : Promise.resolve()
                        ]).then(function () {
                            return promisify($tw.utils.deleteEmptyDirs)(path.dirname(fileInfo.filepath));
                        }).then(function () {
                            var recipesToUpdate = Object.keys(_this.recipes).filter(function (k) {
                                return _this.recipes[k].bags.indexOf(bag) !== -1;
                            });
                            return Promise.all(recipesToUpdate.map(function (recipe) { return __awaiter(_this, void 0, void 0, function () {
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
                            }); }));
                        })];
                }
                return [2 /*return*/];
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
    TiddlyWikiServer.prototype.initSkinnyTiddlers = function () {
        var _this = this;
        var tiddlers = {};
        var bags = [];
        //get a list of all loaded bags (so we don't duplicate work)
        Object.keys(this.recipes).map(function (e) { return _this.recipes[e].bags.forEach(function (f) {
            if (bags.indexOf(f) === -1)
                bags.push(f);
        }); });
        //load the tiddlers in each bag
        bags.forEach(function (bag) {
            _this.files[bag] = {};
            tiddlers[bag] = {};
            var bagpath = path.join(_this.clientTiddlersPath, bag);
            //iterate through each file
            $tw.utils.each($tw.loadTiddlersFromPath(bagpath), function (tiddlerFile) {
                //if this is a writable file (tiddlyweb does not support unwritable files)
                if (tiddlerFile.filepath) {
                    //iterate through the tiddlers in the file
                    $tw.utils.each(tiddlerFile.tiddlers, function (tiddler) {
                        //this is a skinny tiddler
                        tiddler.text = undefined;
                        //set the bag so tiddlyweb knows to update it
                        tiddler.bag = bag;
                        //get the file info
                        _this.files[bag][tiddler.title] = {
                            filepath: tiddlerFile.filepath,
                            type: tiddlerFile.type,
                            hasMetaFile: tiddlerFile.hasMetaFile,
                            bag: bag
                        };
                        //add it to the bag
                        if (tiddlers[bag][tiddler.title])
                            console.log("More than one tiddler %s was found in bag %s", bag, tiddler.title);
                        tiddlers[bag][tiddler.title] = tiddler;
                    });
                }
            });
        });
        //generate the final Hashmap of recipes
        var recipeTiddlers = {};
        var recipeTiddlersRes = {};
        Object.keys(this.recipes).map(function (recipe) {
            recipeTiddlers[recipe] = {};
            //iterate through the bags 
            _this.recipes[recipe].bags.forEach(function (bag) {
                //iterate through the tiddlers in the bag
                Object.keys(tiddlers[bag]).forEach(function (title) {
                    //only add tiddlers that don't already exist
                    if (!recipeTiddlers[recipe][title])
                        recipeTiddlers[recipe][title] = tiddlers[bag][title];
                });
            });
            // convert the recipes to a hashmap of arrays
            recipeTiddlersRes[recipe] = Object.keys(recipeTiddlers[recipe]).map(function (title) { return recipeTiddlers[recipe][title]; });
        });
        return recipeTiddlersRes;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC1ob29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhcnR1cC1ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxDQUFDO0lBR0MscUNBQXFDO0lBQ3JDLHNCQUFzQjtJQUN0QixZQUFZLENBQUM7SUFFYixxQ0FBcUM7SUFDckMsT0FBTyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7SUFDL0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUUzQixPQUFPLENBQUMsT0FBTyxHQUFHO1FBQ2hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUMsVUFBZSxFQUFFLFVBQWUsRUFBRSxRQUFhO1lBQ2hHLElBQUksR0FBRyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFHSixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsSUFBTSxJQUFJLEdBQTBCLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hFLElBQU0sRUFBRSxHQUF3QixHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxRCxJQUFNLFNBQVMsR0FBb0MsR0FBRyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDO0FBZ0J6RjtJQUdFO1FBQ0UsSUFBSSxD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