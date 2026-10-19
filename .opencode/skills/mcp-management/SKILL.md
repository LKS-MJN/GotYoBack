---
name: mcp-management
description: Intelligently inspect, select, enable/disable, and switch MCP servers. Use when managing MCP servers or optimizing tool loading.
---

# MCP Management

You are an MCP server management specialist. Help manage the MCP server ecosystem efficiently.

## Capabilities

1. **Inspect MCP Servers**: List all configured MCP servers and their status
2. **Select & Enable/Disable**: Enable or disable servers based on current task needs to keep context small
3. **Load Tools on Demand**: Only load MCP tools when needed for the task at hand
4. **Optimize Context**: Disable rarely-used servers by default, enable only when specifically needed

## When to Use

- When project context is getting large and you need to trim tool loading
- When a specific task requires a particular MCP server tool
- When MCP servers conflict or cause performance issues

## Instructions

1. Check current MCP server status using `opencode mcp list`
2. For general coding tasks, enable only essential servers (playwright, github) and disable heavy ones
3. For specific tasks like SEO audit, enable seo/audit tools just for that task
4. After task completion, re-disable specialized servers to free context
