/*\
title: $:/core/modules/server/routes/get-tiddler.js
type: application/javascript
module-type: route

GET /recipes/default/tiddlers/:title

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "GET";

	exports.path = /^\/recipes\/default\/tiddlers\/(.+)$/;

	exports.handler = function (request, response, state) {
		var title = decodeURIComponent(state.params[0]);
		var db = state.server.database;
		db.get(title).then(doc => {
			doc.fields.revision = doc.revision;
			doc.fields.type = doc.fields.type || "text/vnd.tiddlywiki";
			var text = JSON.stringify(doc.fields);
			response.writeHead(200, { "Content-Type": "application/json" });
			response.end(text, "utf8");
		}).catch(err => {
			if (err.name !== "not_found") console.log(err);
			response.writeHead(err.name === "not_found" ? 404 : 500);
			response.end();
		});

	};

}());
