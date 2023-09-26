<template>
  <div
    class="bg-zinc-900 min-h-screen main-container"
    style="
      background-image: url('https://t3.ftcdn.net/jpg/02/64/27/90/360_F_264279006_WDXxV3OHjAOoHqH7iiLDrg23p0947g7U.jpg');
      background-size: auto;
    "
  >
    <div class="bg-zinc-900 min-h-screen ml-10 mr-10 rounded-lg">
      <h2 class="text-3xl text-white font-bold p-10 pl-4">
        Gaming Time Management
      </h2>
      <div class="container mx-auto px-4 p-2 px-20">
        <form @submit.prevent="handleSearch">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-black"
          >
            Search
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="handleInputFocus"
              type="search"
              id="default-search"
              class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              required
            />
          </div>
          <transition name="fade">
            <ul
              v-if="visibleResults.length > 0"
              class="mt-2 border border-gray-300 rounded-lg bg-white overflow-y-auto max-h-48 shadow"
            >
              <li
                v-for="result in sortedVisibleResults"
                :key="result.id"
                class="p-3 flex items-center space-x-4 hover:bg-gray-100 cursor-pointer"
                @click="handleGameClick(result.name)"
              >
                <img
                  :src="result.cover"
                  alt="Game Cover"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold capitalize">
                    {{ result.name }}
                  </p>
                </div>
              </li>
            </ul>
          </transition>
        </form>
        <div
          v-if="selectedGame && searchQuery !== ''"
          class="mt-4 p-4 bg-white rounded-lg shadow rounded-md"
        >
          <div class="info">
            <h3 class="text-lg font-semibold capitalize">
              {{ selectedGame.name }}
            </h3>
            <p>Main Story: {{ formatTime(selectedGame.main_story) }}</p>
            <p>Main Extra: {{ formatTime(selectedGame.main_extra) }}</p>
            <p>Completionist: {{ formatTime(selectedGame.completionist) }}</p>
            <div class="mt-4"></div>

            <label class="block text-sm font-medium text-gray-700"
              >Select Game Mode</label
            >
            <select
              v-model="selectedGameMode"
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white"
            >
              <option value="mainStory">
                Main Story : {{ formatTime(selectedGame.main_story) }}
              </option>
              <option value="mainExtra">
                Main Extra : {{ formatTime(selectedGame.main_extra) }}
              </option>
              <option value="completionist">
                Completionist : {{ formatTime(selectedGame.completionist) }}
              </option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <!-- Add input fields for hours and minutes -->
          <div v-if="selectedGameMode === 'custom'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700"
              >Enter Time (Hours and Minutes)</label
            >
            <div class="flex items-center mt-2">
              <input
                v-model="customHours"
                type="number"
                class="w-1/2 mr-2 p-2 rounded-md border border-gray-300"
                placeholder="Hours"
              />
              <input
                v-model="customMinutes"
                type="number"
                class="w-1/2 p-2 rounded-md border border-gray-300"
                placeholder="Minutes"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700"
              >Select Date Mode</label
            >
            <div class="flex">
              <button
                class="flex-1 mr-2 py-2 rounded-lg focus:outline-none border border-grey-500"
                :class="{
                  'bg-blue-500 text-white hover:bg-blue-600':
                    dateMode === 'single',
                  'bg-white text-gray-800 hover:bg-gray-100':
                    dateMode !== 'single',
                }"
                @click="changeDateMode('single')"
              >
                Individually Select Date
              </button>
              <button
                class="flex-1 ml-2 py-2 rounded-lg focus:outline-none border border-grey-500"
                :class="{
                  'bg-blue-500 text-white hover:bg-blue-600':
                    dateMode === 'range',
                  'bg-white text-gray-800 hover:bg-gray-100':
                    dateMode !== 'range',
                }"
                @click="changeDateMode('range')"
              >
                Date Range
              </button>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700"
              >Select Date</label
            >
            <VueDatePicker
              v-model="date"
              :range="dateMode === 'range'"
              :multi-dates="dateMode === 'single'"
              :minDate="new Date()"
              :enable-time-picker="false"
            />
          </div>
          <div class="mt-4" v-if="dateMode === 'range'">
            <label class="block text-sm font-medium text-gray-700">
              Select Days (Optional)
            </label>
            <div class="flex flex-col mt-2 md:flex-row">
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.sunday"
                  class="mr-2"
                />
                <label class="mr-4">Sunday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.monday"
                  class="mr-2"
                />
                <label class="mr-4">Monday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.tuesday"
                  class="mr-2"
                />
                <label class="mr-4">Tuesday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.wednesday"
                  class="mr-2"
                />
                <label class="mr-4">Wednesday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.thursday"
                  class="mr-2"
                />
                <label class="mr-4">Thursday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.friday"
                  class="mr-2"
                />
                <label class="mr-4">Friday</label>
              </div>
              <div class="md:flex md:flex-wrap">
                <input
                  type="checkbox"
                  v-model="selectedDays.saturday"
                  class="mr-2"
                />
                <label>Saturday</label>
              </div>
            </div>
          </div>
          <div>
            <button
              class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-3"
              @click="openCalendar"
              type="button"
            >
              Confirm
            </button>
            <!-- Conditionally render the "Clear" button -->
            <button
              v-if="date || Object.values(selectedDays).some((day) => day)"
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border border-red-600 rounded shadow mt-3 ml-3"
              @click="clearSelection"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
        <!--Pass the calendarEventData to the CalendarPreview component and use it to create events: -->
        <div v-if="showCalendar">
          <CalendarPreview
            :show="showCalendar"
            :eventData="calendarEventData"
            :initialDate="calendarInitialDate"
            @close="closeCalendar"
            class="overlay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";
