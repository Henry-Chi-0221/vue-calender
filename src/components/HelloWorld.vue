<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
          <v-btn icon color="primary">
            <v-icon color="white">far fa-calendar</v-icon> 
          </v-btn>
          <v-btn small depressed color="primary">calendar</v-btn>
      </div>

      <v-spacer></v-spacer>
      <v-avatar style="marginRight:15px" size="36" color="red" >
              <v-btn icon text @click="accountIcon">
                <span class="white--text headline">CJ</span>
              </v-btn>
      </v-avatar>
    </v-app-bar>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" @click="setToday">
              Today
            </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
              
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"
                >
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
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
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
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              ><!--
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                -->
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              <!--    
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                -->  
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-text v-if="!selectedEvent.details">
                <span>尚無備註</span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>


<v-row justify="center">
    <v-dialog v-model="add_toggle" persistent max-width="600px">
      <v-card >
        <v-toolbar
                :color="add.color"
                dark
              >
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
                      label="開始日期"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="fas fa-calendar-day"
                      @blur="date1 = parseDate(dateFormatted1)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker 
                    v-model="date1" 
                    no-title 
                    @input="menu1 = false"
                    :min="dateFormatted2"
                                 ></v-date-picker>
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
                      label="結束日期"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="fas fa-calendar-day"
                      @blur="date2 = parseDate(dateFormatted2)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker 
                    v-model="date2" 
                    no-title 
                    @input="menu2 = false"
                    :min="dateFormatted1"></v-date-picker>
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
                    label="Picker in dialog"
                    prepend-icon="fas fa-clock"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modal1"
                  v-model="time1"
                  full-width
                  :max="time2"
                >
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
                label="Picker in dialog"
                prepend-icon="fas fa-clock"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modal2"
              v-model="time2"
              full-width
              :min="time1"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog2.save(time2)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>  
                     
            <v-col cols="6">
                <v-text-field v-model="add.name" label="事件名稱*" required @focus="checkFocus()" @blur="checkBlur()"></v-text-field>
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
          <v-btn color="blue darken-1" text @click="send()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
<!---------------------------------------------------------------->
<div class="float" v-if="type =='day'">
    <v-btn  fab dark small color="primary" @click="addEvent">
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
</div>
    

  </v-app>
</template>

@import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap" rel="stylesheet")

<style>
    *{
      font-family: 'Noto Sans TC', sans-serif;
    }
    .float{
        position: fixed;
        bottom: 5%;
        right : 5%;
    }
