import * as React from 'react';
// import { useEffect, useState } from 'react';
import SuccessModal from './SuccessModal';
import { useState } from 'react';

const DocumentViewer = (props: any) => {
  const [openmodal, setOpenModal] = useState<string>("");
//   const [filePath, setFilePath] = useState<string>("");
  
//   useEffect(() => {
//     if (props?.data?.AttachmentFiles) {
//         const slidesData = props.data.AttachmentFiles.map((item: any) => ({
//             src: item?.ServerRelativeUrl,
//         }));
//         setFilePath(slidesData[0]?.src || ''); // Set to an empty string if there's no src
//     }
// }, [props.data]); 

console.log("props.data", props.data);

  return (
    <div className='row mt-3'>
      {openmodal === "MetaDataUpdate" && (
        <SuccessModal
          pageType={"success"}
          setModal={setOpenModal}
          message={"MetaData Updated Successfully"}
          showModal={true}
        />
      )}
      {/* <div className='iframe-container col-8'>
        <iframe
          src={filePath}
          title="application/pdf"
          width="99%"
          height="840"
        >
          Your browser does not support embedded PDF files.
        </iframe>
        <div className="pdf-info">
          <a href="#">{filePath}</a>
        </div>
      </div> */}
      <div className='metadata-container px-3'>
        <div className='p-5'>
          <div className="d-flex align-items-center justify-content-between  py-2 px-3 ">
            <div>
              <h5>Metadata</h5>
              <h6 className='text-decoration-underline'>Skills</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Skills }}></div>
              <h6 className='text-decoration-underline'>Practices</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Practices }}></div>
              <h6 className='text-decoration-underline'>Title</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Title }}></div>
              <h6 className='text-decoration-underline'>ShortDescription</h6>              
              <div dangerouslySetInnerHTML={{ __html: props.data?.ShortDescription }}></div>
              <h6 className='text-decoration-underline'>Description</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Description }}></div>     
              <h6 className='text-decoration-underline'>Syntax</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Syntax }}></div>      
              <h6 className='text-decoration-underline'>Code</h6>
              <div dangerouslySetInnerHTML={{ __html: props.data?.Code }}></div>   
              <h6 className='text-decoration-underline'>References</h6>
              <a href={props.data?.References} target="_blank"><div dangerouslySetInnerHTML={{ __html: props.data?.References }}></div></a>
              <h6 className='text-decoration-underline'>Attachments</h6>
              <div>
                {props.data?.AttachmentFiles && props.data.AttachmentFiles.length > 0 ? (
                  <a href={props.data.AttachmentFiles[0].ServerRelativePath.DecodedUrl}>
                    {props.data.AttachmentFiles[0].FileName}
                  </a>
                ) : (
                  <span>No attachments available</span> // Fallback content if no attachment exists
                )}
              </div>
              
            </div>
            <div className="d-flex align-items-center" >
             <p>{props.data?.Title}</p>
             
            </div>
          </div>

        </div>
      </div>
     </div>

  );
};

export default DocumentViewer;
