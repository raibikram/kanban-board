import KanbanBoard from "./components/KanbanBoard";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

function App() {
  return (
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 bg-cover bg-center"
      style={{ backgroundImage: "url(/illustration-japanese-city.jpg)" }}
    >
      <Header />
      <main className="p-4 md:p-6">
        <KanbanBoard />
      </main>
      <Footer />
    </div>
  );
}

export default App;
