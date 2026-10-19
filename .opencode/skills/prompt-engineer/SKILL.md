---
name: prompt-engineer
description: Professional prompt engineering patterns for building robust, secure, and production-ready LLM applications. Improves prompt structure and reusable instructions. Use when refining prompts, setup instructions, orchestration prompts, or project instructions.
triggers:
  - improve prompt
  - rewrite prompt
  - structured instructions
  - agent prompt
  - system prompt
  - prompt engineering
---

# Prompt Engineer

## Overview

Professional prompt engineering patterns for designing, debugging, and optimizing prompts across any major model provider. Solves model drift, parsing failures, and hallucination by implementing industry-standard engineering patterns.

## Core Techniques

### Architectural Design
- **Role anchoring** — assign a clear role/identity to the agent
- **Constraint blocks** — explicit boundaries and limitations
- **Persona tuning** — adjust tone, expertise level, and perspective

### Precision Control
- **Few-shot prompting** — provide examples of desired output
- **Chain-of-thought (CoT)** — step-by-step reasoning for logical consistency
- **Structured output** — enforce JSON/XML schemas in responses

### Agentic Workflows
- **ReAct pattern** — Reasoning + Acting loop for autonomous tasks
- **Plan-and-Execute** — decompose complex tasks into sub-steps
- **Reflection loops** — self-critique and revision cycles

### Reliability & Security
- **Output validation** — verify against schema before returning
- **Token budgeting** — manage context window efficiently
- **Injection defense** — guard against prompt injection and jailbreaking

### Context Management
- **RAG patterns** — integrate retrieval-augmented generation
- **Conversation summarization** — condense long histories
- **Context prioritization** — most relevant information first

## Process

1. **Understand the use case** — what is the prompt supposed to accomplish?
2. **Identify weaknesses** — where does it fail? (format, reasoning, security)
3. **Apply patterns** — select appropriate technique(s) for the problem
4. **Structure the prompt** — clear sections, role, constraints, output format
5. **Test and iterate** — refine based on actual model output
6. **Document** — save as reusable instructions with version notes

## When to Use

- Agent prompts produce inconsistent or malformed output
- Complex multi-step instructions need structure
- JSON/structured output parsing fails
- Prompt injection is a concern
- Token usage needs optimization
