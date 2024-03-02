import React, { useState } from "react";
import "./App.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const App = () => {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "1", x: 0, y: 0, w: 1, h: 1 },
      { i: "2", x: 1, y: 0, w: 1, h: 1 },
      { i: "3", x: 2, y: 0, w: 1, h: 1 },
    ],
  });
  const [counts, setCounts] = useState({ add: 0, update: 0 });

  const onLayoutChange = (newLayouts) => {
    const updatedLayouts = { lg: newLayouts };

    const averageHeight =
      updatedLayouts.lg.reduce((sum, item) => sum + item.h, 0) /
      updatedLayouts.lg.length;

    updatedLayouts.lg = updatedLayouts.lg.map((item) => ({
      ...item,
      h: averageHeight,
    }));

    setLayouts(updatedLayouts);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/data");
      const newData = await response.json();
      if (newData.length > 0) {
        setLayouts({ lg: newData });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...layouts.lg,
          { i: String(layouts.lg.length + 1), x: 0, y: 0, w: 1, h: 1 },
        ]),
      });
      const result = await response.json();
      console.log(result);
      fetchData();
      setCounts((prevCounts) => ({ ...prevCounts, add: prevCounts.add + 1 }));
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleUpdate = async (updatedLayouts) => {
    try {
      setLayouts(() => ({ lg: updatedLayouts }));

      const response = await fetch("http://localhost:3001/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLayouts),
      });
      const result = await response.json();
      console.log(result);
      setCounts((prevCounts) => ({
        ...prevCounts,
        update: prevCounts.update + 1,
      }));
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleUpdateButtonClick = async (index) => {
    const newContent = window.prompt("Enter new content:");
    if (newContent !== null) {
      const updatedLayouts = [...layouts.lg];
      updatedLayouts[index].content = newContent;
      setLayouts(() => ({
        lg: updatedLayouts,
      }));
      handleUpdate(updatedLayouts);
    }
  };

  return (
    <div className="app">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        onLayoutChange={onLayoutChange}
        isResizable={true}
        isDraggable={true}
      >
        {layouts.lg.map((item, index) => (
          <div
            key={item.i}
            style={{
              background:
                item.i === "1"
                  ? "#61dafb"
                  : item.i === "2"
                  ? "#2ecc71"
                  : "#e74c3c",
              border: "1px solid #0074cc",
              margin: "8px",
            }}
          >
            <div className="resizable-content">
              {item.content ? (
                <>{item.content}</>
              ) : (
                <>Resizable Component {item.i}</>
              )}
            </div>
            <button
              style={{cursor: "pointer"}}
              onClick={() => {
                handleUpdateButtonClick(index);
              }}
            >
              Update
            </button>
          </div>
        ))}
      </ResponsiveGridLayout>
      <div className="btn">
        <button onClick={handleAdd}>Add Container</button>
        <div className="count">
          <p className="text">Add Count: {counts.add}</p>
          <p className="text">Update Count: {counts.update}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
