import * as React from 'react';
import "../components/Form.css";
import SharepointServiceProxy from './SharePointProxy';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Layer, Popup, Overlay, FocusTrapZone } from 'office-ui-fabric-react';
import { useBoolean } from '@fluentui/react-hooks';
import { mergeStyleSets } from '@fluentui/react';
import UploadContent from './UploadContent';
import toast, { Toaster } from 'react-hot-toast';

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

    const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
    const [sectionName, setSectionName] = React.useState('');
    const [practiceName, setPractice] = React.useState('');
    const [leadaccess, setLeadLink] = useState<boolean>()
    console.log(leadaccess);
    

    useEffect(() => {
        async function fetchData() {  
            let currentUser = await _sharePointServiceProxy.getCurrentUser().then(async (res: any) => {
              return res;
          });
        let loggedUser = currentUser?.User?.Title
      
          
      
          let inAdminGroup = ((currentUser?.Groups?.filter((ftr: any) => (ftr?.Title === "KTLeads"  && currentUser?.User?.Title === loggedUser)))?.length > 0) 
         debugger
          if (inAdminGroup) {
              setLeadLink(true)
          }
          else {
             setLeadLink(false)
          }
      
        }
        getPractices();
        fetchData();
    }, []);

    useEffect(() => {
    }, [sectionName, practiceName])

    async function getPractices() {
        const data = await _sharePointServiceProxy.getItems({
            listName: 'KT_Practices',
            fields: ["ID", "Practices", "SubPractices"],
            orderedColumn: "Created",
        });

        const uniqueData = _.unionBy(data, 'Practices');
        const sortedData = _.orderBy(uniqueData, 'Practices', 'asc');
        setData(sortedData);

        const groupedData = data?.reduce((acc: any, curr: any) => {
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSectionName(e.target.value);
    };
    const saveSection = (practice: string) => {
        toggleHideDialog();
        setPractice(practice);

    }
    // Add sections in KT_Practices
    const saveSectionData = async () => {        
        const obj = {
            Practices: practiceName,
            SubPractices: sectionName,
        };

        const existingSubPractices = practiceData[practiceName]?.subPractices || [];
        if (existingSubPractices.includes(sectionName)) {
            toast.error('Section already available!');            
        }
        else{
            try {
                await _sharePointServiceProxy.addItem("KT_Practices", obj, []);
                toast.success('Section added successfully!');
                setSectionName('');
    
            } catch (error) {
                console.error("Error adding section:", error);
                toast.error('Failed to add section.');
            } finally {
                toggleHideDialog();
                await getPractices();
            }
        }

    };
    function closeModel(){
        toggleHideDialog();
        setSectionName('');
    }

    return (
        <><div>
            <Toaster
                position="top-center" // Support top-left, top-center, top-right, bottom-left, bottom-center & bottom-right
                reverseOrder={false} // Toasts spawn at top by default. Set to `true` if you want new Toasts at the end
                toastOptions={{
                    style: {
                        margin: '40px',
                        background: '#363636',
                        color: '#fff',
                        zIndex: 1,
                    },
                    
                    // Specific styles for success toasts
        success: {
            style: {
                background: '#4caf50', // Green background for success
                color: '#fff', // White text for success
            },
            duration: 3000,
        },
          // Specific styles for error toasts
          error: {
            style: {
                background: '#f44336', // Red background for error
                color: '#fff', // White text for error
            },
            duration: 3000,
        },
            }}
            />
        </div>
            <div
                className="dash-back"
                style={{ backgroundImage: `url(../SiteAssets/dash-bg.png)` }}
            >
                <div className="main-container">
                    <div className="card-container">
                        <div className="card site-card p-3">
                            <div className="d-flex justify-content-between align-items-center card-hed p-3 rounded">
                                <h5 className="m-0">Practices</h5>
                                { leadaccess ?
                                <button onClick={showPopup} className="btn primary-btn">
                                    <img width={24} src="../SiteAssets/Add.svg" alt="Add" />
                                    Create Knowledge Base
                                </button>
                                :
                                null
                                }
                            </div>
                            {isPopupVisible && (
                                <Layer>
                                    <Popup
                                        className={popupStyles.root}
                                        role="dialog"
                                        aria-modal="true"
                                        onDismiss={hidePopup}
                                    >
                                        <Overlay onClick={hidePopup} />
                                        <FocusTrapZone>
                                            <div role="document" className={popupStyles.content}>
                                                <UploadContent
                                                    context={props.context}
                                                    webURL={props.webURL}
                                                    onclose={hidePopup} />
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
                                        // href={`#ViewContent/${0}`}
                                        href={`#`}
                                    >
                                        <div className="box position-relative">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <a className="title">{itr?.Practices}</a>
                                                <img
                                                    src="../SiteAssets/arrow_forward.png"
                                                    alt="site"
                                                    width={25} />
                                            </div>
                                            <img
                                                className="logo-icon"
                                                src="../SiteAssets/demosite.png"
                                                alt="site" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="card site-card p-3">
                            <h5 className="card-header card-hed rounded">Sections</h5>
                            <div className="container-fluid cards-container">
                                <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                                    {practiceData &&
                                        Object.keys(practiceData).map((key, i) => (
                                            <div className="col" key={i}>
                                                <div className="card border-light mb-3 mt-1">
                                                    <div className="card-header dept-card_hed">
                                                        <img
                                                            src="../SiteAssets/demosite.png"
                                                            alt="site"
                                                            width={24} />
                                                        <span className="dept-name">
                                                            {practiceData[key].Practices}
                                                        </span>
                                                        {leadaccess ? 
                                                        <img
                                                            onClick={() => saveSection(practiceData[key].Practices)}
                                                            className="ms-auto pointer"
                                                            width={24}
                                                            src="../SiteAssets/Add.svg"
                                                            alt="Add" />
                                                            :
                                                            null
                                                            }

                                                    </div>
                                                    <div className="card-body">
                                                        {practiceData[key].subPractices.map(
                                                            (subPractice: any, subIndex: any) => (
                                                                <div
                                                                    className="d-flex align-items-center ps-3 mb-1"
                                                                    key={subIndex}
                                                                >
                                                                    <img
                                                                        src="../SiteAssets/create_new_folder.png"
                                                                        alt="site"
                                                                        width={24} />
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
                        >
                            <Overlay onClick={toggleHideDialog} />
                            <FocusTrapZone>
                                <form className="form-container section-form"
                                    onSubmit={(e) => {
                                        e.preventDefault(); // Prevent default form submission
                                        saveSectionData(); // Call the save function
                                    }}
                                >
                                    <div className={sectionPopup.content}>
                                        <div className="header">
                                            <h5 className='m-0 title'>Add New Section: {practiceName}</h5>
                                            <svg className="pointer" onClick={closeModel} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
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
                                                defaultValue={sectionName} />
                                        </div>
                                        <div className="footer">
                                            <button
                                                className="cancel-btn me-2"
                                                onClick={closeModel}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="save-btn ms-2"
                                               
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
            </div></>
    );
}

export default KTDashboard;