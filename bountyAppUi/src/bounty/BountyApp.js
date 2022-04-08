import '../App.css';
import AdminUi from './AdminUi';
import GeneralUi from './GeneralUi';
import ProductSelect from './ProductSelect';

export default function BountyApp() {
  return (
    <div className="App">
        <GeneralUi />
        {/* <AdminUi /> */}
    </div>
  );
}