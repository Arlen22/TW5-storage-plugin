/*\
title: $:/core/modules/server/routes/delete-tiddler.js
type: application/javascript
module-type: route

DELETE /recipes/default/tiddlers/:title

\*/
/// <reference path="../../types.d.ts" />
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "DELETE";

	exports.path = /^\/bags\/([^\/]+)\/tiddlers\/(.+)$/;

	exports.handler = function (request, response, state) {
		var bag = decodeURIComponent(state.params[0]);
		var title = decodeURIComponent(state.params[1]);
		/** @type {PouchDB.Database} */
		var db = state.server.database;
		var id = db.getIDFromBagTitle(bag, title);
		db.get(id).then(doc => {
			doc._deleted = true;
			return db.put(doc).then(ok => 204);
		}).catch(err => {
			if (err.name === "not_found") {
				return 204;
			} else {
				console.log(err);
				return 500;
			}
		}).then(status => {
			response.writeHead(status, { "Content-Type": "text/plain" });
			response.end();
		})
	};

}());
