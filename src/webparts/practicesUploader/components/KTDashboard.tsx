import * as React from 'react';
import "../components/Form.css";
import SharepointServiceProxy from './SharePointProxy';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Layer, Popup, Overlay, FocusTrapZone } from 'office-ui-fabric-react';
import { useBoolean } from '@fluentui/react-hooks';
import { mergeStyleSets } from '@fluentui/react';
import UploadContent from './UploadContent';

const popupStyles = mergeStyleSets({
    root: {
      background: 'rgba(0, 0, 0, 0.2)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
    },
    content: {
      background: 'white',
      left: '50%',
      maxWidth: '600px',
      height: '80vh',
      // padding: '2em',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'auto',
      borderRadius: '5px'
    },
  });

  const sectionPopup = mergeStyleSets({
    root: {
      background: 'rgba(0, 0, 0, 0.2)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
    },
    content: {
      background: 'white',
      left: '50%',
      maxWidth: '500px',
      width: '500px',
      // height: '80vh',
      // padding: '2em',
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'auto',
      borderRadius: '5px'
    },
  });

const KTDashboard = (props: any) => {
  const _sharePointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props.context, props.webURL);
  const [items, setData] = useState<any>([]);
  const [practiceData, setSubPracticesData] = useState<any>();

  useEffect(() => {
    async function getPractices() {
      const data = await _sharePointServiceProxy.getItems({       
        listName: 'KT_Practices',
        fields: ["ID", "Practices", "SubPractices"],
        orderedColumn: "Created",
      });
      
      const uniqueData = _.unionBy(data, 'Practices'); 
      const sortedData = _.orderBy(uniqueData, 'Practices', 'asc'); 
        setData(sortedData);
     
    //   setData(_.orderBy(_.unionBy(data, "Practices"), "Practices", "asc"))
     
    const groupedData = data?.reduce((acc:any, curr:any) => {
        const { Practices, SubPractices } = curr;
        if (!acc[Practices]) {
            acc[Practices] = { Practices, subPractices: [] };
        }
        acc[Practices].subPractices.push(SubPractices);
        return acc;
    }, {});    

 
        const sortedGroupedData = Object.keys(groupedData)
        .sort() 
        .reduce((acc: any, key: string) => {
            acc[key] = groupedData[key];
            return acc;
        }, {});

    setSubPracticesData(sortedGroupedData)
} 
    getPractices();
  }, []); 

//   function localstorage(data: any) {
//     localStorage.setItem('itr',JSON.stringify(data))  
// }

    const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
    const [sectionName, setSectionName] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSectionName(e.target.value);
    };

    useEffect(()=>{
      console.log('sectionName', sectionName)
    },[sectionName])

  return (
    <div
      className="dash-back"
      style={{ backgroundImage: `url(../../SiteAssets/dash-bg.png)` }}
    >
      <div className="main-container">
        <div className="card-container">
          <div className="card site-card p-3">
            <div className="d-flex justify-content-between align-items-center card-hed p-3 rounded">
              <h5 className="m-0">Practices</h5>
              <button onClick={showPopup} className="btn primary-btn">
                <img width={24} src="../../SiteAssets/Add.svg" alt="Add" />
                Create Knowledge Base
              </button>
            </div>
            {isPopupVisible && (
              <Layer>
                <Popup
                  className={popupStyles.root}
                  role="dialog"
                  aria-modal="true"
                  onDismiss={hidePopup}
                  // enableAriaHiddenSiblings={true}
                >
                  <Overlay onClick={hidePopup} />
                  <FocusTrapZone>
                    <div role="document" className={popupStyles.content}>
                      <UploadContent
                        context={props.context}
                        webURL={props.webURL}
                        onclose={hidePopup}
                      />
                    </div>
                  </FocusTrapZone>
                </Popup>
              </Layer>
            )}
            <div className="d-flex overflow-auto">
              {items.map((itr: any, index: number) => (
                <a
                  className="card-box text-decoration-none"
                  key={index}
                  href={`#ViewContent/${0}`}
                >
                  <div className="box position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <a className="title">{itr?.Practices}</a>
                      <img
                        src="../../SiteAssets/arrow_forward.png"
                        alt="site"
                        width={25}
                      />
                    </div>
                    <img
                      className="logo-icon"
                      src="../../SiteAssets/demosite.png"
                      alt="site"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="card site-card p-3">
            <h5 className="card-header card-hed rounded">Articles</h5>
            <div className="container-fluid cards-container">
              <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                {practiceData &&
                  Object.keys(practiceData).map((key, i) => (
                    <div className="col" key={i}>
                      <div className="card border-light mb-3 mt-1">
                        <div className="card-header dept-card_hed">
                          <img
                            src="../../SiteAssets/demosite.png"
                            alt="site"
                            width={24}
                          />
                          <span className="dept-name">
                            {practiceData[key].Practices}
                          </span>
                          <img
                            onClick={toggleHideDialog}
                            className="ms-auto pointer"
                            width={24}
                            src="../../SiteAssets/Add.svg"
                            alt="Add"
                          />
                        </div>
                        <div className="card-body">
                          {practiceData[key].subPractices.map(
                            (subPractice: any, subIndex: any) => (
                              <div
                                className="d-flex align-items-center ps-3 mb-1"
                                key={subIndex}
                              >
                                <img
                                  src="../../SiteAssets/create_new_folder.png"
                                  alt="site"
                                  width={24}
                                />
                                {/* <a href={`#DocumentList/${itr?.Title}`} onClick={() => localstorage(itr)}>{itr?.Title} */}
                                <a href={`#ViewContent/${subPractice}`}>
                                  {/* <a href={`#ViewContent/${subPractice}`} onClick={() => localstorage(subPractice)}> */}
                                  <span className="dept-subname">
                                    {subPractice}
                                  </span>
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {hideDialog && (
        <Layer>
          <Popup
            className={sectionPopup.root}
            role="dialog"
            aria-modal="true"
            onDismiss={toggleHideDialog}
            // enableAriaHiddenSiblings={true}
          >
            <Overlay onClick={toggleHideDialog} />
            <FocusTrapZone>
              <form className="form-container section-form">
                <div className={sectionPopup.content}>
                  <div className="header">
                    <h5 className='m-0 title'>Add New Section</h5>
                    <svg className="pointer" onClick={toggleHideDialog} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </div>
                  <div className='p-4'>
                    <label className='fw-semibold' htmlFor="Section">Section:</label>
                    <input
                      type="text"
                      id="Section"
                      name="Section"
                      placeholder="Enter the Section Name"
                      required
                      onChange={handleChange}
                      value={sectionName}
                    />
                  </div>
                  <div className="footer">
                    <button
                      className="cancel-btn me-2"
                      onClick={toggleHideDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-btn ms-2"
                      onClick={toggleHideDialog}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </FocusTrapZone>
          </Popup>
        </Layer>
      )}
    </div>
  );
}

export default KTDashboard;