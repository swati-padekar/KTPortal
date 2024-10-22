import * as React from 'react';
// import { useEffect, useState } from 'react';
import SuccessModal from './SuccessModal';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const DocumentViewer = (props: any) => {
  const [openmodal, setOpenModal] = useState<string>("");
  const [snippetsCode, setCodeData] = useState<any>([]);


useEffect(() => {
  // Parse the CodeSnippets
  const codeSnippetsString = props.data?.CodeSnippets ?? '';
  let codeSnippets: any[] = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(codeSnippetsString, 'text/html');
    const jsonString = doc.body.textContent ?? '';
    if (jsonString) {
      codeSnippets = JSON.parse(jsonString);
      setCodeData(codeSnippets);
    }
  } catch (error) {
    console.error('Error parsing CodeSnippets:', error);
  }
}, [props.data]);

const copyToClipboard = (code: string) => {
  navigator.clipboard.writeText(code)
    .then(() => {
      toast.success('Code copied to clipboard');
      
    })
    .catch(err => {
      toast.error('Failed to copy: ', err);
    });
};

  return (
    <>
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
      }} />
      <div className="metadata-container py-3">
        {openmodal === "MetaDataUpdate" && (
          <SuccessModal
            pageType={"success"}
            setModal={setOpenModal}
            message={"MetaData Updated Successfully"}
            showModal={true} />
        )}
        <div className="row m-0">
          <div className="col-9">
            <div className="row">
              <div className="col-5">
                <div className='label'>Section</div>
                <div className='section'>{props.data?.Skills}</div>
              </div>
              <div className="col-5">
                <div className='label'>Topic</div>
                <div className='section'>{props.data?.Topic}</div>
              </div>
              <div className="col-2">
                <div className='label'>Version</div>
                <div className='section'>{props.data?.KTVersion}</div>
              </div>
              <div className="col pt-2">
                <div className='label'>Description</div>
                <div className='section'>{props.data?.Description}</div>
              </div>
            </div>
            <div className="code-snippet my-2 py-0">
              {snippetsCode.map((snippet: any, index: number) => (
                <div className="snippet-card">
                  <div className='row'>
                    <div className="col-6">
                      <div className='label'>Language</div>
                      <div className='section'>{snippet?.Language}</div>
                    </div>
                    <div className="col-6">
                      <div className='label'>Filename with Extension</div>
                      {/* <a href={`${props?.data?.AttachmentFiles[0]?.ServerRelativePath?.DecodedUrl}`}> */}
                      <div className='section'>{snippet?.fileExtension}</div>
                      {/* </a> */}
                    </div>
                  </div>
                  <div className="code">
                    <svg className='copy-btn pointer'
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px" fill="#B7B7B7"
                      onClick={() => copyToClipboard(snippet?.code)}
                    >
                      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
                    <div>
                      <pre>
                        <code>{snippet?.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="note mt-2">
              <div className='d-flex align-items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#002bff"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span className='section ps-2'>Download the Attachments</span>
              </div>
              {props?.data?.AttachmentFiles && props.data.AttachmentFiles.length > 0 && (
                <a href={props.data.AttachmentFiles[0].ServerRelativePath.DecodedUrl}>
                  <div className='section px-3'>{props.data?.AttachmentFiles[0]?.FileName}</div>
                </a>
              )}
              
            </div>
            <div className="note mt-2">
              <div className='d-flex align-items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#002bff"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span className='sectionps-2'>References</span>
              </div>
              <p className='px-3'>{props.data?.References}</p>
            </div>
            <div className="note mt-2">
              <div className='d-flex align-items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#002bff"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span className='section ps-2'>Note from Lead</span>
              </div>
              <p className='px-3'>{props.data?.Notes}</p>
            </div>
          </div>
          <div className="col-3 text-center">
            {/* <p>{props.data?.Title}</p> */}
           <strong>Discussion Section Coming Soon</strong> 
          </div>
        </div>
      </div></>
  );
};

export default DocumentViewer;
