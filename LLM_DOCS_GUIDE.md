# bkui-vue LLM Documentation Guide

## What is `llms-full.txt`?

`llms-full.txt` is a single, self-contained reference document that describes the entire bkui-vue component library — every component, prop, event, slot, and usage pattern — in a format optimized for AI/LLM consumption.

It serves as a **knowledge base** that any AI coding assistant can read to understand bkui-vue **instantly**, without needing to crawl source files or guess at APIs.

## Why This Matters for Development

### The Problem

When using AI assistants (Cursor, Copilot, ChatGPT, Claude, etc.) to write code with bkui-vue, the AI often:

- **Hallucinates props** that don't exist (e.g. inventing `<bk-button type="primary">` instead of `theme="primary"`)
- **Uses wrong tag names** (e.g. `<b-button>` or `<el-button>` from other libraries)
- **Misses component features** like sub-components (`BkOption`, `BkTabPanel`) or imperative APIs (`InfoBox()`, `Message()`)
- **Wastes time re-analyzing** source code on every question

### The Solution

By feeding `llms-full.txt` to the AI **once**, it gains accurate knowledge of:

| What the AI Learns | Example |
|---|---|
| Correct tag names | `<bk-button>`, `<bk-select>`, `<bk-table>` |
| Every prop with type and default | `theme: String`, `filterable: Boolean.def(false)` |
| All events | `@change`, `@toggle`, `@scroll-end` |
| Available slots | `#default`, `#header`, `#footer`, `#content` |
| Import paths | `import { Button } from 'bkui-vue'` |
| Idiomatic usage patterns | v-model binding, slot-based vs config-based APIs |
| Imperative components | `Message()`, `Notify()`, `InfoBox()` called via function |
| Sub-components | `Button.ButtonGroup`, `Select.Option`, `Tab.TabPanel` |

This means **fewer errors, faster iteration, and less back-and-forth correcting the AI**.

## How to Use

### With Cursor IDE

**Option A — Add as a Doc source (recommended)**

1. Open Cursor Settings
2. Go to **Features > Docs**, click **"+ Add new Doc"**
3. Paste the URL where `llms-full.txt` is hosted (e.g. `https://your-domain.com/llms-full.txt`)
4. In any chat, type `@Docs` and select "bkui-vue" to give the AI full library knowledge

**Option B — Reference directly in chat**

Type in Cursor chat:

```
@llms-full.txt Help me build a form with name, email, and a submit button using bkui-vue
```

**Option C — Add as a Cursor Rule**

Create `.cursor/rules/bkui-vue.md`:

```markdown
When writing Vue components, use the bkui-vue component library.
Refer to @llms-full.txt for the complete API reference.
Always use `<bk-*>` tag names and correct prop names from the documentation.
```

### With GitHub Copilot

Add to your workspace instructions or `.github/copilot-instructions.md`:

```
This project uses the bkui-vue component library (Vue 3).
Component reference is available in llms-full.txt at the project root.
Always use <bk-*> tag prefix. Import from 'bkui-vue'.
```

### With ChatGPT / Claude / Other Chat UIs

1. Upload `llms-full.txt` as an attachment, or
2. Paste the relevant section into the conversation, then ask your question

Example prompt:

```
I've attached our component library documentation (llms-full.txt).
Using bkui-vue, create a data management page with:
- A search input at the top
- A table with sortable columns
- Pagination at the bottom
- A dialog for editing rows
```

### With Custom AI Pipelines / RAG

Host the file and index it in your retrieval system:

```python
# Example: loading into a RAG pipeline
import requests

docs = requests.get("https://your-domain.com/llms-full.txt").text
# Chunk and index into your vector store
```

### With Any Other AI Tool

`llms-full.txt` is plain text with standard Markdown formatting. Any tool that accepts text context can use it — Windsurf, Continue, Cline, Aider, LangChain agents, etc.

## Keeping It Up to Date

Regenerate `llms-full.txt` after adding or modifying components:

```bash
yarn generate:llm-docs
```

The generator script automatically:
- Scans all 59 component packages for props, events, and slots
- Merges with hand-written descriptions and examples from `scripts/llm-docs-meta.json`
- Outputs the updated `llms-full.txt`

### When to Regenerate

- After adding a new component
- After changing a component's props, events, or slots
- After updating `scripts/llm-docs-meta.json` with new descriptions or examples
- Before a major release

### Updating Descriptions and Examples

Edit `scripts/llm-docs-meta.json` to improve component descriptions and usage examples. This file is the human-curated layer — the generator extracts API details from source code automatically, but descriptions and examples need human judgment.

## What's Inside `llms-full.txt`

The document is structured for maximum AI comprehension:

```
1. Overview & Installation
   - Package name, Vue version, peer dependencies
   - Full import vs on-demand import examples

2. Component Catalog (grouped by category)
   - Base, Layout, Navigation, Form, Data, Feedback
   - Quick-reference table of all components

3. Per-Component API Reference (×59 components)
   - Tag name, import path, package name
   - Props table (name, type, default, description)
   - Events table
   - Slots table
   - Usage code example

4. Hooks & Directives
   - useGlobalConfig, useLocale, usePrefix
   - v-bk-clickoutside, v-bk-tooltips, v-bk-loading
```

## Real-World Impact

| Scenario | Without llms-full.txt | With llms-full.txt |
|---|---|---|
| "Create a form" | AI may use wrong prop names, miss `<bk-form-item>` wrapper | AI uses correct `model`, `rules`, `property` props |
| "Add a dropdown" | AI confuses Select vs Dropdown vs Popover | AI knows Select is for form input, Dropdown is for action menus |
| "Show a confirmation" | AI tries `<bk-dialog>` with wrong setup | AI uses `InfoBox({ title, onConfirm })` imperative API |
| "Build a data table" | AI invents column config format | AI uses correct `columns` prop structure or `<bk-table-column>` slots |
| "Add loading state" | AI wraps wrong component | AI uses `<bk-loading :loading="bool">` or `v-bk-loading` directive |

## Hosting Recommendations

For team-wide access, host `llms-full.txt` at a stable URL:

- **Static file server**: Serve alongside your docs site
- **CDN**: Upload to your CDN for fast global access
- **npm package**: Include in the published `bkui-vue` package
- **Git raw URL**: Use the raw GitHub/GitLab URL (works but may have rate limits)

Example nginx config:

```nginx
location /llms-full.txt {
    alias /path/to/bkui-vue3/llms-full.txt;
    add_header Content-Type text/plain;
    add_header Access-Control-Allow-Origin *;
}
```
