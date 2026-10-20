function getChartColorsArray(elementId) {
    if (document.getElementById(elementId) !== null) {
        var themeAttribute = "data-colors" + ("-" + document.documentElement.getAttribute("data-theme") ?? "");
        var colors = document.getElementById(elementId).getAttribute(themeAttribute) ?? document.getElementById(elementId).getAttribute("data-colors");

        if (colors) {
            return JSON.parse(colors).map(function (color) {
                var trimmedColor = color.replace(" ", "");
                if (trimmedColor.indexOf(",") === -1) {
                    return getComputedStyle(document.documentElement).getPropertyValue(trimmedColor) || trimmedColor;
                } else {
                    var colorParts = color.split(",");
                    return colorParts.length === 2
                        ? "rgba(" + getComputedStyle(document.documentElement).getPropertyValue(colorParts[0]) + "," + colorParts[1] + ")"
                        : trimmedColor;
                }
            });
        }

        console.warn("data-colors attributes not found on", elementId);
    }
}

var worldemapmarkers = "",
    storeVisitsSourceChart = "",
    customerImpressionChart = "";

function loadCharts() {
    var colors, chartOptions;

    // Sales by Locations
    colors = getChartColorsArray("sales-by-locations");
    if (colors) {
        document.getElementById("sales-by-locations").innerHTML = "";
        worldemapmarkers = new jsVectorMap({
            map: "world_merc",
            selector: "#sales-by-locations",
            zoomOnScroll: false,
            zoomButtons: false,
            selectedMarkers: [0, 5],
            regionStyle: {
                initial: {
                    stroke: "#9599ad",
                    strokeWidth: 0.25,
                    fill: colors[0],
                    fillOpacity: 1
                }
            },
            markersSelectable: true,
            markers: [
                { name: "Palestine", coords: [31.9474, 35.2272] },
                { name: "Russia", coords: [61.524, 105.3188] },
                { name: "Canada", coords: [56.1304, -106.3468] },
                { name: "Greenland", coords: [71.7069, -42.6043] }
            ],
            markerStyle: {
                initial: { fill: colors[1] },
                selected: { fill: colors[2] }
            },
            labels: {
                markers: {
                    render: function (marker) {
                        return marker.name;
                    }
                }
            }
        });
    }

    // Customer Impression Charts
    colors = getChartColorsArray("customer_impression_charts");
    if (colors) {
        chartOptions = {
            series: [
                { name: "Orders", type: "area", data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67] },
                { name: "Earnings", type: "bar", data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57] },
                { name: "Refunds", type: "line", data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35] }
            ],
            chart: { height: 370, type: "line", toolbar: { show: false } },
            stroke: { curve: "straight", dashArray: [0, 0, 8], width: [2, 0, 2.2] },
            fill: { opacity: [0.1, 0.9, 1] },
            markers: { size: [0, 0, 0], strokeWidth: 2, hover: { size: 4 } },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                axisTicks: { show: false },
                axisBorder: { show: false }
            },
            grid: {
                show: true,
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } },
                padding: { top: 0, right: -2, bottom: 15, left: 10 }
            },
            legend: {
                show: true,
                horizontalAlign: "center",
                offsetX: 0,
                offsetY: -5,
                markers: { width: 9, height: 9, radius: 6 },
                itemMargin: { horizontal: 10, vertical: 0 }
            },
            plotOptions: { bar: { columnWidth: "30%", barHeight: "70%" } },
            colors: colors,
            tooltip: {
                shared: true,
                y: [
                    { formatter: function (value) { return value !== undefined ? value.toFixed(0) : value; } },
                    { formatter: function (value) { return value !== undefined ? "$" + value.toFixed(2) + "k" : value; } },
                    { formatter: function (value) { return value !== undefined ? value.toFixed(0) + " Sales" : value; } }
                ]
            }
        };

        if (customerImpressionChart !== "") customerImpressionChart.destroy();
        customerImpressionChart = new ApexCharts(document.querySelector("#customer_impression_charts"), chartOptions);
        customerImpressionChart.render();
    }

    // Store Visits Source
    colors = getChartColorsArray("store-visits-source");
    if (colors) {
        chartOptions = {
            series: [44, 55, 41, 17, 15],
            labels: ["Direct", "Social", "Email", "Other", "Referrals"],
            chart: { height: 333, type: "donut" },
            legend: { position: "bottom" },
            stroke: { show: false },
            dataLabels: { dropShadow: { enabled: false } },
            colors: colors
        };

        if (storeVisitsSourceChart !== "") storeVisitsSourceChart.destroy();
        storeVisitsSourceChart = new ApexCharts(document.querySelector("#store-visits-source"), chartOptions);
        storeVisitsSourceChart.render();
    }
}

window.onresize = function () {
    setTimeout(() => { loadCharts(); }, 0);
};

loadCharts();

var overlay;
var swiper = new Swiper(".vertical-swiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    mousewheel: true,
    loop: true,
    direction: "vertical",
    autoplay: { delay: 2500, disableOnInteraction: false }
});
