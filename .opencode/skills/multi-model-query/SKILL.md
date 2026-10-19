---
name: multi-model-query
description: Get second-opinion code reviews from multiple LLMs. Use for complex code review, debugging, or when you need diverse perspectives.
---

# Multi-Model Query

Get diverse, multi-perspective code reviews by leveraging different LLM capabilities.

## When to Use

- Complex code that needs thorough review
- Debugging tricky bugs that one model couldn't solve
- Architecture decisions that benefit from multiple viewpoints
- Security-sensitive code that needs extra scrutiny
- When you want to verify code quality across different reasoning styles

## How to Use

Ask the user: "Would you like me to get a second opinion on this code using a multi-model review?"

Then:
1. Use the `sequential_thinking` MCP server for structured reasoning
2. If configured, use the `opencode-mcp` provider test tools to check model availability
3. Present the combined reviews highlighting:
   - Areas of agreement (high confidence)
   - Divergent opinions (needs human judgment)
   - Unique findings from each model

## Guidelines

- Focus reviews on: correctness, security, performance, maintainability
- Flag any issue found by 2+ models as HIGH priority
- Flag model-specific findings as MEDIUM priority
- Always summarize with actionable recommendations
