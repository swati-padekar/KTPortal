import * as React from 'react'
import '../components/style.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import KTDashboard from './KTDashboard';
import '../components/webpartStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewContent from './ViewContent';
import UploadContent from './UploadContent';

function KT(props:any) {
  return (
    <div className='dms-root'>
      {/* <Header /> */}
      <HashRouter>
        <Routes>
          <Route path='/' element={<KTDashboard context={props.context} webURL={props.webURL}/>}></Route>
          <Route path='/ViewContent/:id' element={<ViewContent context={props.context} webURL={props.webURL}/>}></Route>
          <Route path='/uploadContent' element={<UploadContent context={props.context} webURL={props.webURL}/>}></Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default KT