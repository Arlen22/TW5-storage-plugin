/*\
title: $:/arlen22/modules/server/routes/get-index.js
type: application/javascript
module-type: none

GET /

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	var zlib = require("zlib");
	var fs = require("fs");

	exports.method = "GET";

	exports.path = /^\/$/;

	exports.handler = function (request, response, state) {
		var acceptEncoding = request.headers["accept-encoding"];
		if (!acceptEncoding) {
			acceptEncoding = "";
		}
		//The index can be loaded from the file system or generated dynamically from the server data folder
		var text = state.wiki.renderTiddler(state.server.get("root-render-type"),state.server.get("root-tiddler"));
		// var text = fs.readFileSync(path.resolve($tw.boot.wikiPath, "root.html"));
		var responseHeaders = {
			"Content-Type": "text/html; charset=utf-8"
		};
		/*
		If the gzip=yes flag for `listen` is set, check if the user agent permits
		compression. If so, compress our response. Note that we use the synchronous
		functions from zlib to stay in the imperative style. The current `Server`
		doesn't depend on this, and we may just as well use the async versions.
		*/
		if (state.server.enableGzip) {
			if (/\bdeflate\b/.test(acceptEncoding)) {
				responseHeaders["Content-Encoding"] = "deflate";
				text = zlib.deflateSync(text);
			} else if (/\bgzip\b/.test(acceptEncoding)) {
				responseHeaders["Content-Encoding"] = "gzip";
				text = zlib.gzipSync(text);
			}
		}
		response.writeHead(200, responseHeaders);
		response.end(text);
	};

}());
