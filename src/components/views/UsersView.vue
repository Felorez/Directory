<template>
    <splitpanes class="default-theme">
      <pane min-size="30">
        <user-table class="w-2/3"></user-table>
      </pane>
      <pane min-size="10">
        <user-details class="w-1/3"></user-details>
      </pane>
    </splitpanes>
  </template>
  
  <script>
  import UserTable from "../../components/Users/UserTable.vue";
  import UserDetails from "../../components/Users/UserDetails.vue";
  import { Splitpanes, Pane } from 'splitpanes';
  import 'splitpanes/dist/splitpanes.css';
  
  export default {
    components: { UserDetails, UserTable, Splitpanes, Pane },
  };
  </script>
  