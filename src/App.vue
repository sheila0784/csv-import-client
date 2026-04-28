<template>
  <!-- <div class="min-h-screen flex flex-col md:flex-row items-center justify-center gap-4 p-4">
    <div class="w-full md:flex-1">
      <ExpInvoicesUpload />
    </div>

    <div class="w-full md:flex-1">
      <CsvImporter />
    </div>
  </div> -->



   <div class=" flex flex-col items-center  gap-4 m-4">
    <div class="w-full md:flex-1">
      <ExpInvoicesUpload />
    </div>

    <div class="w-full md:flex-1">
      <CsvImporter />
    </div>
  </div>

</template>

<script setup>
import CsvImporter from "./components/CsvInvoices.vue";
import ExpInvoicesUpload from "./components/ExpInvoicesUpload.vue";
</script>
