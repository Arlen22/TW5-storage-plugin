/*\
title: $:/arlen22/modules/server/routes/get-favicon.js
type: application/javascript
module-type: none

GET /favicon.ico

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	var fs = require("fs");


	exports.method = "GET";

	exports.path = /^\/favicon.ico$/;

	exports.handler = function (request, response, state) {
		var buffer = fs.readFileSync(path.resolve($tw.boot.wikiPath, "favicon.ico"));
		response.writeHead(200, { "Content-Type": "image/x-icon" });
		response.end(buffer);
	};

}());
