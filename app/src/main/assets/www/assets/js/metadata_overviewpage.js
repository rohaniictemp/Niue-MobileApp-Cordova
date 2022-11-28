$(document).ready(function () {
   var v_metadataTitle = localStorage.getItem('m_datasetname');
   var v_m_dataset_deptName = localStorage.getItem('m_dataset_deptName');
   
   var v_m_dataset_description = localStorage.getItem('m_dataset_description');
  
   var v_m_dataset_themeName = localStorage.getItem('m_dataset_themeName');

   var v_m_dataset_villageName = localStorage.getItem('m_dataset_villageName'); 
   
   var v_m_dataset_uploadedBy = localStorage.getItem('m_dataset_uploadedBy');
   var v_m_dataset_uploadedDate = localStorage.getItem('m_dataset_uploadedDate');

   var v_m_dataset_updatedby = localStorage.getItem('m_dataset_updatedby');
   var v_m_dataset_updateddate = localStorage.getItem('m_dataset_updateddate');

   var dt = new Date(parseInt(v_m_dataset_uploadedDate));
   var uploadedDate_date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
   var uploadedDate_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
   var uploadedDate_formated_dt = uploadedDate_date + " " + uploadedDate_time;

   var updateddate_formated_dt = null; 
   if(v_m_dataset_updateddate == "null")
   {      
      updateddate_formated_dt = "null";
   }
   else
   {
   var dt_updateddate = new Date(parseInt(v_m_dataset_updateddate));
   var updateddate_date = dt_updateddate.getFullYear() + "/" + (dt_updateddate.getMonth() + 1) + "/" + dt_updateddate.getDate();
   var updateddate_time = dt_updateddate.getHours() + ":" + dt_updateddate.getMinutes() + ":" + dt_updateddate.getSeconds();
   updateddate_formated_dt = updateddate_date + " " + updateddate_time;
   }

   document.getElementById("m_datasetId").innerText = v_metadataTitle;
   document.getElementById("m_depnameId").innerText = v_m_dataset_deptName;
   document.getElementById("m_desId").innerText = v_m_dataset_description;
   document.getElementById("m_themeId").innerText = v_m_dataset_themeName;
   document.getElementById("m_villageId").innerText = v_m_dataset_villageName;

   document.getElementById("m_uploadedbyId").innerText = v_m_dataset_uploadedBy;
   document.getElementById("m_uploadeddateId").innerText = uploadedDate_formated_dt;

   document.getElementById("m_updatedbyId").innerText = v_m_dataset_updatedby;
   document.getElementById("m_updateddateId").innerText = updateddate_formated_dt;
   document.getElementById("m_updateddateId").innerText = updateddate_formated_dt;
});
