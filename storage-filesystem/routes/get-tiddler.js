/*\
title: $:/core/modules/server/routes/get-tiddler.js
type: application/javascript
module-type: route

GET /recipes/default/tiddlers/:title

\*/
/// <reference path="../startup-hook.ts" />
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "GET";

	exports.path = /^\/recipes\/([^\/]+)\/tiddlers\/(.+)$/;

	exports.handler = handler;
	/**
	 * 
	 * @param {*} request 
	 * @param {*} response 
	 * @param {{ server: TiddlyWikiServer }} state 
	 */
	function handler(request, response, state) {
		var recipe = decodeURIComponent(state.params[0]);
		var title = decodeURIComponent(state.params[1]);

		state.server.loadTiddlerFile(recipe, title).catch(err => { err }).then(({ err, tiddler }) => {
			if (err) console.log(err);
			response.writeHead(err ? 404 : 200, { "Content-Type": "application/json" });
			if (!err) response.write(JSON.stringify(tiddler), "utf8");
			response.end();
		});

		//I'm not sure yet what the TiddlyWeb spec is on this
		// db.allDocs({
		// 	keys: db.getIDsFromRecipeTitle(recipe, title)
		// }).then(docs => {
		// 	console.log(docs);
		// });
		// db.get(db.getIDFromBagTitle("default", title)).then(doc => {
		// 	doc.fields.revision = doc.revision;
		// 	doc.fields.type = doc.fields.type || "text/vnd.tiddlywiki";
		// 	var text = JSON.stringify(doc.fields);
		// 	response.writeHead(200, { "Content-Type": "application/json" });
		// 	response.end(text, "utf8");
		// }).catch(err => {
		// 	if (err.name !== "not_found") console.log(err);
		// 	response.writeHead(err.name === "not_found" ? 404 : 500);
		// 	response.end();
		// });

	};

}());
