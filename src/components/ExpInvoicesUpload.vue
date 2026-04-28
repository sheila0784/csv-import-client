<template>
  <div>
    <Toast />
    <Card class="w-full max-w-2xl min-w-[320px] mx-auto rounded-lg shadow-lg">
      <template #header>
        <div class="text-3xl text-shadow-2xs font-bold text-center text-blue-500 py-4">
          Export From POS
        </div>
        <div class="text-center text-gray-500 mb-4 text-xs">
          Generate CSV file to upload in Solex.
        </div>
      </template>
      <template #content>
        <div class="w-full">
          <div class="w-full">
            <div class="flex flex-col gap-4">
              <div class="card flex justify-center w-full">
                <Select
                  v-model="selectedExportType"
                  :options="exportTypes"
                  optionLabel="name"
                  placeholder="Select Export Type"
                  checkmark
                  :highlightOnSelect="false"
                  class="w-full"
                />
              </div>

              <div class="flex justify-end">
                <Button
                  label="Export"
                  icon="pi pi-file-export"
                  variant="text"
                  @click="exportCSV"
                  :loading="loading"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- <template #footer>
        <div class="text-center text-gray-500 py-2 text-xs">
          &copy; 2026 Solex. All rights reserved.
        </div>
      </template> -->
    </Card>
  </div>
</template>

<script setup>
import axios from "axios";
import Card from "primevue/card";
import Button from "primevue/button";
import Select from "primevue/select";
import { ref } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const loading = ref(false);

const selectedExportType = ref();
const exportTypes = ref([
  { name: "POS Invoices To CSV", code: "opt1" },
  { name: "POS Invoice Adjustments To CSV", code: "opt2" },
  { name: "POS Invoices for Deletion To CSV", code: "opt3" },
]);

const exportCSV = async () => {
  if (!selectedExportType.value) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Please select an export type.",
      life: 3000,
    });
    return;
  }

  try {
    loading.value = true;

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/export/${selectedExportType.value.code}`,
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([res.data], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "export.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    // catch (err) {
    //   console.error("Export failed:", err);

    //   toast.add({
    //     severity: "error",
    //     summary: "Export Failed",
    //     detail: err.message,
    //     life: 4000,
    //   });
    // }

    console.error("Export failed:", err);

    // ✅ Check if backend responded
    if (err.response && err.response.data) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const errorData = JSON.parse(reader.result);

          toast.add({
            severity: "warn",
            summary: "No Data",
            detail: errorData.message || "No data found",
            life: 3000,
          });
        } catch {
          toast.add({
            severity: "error",
            summary: "Export Failed",
            detail: "Unexpected error format",
            life: 4000,
          });
        }
      };

      reader.readAsText(err.response.data);
    } else {
      // fallback
      toast.add({
        severity: "error",
        summary: "Export Failed",
        detail: err.message,
        life: 4000,
      });
    }
  }

  loading.value = false;
};
</script>
