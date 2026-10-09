<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        processing: boolean;
        disabled?: boolean;
        type?: 'submit' | 'button';
        tabindex?: number;
        testId?: string;
    }>(),
    { disabled: false, type: 'submit', tabindex: undefined, testId: undefined },
);
</script>

<template>
    <button
        :type="type"
        :tabindex="tabindex"
        :disabled="processing || disabled"
        :data-test="testId"
    >
        <span v-if="processing" class="mr-2">Working…</span>
        {{ label }}
    </button>
</template>
