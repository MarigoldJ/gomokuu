<script lang="ts">
  const features = [
    {
      title: 'Skeleton UI',
      description:
        'Preconfigured Skeleton UI components and themes for rapid UI prototyping in SvelteKit.'
    },
    {
      title: 'Tailwind CSS',
      description: 'Utility-first styling powered by Tailwind CSS and PostCSS integration.'
    },
    {
      title: 'TypeScript Tooling',
      description:
        'Type-safe development environment with ESLint, Prettier, and Svelte Check scripts.'
    }
  ];
</script>

<section class="space-y-10 p-6">
  <div class="space-y-4 text-center">
    <h2 class="text-3xl font-bold">Welcome to gomokuu</h2>
    <p class="text-on-surface-variant">
      This project was bootstrapped manually with the SvelteKit TypeScript template, enhanced with
      Skeleton UI and Tailwind CSS utilities.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-3">
    {#each features as feature}
      <article class="rounded-xl border border-outline-variant bg-surface-50 p-6 shadow-sm">
        <h3 class="text-xl font-semibold">{feature.title}</h3>
        <p class="mt-2 text-on-surface-variant">{feature.description}</p>
      </article>
    {/each}
  </div>
</section>
