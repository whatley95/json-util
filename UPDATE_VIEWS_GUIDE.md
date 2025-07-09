# Guide for Updating View Components

Now that we've added subtitles to the header, we need to update all view components to remove the duplicate h1 titles. Follow this guide to update each component.

## General Changes

For each view component:

1. Remove the `<h1>` element entirely
2. Change the existing description `<p>` to include a `class="tool-description"`

## Example Updates

### Before:

```vue
<template>
  <div class="container">
    <h1>JSON Diff Tool</h1>
    <p>Compare two JSON objects and see the differences</p>
    
    <!-- Rest of component -->
  </div>
</template>
```

### After:

```vue
<template>
  <div class="container">
    <p class="tool-description">Compare two JSON objects and see the differences</p>
    
    <!-- Rest of component -->
  </div>
</template>
```

## List of Files to Update

- src/views/HomeView.vue
- src/views/JsonDiffView.vue
- src/views/JsonEscapeView.vue
- src/views/JsonBeautifyView.vue
- src/views/JsonConverterView.vue
- src/views/JsonValidateView.vue
- src/views/JsonPathView.vue

## Example of an Updated Component

See the file `src/views/JsonDiffView.vue.updated` for a complete example of an updated component.

## Additional Notes

- The description paragraph now has styling applied through the `tool-description` class
- The removal of the h1 helps eliminate redundant content and makes the UI cleaner
- The subtitle in the header provides sufficient context about which tool is being used
