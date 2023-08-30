<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="text-center font-bold">
        <h3>Preview Calendar</h3>
      </div>
      <FullCalendar :options="calendarOptions" class="calendar" />
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
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        fixedWeekCount: false, // Allow variable number of weeks in the month view
        // Other calendar options...
      },
    };
  },
  methods: {
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
