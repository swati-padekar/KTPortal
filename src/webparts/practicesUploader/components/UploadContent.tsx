import * as React from 'react';
import '../components/Form.css';
import SharepointServiceProxy from './SharePointProxy';
import { AttachmentFileInfo } from 'sp-pnp-js/lib/sharepoint/attachmentfiles';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';


const UploadContent = (props: any) => {
  const _sharePointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props.context, props.webURL);
  const [ddlPractices, setData] = useState<any>([]);
  const [ddlsetSubPractices, setSubPractices] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [formData, setFormData] = React.useState({
    Practices: '',
    Skills: '',
    Title: '',
    Syntax: '',
    Code: '',
    ShortDescription:'',
    Description: '',
    References: '',
  
  });



  useEffect(() => {
    async function getPractices() {
      const data = await _sharePointServiceProxy.getItems({       
        listName: 'KT_Practices',
        fields: ["ID", "Practices", "SubPractices"],
        orderedColumn: "Created",
      });
      setAllData(data)
    
    
      setData(_.orderBy(_.unionBy(data, "Practices"), "Practices", "asc"))     
}
    getPractices();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'Practices') {
      const selectedPractice = value;
      const relatedSubPractices = allData.filter((item: any) => item.Practices === selectedPractice)
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
    const attachmentInput = document.querySelector("#attachments") as HTMLInputElement;
    if (attachmentInput.files && attachmentInput.files.length > 0) {
      let awardThumbnail = attachmentInput.files[0];
      files.push({
          name: awardThumbnail.name,
          content: awardThumbnail
      });
  } 

    try {
      await _sharePointServiceProxy.addItem("Knowledge_Transfer", formData, files);
      alert("Added successfully");
      setFormData({
        Practices: '',
        Skills: '',
        Title: '',
        Syntax: '',
        Code: '',
        ShortDescription:'',
        Description: '',
        References: '',
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the item.");
    }


  };

  console.log("formData", formData);
  
  return (
    <div className="form-container">
      <h2>Knowledge Transfer Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="practice">Practice:</label>
        <select id="practice" name="Practices" required onChange={handleChange} value={formData.Practices}>
        <option value="" disabled selected>Select Practices</option>
          {ddlPractices.map((itr: any) => (
            <option key={itr.Id} value={itr.Practices}>{itr?.Practices}</option>
          ))}
        </select>     

        <label htmlFor="skill">Skill:</label>
        <select id="skill" name="Skills" required onChange={handleChange} value={formData.Skills}>  
          <option value="" disabled selected>Select Skills</option> 
          {ddlsetSubPractices.map((itr: any, i: any) => (
        <option key={i} value={itr}>{itr}</option> 
        ))} 
     </select>

    

        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="Title" placeholder="Enter the title" required onChange={handleChange} value={formData.Title}/>

        <label htmlFor="syntax">Syntax:</label>
        <textarea id="syntax" name="Syntax" rows={3} placeholder="Enter the syntax" required onChange={handleChange} value={formData.Syntax}></textarea>

        <label htmlFor="code">Code:</label>
        <textarea id="code" name="Code" rows={4} placeholder="Enter the code" required onChange={handleChange} value={formData.Code}></textarea>

        <label htmlFor="ShortDescription">ShortShortDescription:</label>
        <textarea id="ShortDescription" name="ShortDescription" rows={4} placeholder="Enter the ShortDescription" required onChange={handleChange} value={formData.ShortDescription}></textarea>


        <label htmlFor="description">Description:</label>
        <textarea id="description" name="Description" rows={4} placeholder="Enter the description" required onChange={handleChange} value={formData.Description}></textarea>

        <label htmlFor="references">References:</label>
        <textarea id="references" name="References" rows={4} placeholder="Enter the references" required onChange={handleChange} value={formData.References}></textarea>

        <label htmlFor="attachments">Document/Attachments:</label>
        <input type="file" id="attachments" name="attachments" accept=".doc,.docx,.pdf,.zip,.txt,.jpg,.png" />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default UploadContent;
