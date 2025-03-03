<template>
    <splitpanes class="default-theme">
      <pane min-size="30">
        <product-table class="w-2/3"></product-table>
      </pane>
      <pane min-size="10">
        <product-details class="w-1/3"></product-details>
      </pane>
    </splitpanes>
  </template>
  
  <script>
  import ProductTable from "../../components/Products/ProductTable.vue";
  import ProductDetails from "../../components/Products/ProductDetails.vue";
  import { Splitpanes, Pane } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  
  export default {
    components: { ProductDetails, ProductTable, Splitpanes, Pane },
  };
  </script>
  