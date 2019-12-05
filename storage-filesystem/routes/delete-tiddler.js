/*\
title: $:/core/modules/server/routes/delete-tiddler.js
type: application/javascript
module-type: route

DELETE /recipes/default/tiddlers/:title

\*/
/// <reference path="../startup-hook.ts" />
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "DELETE";

	exports.path = /^\/bags\/([^\/]+)\/tiddlers\/(.+)$/;

	exports.handler = handler;
	/**
	 * 
	 * @param {*} request 
	 * @param {*} response 
	 * @param {{ server: TiddlyWikiServer }} state 
	 */
	function handler(request, response, state) {
		var bag = decodeURIComponent(state.params[0]);
		var title = decodeURIComponent(state.params[1]);

		state.server.deleteTiddlerFile(bag, title).then(() => callback(null)).catch((err) => callback(err));

		function callback(err) {
			response.writeHead(err ? 500 : 204, { "Content-Type": "text/plain" });
			response.end();
		}
	};

}());

