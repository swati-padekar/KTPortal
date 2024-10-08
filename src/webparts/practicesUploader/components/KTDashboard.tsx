import * as React from 'react';
import SharepointServiceProxy from './SharePointProxy';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';


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


  return (
  <div className='dash-back' style={{ backgroundImage: `url(../../SiteAssets/dash-bg.png)` }}>
    <div className="main-container">
        <div className="card-container">
            <div className="card site-card">
                <h5 className="card-header card-hed">Practices </h5>             
                <a href='#uploadContent'>Knowledge Transfer</a>
                <div className="d-flex"> 
                    {items.map((itr:any, index:number) => (
                    <div className='card-box' key={index}>                                                                
                        <div className='box'>
                            <img src="../../SiteAssets/demosite.png" alt="site" width={30} />
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex justify-content-between align-items-center'>
                                  <div>
                                    <a>{itr?.Practices}</a>
                                  </div>
                                    <div><img src="../../SiteAssets/arrow_forward.png" alt="site" width={22} /></div>
                                </div>
                            </div>
                        </div>                                      
                    </div>
                   
                    ))}
                </div>
            </div>
            <div className="card site-card">
    <h5 className="card-header card-hed">Articles</h5>
    <div className="container">                                
        <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
            {practiceData && Object.keys(practiceData).map((key, i) => (
                <div className="col" key={i}>
                    <div className="card border-light mb-3 mt-1">
                        <div className="card-header dept-card_hed">
                            <img src="../../SiteAssets/demosite.png" alt="site" width={24} />
                            <span className='dept-name'>{practiceData[key].Practices}</span>
                        </div>
                        <div className="card-body">
                            {practiceData[key].subPractices.map((subPractice:any, subIndex:any) => (
                                <div className='d-flex align-items-center ps-3 mb-1' key={subIndex}>
                                    <img src="../../SiteAssets/create_new_folder.png" alt="site" width={24} />
                                {/* <a href={`#DocumentList/${itr?.Title}`} onClick={() => localstorage(itr)}>{itr?.Title} */}
                                    <a href={`#ViewContent/${subPractice}`}>
                                    {/* <a href={`#ViewContent/${subPractice}`} onClick={() => localstorage(subPractice)}> */}
                                        <span className='dept-subname'>{subPractice}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>                
</div>

     </div>
   </div>
 </div >
  );
}

export default KTDashboard;