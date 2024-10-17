import * as React from "react";
import "../components/Form.css";
import SharepointServiceProxy from "./SharePointProxy";
import { AttachmentFileInfo } from "sp-pnp-js/lib/sharepoint/attachmentfiles";
import { useEffect, useState } from "react";
import * as _ from "lodash";

const UploadContent = (props: any) => {
  const _sharePointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props.context, props.webURL);
  const [ddlPractices, setData] = useState<any>([]);
  const [ddlsetSubPractices, setSubPractices] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [snippet, setSnippet] = useState<any>([
    {
      Language: '',
      fileExtension: '',
      code: ''
    },
  ]);
  const [formData, setFormData] = React.useState({
    Practices: "",
    Skills: "",
    Title: "",
    Syntax: "",
    Code: "",
    ShortDescription: "",
    Description: "",
    References: "",
  });

  useEffect(() => {
    async function getPractices() {
      const data = await _sharePointServiceProxy.getItems({
        listName: "KT_Practices",
        fields: ["ID", "Practices", "SubPractices"],
        orderedColumn: "Created",
      });
      setAllData(data);

      setData(_.orderBy(_.unionBy(data, "Practices"), "Practices", "asc"));
    }
    getPractices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (name === "Practices") {
      const selectedPractice = value;
      const relatedSubPractices = allData
        .filter((item: any) => item.Practices === selectedPractice)
        .map((item: any) => item.SubPractices);

      const uniqueSubPractices = _.uniq(relatedSubPractices);

      setSubPractices(uniqueSubPractices);
    }
    //   let skills:any=[];
    //   allData.forEach((itr:any)=>{
    //      if(formData?.Practices === itr?.SubPractices)
    //      skills.push(itr?.Skills)
    //    })
    // setSubPractices(skills)
    //    console.log(skills);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let files: AttachmentFileInfo[] = [];
    const attachmentInput = document.querySelector(
      "#attachments"
    ) as HTMLInputElement;
    if (attachmentInput.files && attachmentInput.files.length > 0) {
      let awardThumbnail = attachmentInput.files[0];
      files.push({
        name: awardThumbnail.name,
        content: awardThumbnail,
      });
    }

    try {
      await _sharePointServiceProxy.addItem(
        "Knowledge_Transfer",
        formData,
        files
      );
      alert("Added successfully");
      setFormData({
        Practices: "",
        Skills: "",
        Title: "",
        Syntax: "",
        Code: "",
        ShortDescription: "",
        Description: "",
        References: "",
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the item.");
    }
  };

  console.log("formData", formData);

  const addSnippet = () => {
    // Check if any object in the snippet array has empty fields
    const hasEmptyFields = snippet.some(
      (obj: any) => !obj.Language || !obj.fileExtension || !obj.code
    );
  
    if (hasEmptyFields) {
      console.log('Cannot add new snippet. Some fields are empty.');
      return;
    }
  
    // If no empty fields, proceed to push the new object
    const newSnippet = {
      Language: '',
      fileExtension: '',
      code: ''
    };
  
    setSnippet([...snippet, newSnippet]);
    console.log('New snippet added:', newSnippet);
  };

  return (
    <form
      className="form-container"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div className="header">
        <h2 className="title">Knowledge Base Form</h2>
        <svg
          className="pointer"
          onClick={props.onclose}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
      <div
        className="knowledge-form"
        // encType="multipart/form-data"
        // onSubmit={handleSubmit}
      >
        <label htmlFor="practice">Practice Name:</label>
        <select
          id="practice"
          name="Practices"
          required
          onChange={handleChange}
          value={formData.Practices}
        >
          <option value="" disabled selected>
            Select Practices
          </option>
          {ddlPractices.map((itr: any) => (
            <option key={itr.Id} value={itr.Practices}>
              {itr?.Practices}
            </option>
          ))}
        </select>

        <label htmlFor="Section">Section:</label>
        <select
          id="Section"
          name="Skills"
          required
          onChange={handleChange}
          value={formData.Skills}
        >
          <option value="" disabled selected>
            Select Section
          </option>
          {ddlsetSubPractices.map((itr: any, i: any) => (
            <option key={i} value={itr}>
              {itr}
            </option>
          ))}
        </select>

        <label htmlFor="title">Topic:</label>
        <input
          type="text"
          id="Topic"
          name="Topic"
          placeholder="Enter the Topic"
          required
          onChange={handleChange}
          value={formData.Title}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="Description"
          rows={4}
          placeholder="Enter the description"
          required
          onChange={handleChange}
          value={formData.Description}
        ></textarea>

        <label htmlFor="title">Version:</label>
        <input
          type="text"
          id="Version"
          name="Version"
          placeholder="Enter the Version"
          required
          // onChange={handleChange}
          // value={formData.Title}
        />
        <div>
          {snippet.map((itr: any, i:number) => (
            <>
              <div>Code {i + 1}</div>
              <div className="p-3 border rounded mb-2">
                <label htmlFor="Language">Language:</label>
                <input
                  type="text"
                  id="Language"
                  name="Language"
                  placeholder="Enter the Language"
                  required
                  // onChange={handleChange}
                  // value={formData.Title}
                />
                <label htmlFor="Extension">Filename with Extension:</label>
                <input
                  type="text"
                  id="Extension"
                  name="Extension"
                  placeholder="Enter the filename"
                  required
                  // onChange={handleChange}
                  // value={formData.Title}
                />
                <label htmlFor="Snippet">Code Snippet</label>
                <textarea
                  id="Snippet"
                  name="Snippet"
                  rows={3}
                  placeholder="Paste your code snippet here"
                  required
                  // onChange={handleChange}
                  // value={formData.Syntax}
                ></textarea>
              </div>
            </>
          ))}
          <div className="text-end pt-2">
                <button type="button" onClick={addSnippet} className="btn btn-primary">Add New</button>
          </div>
        </div>
        {/* 
          <label htmlFor="syntax">Syntax:</label>
          <textarea
            id="syntax"
            name="Syntax"
            rows={3}
            placeholder="Enter the syntax"
            required
            onChange={handleChange}
            value={formData.Syntax}
          ></textarea>

          <label htmlFor="code">Code:</label>
          <textarea
            id="code"
            name="Code"
            rows={4}
            placeholder="Enter the code"
            required
            onChange={handleChange}
            value={formData.Code}
          ></textarea>

          <label htmlFor="ShortDescription">Short Description:</label>
          <textarea
            id="ShortDescription"
            name="ShortDescription"
            rows={4}
            placeholder="Enter the ShortDescription"
            required
            onChange={handleChange}
            value={formData.ShortDescription}
          ></textarea>


          <label htmlFor="references">References:</label>
          <textarea
            id="references"
            name="References"
            rows={4}
            placeholder="Enter the references"
            required
            onChange={handleChange}
            value={formData.References}
          ></textarea> 
        */}

        <label htmlFor="Notes">Notes:</label>
        <textarea
            id="Notes"
            name="Notes"
            rows={3}
            placeholder="Add any additional notes or comments"
            required
            onChange={handleChange}
            value={formData.References}
        ></textarea> 

        <label htmlFor="attachments">Document/Attachments:</label>
        <input
          type="file"
          id="attachments"
          name="attachments"
          accept=".doc,.docx,.pdf,.zip,.txt,.jpg,.png"
        />
        {/* <input type="submit" value="Submit" /> */}
      </div>
      <div className="footer">
        <button className="cancel-btn me-2" onClick={props.onclose}>
          Cancel
        </button>
        <button className="save-btn ms-2" type="submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default UploadContent;
