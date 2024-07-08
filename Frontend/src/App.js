import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionsTable from "./components/Transaction";
import TransactionStatistics from "./components/Statistics";
import BarChartComponent from "./components/Barchart";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar> 

      <Router>
        <Routes>
          <Route exact path="/statistics" element={<TransactionStatistics />} />
          <Route path="/" element={<TransactionsTable />} />
          <Route path="/bar-chart" element={<BarChartComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
