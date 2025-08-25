# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Cascader component package for the bkui-vue3 component library. The Cascader is a Vue 3 component that allows users to select options from a hierarchical data structure through a cascading panel interface.

## Common Development Commands

### Building
```bash
yarn build
```

### Testing
```bash
yarn test
```

### Linting
```bash
yarn lint
```

### Root Project Commands (from bkui-vue3 root)
```bash
# Development
yarn dev

# Building the entire library
yarn build

# Linting all packages
yarn lint

# Running tests
yarn test:unit
```

## Code Architecture

### Component Structure
- `cascader.tsx` - Main component that handles the UI, popover, input, and tag management
- `cascader-panel.tsx` - Panel component that displays the hierarchical options
- `store.ts` - Data store that manages the node hierarchy and selection state
- `node.ts` - Node class that represents individual items in the hierarchy
- `interface.tsx` - TypeScript interfaces for type safety

### Key Implementation Details

1. **Data Management**:
   - Uses a Store class to manage the hierarchical data structure
   - Nodes are represented by the Node class which handles parent-child relationships
   - Selection state is managed through the store with support for both single and multiple selection

2. **UI Components**:
   - Main cascader component handles the input field, tags (for multiple selection), and popover
   - Cascader panel displays the hierarchical options in columns
   - Supports both single and multiple selection modes

3. **Key Features**:
   - Multiple selection with tag display
   - Search/filter functionality
   - Remote data loading
   - Customizable node rendering
   - Keyboard navigation support
   - Check-any-level option for selecting parent nodes

4. **Event Handling**:
   - Node expansion through click or hover triggers
   - Selection updates propagate through the component hierarchy
   - Model updates are emitted to parent components

### Data Flow
1. Props are passed to the Store which creates Node instances
2. Nodes maintain their state (checked, expanded, etc.)
3. User interactions update the node states
4. Changes are propagated back through events to update the modelValue
5. Watchers ensure UI updates when modelValue changes

### Important Implementation Notes
- The cascader has special handling for multi-select mode to ensure proper panel behavior
- Remote data loading is supported through the `remoteMethod` prop
- The component distinguishes between initial loading and user interactions to handle panel expansion correctly
- CSS classes use a prefix system for styling consistency