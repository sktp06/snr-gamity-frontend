<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <div class="text-center font-bold">
        <h3>Preview Calendar</h3>
      </div>
      <FullCalendar :options="calendarOptions" class="calendar" />
      <div class="buttons-container">
        <button
          class="bg-white mt-3 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center"
          @click="downloadICS"
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download</span>
        </button>
        <button @click="closeModal" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";

export default {
  components: { FullCalendar },
  props: {
    show: Boolean,
    eventData: Array,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        fixedWeekCount: false,
        initialDate: this.calculateInitialDate(), // Set initial date based on events
        events: this.generateEvents(),
      },
    };
  },
  methods: {
    calculateInitialDate() {
      // Find the earliest event date in the eventData array
      if (this.eventData.length > 0) {
        const earliestEvent = this.eventData.reduce((earliest, event) => {
          return event.date < earliest.date ? event : earliest;
        });
        return earliestEvent.date;
      } else {
        // If there are no events, default to the current date
        return new Date();
      }
    },
    generateEvents() {
      return this.eventData.map((event) => {
        return {
          title: `Gaming time: ${Math.floor(event.hours)} hrs ${Math.round(
            event.minutes
          )} mins`,
          start: event.date,
          allDay: true,
        };
      });
    },
    downloadICS() {
      const { events } = this.calendarOptions;
      const icsContent = this.generateICSContent(events);
      const blob = new Blob([icsContent], { type: "text/plain;charset=utf-8" });
      const fileName = "gaming.ics";

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    },
    generateICSContent(events) {
      let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";

      for (const event of events) {
        const formattedStartDate = event.start.toISOString();
        const formattedEndDate = new Date(event.start);
        formattedEndDate.setHours(23, 59, 0); // Set end time to 11:59 PM
        const eventTitle = event.title || "Event";

        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `DTSTART:${formattedStartDate}\n`;
        icsContent += `DTEND:${formattedEndDate.toISOString()}\n`; // Set end time
        icsContent += `SUMMARY:${eventTitle}\n`;
        icsContent += `END:VEVENT\n`;
      }

      icsContent += "END:VCALENDAR\n";
      return icsContent;
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar {
  flex: 1; /* Let the calendar take up the remaining space */
  height: 80%; /* Adjust the height of the calendar */
}
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px; /* Add some space between buttons and content */
}

.buttons-container button {
  margin-top: 10px; /* Add some space between buttons */
}

.buttons-container button.flex {
  flex-direction: row; /* Display icon and text in a row */
  justify-content: center; /* Center contents horizontally */
  align-items: center; /* Center contents vertically */
}

.buttons-container button .svg-icon {
  width: 1rem; /* Set the width of the icon */
  height: 1rem; /* Set the height of the icon */
  margin-right: 0.5rem; /* Add some spacing between icon and text */
}
.close-button {
  margin-top: 10px;
}
</style>
