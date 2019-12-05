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

	exports.path = /^\/recipes\/([^\/]+)\/tiddlers\/(.+)$/;

	exports.handler = function (request, response, state) {
		/** @type {PouchDB.Database} */
		var db = state.server.database;
		var recipe = decodeURIComponent(state.params[0]);
		var title = decodeURIComponent(state.params[1]),
			tiddlerFields = JSON.parse(state.data);
		var id = db.getIDFromBagTitle("default", title);
		if (typeof tiddlerFields.revision !== "undefined") delete tiddlerFields.revision;

		tiddlerFields.title = title;

		db.allDocs({
			keys: db.getIDsFromRecipeTitle(recipe, title)
		}).then(docs => {
			console.log(docs);
		});

		db.get(id).catch(err => {
			//if the tiddler doesn't exist we return a template object
			//else we just throw the error on down the chain
			if (err && err.name === "not_found") {
				return { _id: id, revision: 0 };
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
