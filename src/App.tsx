import ControlBar from "./components/ControlBar";
import KanbanBoard from "./components/KanbanBoard";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

function App() {
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 bg-cover bg-center "
      style={{ backgroundImage: "url(/illustration-japanese-city.jpg)" }}
    >
      <div className="max-w-7xl mx-auto ">
        <Header />
        <ControlBar />
        <main className="p-4 md:p-6">
          <KanbanBoard />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
