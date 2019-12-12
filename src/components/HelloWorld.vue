<template>
  <transition name="fade">
    <v-app id="inspire">
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="18%">
            <v-toolbar flat color="white">
              <v-btn outlined class="mr-4" @click="setToday">Today</v-btn>
              <v-btn fab text small @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <v-menu bottom right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-toolbar flat color="white">
              <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="#94acfa"
              :events="events"
              :event-color="getEventColor"
              :event-margin-bottom="3"
              :now="today"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              full-width
              offset-x
            >
              <v-card color="grey lighten-4" min-width="300px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="addEvent(1)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-text v-if="!selectedEvent.details">
                  <span>尚無備註</span>
                </v-card-text>
                <v-divider></v-divider>
                <div class="mx-auto">
                  <v-btn
                    class="mx-auto"
                    small
                    color="blue lighten-1"
                    href="https://www.trivago.com.tw/"
                  >Trivago</v-btn>

                  <v-btn
                    class="mx-auto"
                    small
                    color="amber lighten-2"
                    href="https://tc.trip.com/"
                  >Trip.com</v-btn>

                  <v-btn
                    class="mx-auto"
                    small
                    color="brown lighten-4"
                    href="https://www.airbnb.com.tw/"
                  >Airbnb</v-btn>
                </div>

                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text color="red" @click="delete_db()">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-dialog v-model="add_toggle" persistent max-width="600px">
          <v-card>
            <v-toolbar :color="add.color" dark>
              <v-toolbar-title v-html="add.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="nextColor">
                <v-icon small>fas fa-paint-brush</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <!------------------------------------------------------------>

                <v-row justify="center">
                  <v-col cols="12">
                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateFormatted1"
                          label="開始日期*"
                          hint="MM/DD/YYYY format"
                          persistent-hint
                          prepend-icon="fas fa-calendar-day"
                          @blur="date1 = parseDate(dateFormatted1)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateFormatted2"
                          label="結束日期*"
                          hint="MM/DD/YYYY format"
                          persistent-hint
                          prepend-icon="fas fa-calendar-day"
                          @blur="date2 = parseDate(dateFormatted2)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date2" no-title @input="menu2 = false" :min="date1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="6">
                    <v-dialog
                      ref="dialog1"
                      v-model="modal1"
                      :return-value.sync="time1"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time1"
                          label="開始時間*"
                          prepend-icon="fas fa-clock"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-if="modal1" v-model="time1" full-width :max="time2">
                        <v-btn text color="primary" @click="modal1 = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog1.save(time1)">OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="6">
                    <v-dialog
                      ref="dialog2"
                      v-model="modal2"
                      :return-value.sync="time2"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time2"
                          label="結束時間*"
                          prepend-icon="fas fa-clock"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-if="modal2" v-model="time2" full-width :min="time1">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.dialog2.save(time2)">OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>

                  <v-col cols="6">
                    <v-text-field
                      v-model="add.name"
                      label="事件名稱*"
                      required
                      @focus="checkFocus()"
                      @blur="checkBlur()"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <v-text-field v-model="add.details" label="備註"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="add_toggle = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="send(put)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!---------------------------------------------------------------->

      <div class="float" v-if="type =='day'">
        <v-btn fab dark small color="#5165a3" @click="addEvent">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-app>
  </transition>
</template>



