<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { fieldDescribedBy, fieldErrorId, useForm } from '@/composables/useForm';
import { settingsService } from '@/services/settings/SettingsService';
import FormFieldError from '@/components/shared/FormFieldError.vue';

const emit = defineEmits<{ deleted: [] }>();
const deletePassword = useTemplateRef<HTMLInputElement>('deletePassword');
const dialogOpen = ref(false);
const form = useForm({ password: '' });

async function openDialog(): Promise<void> {
    dialogOpen.value = true;
    await nextTick();
    deletePassword.value?.focus();
}

function closeDialog(): void {
    dialogOpen.value = false;
    form.reset();
    form.clearErrors();
}

async function deleteAccount(): Promise<void> {
    try {
        await form.submit(async (data) => {
            await settingsService.deleteAccount({ password: data.password });
            emit('deleted');
        });
    } catch {
        deletePassword.value?.focus();
    }
}
</script>

<template>
    <section class="space-y-4 border-t border-neutral-200 pt-6">
        <header>
            <h2 class="text-lg font-semibold">Delete account</h2>
            <p class="text-sm text-neutral-600">
                Delete your account and its data permanently.
            </p>
        </header>
        <button type="button" @click="openDialog">Delete account</button>
        <div
            v-if="dialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            @click.self="closeDialog"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                class="w-full max-w-md space-y-4 border border-neutral-300 bg-white p-6"
                @keydown.esc="closeDialog"
            >
                <h2 id="delete-title" class="text-lg font-semibold">
                    Delete account?
                </h2>
                <p>
                    This permanently deletes your account. Enter your password
                    to confirm.
                </p>
                <form class="space-y-4" @submit.prevent="deleteAccount">
                    <label for="delete-password">Password</label>
                    <input
                        id="delete-password"
                        ref="deletePassword"
                        v-model="form.data.password"
                        type="password"
                        autocomplete="current-password"
                        :disabled="form.processing"
                        :aria-invalid="Boolean(form.errors.password)"
                        :aria-describedby="
                            fieldDescribedBy('password', form.errors)
                        "
                    />
                    <FormFieldError
                        v-if="form.errors.password || form.formError"
                        :id="fieldErrorId('password')"
                        :message="form.errors.password ?? form.formError ?? ''"
                    />
                    <div class="flex justify-end gap-2">
                        <button type="button" @click="closeDialog">
                            Cancel
                        </button>
                        <button type="submit" :disabled="form.processing">
                            Delete account
                        </button>
                    </div>
                </form>
            </section>
        </div>
    </section>
</template>
