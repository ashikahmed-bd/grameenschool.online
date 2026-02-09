<script setup>
import { onMounted, reactive } from "vue";
import { useSettingsStore } from "@/stores/settings";
import BaseButton from "@/components/BaseButton.vue";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();
const { errors } = storeToRefs(settingsStore);

const form = reactive({
  site_name: '',
  tagline: '',
  theme_color: '#444CE7',
  dark_mode: false,
  language: '',
  timezone: '',
  website_url: '',
  maintenance_mode: '',
});

const loadGeneral = async () => {
  const response = await settingsStore.getGeneral();
  form.site_name = response.general.site_name;
  form.tagline = response.general.tagline;
  form.theme_color = response.general.theme_color;
  form.dark_mode = response.general.dark_mode;
  form.language = response.general.language;
  form.timezone = response.general.timezone;
  form.website_url = response.general.website_url;
  form.maintenance_mode = response.general.maintenance_mode;
}

const submit = async () => {
  await settingsStore.appearance(form);
}


onMounted(() => {
  loadGeneral();
})

</script>

<template>
  <div class="space-y-2 mb-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold">Appearance Settings</h2>
      <p class="text-sm text-gray-500 mt-1">
        Customize how your public dashboard or landing page looks and feels.
      </p>
    </div>

    <div class="w-full">
      <form @submit.prevent="submit">
        <div class="flex items-start gap-8">
          <!-- Left Form -->
          <div class="flex-grow">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="form__group">
                <label class="form__label">Site Name</label>
                <input type="text" v-model="form.site_name" class="form__control" placeholder="Enter site name" />
                <small v-if="errors.site_name" class="text-danger">{{ errors.site_name[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Tagline</label>
                <input type="text" v-model="form.tagline" class="form__control" placeholder="Enter tagline" />
                <small v-if="errors.tagline" class="text-danger">{{ errors.tagline[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Theme Color</label>
                <div class="flex items-center gap-4">
                  <input type="color" v-model="form.theme_color" class="h-10 w-10 rounded border border-gray-300" />
                  <input type="text" v-model="form.theme_color" class="form__control w-28" placeholder="#444CE7" />
                </div>
                <small v-if="errors.theme_color" class="text-danger">{{ errors.theme_color[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Dark Mode</label>
                <div class="flex items-center gap-4">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="form.dark_mode" class="sr-only peer" />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300
                      rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                      after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span class="text-sm text-gray-600">
                    {{ form.dark_mode ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
                <small v-if="errors.dark_mode" class="text-danger">{{ errors.dark_mode[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Default Language</label>
                <select v-model="form.language" class="form__select w-full">
                  <option value="en">English</option>
                  <option value="bn">Bangla</option>
                </select>
                <small v-if="errors.language" class="text-danger">{{ errors.language[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Timezone</label>
                <select v-model="form.timezone" class="form__select w-full">
                  <option value="UTC">UTC</option>
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                  <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                  <option value="Europe/London">Europe/London (GMT+1)</option>
                  <option value="Europe/Berlin">Europe/Berlin (GMT+2)</option>
                  <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
                  <option value="America/New_York">America/New_York (GMT-4)</option>
                  <option value="America/Chicago">America/Chicago (GMT-5)</option>
                  <option value="America/Denver">America/Denver (GMT-6)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-7)</option>
                  <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                  <option value="Australia/Sydney">Australia/Sydney (GMT+10)</option>
                  <option value="Pacific/Auckland">Pacific/Auckland (GMT+12)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                </select>
                <small v-if="errors.timezone" class="text-danger">{{ errors.timezone[0] }}</small>
              </div>

              <div class="form__group">
                <label class="form__label">Website URL</label>
                <input type="url" v-model="form.website_url" class="form__control" placeholder="https://example.com" />
                <small v-if="errors.website_url" class="text-danger">{{ errors.website_url[0] }}</small>
              </div>

              <!-- Maintenance Mode -->
              <div class="form__group">
                <label class="form__label">Maintenance Mode</label>
                <select v-model="form.maintenance_mode" class="form__select w-full">
                  <option value="0">Disabled</option>
                  <option value="1">Enabled</option>
                </select>
                <small v-if="errors.maintenance_mode" class="text-danger">{{ errors.maintenance_mode[0] }}</small>
              </div>
            </div>
          </div>

          <!-- Logo & Favicon -->
          <div class="flex-none w-80 space-y-6">
            <div class="form__group">
              <label class="form__label">Logo</label>
              <input type="file" class="form__file" @change="e => form.logo = e.target.files[0]" accept="image/*" />
              <!-- Logo preview -->
              <div v-if="form.logo && typeof form.logo === 'object'" class="mt-2">
                <img :src="URL.createObjectURL(form.logo)" class="h-16 rounded border" />
              </div>
            </div>

            <div class="form__group">
              <label class="form__label">Favicon</label>
              <input type="file" class="form__file" @change="e => form.favicon = e.target.files[0]"
                accept="image/x-icon,image/png" />
              <!-- Favicon preview -->
              <div v-if="form.favicon && typeof form.favicon === 'object'" class="mt-2">
                <img :src="URL.createObjectURL(form.favicon)" class="h-10 w-10 border rounded" />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-8">
          <BaseButton :loading="settingsStore.loading">Save Change</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