import VueDatePicker from "@vuepic/vue-datepicker";
import CalendarPreview from "@/components/CalendarPreview.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Swal from "sweetalert2";

export default {
  components: { VueDatePicker, CalendarPreview },
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      visibleResults: [],
      selectedGame: null,
      selectedGameMode: "mainStory",
      date: null,
      showCalendar: false,
      dateMode: "single",
      selectedDays: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      },
      customHours: 0,
      customMinutes: 0,
    };
  },
  computed: {
    sortedVisibleResults() {
      return this.visibleResults
        .slice()
        .sort((a, b) => b.aggregated_rating - a.aggregated_rating);
    },
    selectedDates() {
      if (this.dateMode === "range") {
        const startDate = this.date[0];
        const endDate = this.date[1];
        const daysOfWeek = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
        };
        const selectedDates = [];
        for (const day in this.selectedDays) {
          if (this.selectedDays[day]) {
            const selectedDate = new Date(startDate);
            while (selectedDate <= endDate) {
              if (selectedDate.getDay() === daysOfWeek[day]) {
                selectedDates.push(new Date(selectedDate));
              }
              selectedDate.setDate(selectedDate.getDate() + 1);
            }
          }
        }
        return selectedDates;
      } else if (this.dateMode === "single" && Array.isArray(this.date)) {
        return this.date;
      }
      return [];
    },
  },
  watch: {
    searchQuery(newSearchQuery) {
      // Reset selectedGame when searchQuery becomes empty
      if (newSearchQuery === "") {
        this.selectedGame = null;
      }
    },
  },
  methods: {
    handleSearch() {
      this.handleSearchInput();
    },
    formatTime(decimalHours) {
      if (decimalHours < 0) {
        return "Invalid";
      }

      // Calculate hours and minutes
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      // Construct the formatted string
      let formattedTime = `${hours} hours`;

      if (minutes > 0) {
        formattedTime += `, ${minutes} minutes`;
      }

      return formattedTime;
    },
    async handleSearchInput() {
      try {
        if (this.searchQuery === "") {
          this.searchResults = [];
          this.visibleResults = []; // Clear visible results
          return;
        }

        const games = await gameService.get_clean_gameplay();
        this.searchResults = games.filter((game) =>
          game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        // Update visibleResults only if no game is selected
        if (!this.selectedGame) {
          this.visibleResults = this.searchResults.slice(0, 20);
        }
      } catch (error) {
        console.error("Error handling search input:", error);
      }
    },
    handleGameClick(gameName) {
      this.searchQuery = gameName;
      this.visibleResults = [];
      this.selectedGame = this.searchResults.find(
        (game) => game.name === gameName
      );
    },
    // Inside your openCalendar method
    openCalendar() {
      const selectedGameModeMap = {
        mainStory: "main_story",
        mainExtra: "main_extra",
        completionist: "completionist",
        custom: "custom",
      };

      if (!(this.selectedGameMode in selectedGameModeMap)) {
        console.error("Invalid selectedGameMode");
        return;
      }

      let totalHours;
      let totalMinutes;

      totalHours =
        this.selectedGame[selectedGameModeMap[this.selectedGameMode]];
      totalMinutes = Math.round(totalHours * 60);
      console.log(totalHours);
      console.log(totalMinutes);

      if (this.selectedGameMode === "custom") {
        // Handle the custom option
        totalHours =
          parseFloat(this.customHours) + parseFloat(this.customMinutes) / 60;
        totalMinutes = totalHours * 60;
      } else {
        totalHours =
          this.selectedGame[selectedGameModeMap[this.selectedGameMode]];
        totalMinutes = Math.round(totalHours * 60);
      }

      const eventData = [];
      // Check if no dates or days are selected in range mode
      if (this.dateMode === "range" && (!this.date || this.date.length < 2)) {
        Swal.fire({
          icon: "error",
          title: "No Dates Selected",
          text: "Please select a date range before confirming.",
        });
        return;
      }

      // Check if no dates or days are selected
      if (this.selectedDates.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No Dates or Days Selected",
          text: "Please select at least one date or day before confirming.",
        });
        return;
      }

      // alert enough days
      if (this.selectedDates.length > 0) {
        if (this.dateMode === "single") {
          // Check for single date mode
          const minimumDaysRequired = Math.ceil(totalMinutes / (24 * 60)); // Convert total minutes to days
          if (this.selectedDates.length < minimumDaysRequired) {
            Swal.fire({
              icon: "error",
              title: "Insufficient Days Selected",
              text: `You must select at least ${minimumDaysRequired} days for this game time.`,
            });
            return;
          }
        } else if (this.dateMode === "range") {
          const selectedDayCount = this.selectedDates.length;
          const minimumDaysRequired = Math.ceil(totalMinutes / (24 * 60)); // Convert total minutes to days
          const selectedDays = Object.keys(this.selectedDays).filter(
            (day) => this.selectedDays[day]
          );

          if (
            selectedDayCount < minimumDaysRequired ||
            !selectedDays.every((day) =>
              this.isDayInRange(day, this.date[0], this.date[1])
            )
          ) {
            Swal.fire({
              icon: "error",
              title: "Invalid Days Selected",
              text: `You must select at least ${minimumDaysRequired} days, and they must be within the chosen date range for this game time.`,
            });
            return;
          }
        }
        const totalMinutesPerDay = Math.floor(
          totalMinutes / this.selectedDates.length
        );
        let remainingMinutes = totalMinutes % this.selectedDates.length;

        this.selectedDates.forEach((selectedDate) => {
          let minutesToAdd = totalMinutesPerDay;

          // Distribute remaining minutes evenly among the days
          if (remainingMinutes > 0) {
            minutesToAdd += 1;
            remainingMinutes -= 1;
          }

          // Convert minutesToAdd to hours and minutes
          const hours = Math.floor(minutesToAdd / 60);
          const minutes = minutesToAdd % 60;

          eventData.push({
            date: selectedDate,
            hours: hours,
            minutes: minutes,
          });
        });
      } // Check if the date mode is "range" and an array of dates is provided
      else if (this.dateMode === "range" && Array.isArray(this.date)) {
        const startDate = this.date[0];
        const endDate = this.date[1];
        const totalDays = this.calculateDayCount(startDate, endDate);
        const minimumDaysRequired = Math.ceil(totalMinutes / (24 * 60)); // Convert total minutes to days
        const selectedDays = Object.keys(this.selectedDays).filter(
          (day) => this.selectedDays[day]
        );

        if (
          totalDays < minimumDaysRequired ||
          !selectedDays.every((day) =>
            this.isDayInRange(day, startDate, endDate)
          )
        ) {
          Swal.fire({
            icon: "error",
            title: "Invalid Days Selected",
            text: `You must select at least ${minimumDaysRequired} days, and they must be within the chosen date range for this game time.`,
          });
          return;
        }

        const totalMinutesPerDay = Math.floor(totalMinutes / totalDays);
        let remainingMinutes = totalMinutes % totalDays;

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          let minutesToAdd = totalMinutesPerDay;

          // Distribute remaining minutes evenly among the days
          if (remainingMinutes > 0) {
            minutesToAdd += 1;
            remainingMinutes -= 1;
          }

          // Convert minutesToAdd to hours and minutes
          const hours = Math.floor(minutesToAdd / 60);
          const minutes = minutesToAdd % 60;

          eventData.push({
            date: new Date(currentDate),
            hours: hours,
            minutes: minutes,
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        console.error("Invalid date mode or date format");
        return;
      }

      const initialDate =
        this.dateMode === "range" ? this.date[0] : this.date[0];
      this.calendarInitialDate = initialDate;
      this.showCalendar = true;
      this.calendarEventData = eventData;
    },
    isDayInRange(day, startDate, endDate) {
      const daysOfWeek = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      const selectedDayOfWeek = daysOfWeek[day];
      const currentDayOfWeek = startDate.getDay();
      const endDayOfWeek = endDate.getDay();

      if (currentDayOfWeek <= endDayOfWeek) {
        return (
          selectedDayOfWeek >= currentDayOfWeek &&
          selectedDayOfWeek <= endDayOfWeek
        );
      } else {
        // Handle date ranges that cross over to the next week
        return (
          selectedDayOfWeek >= currentDayOfWeek ||
          selectedDayOfWeek <= endDayOfWeek
        );
      }
    },
    calculateDayCount(startDate, endDate) {
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
      return Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    },
    clearSelection() {
      (this.searchQuery = ""), (this.date = null);
      this.selectedGameMode = "mainStory";
      this.selectedDays = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      };
    },
    changeDateMode(mode) {
      this.date = null;
      this.dateMode = mode;
    },
    closeCalendar() {
      this.showCalendar = false;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.main-container {
  padding-top: 30px;
  padding-bottom: 30px;
}
.dp__action_button.dp__action_select {
  background-color: black;
}
</style>
