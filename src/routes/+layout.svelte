<script lang="ts">
  import '../app.postcss';
  import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <h1 slot="title" class="text-xl font-semibold">gomokuu</h1>
    </AppBar>
  </svelte:fragment>

  <slot />
</AppShell>
