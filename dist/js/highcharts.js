var today = new Date(),
  day = 1000 * 60 * 60 * 24,
  // Utility functions
  dateFormat = Highcharts.dateFormat,
  defined = Highcharts.defined,
  isObject = Highcharts.isObject,
  reduce = Highcharts.reduce;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

Highcharts.ganttChart("assessmentplan", {
  series: [
    {
      name: "Offices",
      data: [
        {
          name: "HVRA Assessment",
          id: "id_HvRA",
          owner: "AKAH",
        },
        {
          name: "HVRA Khorog",
          id: "prepare_building",
          parent: "id_HvRA",
          start: today - 2 * day,
          end: today + 6 * day,
          completed: {
            amount: 0.2,
          },
          owner: "Khushdilov",
        },
        {
          name: "Inspect building",
          id: "inspect_building",
          dependency: "prepare_building",
          parent: "id_HvRA",
          start: today + 6 * day,
          end: today + 8 * day,
          owner: "Khushdilov",
        },
        {
          name: "Passed inspection",
          id: "passed_inspection",
          dependency: "inspect_building",
          parent: "id_HvRA",
          start: today + 9.5 * day,
          milestone: true,
          owner: "Khushdilov",
        },
        {
          name: "THRIVE",
          id: "relocate",
          dependency: "passed_inspection",
          parent: "id_HvRA",
          owner: "Khushdilov",
        },
        {
          name: "Thrive assessment",
          id: "relocate_staff",
          parent: "relocate",
          start: today + 10 * day,
          end: today + 11 * day,
          owner: "Khushdilov",
        },
        {
          name: "Test",
          dependency: "relocate_staff",
          parent: "relocate",
          start: today + 11 * day,
          end: today + 13 * day,
          owner: "Khushdilov",
        },
        {
          name: "Thrive village",
          dependency: "relocate_staff",
          parent: "relocate",
          start: today + 11 * day,
          end: today + 14 * day,
        },
      ],
    },
    {
      name: "SWSMT Project",
      data: [
        {
          name: "SWSMT Project",
          id: "new_product",
          owner: "Khushdilov",
        },
        {
          name: "Water line building",
          id: "development",
          parent: "new_product",
          start: today - day,
          end: today + 11 * day,
          completed: {
            amount: 0.6,
            fill: "#e80",
          },
          owner: "Khushdilov",
        },
        {
          name: "Water test",
          id: "beta",
          dependency: "development",
          parent: "new_product",
          start: today + 12.5 * day,
          milestone: true,
          owner: "Khushdilov",
        },
        {
          name: "SWSMT Assessment",
          id: "finalize",
          dependency: "beta",
          parent: "new_product",
          start: today + 13 * day,
          end: today + 17 * day,
        },
        {
          name: "Water line",
          dependency: "finalize",
          parent: "new_product",
          start: today + 17.5 * day,
          milestone: true,
          owner: "Khushdilov",
        },
      ],
    },
  ],
  tooltip: {
    pointFormatter: function () {
      var point = this,
        format = "%e. %b",
        options = point.options,
        completed = options.completed,
        amount = isObject(completed) ? completed.amount : completed,
        status = (amount || 0) * 100 + "%",
        lines;

      lines = [
        {
          value: point.name,
          style: "font-weight: bold;",
        },
        {
          title: "Start",
          value: dateFormat(format, point.start),
        },
        {
          visible: !options.milestone,
          title: "End",
          value: dateFormat(format, point.end),
        },
        {
          title: "Completed",
          value: status,
        },
        {
          title: "Owner",
          value: options.owner || "unassigned",
        },
      ];

      return reduce(
        lines,
        function (str, line) {
          var s = "",
            style = defined(line.style) ? line.style : "font-size: 0.8em;";
          if (line.visible !== false) {
            s =
              '<span style="' +
              style +
              '">' +
              (defined(line.title) ? line.title + ": " : "") +
              (defined(line.value) ? line.value : "") +
              "</span><br/>";
          }
          return str + s;
        },
        ""
      );
    },
  },
  title: {
    text: "OR&R Assessment Plan",
  },
  xAxis: {
    currentDateIndicator: true,
    min: today - 3 * day,
    max: today + 18 * day,
  },
});

$(document).ready(function () {
  $("#assessmentTable").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "excel", "pdf", "csv"],
    ajax: {
      url: assessmentapi,
      dataSrc: "assessments",
    },
    columns: [
      {
        data: "Region",
      },
      {
        data: "District",
      },
      {
        data: "Jamoat",
      },
      {
        data: "AreaofAssessment",
      },
      {
        data: "TypeofActivity",
      },
      {
        data: "Project",
      },
      {
        data: "Startdate",
      },
      {
        data: "Enddate",
      },
    ],
  });
  $("#tableasses").DataTable();
});

// PIN - SIDEBAR

let container = document.querySelector(".content");
let pinBtn = document.querySelector("#pin");
let close = document.querySelector("#close");

pinBtn.addEventListener("click", () => {
  container.classList.toggle("sticky-sidebar-right");
});

close.addEventListener("click", () => {
  container.classList.remove("sticky-sidebar-right");
});

// PIE - CHART

Highcharts.chart("piechart", {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
  },
  title: {
    text: "Browser market shares in January, 2018",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
    },
  },
  series: [
    {
      name: "Brands",
      colorByPoint: true,
      data: [
        {
          name: "Chrome",
          y: 61.41,
          sliced: true,
          selected: true,
        },
        {
          name: "Internet Explorer",
          y: 11.84,
        },
        {
          name: "Firefox",
          y: 10.85,
        },
        {
          name: "Edge",
          y: 4.67,
        },
        {
          name: "Safari",
          y: 4.18,
        },
        {
          name: "Sogou Explorer",
          y: 1.64,
        },
        {
          name: "Opera",
          y: 1.6,
        },
        {
          name: "QQ",
          y: 1.2,
        },
        {
          name: "Other",
          y: 2.61,
        },
      ],
    },
  ],
});

