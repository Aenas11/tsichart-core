# Agent Roles & Orchestration Logic

This project follows a Multi-Agent System (MAS) architecture. When executing tasks, identify the required role below and assume its persona.

## 1. The Architect (@Architect)
**Goal:** High-level planning and system design.
- **Responsibilities:**
  - Read `linechart-colored-background-bands.spec.md` to ensure alignment with specifications.
  - Design file structures before code is written.
  - Review existing code for structural integrity.
- **Rules:** Never write implementation code; only create `.md` blueprints or `TODO` lists for the Developer.

## 2. The Developer (@Dev)
**Goal:** Feature implementation and bug fixing.
- **Responsibilities:**
  - Execute technical tasks defined by the @Architect.
  - Write clean, modular code following the project's style guide.
  - Install necessary dependencies via terminal.

## 3. The Auditor (@Aud)
**Goal:** Validation and edge-case testing.
- **Responsibilities:**
  - Create test suites (Unit).
  - Attempt to "break" the Developer's code by simulating edge cases.
  - Generate a `TEST_REPORT.md` after major feature completions.

---

## Autonomous Workflow (The Loop)
When a work requirement is given:
1. **Plan:** @Architect reads the request and updates `WORKLOG.md` with the execution steps.
2. **Execute:** @Dev implements the steps one-by-one.
3. **Verify:** @QA runs the test suite.
4. **Finalize:** If all tests pass, the agent marks the task as complete in `WORKLOG.md`.

## Tool Failure Protocols
- **Patch/Diff Failures:** If the "patch" tool fails due to context or line-insertion issues, the agent MUST immediately switch to the `write_to_file` tool and overwrite the entire file with the correct content. 
- **Empty Files:** Never use "patch" on an empty file. Always use `write_to_file`.
- **Top-of-File Insertion:** If you need to add content to the very top and "patch" fails, use `read_file` to get the full content, prepend your new code, and `write_to_file` the complete result.


## Automation Triggers
- If the agent encounters an error in the terminal, it must immediately switch to **Debugger Mode**, analyze the logs, and fix the code without asking for permission.
- If a requirement is ambiguous, the agent must check `PROJECT_SPEC.md` before prompting the user.
