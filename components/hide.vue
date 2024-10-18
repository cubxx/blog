<script setup>
defineProps({
  text: String
})
</script>
<template>
  <span :class="$style.hide">
    <slot>{{ text }}</slot>
  </span>
</template>
<style module>
.hide {
  cursor: pointer;
  color: black;
  background: black;
}

.hide:active {
  cursor: none;
  color: inherit;
  background: inherit;
}

.hide::selection {
  content: '';
}
</style>
