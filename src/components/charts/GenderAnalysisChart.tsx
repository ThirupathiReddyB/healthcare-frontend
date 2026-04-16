import { Chart as ChartJs, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { IgenderAnalysis } from "../../interfaces/interfaces";
import { Divider } from "@mui/material";

ChartJs.register(ArcElement, Tooltip, Legend, Title);

const GenderAnalysisChart = ({ analysisData }: IgenderAnalysis) => {
  const data = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Ratio",
        data: [
          analysisData?.totalMale ? analysisData?.totalMale : 0,
          analysisData?.totalFemale ? analysisData?.totalFemale : 0,
          analysisData?.otherGender ? analysisData?.otherGender : 0,
        ],
        backgroundColor: ["#FFC99D", "#EF7612", "#F9E6D3"],
        hoverBackgroundColor: ["#FFC99D", "#EF7612", "#F9E6D3"], // Different hover color for "Other"
        borderColor: "#FFFFFF",
        borderWidth: 0,
      },
    ],
  };

  const total = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
  const percentages = data.datasets[0].data.map((value) =>
    ((value / total) * 100).toFixed(2)
  );

  return (
    <div
      style={{
        width: "50%",
        padding: "10px",
        margin: "auto",
        position: "relative",
      }}
    >
      <div
        className="outer-border"
        style={{
          border: "20px solid #FFF9F3",
          borderRadius: "50%",
          boxSizing: "border-box",
        }}
      >
        <div className="chart-container">
          <Pie
            data={data}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>
      <div className="custom-legend">
        {data.labels.map((label, index) => (
          <div
            style={{
              display: "flex",
            }}
            key={label}
          >
            <div
              className="legend-item"
              style={{
                textAlign: "left",
                left:""
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  className="legend-color"
                  style={{
                    width: "20px", // Ensure the color box has a set width and height
                    height: "20px",
                    backgroundColor: data.datasets[0].backgroundColor[index],
                  }}
                ></div>
                <span
                  className="legend-text"
                  style={{
                    fontFamily: "Urbanist",
                    fontSize: 18,
                    fontWeight: 450,
                  }}
                >
                  {percentages[index]}%
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Urbanist",
                  fontSize: 16,
                  fontWeight: 450,
                  marginTop: "4px", // Add a bit of spacing between the percentage and label
                  marginLeft: "0",
                }}
              >
                {label}
              </div>
            </div>
            {index === data.labels.length - 1 ? (
              ""
            ) : (
              <Divider
                orientation="vertical"
                sx={{ bgcolor: "orange", marginRight: "10px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenderAnalysisChart;
