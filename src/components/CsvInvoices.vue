<template>
  <div>
    <Card class="w-full max-w-2xl min-w-[320px] min-h-[400px] mx-auto rounded-lg shadow-lg">
      <template #header>
        <div class="text-3xl text-shadow-2xs font-bold text-center text-blue-500 py-4">
          Solex CSV to POS Importer
        </div>
        <div class="text-center text-gray-500 mb-4 text-xs">
          Upload your CSV file to import invoices into your POS system.
        </div>
      </template>
      <template #content>
        <div class="w-full">
          <!-- File Upload in Advanced Mode -->
          <FileUpload
            ref="fileUploadRef"
            mode="advanced"
            name="file"
            accept=".csv"
            :customUpload="true"
            :multiple="true"
            :disabled="uploading"
            :chooseButtonDisabled="disableSelect"
            @select="uploadFile"
            @remove="onClear"
            @clear="onClear"
            chooseLabel="Select CSV (Invoices)"
            uploadLabel=" "
            cancelLabel=" "
            class="w-full"
            :showUploadButton="true"
            :showCancelButton="true"
          >
            <!-- Custom Empty Text -->
            <template #empty>
              <div
                class="text-gray-500 italic text-center py-4 border border-dashed border-gray-300 rounded"
              >
                No CSV selected yet
              </div>
            </template>

            <!-- Choose Icon -->
            <template #chooseicon>
              <!-- <i class="pi pi-folder text-blue-600" style="font-size: 1.25rem; cursor: pointer"></i> -->
              <i class="pi pi-folder text-blue-600 text-lg sm:text-xl cursor-pointer"></i>
            </template>

            <!-- Upload Icon -->
            <template #uploadicon>
              <i
                class="pi pi-download text-green-600"
                style="font-size: 1.25rem; cursor: pointer"
                @click="sendFile"
              ></i>
            </template>

            <!-- Cancel Icon -->
            <template #cancelicon>
              <i
                class="pi pi-times text-red-600"
                style="font-size: 1.25rem; cursor: pointer"
                @click="onRemove"
              ></i>
            </template>

            <!-- File List / Status -->
            <template #content="{ files }">
              <div
                v-for="file in files"
                :key="file.name"
                class="p-2 sm:p-3 border rounded mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <!-- File name and size -->
                <div>
                  <div class="font-medium">{{ file.name }}</div>
                  <div class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</div>
                </div>

                <!-- Status -->
                <div>
                  <span v-if="uploaded" class="text-green-600 font-semibold"> ✅ Done </span>
                  <span v-else class="text-orange-500 font-semibold"> ⏳ Pending </span>
                </div>
              </div>
            </template>
          </FileUpload>

          <div v-if="uploading" class="flex flex-col items-center mt-4">
            <div
              class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="text-sm text-gray-600 mt-2">Processing file...</p>
            <p v-if="uploading" class="text-blue-500 mt-2 text-center">
              ⏳ Uploading & processing...
            </p>
          </div>
        </div>

        <div class="mt-4 flex justify-center px-2">
          <div
            v-if="message"
            class="px-4 py-3 flex items-center gap-2 transition-all duration-300 text-xs sm:text-sm italic text-green-500"
          >
            <i :class="uploaded ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ message }}</span>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="text-center text-gray-500 py-2 text-xs">
          &copy; 2026 Solex. All rights reserved.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import Card from "primevue/card";

let timer = null;

const message = ref("");
const uploaded = ref(false);
const fileUploadRef = ref(null);
const uploading = ref(false);
const files = ref([]);

// Computed property to check if select button should be disabled
const disableSelect = computed(() => files.value.length >= 1); // disable if 1 or more files

const uploadFile = (event) => {
  files.value = event.files; // update reactive array
  uploaded.value = false;
};

// Safe clear of internal state
const resetInternalState = () => {
  uploaded.value = false;
  message.value = "";
  files.value = [];
};

const onClear = () => {
  resetInternalState();
};

const onRemove = () => {
  uploaded.value = false;
  fileUploadRef.value.clear();
  // console.log("ok here - final.");
};

const sendFile = async () => {
  // console.log(files.value.length);

  if (!files.value.length) {
    message.value = "Please select a file";
    return;
  }

  const formData = new FormData();
  formData.append("file", files.value[0]);

  try {
    uploading.value = true; // 🔄 start spinner

    //const res = await axios.post("http://localhost:3000/api/upload", formData);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);

    message.value = res.data.message;

    uploaded.value = true;
  } catch (err) {
    uploaded.value = false;
    message.value = err.response?.data?.error || err.message || "Upload failed";
    console.error("ERROR:", err);
  } finally {
    uploading.value = false;
  }
};

const formatFileSize = (size) => {
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
  return (size / (1024 * 1024)).toFixed(2) + " MB";
};

watch(message, (val) => {
  if (!val) return;

  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    message.value = "";
  }, 10000);
});
</script>
