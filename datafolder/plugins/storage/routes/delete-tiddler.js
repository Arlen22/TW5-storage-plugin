/*\
title: $:/core/modules/server/routes/delete-tiddler.js
type: application/javascript
module-type: route

DELETE /recipes/default/tiddlers/:title

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "DELETE";

	exports.path = /^\/bags\/default\/tiddlers\/(.+)$/;

	exports.handler = function (request, response, state) {
		var title = decodeURIComponent(state.params[0]);
		/** @type {PouchDB.Database} */
		var db = state.server.database;
		db.get(title).then(doc => {
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
