//setting up the mcp server
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { _MCP_SERVER, _MCP_SERVER_VERSION } from "./constants";

// Create an MCP server
const server = new McpServer({
  name: _MCP_SERVER,
  version: _MCP_SERVER_VERSION,
});

