#!/usr/bin/env node
import { server, list_sections_handler, get_documentation_handler } from './index.js';
import { StdioTransport } from '@tmcp/transport-stdio';

const command = process.argv[2];

if (command === 'list-sections') {
	console.log(await list_sections_handler());
} else if (command === 'get-documentation') {
	const section = process.argv.slice(3);
	if (section.length === 0) {
		console.error('Usage: scrolly-mcp get-documentation <section> [section...]');
		process.exit(1);
	}
	console.log(await get_documentation_handler({ section }));
} else {
	// Default: start STDIO MCP server
	const transport = new StdioTransport(server);
	transport.listen({ stdio: true });
}
