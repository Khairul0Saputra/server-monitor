async function fetchData() {
    try {
        let response = await fetch("http://localhost:19999/api/v1/data?chart=system.cpu&format=json");
        let data = await response.json();
        return data.data.slice(-10).map(item => item[1]); // Ambil 10 data terakhir
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return [];
    }
}

async function updateChart(chart) {
    let newData = await fetchData();
    chart.data.datasets[0].data = newData;
    chart.update();
}

document.addEventListener("DOMContentLoaded", async () => {
    let ctx = document.getElementById("cpuChart").getContext("2d");
    let chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array(10).fill("").map((_, i) => `T-${i}`),
            datasets: [{ label: "CPU Load (%)", data: [], borderColor: "red", fill: false }]
        }
    });

    await updateChart(chart);
    setInterval(() => updateChart(chart), 5000); // Update tiap 5 detik
});
