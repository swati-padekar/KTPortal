import { IStackTokens, Panel, SearchBox, Stack } from "@fluentui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import SharepointServiceProxy from "./SharePointProxy";
import * as moment from "moment";
import DocumentViewer from "./DocumentViewer";

const ViewContent = (props: any) => {
  const [file, setViewerdata] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [byFile, setByFile] = useState<string>("");
  const _sharePointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props.context, props.webURL);
  const stackTokens: IStackTokens = { childrenGap: 20 };
  const [allData, setViewDataResult] = useState<any>();
  const [viewData, setViewData] = useState<any>();

  const togglePanel = (data: any) => {
    setIsOpen(!isOpen);
    setViewerdata(data);
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
    let byFileName = window.localStorage.getItem("file")
      ? window.localStorage.getItem("file")?.toLowerCase()
      : "";

    let allFiles = allData?.filter((ftr: any) =>
      byFileName !== ""
        ? ftr?.Title?.toLowerCase()?.includes(byFileName)
        : viewData
    );
    setViewData(allFiles);
  };

  useEffect(() => {
    const skills = window.location.href;
    const skillsId = skills.slice(skills.lastIndexOf("/") + 1);
    const cleanedSkillsId = skillsId.replace(/%20/g, " ").trim();
    getPractices(cleanedSkillsId);
  }, []);

  const getPractices = async (item: any) => {
    const results = await _sharePointServiceProxy.getItems(
      {
        listName: "Knowledge_Transfer",
        fields: [
          "ID",
          "Practices",
          "Skills",
          "Title",
          "Code",
          "Description",
          "References",
          "Syntax",
          "ShortDescription",
          "Attachments",
          "AttachmentFiles",
          "Author/Title",
          "Created",
        ],
        filter: `Skills eq '${item}'`,
        orderedColumn: "Created",
        expandFields: ["AttachmentFiles", "Author"],
      },
      false
    );

    setViewData(results);
    setViewDataResult(results);
    console.log("all files", results);
  };

  return (
    <div className="documen-section mt-5">
      <div className="col-xl-2 col-lg-3">
        <div className="side-nav">
          <div className="hed">
            {/* <img src="../../SiteAssets/tune.png" alt="site" width={30} /> */}
            <h1 className="m-0">Menu</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z" />
            </svg>
          </div>
          <div className="card">
            <div className="card-header">Sections</div>
            <div className="card-body sections-height" id="style-3">
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
            </div>
          </div>
          {/* <div className="card">
            <div className="card-header card-hed">Skills</div>
            <div className="card-body menu-scrollbar" id="style-3">
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
              <div className="stacks">
                <a>
                  <p className="card-txt">Test</p>
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="col-xl-10 col-lg-9">
        <div className="document-list pt-0" id="style-3">
          <div className="col-xl-12">
            <div className="align-auto">
              <div className="d-flex align-items-center">
                  <svg
                    className="pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#0078D4"
                    onClick={(event) => {
                      // stop the browser from changing the URL and requesting the new document
                      event.preventDefault();
                      // push an entry into the browser history stack and change the URL
                      window.history.back()
                    }}
                  >
                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                  </svg>
                <p className="text">Knowledge Transfer</p>
              </div>
              <div className="col-lg-4">
                {/* <input type="text" className='search-box' placeholder="Search" /> */}
                <Stack tokens={stackTokens}>
                  <SearchBox
                    className="search-box"
                    placeholder="Search"
                    onChange={handlebyFiles}
                    value={byFile}
                    onSearch={() => handlebyFiles(byFile)}
                    clearButtonProps={{ onClick: handleClear }}
                  />
                </Stack>
              </div>
            </div>
            <div className="topics-height">
              {viewData &&
                viewData.map((itr: any, i: number) => (
                  <div className="row cards">
                    <div className="col-3 p-0">
                      <div className="cardbody">
                        <div className="col-xl-2 col-lg-2">
                          <img
                            src="../../SiteAssets/PdfFile.png"
                            alt="image"
                            className="pdf-icon"
                          />
                        </div>
                        <div className="col-xl-10 col-lg-10">
                          <h4 className="mb-0 mt-2">{itr?.Title}</h4>
                          <div className="pdf-row">
                            <div className="col-xl-5 col-lg-5 row1">
                              <img
                                src="../../SiteAssets/person.png"
                                alt="image"
                              />
                              <span>{itr?.Author?.Title}</span>
                            </div>
                            <div className="col-xl-5 col-lg-5 row1">
                              <img
                                src="../../SiteAssets/calendar_month.png"
                                alt="image"
                              />
                              <span className="text-nowrap">
                                {moment(itr?.Created).format("MMMM Do YYYY")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-3 py-1">
                      <div className="d-flex pb-2">
                        <span className="txt-color">Section</span>
                        <span className="bold-text">:{itr?.Skills}</span>
                      </div>
                      <div className="d-flex pt-2">
                        <span className="txt-color">Topic</span>
                        <span className="bold-text">:{itr?.Title}</span>
                      </div>
                    </div>
                    <div className="col-5 py-1">
                      <div className="d-flex pb-2">
                        <span className="txt-color">Version</span>
                        <span className="bold-text">:{itr?.Author?.Title}</span>
                      </div>
                      <div className="d-flex pt-2">
                        <span className="txt-color">Description</span>
                        <span className="bold-text text-truncate">
                          :{itr?.ShortDescription}
                        </span>
                      </div>
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-end">
                      <button
                        className="view-btn"
                        onClick={() => togglePanel(itr)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#888888"
                        >
                          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
                        </svg>
                        <span className="docbold-text ps-2">View</span>
                      </button>
                    </div>
                    <div className="col-9 d-none">
                      <div className="d-flex mt-2">
                        <div className="colwid1">
                          <span className="txt-color">Name Raised To</span>
                          <span className="bold-text">
                            :{itr?.Author?.Title}
                          </span>
                        </div>
                        <div className="colwid2">
                          <span className="txt-color">Date</span>
                          <span className="bold-text">
                            :{moment(itr?.Created).format("MMMM Do YYYY")}
                          </span>
                        </div>
                        <div className="colwid3">
                          <span className="txt-color">Appointment No</span>
                          <span className="bold-text">:{itr?.ID}</span>
                        </div>
                        <div className="colwid4">
                          <span className="txt-color">Document Type</span>
                          <span className="bold-text">: {itr?.Skills}</span>
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
                          <span className="txt-color">
                            <img
                              src="../../SiteAssets/visibility.png"
                              width={18}
                              onClick={() => togglePanel(itr)}
                            />
                          </span>
                          <span className="docbold-text">View</span>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="path">
                          References: {itr?.References}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Panel
        isOpen={isOpen}
        onDismiss={togglePanel}
        closeButtonAriaLabel="Close"
        headerText="Appoinment Letter"
        styles={{ main: { width: "100%", maxWidth: "100%" } }}
      >
        <DocumentViewer
          data={file}
          subsite={file}
          context={props.context}
          webURL={props.webURL}
          onSuccess={file}
        />
      </Panel>
    </div>
  );
};

export default ViewContent;
