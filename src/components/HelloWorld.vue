<template>
  <header
    class="d-flex justify-content-center align-items-center"
    style="height: 10vh; margin-bottom: 20px; background: #082c32"
  >
    <div
      class="d-flex justify-content-center align-items-center"
      style="
        height: 100%;
        object-fit: contain;
        width: 200px;
        padding: 10px;
        overflow: hidden;
      "
    >
      <img style="width: 100%" src="assets/img/ehealth_teal_green_70px.png" />
    </div>
    <div
      v-if="!online"
      class="offline-indicator"
      style="
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        color: white;
        background: red;
      "
    >
      You are offline
    </div>
  </header>
  <main
    class="d-flex justify-content-center align-items-center"
    style="min-height: 90vh; width: 100%; margin: 0px"
  >
    <div class="container">
      <div
        class="row"
        style="margin-bottom: 25px; background: rgba(24, 132, 150, 0.11)"
      >
        <div
          class="col"
          style="
            box-shadow: 2px 3px 3px 1px rgba(33, 37, 41, 0.11);
            border-radius: 10px;
            border: 1px solid #188496;
          "
        >
          <div id="chart-container"></div>
        </div>
      </div>
      <div class="row" style="margin-bottom: 50px">
        <div
          class="col"
          style="
            border-radius: 10px;
            box-shadow: 2px 3px 3px 1px rgba(33, 37, 41, 0.11);
            border: 1px solid #188496;
          "
        >
          <div
            class="row"
            style="
              margin-bottom: 15px;
              padding-top: 5px;
              padding-bottom: 5px;
              background: #188496;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            "
          >
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="color: rgb(255, 255, 255)">Name</h6>
            </div>
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="color: rgb(255, 255, 255)">Age</h6>
            </div>
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="color: rgb(255, 255, 255)">Blood Group</h6>
            </div>
          </div>
          <div
            v-for="person in people"
            :key="person.id"
            class="row"
            style="
              background: #ffffff;
              padding-top: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid rgb(186, 186, 186);
            "
          >
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="margin: 0px">
                {{ person.name.first + " " + person.name.last }}
              </h6>
            </div>
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="margin: 0px">{{ person.age }}</h6>
            </div>
            <div class="col d-flex justify-content-center align-items-center">
              <h6 style="margin: 0px">{{ person.bloodGroup }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Highcharts from "highcharts";
import { getPeople } from "../firebaseService";
import { addPeopleToDB, getPeopleFromDB } from "../indexedDBService";

export default {
  name: "BarChart",
  data() {
    return {
      people: [],
      online: navigator.onLine,
    };
  },
  async mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);

    let people;
    if (this.online) {
      people = await getPeople();
      await addPeopleToDB(people);
    } else {
      people = await getPeopleFromDB();
    }
    this.people = people;
    this.createChart(people);
  },
  beforeUnmount() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus() {
      this.online = navigator.onLine;
    },
    createChart(data) {
      const ageGroups = { "0-18": 0, "19-35": 0, "36-50": 0, "51+": 0 };
      const bloodGroups = {
        "A+": 0,
        "B+": 0,
        "AB+": 0,
        "O+": 0,
        "A-": 0,
        "B-": 0,
        "AB-": 0,
        "O-": 0,
      };

      data.forEach((person) => {
        if (person.age <= 18) ageGroups["0-18"]++;
        else if (person.age <= 35) ageGroups["19-35"]++;
        else if (person.age <= 50) ageGroups["36-50"]++;
        else ageGroups["51+"]++;

        bloodGroups[person.bloodGroup]++;
      });

      Highcharts.chart("chart-container", {
        chart: {
          type: "bar",
          backgroundColor: "transparent",
        },
        title: { text: "Patients by Blood Group and Age" },
        xAxis: {
          categories: Object.keys(bloodGroups),
          title: { text: "Blood Groups" },
        },
        yAxis: {
          min: 0,
          title: { text: "Number of Patients" },
          stackLabels: {
            enabled: true,
          },
        },
        plotOptions: {
          series: {
            stacking: "normal",
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        legend: {
          title: {
            text: "Age",
          },
        },
        series: [
          {
            name: "0-18",
            data: Object.keys(bloodGroups).map(
              (bloodGroup) =>
                data.filter(
                  (person) =>
                    person.age <= 18 && person.bloodGroup === bloodGroup
                ).length
            ),
            color: "#7cb5ec",
          },
          {
            name: "19-35",
            data: Object.keys(bloodGroups).map(
              (bloodGroup) =>
                data.filter(
                  (person) =>
                    person.age > 18 &&
                    person.age <= 35 &&
                    person.bloodGroup === bloodGroup
                ).length
            ),
            color: "#434348",
          },
          {
            name: "36-50",
            data: Object.keys(bloodGroups).map(
              (bloodGroup) =>
                data.filter(
                  (person) =>
                    person.age > 35 &&
                    person.age <= 50 &&
                    person.bloodGroup === bloodGroup
                ).length
            ),
            color: "#90ed7d",
          },
          {
            name: "51+",
            data: Object.keys(bloodGroups).map(
              (bloodGroup) =>
                data.filter(
                  (person) =>
                    person.age > 50 && person.bloodGroup === bloodGroup
                ).length
            ),
            color: "#f7a35c",
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.offline-indicator {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  color: white;
  background: red;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 10px;
}
a {
  text-decoration: none;
  color: #3b8070;
}
</style>
