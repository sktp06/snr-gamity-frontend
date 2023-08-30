<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal-content">
      <div class="text-center font-bold">
        <h3>Preview Calendar</h3>
      </div>
      <FullCalendar :options="calendarOptions" class="calendar" />
      <button @click="downloadICS">Download as .ics</button>
      <button @click="closeModal" class="close-button">Close</button>
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

.close-button {
  margin-top: 10px;
}
</style>
