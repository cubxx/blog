<script setup>
defineProps({
  bvid: {
    type: String,
    required: true
  },
  page: {
    type: Number,
    default: 1
  }
});
</script>
<template>
  <iframe style="border: none; width: 100%; aspect-ratio: 16/9;" allowfullscreen loading="lazy"
    :src="`//player.bilibili.com/player.html?bvid=${bvid}&page=${page}&autoplay=false`"></iframe>
</template>
