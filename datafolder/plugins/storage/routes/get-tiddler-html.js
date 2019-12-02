/*\
title: $:/core/modules/server/routes/get-tiddler-html.js
type: application/javascript
module-type: route

GET /:title

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.method = "GET";

	exports.path = /^\/([^\/]+)$/;

	exports.handler = function (request, response, state) {
		response.writeHead(500);
		response.write("This feature is not supported by this datafolder");
		response.end();
	};

}());