</style>
<script>
export default {
  name: 'HelloWorld',
  
data: vm => ({
    today: '2019-1-1',
    focus: '2019-1-1',
    test : '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    
    
    add_toggle : false,
    add : {
        name : '',
        details: '',
        start: '',
        end  : '',
        color: 'primary'
    },
    colors :['primary','blue','indigo','deep-purple','deep-purple','red','deep-orange','teal','green','grey darken-1','black','#4285F4'],
    colorIndex:0,
    
    date1: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10),
    
    dateFormatted1: vm.formatDate(new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10)),
    
    date2: new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10),
    
    dateFormatted2: vm.formatDate(new Date(+new Date() + 8 * 3600 * 1000).toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
    
      time1: null,
      time2: null,
      modal1: false,
      modal2: false,
    
    events: [
      {
        name: 'Vacation',
        details: 'Going to the beach!',
        start: '2019-12-10',
        end: '2019-12-12',
        color: 'blue',
      },
      {
        name: 'Meeting',
        details: 'Spending time on how we do not have enough time',
        start: '2019-01-07 09:00',
        end: '2019-01-07 09:30',
        color: 'indigo',
      },
      {
        name: 'Large Event',
        details: 'This starts in the middle of an event and spans over multiple events',
        start: '2018-12-31',
        end: '2019-01-04',
        color: 'deep-purple',
      },
      {
        name: '3rd to 7th',
        details: 'Testing',
        start: '2019-01-03',
        end: '2019-01-07',
        color: 'cyan',
      },
      {
        name: 'Big Meeting',
        details: 'A very important meeting about nothing',
        start: '2019-01-07 08:00',
        end: '2019-01-07 11:30',
        color: 'red',
      },
      {
        name: 'Another Meeting',
        details: 'Another important meeting about nothing',
        start: '2019-01-07 10:00',
        end: '2019-01-07 13:30',
        color: 'brown',
      },
      {
        name: '7th to 8th',
        start: '2019-01-07',
        end: '2019-01-08',
        color: 'blue',
      },
      {
        name: 'Lunch',
        details: 'Time to feed',
        start: '2019-01-07 12:00',
        end: '2019-01-07 15:00',
        color: 'deep-orange',
      },
      {
        name: '30th Birthday',
        details: 'Celebrate responsibly',
        start: '2019-01-03',
        color: 'teal',
      },
      {
        name: 'New Year',
        details: 'Eat chocolate until you pass out',
        start: '2019-01-01',
        end: '2019-01-02',
        color: 'green',
      },
      {
        name: 'Conference',
        details: 'The best time of my life',
        start: '2019-01-21',
        end: '2019-01-28',
        color: 'grey darken-1',
      },
      {
        name: 'Hackathon',
        details: 'Code like there is no tommorrow',
        start: '2019-01-30 23:00',
        end: '2019-02-01 08:00',
        color: 'black',
      },
      {
        name: 'event 1',
        start: '2019-01-14 18:00',
        end: '2019-01-14 19:00',
        color: '#4285F4',
      },
      {
        name: 'event 2',
        start: '2019-01-14 18:00',
        end: '2019-01-14 19:00',
        color: '#4285F4',
      },
      {
        name: 'event 5',
        start: '2019-01-14 18:00',
        end: '2019-01-14 19:00',
        color: '#4285F4',
      },
      {
        name: 'event 3',
        start: '2019-01-14 18:30',
        end: '2019-01-14 20:30',
        color: '#4285F4',
      },
      {
        name: 'event 4',
        start: '2019-01-14 19:00',
        end: '2019-01-14 20:00',
        color: '#4285F4',
      },
      {
        name: 'event 6',
        start: '2019-01-14 21:00',
        end: '2019-01-14 23:00',
        color: '#4285F4',
      },
      {
        name: 'event 7',
        start: '2019-01-14 22:00',
        end: '2019-01-14 23:00',
        color: '#4285F4',
      },
    ],
  }),
  computed: {
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    },
    computedDateFormatted () {
        return this.formatDate(this.date)
      },
      parseTime1() {
          return this.add.start + ' ' + this.time1;
      },
      parseTime2() {
          return this.add.end + ' ' + this.time2;
      },
  },
  mounted () {
    this.colorIndex = 0;
    this.$refs.calendar.checkChange();
    this.setToday();
    this.defaultTime();
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date
      this.type = "day"
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.type ="month";
      var date = new Date();
      var Y = date.getFullYear();
      var M = date.getMonth()+1;
      var D = date.getDate();
      this.today = Y+'-'+M+'-'+D;
      this.focus = this.today;
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start
      this.end = end
    },
    nth (d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    accountIcon (){
        this.defaultTime();
        console.log(this.time1);
        console.log(this.time2);
    },
    addEvent (x){
        console.log(x);
        this.add_toggle = true;
        this.add.start = this.focus;
        this.add.end   = this.focus;
        this.add.name  = this.focus;
        
        this.date1 = this.focus;
        this.date2 = this.focus;
        
    },
    checkBlur(){
        if(this.add.name==''){
            this.add.name=this.add.start;
        }
    },
    checkFocus(){
        if(this.add.name==this.add.start){
            this.add.name='';
        }
    },
    nextColor(){
        this.colorIndex++;
        this.add.color = this.colors[this.colorIndex];
        if(this.colorIndex == this.colors.length){
            this.colorIndex = 0;
        }
    },
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      send () {
          this.add.start = this.parseTime1;
          this.add.end = this.parseTime2;
          console.log(this.add);
          this.add_toggle = false;
          this.events.push(this.add);
      },
      defaultTime(){
          var date = new Date();
          var H = date.getHours() ;
          var M = date.getMinutes() ;
          if(H < 10){
              H = '0' + H;
          };
          if(M < 10){
              M = '0' + M;
          }
          this.time1 = H + ":" + M;
          this.time2 = H + ":" + M;
      }
      
  },
  watch: {
      date1 (val) {
        this.dateFormatted1 = this.formatDate(this.date1);
        this.add.start = this.date1;
      },
      date2 (val) {
        this.dateFormatted2 = this.formatDate(this.date2);
        this.add.end = this.date2;
      }
    },

};
</script>
