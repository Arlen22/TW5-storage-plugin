/*\
title: $:/core/modules/server/routes/put-tiddler.js
type: application/javascript
module-type: route

PUT /recipes/default/tiddlers/:title

\*/
/// <reference path="../startup-hook.ts" />
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "PUT";

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
		var title = decodeURIComponent(state.params[1]),
			fields = JSON.parse(state.data);

		// if (typeof fields.revision !== "undefined") delete fields.revision;

		fields.title = title;

		fields = state.server.convertTiddlerFromTiddlyWebFormat(fields);

		state.server.saveTiddlerFile(recipe, fields).then(function ({bag, revision}) {
			response.writeHead(204, "OK", {
				Etag: "\"" + bag + "/" + encodeURIComponent(title) + "/" + revision + ":\"",
				"Content-Type": "text/plain"
			});
			response.end();
		}).catch(err => {
			console.log(err);
			response.writeHead(500);
			response.end();
		});
	};

}());