<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap");
.float {
  position: fixed;
  bottom: 5%;
  right: 5%;
}
* {
  font-family: "Noto Sans TC", sans-serif;
}
</style>
<script>
const axios = require("axios");
export default {
  name: "ntut-vue-calender",

  data: vm => ({
    today: "2019-1-1",
    focus: "2019-1-1",
    test: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,

    add_toggle: false,
    add: {
      name: "",
      details: "",
      start: "",
      end: "",
      color: "primary"
    },
    put: 0,
    colors: [
      "primary",
      "blue",
      "indigo",
      "deep-purple",
      "red",
      "deep-orange",
      "teal",
      "green",
      "grey darken-1",
      "black",
      "#4285F4"
    ],
    colorIndex: 0,

    date1: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10),

    dateFormatted1: vm.formatDate(
      new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10)
    ),

    date2: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10),

    dateFormatted2: vm.formatDate(
      new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10)
    ),
    menu1: false,
    menu2: false,

    time1: null,
    time2: null,
    modal1: false,
    modal2: false,

    events: []
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startYear} ${startMonth} `;
        case "week":
        case "4day":
          return `${startYear} ${startMonth} ${startDay}  ~    ${suffixYear} ${suffixMonth} ${endDay}`;
        case "day":
          return `${startYear} ${startMonth} ${startDay} `;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    parseTime1() {
      if (this.time1.length != 0) {
        return this.add.start + " " + this.time1;
      }
    },
    parseTime2() {
      if (this.time2.length != 0) {
        return this.add.end + " " + this.time2;
      }
    }
  },
  mounted() {
    this.colorIndex = 0;
    this.$refs.calendar.checkChange();
    this.setToday();
    this.defaultTime();
    this.update();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.type = "month";
      var date = new Date();
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      this.today = Y + "-" + M + "-" + D;
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
      var year = this.start.year;
      if (this.type == "4day") {
        if (this.end.day != 1) {
          this.start = start;
          this.end.day--;
        }
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          if (start.month == 2 && start.day == 26) {
            this.end.month--;
            this.end.day = 29;
          }
        }
      }
    },
    nth(d) {
      /*
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
        */
      return "日";
    },
    accountIcon() {
      this.defaultTime();
      //console.log(this.time1);
      //console.log(this.time2);
    },
    addEvent(x) {
      if (x == 1) {
        var cut_start = this.selectedEvent.start.split(" ");
        var cut_end = this.selectedEvent.end.split(" ");

        this.add_toggle = true;
        this.add.start = cut_start[1];
        this.add.end = cut_end[1];
        this.add.name = this.selectedEvent.name;
        this.add.color = this.selectedEvent.color;
        this.date1 = cut_start[0];
        this.date2 = cut_end[0];
        this.add.details = this.selectedEvent.details;
        this.put = 1;
      } else {
        this.add_toggle = true;
        this.add.start = this.focus;
        this.add.end = this.focus;
        this.add.name = this.focus;

        this.date1 = this.focus;
        this.date2 = this.focus;
        this.add.details = "";
        this.defaultTime();
      }
    },
    checkBlur() {
      if (this.add.name == "") {
        this.add.name = this.add.start;
      }
    },
    checkFocus() {
      if (this.add.name == this.date1) {
        this.add.name = "";
      }
    },
    nextColor() {
      this.colorIndex++;
      this.add.color = this.colors[this.colorIndex];
      if (this.colorIndex == this.colors.length) {
        this.colorIndex = 0;
      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    send(x) {
      if (x == 1) {
        var vm = this;
        this.add.start = this.date1;
        this.add.end = this.date2;
        this.add.detail = this.detail;
        axios
          .post("/api/db_update", {
            oldEvent: vm.selectedEvent,
            newEvent: vm.add
          })
          .then(function(response) {
            vm.selectedOpen = false;
            vm.update();
          })
          .catch(function(error) {
            console.log(error);
          });

        this.put = 0;
        this.add_toggle = false;
      } else {
        var vm = this;
        this.add.start = this.parseTime1;
        this.add.end = this.parseTime2;
        this.add_toggle = false;
        this.type = "month";
        axios
          .post("/api/db_add", {
            event: this.add,
            userName: localStorage.getItem("username")
          })
          .then(function(response) {
            vm.update();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    defaultTime() {
      var date = new Date();
      var H = date.getHours();
      var M = date.getMinutes();
      var Ms = date.getMinutes() + 1;
      if (H < 10) {
        H = "0" + H;
      }
      if (M < 10) {
        M = "0" + M;
      }
      this.time1 = H + ":" + M;
      this.time2 = "23:59";
    },
    update() {
      var vm = this;
      axios
        .post("/api/db_select", {
          userName: localStorage.getItem("username")
        })
        .then(function(response) {
          vm.events = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    delete_db() {
      this.selectedOpen = false;
      var vm = this;
      axios
        .post("/api/db_delete", {
          eventId: this.selectedEvent.id
        })
        .then(function(response) {
          vm.update();
        })
        .catch(function(error) {
          console.log(error);
        });
      //console.log(this.selectedEvent);
    }
  },
  watch: {
    date1(val) {
      this.dateFormatted1 = this.formatDate(this.date1);
      this.add.start = this.date1;
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
      this.add.end = this.date2;
    }
  }
};
</script>
