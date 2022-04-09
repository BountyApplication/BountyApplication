import '../App.css';
import AdminUi from './adminUi/AdminUi';
import GeneralUi from './generalUi/GeneralUi';

export default function BountyApp() {
  return (
    <div className="App">
        {/* <GeneralUi /> */}
        <AdminUi />
    </div>
  );
}