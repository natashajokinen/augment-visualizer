import AugmentClasslist from './augmentChecklist';
import './App.css';

function App() {
  return (
    <div>
      <header className="App-header">
        <p>
          See what augments do to your equipment in PSO2:NGS
        </p>
        {/* Components that go here can be functional components from another file */}
      </header>
      <AugmentClasslist/>
    </div>
  );
}

export default App;
