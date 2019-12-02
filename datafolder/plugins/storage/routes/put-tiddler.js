/*\
title: $:/core/modules/server/routes/put-tiddler.js
type: application/javascript
module-type: route

PUT /recipes/default/tiddlers/:title

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "PUT";

	exports.path = /^\/recipes\/default\/tiddlers\/(.+)$/;

	exports.handler = function (request, response, state) {
		/** @type {PouchDB.Database} */
		var db = state.server.database;
		var title = decodeURIComponent(state.params[0]),
			tiddlerFields = JSON.parse(state.data);

		if (typeof tiddlerFields.revision !== "undefined") delete tiddlerFields.revision;

		tiddlerFields.title = title;

		db.get(title).catch(err => {
			//if the tiddler doesn't exist we return a template object
			//else we just throw the error on down the chain
			if (err && err.name === "not_found") {
				return { _id: title, revision: 0 };
			} else {
				return Promise.reject(err);
			}
		}).then(doc => {
			var revision = doc.revision + 1;

			var newDoc = {
				fields: tiddlerFields,
				_id: doc._id, _rev: doc._rev,
				revision: revision
			};
			//return this so errors are handled by the catch
			return db.put(newDoc).then(() => {
				response.writeHead(204, "OK", {
					Etag: "\"default/" + encodeURIComponent(title) + "/" + revision + ":\"",
					"Content-Type": "text/plain"
				});
				response.end();
			});
		}).catch(function (err) {
			console.log(err);
			response.writeHead(500);
			response.end();
		});
	};

}());
