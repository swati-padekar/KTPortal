import { IStackTokens, Panel, SearchBox, Stack } from '@fluentui/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import SharepointServiceProxy from './SharePointProxy';
import * as moment from 'moment';
import DocumentViewer from './DocumentViewer';

const ViewContent = (props: any) => {
    const [file, setViewerdata] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [byFile, setByFile] = useState<string>("");
    const _sharePointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props.context, props.webURL);
    const stackTokens: IStackTokens = { childrenGap: 20 };
     const[allData, setViewDataResult]=useState<any>();
     const [viewData, setViewData]= useState<any>();

    const togglePanel = (data:any) => {
        setIsOpen(!isOpen);
        setViewerdata(data)
    };

    const handleClear = () => {
        window.localStorage.removeItem("file");
        setByFile(""); // Clear the typed value state
        filterItems();
    };

    const handlebyFiles = (e: any) => {
        const newValue = e.target.value.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        setByFile(newValue);
        window.localStorage.setItem("file", newValue);
        filterItems();
    };
    const filterItems = async () => {
        let byFileName = window.localStorage.getItem("file") ? window.localStorage.getItem("file")?.toLowerCase() : "";
        
        let allFiles = allData?.filter((ftr: any) =>
           (byFileName !== "" ? ftr?.Title?.toLowerCase()?.includes(byFileName) : viewData)

        )
        console.log('all', allFiles, viewData);
        
        setViewData(allFiles)
    }

    
    useEffect(() => {
        const skills = window.location.href;
        const skillsId = skills.slice(skills.lastIndexOf('/') + 1)    
        const cleanedSkillsId = skillsId.replace(/%20/g, ' ').trim();
        getPractices(cleanedSkillsId);
    
    }, []);

    const getPractices = async (item: any) => {
           
        const results = await _sharePointServiceProxy.getItems({
            listName: 'Knowledge_Transfer',
            fields: [ "ID", "Practices", "Skills", "Title", "Code", "Description", "References","Syntax",
                       "ShortDescription", "Attachments","AttachmentFiles", "Author/Title","Created"],
            filter: `Skills eq '${item}'`,            
            orderedColumn: "Created",
            expandFields:["AttachmentFiles","Author"]
          }, false);
          
          setViewData(results)
          setViewDataResult(results)
    };
    
   
    
    
    return (
        <div className='documen-section mt-5'>
            <div className='col-xl-2 col-lg-3'>
                <div className="side-nav">
                    <div className='hed'>
                        <img src="../../SiteAssets/tune.png" alt="site" width={30} />
                        <h1 className='ps-3 m-0'>Menu</h1>
                    </div>
                    <div className="card">
                        <div className="card-header card-hed">Articles</div>
                        <div className="card-body menu-scrollbar" id="style-3">
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>

                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header card-hed">Skills</div>
                        <div className="card-body menu-scrollbar" id="style-3">
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>
                            <div className="stacks">
                                <a><p className="card-txt">Test</p></a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className='col-xl-10 col-lg-9'>
                <div className='document-list scroler' id="style-3">
                    <div className="col-xl-12">
                        <div className="align-auto">
                            <div>
                                <p className='text'>Knowledge Transfer</p>
                            </div>
                            <div className="col-lg-4">
                                {/* <input type="text" className='search-box' placeholder="Search" /> */}
                                <Stack tokens={stackTokens}>
                                        <SearchBox
                                            className='search-box'
                                            placeholder="Search"
                                            onChange={handlebyFiles}
                                            value={byFile}
                                            onSearch={() => handlebyFiles(byFile)}
                                            clearButtonProps={{ onClick: handleClear }}
                                            
                                        />
                                    </Stack>
                            </div>
                        </div>
                        <div className="mb-5 pb-5">
                            {viewData && viewData.map((itr:any, i:number)=>
                            <div className='row cards'>
                                <div className="col-3 p-0">
                                    <div className="cardbody">
                                        <div className="col-xl-2 col-lg-2">
                                            <img src="../../SiteAssets/PdfFile.png" alt="image" className='pdf-icon' />
                                        </div>
                                        <div className="col-xl-10 col-lg-10">
                                            <h4 className='mb-0 mt-2'>{itr?.Title}</h4>
                                            <div className="pdf-row">
                                                <div className="col-xl-5 col-lg-5 row1">
                                                    <img src="../../SiteAssets/person.png" alt="image" />
                                                    <span>{itr?.Author?.Title}</span>
                                                </div>
                                                <div className="col-xl-5 col-lg-5 row1">
                                                    <img src="../../SiteAssets/calendar_month.png" alt="image" />
                                                    <span>{moment(itr?.Created).format('MMMM Do YYYY')}</span>
                                                 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-9">
                                    <div className="d-flex mt-2">
                                        <div className="colwid1">
                                            <span className='txt-color'>Name Raised To</span><span className='bold-text'>:{itr?.Author?.Title}</span>
                                        </div>
                                        <div className="colwid2">
                                            <span className='txt-color'>Date</span><span className='bold-text'>:{moment(itr?.Created).format('MMMM Do YYYY')}</span>
                                        </div>
                                        <div className="colwid3">
                                            <span className='txt-color'>Appointment No</span><span className='bold-text'>:{itr?.ID}</span>
                                        </div>
                                        <div className="colwid4">
                                            <span className='txt-color'>Document Type</span><span className='bold-text'>: {itr?.Skills}</span>
                                        </div>
                                        <div className="colwid5">
                                            {/* <a href="/path/to/file" download>
                                                <span className='txt-color'>
                                                    <img src="../../SiteAssets/download.png" width={18} />
                                                </span>
                                                <span className='docbold-text'>Download</span>
                                            </a> */}
                                        </div>
                                        <div className="colwid6">
                                            <span className='txt-color'>
                                                <img src="../../SiteAssets/visibility.png" width={18} onClick={() => togglePanel(itr)} />
                                            </span>
                                            <span className='docbold-text'>View</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className='path'>References: {itr?.References}</div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Panel
                    isOpen={isOpen}
                    onDismiss={togglePanel}
                    closeButtonAriaLabel="Close"
                    headerText="Appoinment Letter"
                    styles={{ main: { width: '100%', maxWidth: '100%' } }}
                >
                    <DocumentViewer data={file}  subsite={file} context={props.context} webURL={props.webURL} onSuccess={file}/>
                </Panel>
        </div>

    );
}

export default ViewContent;