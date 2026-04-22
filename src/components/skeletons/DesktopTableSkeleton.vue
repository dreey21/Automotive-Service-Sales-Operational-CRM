<template>
  <div
    class="hidden md:block h-[calc(100vh-410px)] bg-card border border-border"
    style="border-radius: 6px"
  >
    <div class="border-b border-border bg-[var(--foreground)]">
      <table class="w-full border-collapse table-fixed">
        <colgroup>
          <col style="width: 200px" />
          <col style="width: 140px" />
          <col style="width: auto" />
          <col style="width: 140px" />
          <col style="width: 180px" />
          <col style="width: 140px" />
          <col style="width: 180px" />
          <col style="width: 48px" />
        </colgroup>
        <thead>
          <tr>
            <th
              class="h-10 pl-10 pr-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Plate No.
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Jobs Done
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Part Details
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Cost
            </th>
            <th
              class="h-10 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
            >
              Vehicle
            </th>
            <th class="h-10 w-[48px]"></th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="overflow-y-auto" style="height: calc(100% - 40px)">
      <table class="w-full border-collapse table-fixed">
        <colgroup>
          <col style="width: 200px" />
          <col style="width: 140px" />
          <col style="width: auto" />
          <col style="width: 140px" />
          <col style="width: 180px" />
          <col style="width: 140px" />
          <col style="width: 180px" />
          <col style="width: 48px" />
        </colgroup>
        <tbody>
          <tr
            v-for="i in 10"
            :key="`skel-row-${i}`"
            class="border-b border-border animate-pulse"
          >
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 flex-shrink-0"></div>
                <div
                  class="h-3.5 bg-muted w-[70px]"
                  style="border-radius: 3px"
                ></div>
              </div>
            </td>
            <td class="px-4 py-2">
              <div
                class="h-3.5 bg-muted w-[80px]"
                style="border-radius: 3px"
              ></div>
            </td>
            <td class="px-4 py-2">
              <div
                class="h-3.5 bg-muted w-[120px]"
                style="border-radius: 3px"
              ></div>
            </td>
            <td class="px-4 py-2">
              <div
                class="h-3.5 bg-muted w-[100px]"
                style="border-radius: 3px"
              ></div>
            </td>
            <td class="px-4 py-2">
              <div class="flex flex-wrap gap-1">
                <div
                  class="h-5 bg-muted w-[70px]"
                  style="border-radius: 3px"
                ></div>
                <div
                  class="h-5 bg-muted w-[60px]"
                  style="border-radius: 3px"
                ></div>
              </div>
            </td>
            <td class="px-4 py-2">
              <div
                class="h-4 bg-muted w-[80px]"
                style="border-radius: 3px"
              ></div>
            </td>
            <td class="px-4 py-2">
              <div
                class="h-3.5 bg-muted w-[90px]"
                style="border-radius: 3px"
              ></div>
            </td>
            <td class="px-2 py-2">
              <div class="p-1.5">
                <div
                  class="h-[18px] bg-muted w-[18px] mx-auto"
                  style="border-radius: 3px"
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
