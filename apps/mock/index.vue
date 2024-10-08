<script setup lang="ts">

</script>

<template>
  <div>
    <div :label="'Curt. Exclusive\nPrice'" />
    <div label="Curt. Exclusive\nPrice" />
    <div :foo="'bar' /* comment */" />
  </div>
</template>

<style lang="scss" scoped>
a {
  grid-template-areas:
    'a a'
    'b b b';
  colr: hsl(20deg 10% 30% / 5%);
}

a {
  --Foo: 1rem;
}
</style>
