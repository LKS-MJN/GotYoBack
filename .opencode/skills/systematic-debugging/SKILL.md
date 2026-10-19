---
name: systematic-debugging
description: Four-phase debugging methodology with root cause analysis. Use when investigating bugs, test failures, broken builds, runtime issues, or unclear behavior. Emphasizes NO FIXES WITHOUT ROOT CAUSE FIRST.
triggers:
  - bug
  - test failure
  - broken build
  - runtime error
  - crash
  - regression
  - unexpected behavior
---

# Systematic Debugging

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

Never apply symptom-focused patches that mask underlying problems. Understand WHY something fails before attempting to fix it.

## The Four-Phase Framework

### Phase 1: Root Cause Investigation

1. **Read error messages thoroughly** — every word matters
2. **Reproduce the issue consistently** — if you can't reproduce it, you can't verify a fix
3. **Examine recent changes** — what changed before this started failing?
4. **Gather diagnostic evidence** — logs, stack traces, state dumps
5. **Trace data flow** — follow the call chain to find where bad values originate

**Root Cause Tracing Technique:**
1. Observe the symptom — where does the error manifest?
2. Find immediate cause — which code directly produces the error?
3. Ask "What called this?" — map the call chain upward
4. Keep tracing up — follow invalid data backward through the stack
5. Find original trigger — where did the problem actually start?

### Phase 2: Pattern Analysis

1. **Locate working examples** — find similar code that works correctly
2. **Compare implementations completely** — don't just skim
3. **Identify differences** — what's different between working and broken?
4. **Understand dependencies** — what does this code depend on?

### Phase 3: Hypothesis and Testing

1. **Formulate ONE clear hypothesis** — "The error occurs because X"
2. **Design minimal test** — change ONE variable at a time
3. **Predict the outcome** — what should happen if hypothesis is correct?
4. **Run the test** — execute and observe
5. **Verify results** — did it behave as predicted?
6. **Iterate or proceed** — refine hypothesis if wrong, implement if right

### Phase 4: Implementation

1. **Create failing test case** — captures the bug behavior
2. **Implement single fix** — address root cause, not symptoms
3. **Verify test passes** — confirms fix works
4. **Run full test suite** — ensure no regressions
5. **If fix fails, STOP** — re-evaluate hypothesis

**Critical rule:** If THREE or more fixes fail consecutively, STOP. This signals architectural problems requiring discussion, not more patches.

## Red Flags — Process Violations

Stop immediately if you catch yourself thinking:
- "Quick fix for now, investigate later"
- "One more fix attempt" (after multiple failures)
- "This should work" (without understanding why)
- "Let me just try..." (without hypothesis)
- "It works on my machine" (without investigating difference)

## Common Debugging Scenarios

### Test Failures
1. Read the FULL error message and stack trace
2. Identify which assertion failed and why
3. Check test setup — is the test environment correct?
4. Check test data — are mocks/fixtures correct?
5. Trace to the source of unexpected value

### Runtime Errors
1. Capture the full stack trace
2. Identify the line that throws
3. Check what values are undefined/null
4. Trace backward to find where bad value originated
5. Add validation at the source

### "It worked before"
1. Use git bisect to find the breaking commit
2. Compare the change with previous working version
3. Identify what assumption changed
4. Fix at the source of the assumption violation

### Intermittent Failures
1. Look for race conditions
2. Check for shared mutable state
3. Examine async operation ordering
4. Look for timing dependencies
5. Add deterministic waits or proper synchronization

## Debugging Checklist

Before claiming a bug is fixed:
- [ ] Root cause identified and documented
- [ ] Hypothesis formed and tested
- [ ] Fix addresses root cause, not symptoms
- [ ] Failing test created that reproduces bug
- [ ] Test now passes with fix
- [ ] Full test suite passes
- [ ] No "quick fix" rationalization used
- [ ] Fix is minimal and focused
