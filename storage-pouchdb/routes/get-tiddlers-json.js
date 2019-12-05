/*\
title: $:/core/modules/server/routes/get-tiddlers-json.js
type: application/javascript
module-type: route

GET /recipes/default/tiddlers/tiddlers.json

\*/
/// <reference path="../../types.d.ts" />
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "GET";

	exports.path = /^\/recipes\/([^\/]+)\/tiddlers.json$/;

	exports.handler = function (request, response, state) {
		var recipe = decodeURIComponent(state.params[0]);
		/** @type {PouchDB.Database} */
		var db = state.server.database;
		db.allDocs({ include_docs: true }).then(docs => {
			response.writeHead(200, { "Content-Type": "application/json" });
			var tiddlers = docs.rows.map(function (docInfo) {
				db.getIDsFromRecipeTitle(recipe, docInfo.doc.fields.title);
				docInfo.doc.fields.revision = docInfo.doc.revision;
				docInfo.doc.fields.type = docInfo.doc.fields.type || "text/vnd.tiddlywiki";
				delete docInfo.doc.fields.text;
				return docInfo.doc.fields;
			});
			var text = JSON.stringify(tiddlers);
			response.end(text, "utf8");
		}).catch(err => {
			console.log(err);
			response.writeHead(500);
			response.end();
		})
	};

}());
