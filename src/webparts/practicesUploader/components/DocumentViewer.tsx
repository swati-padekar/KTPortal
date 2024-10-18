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

const htmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Heading</h1>
  </body>
</html>`;

  return (
    <div className="metadata-container py-3">
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
 
      <div className="row m-0">
        {/* old integrated code commented  */}
        {/* <div className='col-9'>
            <h5>Metadata</h5>
            <h6 className="text-decoration-underline">Skills</h6>
            <div dangerouslySetInnerHTML={{ __html: props.data?.Skills }}></div>
            <h6 className="text-decoration-underline">Practices</h6>
            <div
              dangerouslySetInnerHTML={{ __html: props.data?.Practices }}
            ></div>
            <h6 className="text-decoration-underline">Title</h6>
            <div dangerouslySetInnerHTML={{ __html: props.data?.Title }}></div>
            <h6 className="text-decoration-underline">ShortDescription</h6>
            <div
              dangerouslySetInnerHTML={{ __html: props.data?.ShortDescription }}
            ></div>
            <h6 className="text-decoration-underline">Description</h6>
            <div
              dangerouslySetInnerHTML={{ __html: props.data?.Description }}
            ></div>
            <h6 className="text-decoration-underline">Syntax</h6>
            <div dangerouslySetInnerHTML={{ __html: props.data?.Syntax }}></div>
            <h6 className="text-decoration-underline">Code</h6>
            <div dangerouslySetInnerHTML={{ __html: props.data?.Code }}></div>
            <h6 className="text-decoration-underline">References</h6>
            <a href={props.data?.References} target="_blank">
              <div
                dangerouslySetInnerHTML={{ __html: props.data?.References }}
              ></div>
            </a>
            <h6 className="text-decoration-underline">Attachments</h6>
            <div>
              {props.data?.AttachmentFiles &&
              props.data.AttachmentFiles.length > 0 ? (
                <a
                  href={
                    props.data.AttachmentFiles[0].ServerRelativePath.DecodedUrl
                  }
                >
                  {props.data.AttachmentFiles[0].FileName}
                </a>
              ) : (
                <span>No attachments available</span> // Fallback content if no attachment exists
              )}
            </div>
        </div> */}


        <div className="col-9">
          <div className="row">
            <div className="col-5">
              <div className='label'>Section</div>
              <div className='section'>Section Name</div>
            </div>
            <div className="col-5">
              <div className='label'>Topic</div>
              <div className='section'>Topic Name</div>
            </div>
            <div className="col-2">
              <div className='label'>Version</div>
              <div className='section'>2.6.1</div>
            </div>
            <div className="col pt-2">
              <div className='label'>Description</div>
              <div className='section'>Description Details</div>
            </div>
          </div>
          <div className="code-snippet my-2 py-0">
            <div className="snippet-card">
              <div className='row'>
                <div className="col-6">
                  <div className='label'>Language</div>
                  <div className='section'>Language Name</div>
                </div>
                <div className="col-6">
                  <div className='label'>Filename with Extension</div>
                  <div className='section'>File name</div>
                </div>
              </div>
              <div className="code">
                <svg className='copy-btn pointer' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#B7B7B7"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                <div>
                  <pre>
                    <code>{htmlCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className="note mt-2">
            <div className='d-flex align-items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffa500"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
              <span className='section ps-2'>Note from Lead</span>
            </div>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos consequatur, laborum sequi, officia amet debitis nesciunt esse sit beatae vel porro veritatis exercitationem natus est neque tempora a. Voluptate, culpa! Error nam, repudiandae dolores praesentium vero quam nostrum a vel quasi odio natus sunt repellat corporis, eveniet excepturi itaque facilis.</p>
          </div>
        </div>
        <div className="col-3 text-center">
          {/* <p>{props.data?.Title}</p> */}
          Discussion Section Coming Soon
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
